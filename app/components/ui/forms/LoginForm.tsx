import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useTypedNavigation } from '../../../hooks/navigation/useTypedNavigation'
import { ILoginRequest } from '../../../types/auth.types'
import { toastShow } from '../../../utils/toast/toast'

interface ILoginFormProps {
	loginUser: (data: ILoginRequest, options: any) => void
}

export default function LoginForm({ loginUser }: ILoginFormProps) {
	const navigation = useTypedNavigation()
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors }
	} = useForm<ILoginRequest>({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange'
	})

	const onSubmit = (data: ILoginRequest) => {
		loginUser(data, {
			onSuccess: () => {
				toastShow({
					status: 'success',
					text: 'Вы успешно вошли в систему.'
				})

				reset()
			},
			onError: (error: any) => {
				if (error.message) {
					toastShow({
						status: 'error',
						text: error.message
					})
				} else {
					toastShow({
						status: 'error',
						text: 'Не удалось войти. Проверьте введённые данные.'
					})
				}
			}
		})
	}

	return (
		<View>
			<View className='w-full'>
				<Text className='mb-1 text-lg font-bold'>Email:</Text>
				<Controller
					control={control}
					name='email'
					rules={{
						required: 'Электронная почта обязательна',
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
					<Text className='text-red-500 mb-2 text-left'>
						{errors.email.message}
					</Text>
				)}
			</View>

			<View className='w-full'>
				<Text className='mb-1 text-lg font-bold'>Пароль:</Text>
				<Controller
					control={control}
					name='password'
					rules={{
						required: 'Пароль обязателен',
						minLength: {
							value: 6,
							message: 'Пароль должен быть не менее 6 символов'
						}
					}}
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='border border-gray-300 rounded p-2 mb-1 text-black bg-white shadow placeholder-black'
							onChangeText={onChange}
							value={value}
							placeholder='Введите пароль'
							placeholderTextColor={'black'}
							secureTextEntry
						/>
					)}
				/>
				{errors.password && (
					<Text className='text-red-500 mb-2 text-left'>
						{errors.password.message}
					</Text>
				)}
			</View>

			<TouchableOpacity
				className='mb-5 mt-3 justify-center items-center rounded bg-[#4CAF50]'
				onPress={handleSubmit(onSubmit)}
			>
				<Text className='text-white py-3 text-base font-semibold'>Войти</Text>
			</TouchableOpacity>

			<TouchableOpacity
				className='justify-center items-center mb-8'
				onPress={() => navigation.navigate('RegisterPage')}
			>
				<Text className='text-black font-semibold'>
					Нет аккаунта? Зарегистрироваться
				</Text>
			</TouchableOpacity>
		</View>
	)
}
