import React from 'react'
import { Text, View } from 'react-native'
import { useLogin } from '../../hooks/queries/auth.queries'
import LoginForm from '../ui/forms/LoginForm'

export default function LoginPage() {
	const { mutate: loginUser } = useLogin()

	return (
		<View className='bg-gray-100 px-5 justify-center items-center flex-1'>
			<Text className='mb-2 text-2xl font-bold text-center text-[#4CAF50]'>
				Вход
			</Text>

			<LoginForm loginUser={loginUser} />
		</View>
	)
}
