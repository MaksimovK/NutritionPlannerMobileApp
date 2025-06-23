import {
	DateTimePickerAndroid,
	DateTimePickerEvent
} from '@react-native-community/datetimepicker'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import React, { useEffect, useState } from 'react'
import {
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'

interface BlockUserModalProps {
	visible: boolean
	onClose: () => void
	// Возвращаем Date, чтобы в родителе сразу можно было передать в API
	onBlock: (date: Date, reason: string) => void
	userName: string
}

export default function BlockUserModal({
	visible,
	onClose,
	onBlock,
	userName
}: BlockUserModalProps) {
	const [blockDate, setBlockDate] = useState<Date>(() => {
		const d = new Date()
		d.setDate(d.getDate() + 7)
		return d
	})
	const [dateInput, setDateInput] = useState('')
	const [reason, setReason] = useState('')

	useEffect(() => {
		if (visible) {
			const date = new Date()
			date.setDate(date.getDate() + 7)
			setBlockDate(date)
			setDateInput(format(date, 'dd.MM.yyyy HH:mm', { locale: ru }))
			setReason('')
		}
	}, [visible])

	// Обновляем блокируемую дату и текст
	const handleDateChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date
	) => {
		if (selectedDate) {
			setBlockDate(selectedDate)
			setDateInput(format(selectedDate, 'dd.MM.yyyy HH:mm', { locale: ru }))
		}
	}

	// Android: сначала date, потом time
	const openAndroidPicker = () => {
		DateTimePickerAndroid.open({
			value: blockDate,
			mode: 'date',
			is24Hour: true,
			minimumDate: new Date(),
			onChange: (e, datePart) => {
				if (!datePart) return

				// объединяем дату, без времени
				const onlyDate = new Date(blockDate)
				onlyDate.setFullYear(
					datePart.getFullYear(),
					datePart.getMonth(),
					datePart.getDate()
				)
				handleDateChange(e, onlyDate)

				// теперь выбираем время
				DateTimePickerAndroid.open({
					value: onlyDate,
					mode: 'time',
					is24Hour: true,
					onChange: handleDateChange
				})
			}
		})
	}

	const openDatePicker = () => {
		if (Platform.OS === 'android') {
			openAndroidPicker()
		} else {
			// iOS поддерживает 'datetime'
			DateTimePickerAndroid.open({
				value: blockDate,
				mode: 'date',
				is24Hour: true,
				minimumDate: new Date(),
				onChange: handleDateChange
			})
		}
	}

	// Если юзер правит текст вручную
	const handleInputChange = (text: string) => {
		setDateInput(text)
		const regex = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2})$/
		const m = text.match(regex)
		if (m) {
			const [, d, mo, y, h, mi] = m
			const nd = new Date(+y, +mo - 1, +d, +h, +mi)
			if (!isNaN(nd.getTime())) {
				setBlockDate(nd)
			}
		}
	}

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Блокировка пользователя</Text>
					<Text style={styles.userName}>{userName}</Text>

					<Text style={styles.label}>Дата разблокировки:</Text>
					<TextInput
						style={styles.input}
						value={dateInput}
						onChangeText={handleInputChange}
						placeholder='ДД.MM.ГГГГ ЧЧ:ММ'
						keyboardType='numeric'
						placeholderTextColor='#999'
					/>

					<Text style={styles.label}>Причина блокировки:</Text>
					<TextInput
						style={[styles.input, styles.reasonInput]}
						value={reason}
						onChangeText={setReason}
						placeholder='Укажите причину блокировки'
						multiline
						numberOfLines={3}
					/>

					<TouchableOpacity
						style={styles.datePickerButton}
						onPress={openDatePicker}
					>
						<Text style={styles.datePickerButtonText}>Выбрать дату</Text>
					</TouchableOpacity>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={onClose}
						>
							<Text style={styles.buttonText}>Отмена</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.blockButton]}
							onPress={() => onBlock(blockDate, reason)}
						>
							<Text style={styles.buttonText}>Заблокировать</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	modalContent: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center'
	},
	userName: {
		fontSize: 16,
		marginBottom: 20,
		textAlign: 'center',
		fontWeight: '500'
	},
	label: { marginBottom: 8, fontSize: 16 },
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 15,
		fontSize: 16,
		color: '#000'
	},
	datePickerButton: {
		backgroundColor: '#3498db',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginBottom: 20
	},
	datePickerButtonText: {
		color: 'white',
		fontWeight: 'bold'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10
	},
	button: {
		flex: 1,
		padding: 12,
		borderRadius: 5,
		alignItems: 'center',
		marginHorizontal: 5
	},
	cancelButton: { backgroundColor: '#e74c3c' },
	blockButton: { backgroundColor: '#2ecc71' },
	buttonText: { color: 'white', fontWeight: 'bold' },
	reasonInput: {
		height: 80, // Больше места для текста
		textAlignVertical: 'top' // Для многострочного ввода
	}
})
