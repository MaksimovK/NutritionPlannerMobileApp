import React from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useGetAllActivityLevels } from '../../hooks/queries/activityLevels.queries'
import { useRegister } from '../../hooks/queries/auth.queries'
import { useGetAllGoalTypes } from '../../hooks/queries/goalTypes.queries'
import RegisterForm from '../ui/forms/RegisterForm'

export default function RegisterPage() {
	const { mutate: registerUser } = useRegister()
	const { data: goalTypes, isLoading: isGoalTypesLoading } =
		useGetAllGoalTypes()
	const { data: activityLevels, isLoading: isActivityLevelsLoading } =
		useGetAllActivityLevels()

	if (isGoalTypesLoading || isActivityLevelsLoading) {
		return (
			<View className='flex-1 justify-center items-center bg-gray-100'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	if (!goalTypes || !activityLevels) return null

	return (
		<ScrollView className='bg-gray-100 p-5'>
			<Text className='mb-2 text-2xl font-bold text-center text-[#4CAF50]'>
				Регистрация
			</Text>

			<RegisterForm
				registerUser={registerUser}
				activityLevels={activityLevels}
				goalTypes={goalTypes}
			/>
		</ScrollView>
	)
}
