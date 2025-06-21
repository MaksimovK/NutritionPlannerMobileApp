import React, { useState } from 'react'
import {
	Modal,
	StyleSheet,
	Switch,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { ProductFilter as FilterType } from '../../../../../types/product.types'

interface FilterProductModalProps {
	visible: boolean
	onClose: () => void
	onApply: (filter: FilterType) => void
	initialFilter: FilterType
}

const FilterProductModal: React.FC<FilterProductModalProps> = ({
	visible,
	onClose,
	onApply,
	initialFilter
}) => {
	const [filter, setFilter] = useState<FilterType>(initialFilter)

	const toggleFilter = (key: keyof FilterType) => {
		setFilter(prev => ({ ...prev, [key]: !prev[key] }))
	}

	const handleApply = () => {
		onApply(filter)
		onClose()
	}

	const handleReset = () => {
		const resetFilter: FilterType = {
			highProtein: false,
			lowCalorie: false,
			highCalorie: false,
			lowCarb: false,
			highCarb: false,
			lowFat: false,
			highFat: false
		}
		setFilter(resetFilter)
		onApply(resetFilter)
	}

	const FilterItem = ({
		label,
		keyName
	}: {
		label: string
		keyName: keyof FilterType
	}) => (
		<View style={styles.filterItem}>
			<Text style={styles.filterLabel}>{label}</Text>
			<Switch
				value={filter[keyName] || false}
				onValueChange={() => toggleFilter(keyName)}
				trackColor={{ false: '#767577', true: '#4CAF50' }}
				thumbColor={filter[keyName] ? '#f4f3f4' : '#f4f3f4'}
			/>
		</View>
	)

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContainer}>
					<Text style={styles.modalTitle}>Фильтры продуктов</Text>

					<FilterItem label='Высокий белок' keyName='highProtein' />
					<FilterItem label='Низкокалорийный' keyName='lowCalorie' />
					<FilterItem label='Высококалорийный' keyName='highCalorie' />
					<FilterItem label='Низкоуглеводный' keyName='lowCarb' />
					<FilterItem label='Высокоуглеводный' keyName='highCarb' />
					<FilterItem label='Низкожирный' keyName='lowFat' />
					<FilterItem label='Высокожирный' keyName='highFat' />

					<View style={styles.buttonContainer}>
						<TouchableOpacity onPress={handleReset} style={styles.resetButton}>
							<Text style={styles.buttonText}>Сбросить</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={onClose} style={styles.cancelButton}>
							<Text style={styles.buttonText}>Отмена</Text>
						</TouchableOpacity>

						<TouchableOpacity onPress={handleApply} style={styles.applyButton}>
							<Text style={styles.buttonText}>Применить</Text>
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
		backgroundColor: 'rgba(0,0,0,0.5)'
	},
	modalContainer: {
		width: '90%',
		backgroundColor: 'white',
		borderRadius: 10,
		padding: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center'
	},
	filterItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	filterLabel: {
		fontSize: 16,
		color: '#333'
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20
	},
	resetButton: {
		backgroundColor: '#e0e0e0',
		padding: 6,
		borderRadius: 5,
		flex: 1,
		marginRight: 5,
		alignItems: 'center'
	},
	cancelButton: {
		backgroundColor: '#ff5252',
		padding: 6,
		borderRadius: 5,
		flex: 1,
		marginHorizontal: 5,
		alignItems: 'center'
	},
	applyButton: {
		backgroundColor: '#4CAF50',
		padding: 6,
		borderRadius: 5,
		flex: 1,
		marginLeft: 5,
		alignItems: 'center'
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold'
	}
})

export default FilterProductModal
