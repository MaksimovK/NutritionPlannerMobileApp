import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../../hooks/navigation/useTypedNavigation'
import { IActivityLevelsResponse } from '../../../types/activityLevels.types'
import { IRegisterRequest } from '../../../types/auth.types'
import { IGoalTypesResponse } from '../../../types/goalTypes.types'
import { toastShow } from '../../../utils/toast/toast'

interface IRegisterFormProps {
	registerUser: (data: IRegisterRequest, options: any) => void
	activityLevels: IActivityLevelsResponse
	goalTypes: IGoalTypesResponse
}

export default function RegisterForm({
	registerUser,
	activityLevels,
	goalTypes
}: IRegisterFormProps) {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<IRegisterRequest>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			age: 0,
			gender: 'male',
			height: 0,
			weight: 0,
			activityLevelId: 1,
			goalTypeId: 1,
			password: ''
		}
	})
	const navigation = useTypedNavigation()
	const [isAgreed, setIsAgreed] = useState(false)

	const onSubmit = (data: IRegisterRequest) => {
		if (!isAgreed) {
			toastShow({
				status: 'error',
				text: 'Вы должны согласиться с правилами'
			})
			return
		}

		registerUser(data, {
			onSuccess: () => {
				toastShow({
					status: 'success',
					text: 'Вы успешно зарегистрировались.'
				})
				reset()
			},
			onError: (error: any) => {
				console.error('Registration error:', error)

				const errorMessage =
					error.response?.data?.Message || // Сообщение, возвращаемое сервером
					error.response?.data?.message || // Альтернативное поле для сообщений
					'Не удалось зарегистрироваться! Проверьте введённые данные.' // Сообщение по умолчанию

				toastShow({
					status: 'error',
					text: `Ошибка: ${errorMessage}`
				})
			}
		})
	}

	return (
		<View>
			<Text className='mb-1 text-lg font-bold'>Имя:</Text>
			<Controller
				control={control}
				name='name'
				rules={{
					required: 'Имя обязательно',
					minLength: {
						value: 4,
						message: 'Имя должно быть не менее 4 символов'
					}
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow'
						onChangeText={onChange}
						value={value}
						placeholderTextColor={'black'}
						placeholder='Введите имя'
					/>
				)}
			/>
			{errors.name && (
				<Text className='text-red-500 mb-4'>{errors.name.message}</Text>
			)}

			{/* Email Field */}
			<Text className='mb-1 text-lg font-bold'>Email:</Text>
			<Controller
				control={control}
				name='email'
				rules={{
					required: 'Email обязателен',
					pattern: {
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: 'Введите корректный email'
					}
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow placeholder-black'
						onChangeText={onChange}
						value={value}
						placeholder='Введите email'
						placeholderTextColor={'black'}
						keyboardType='email-address'
					/>
				)}
			/>
			{errors.email && (
				<Text className='text-red-500 mb-4'>{errors.email.message}</Text>
			)}

			{/* Age Field */}
			<Text className='mb-1 text-lg font-bold'>Возраст:</Text>
			<Controller
				control={control}
				name='age'
				rules={{
					required: 'Возраст обязателен',
					min: { value: 1, message: 'Возраст должен быть больше 0' },
					max: { value: 150, message: 'Возраст не может быть больше 150' }
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow placeholder-black'
						onChangeText={text =>
							onChange(text === '' ? 0 : parseInt(text, 10))
						}
						value={value.toString()}
						placeholder='Введите возраст'
						keyboardType='numeric'
					/>
				)}
			/>
			{errors.age && (
				<Text className='text-red-500 mb-4'>{errors.age.message}</Text>
			)}

			{/* Height Field */}
			<Text className='mb-1 text-lg font-bold'>Рост (см):</Text>
			<Controller
				control={control}
				name='height'
				rules={{
					required: 'Рост обязателен',
					min: { value: 1, message: 'Рост должен быть больше 0' },
					max: { value: 300, message: 'Рост должен быть меньше 300' }
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow placeholder-black'
						onChangeText={text =>
							onChange(text === '' ? 0 : parseInt(text, 10))
						}
						value={value.toString()}
						placeholder='Введите рост'
						keyboardType='numeric'
						placeholderTextColor={'black'}
					/>
				)}
			/>
			{errors.height && (
				<Text className='text-red-500 mb-4'>{errors.height.message}</Text>
			)}

			{/* Weight Field */}
			<Text className='mb-1 text-lg font-bold'>Вес (кг):</Text>
			<Controller
				control={control}
				name='weight'
				rules={{
					required: 'Вес обязателен',
					min: { value: 1, message: 'Вес должен быть больше 0' },
					max: { value: 400, message: 'Вес должен быть меньше 600' }
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow placeholder-black'
						onChangeText={text =>
							onChange(text === '' ? 0 : parseInt(text, 10))
						}
						value={value.toString()}
						placeholder='Введите вес'
						keyboardType='numeric'
						placeholderTextColor={'black'}
					/>
				)}
			/>
			{errors.weight && (
				<Text className='text-red-500 mb-4'>{errors.weight.message}</Text>
			)}

			{/* Gender Field */}
			<Text className='mb-1 text-lg font-bold'>Пол:</Text>
			<Controller
				control={control}
				name='gender'
				render={({ field: { onChange, value } }) => (
					<Picker
						selectedValue={value}
						onValueChange={onChange}
						style={{ color: 'black' }}
					>
						<Picker.Item label='Мужской' value='male' />
						<Picker.Item label='Женский' value='female' />
					</Picker>
				)}
			/>

			{/* Activity Level Field */}
			<Text className='mb-1 text-lg font-bold'>
				Уровень физической активности:
			</Text>
			<Controller
				control={control}
				name='activityLevelId'
				render={({ field: { onChange, value } }) => (
					<View className='mb-4'>
						<Picker
							selectedValue={value}
							onValueChange={onChange}
							style={{ color: 'black' }}
						>
							{activityLevels?.levels?.map((level: any) => (
								<Picker.Item
									key={level.id}
									label={level.name}
									value={level.id}
								/>
							))}
						</Picker>
						<Text className='text-sm text-gray-500 mt-1'>
							{
								activityLevels?.levels?.find((level: any) => level.id === value)
									?.description
							}
						</Text>
					</View>
				)}
			/>

			{/* Goal Type Field */}
			<Text className='mb-1 text-lg font-bold'>Цель:</Text>
			<Controller
				control={control}
				name='goalTypeId'
				render={({ field: { onChange, value } }) => (
					<View className='mb-4'>
						<Picker
							selectedValue={value}
							onValueChange={onChange}
							className='border border-gray-300 rounded bg-white shadow'
							style={{ color: 'black' }}
						>
							{goalTypes?.types?.map((goal: any) => (
								<Picker.Item key={goal.id} label={goal.name} value={goal.id} />
							))}
						</Picker>
						<Text className='text-sm text-gray-500 mt-1'>
							{
								goalTypes?.types?.find((goal: any) => goal.id === value)
									?.description
							}
						</Text>
					</View>
				)}
			/>

			{/* Password Field */}
			<Text className='mb-1 text-lg font-bold'>Пароль:</Text>
			<Controller
				control={control}
				name='password'
				rules={{
					required: 'Пароль обязателен',
					validate: value => {
						const errors: string[] = []
						if (!value) {
							return 'Пароль обязателен'
						}
						if (value.length < 6) {
							errors.push('Минимум 6 символов')
						}
						if (!/^[A-Za-z0-9!@#$%^&*()_+]+$/.test(value)) {
							errors.push(
								'Только английские буквы и разрешённые символы (!@#$%^&*()_+)'
							)
						}
						if (!/\d/.test(value)) {
							errors.push('Хотя бы одна цифра')
						}
						if (!/[!@#$%^&*()_+]/.test(value)) {
							errors.push('Хотя бы один специальный символ (!@#$%^&*()_+)')
						}
						return errors.length === 0 || errors.join('\n')
					}
				}}
				render={({ field: { onChange, value } }) => (
					<TextInput
						className='border border-gray-300 rounded p-2 mb-5 text-black bg-white shadow'
						onChangeText={onChange}
						value={value}
						placeholder='Введите пароль'
						placeholderTextColor={'black'}
						secureTextEntry={true}
					/>
				)}
			/>
			{errors.password && (
				<View className='flex-col items-start'>
					{Array.isArray(errors.password.message) ? (
						errors.password.message.map((message, index) => (
							<Text key={index} className='text-red-500 mb-4'>
								{message}
							</Text>
						))
					) : (
						<Text className='text-red-500 mb-4'>{errors.password.message}</Text>
					)}
				</View>
			)}

			<View className='flex-row items-center mb-5 mt-2'>
				<TouchableOpacity onPress={() => setIsAgreed(!isAgreed)}>
					<View style={styles.checkboxContainer}>
						<View style={[styles.checkbox, isAgreed && styles.checked]}>
							{isAgreed && <Text style={styles.checkmark}>✓</Text>}
						</View>
					</View>
				</TouchableOpacity>
				<Text className='text-black ml-2'>
					Я соглашаюсь с{' '}
					<Text
						className='text-blue-500 underline'
						onPress={() => navigation.navigate('TermsPage')}
					>
						правилами сообщества
					</Text>
				</Text>
			</View>

			<TouchableOpacity
				className='mb-5 w-full justify-center items-center rounded bg-[#4CAF50]'
				onPress={handleSubmit(onSubmit)}
			>
				<Text className='text-white py-3 text-base font-semibold'>
					Зарегистрироваться
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='justify-center items-center mb-8'
				onPress={() => navigation.navigate('LoginPage')}
				style={{ opacity: isAgreed ? 1 : 0.6 }}
				disabled={!isAgreed}
			>
				<Text className='text-black font-semibold'>Есть аккаунт? Войти</Text>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	checkboxContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	checkbox: {
		width: 24,
		height: 24,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#fff'
	},
	checked: {
		backgroundColor: '#4CAF50',
		borderColor: '#4CAF50'
	},
	checkmark: {
		color: 'white',
		fontSize: 16,
		fontWeight: 'bold'
	}
})
