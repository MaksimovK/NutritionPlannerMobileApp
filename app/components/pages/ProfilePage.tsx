import React from 'react'
import {
	ActivityIndicator,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { useGetAllActivityLevels } from '../../hooks/queries/activityLevels.queries'
import { useGetAllGoalTypes } from '../../hooks/queries/goalTypes.queries'
import { useUpdateUser, useUserProfile } from '../../hooks/queries/user.queries'
import {
	useUpdateUserGoal,
	useUserGoals
} from '../../hooks/queries/userGoals.queries'
import { useAuthTokenStore } from '../../store/token'
import { Role } from '../../types/user.types'
import ProfileForm from '../ui/forms/ProfileForm'

export default function ProfilePage() {
	const { userRole, userId } = useAuthTokenStore()
	const removeToken = useAuthTokenStore(state => state.removeToken)
	const navigation = useTypedNavigation()

	const { data: userData, isLoading, error, isError } = useUserProfile()
	const { mutate: updateUser } = useUpdateUser()
	const { mutate: updateUserGoal } = useUpdateUserGoal()
	const { data: userGoals, isLoading: userGoalsLoading } = useUserGoals(userId)
	const { data: activityLevels, isLoading: activityLevelsLoading } =
		useGetAllActivityLevels()
	const { data: goalTypes, isLoading: goalTypesLoading } = useGetAllGoalTypes()

	const handleLogout = () => removeToken()

	if (
		isLoading ||
		activityLevelsLoading ||
		userGoalsLoading ||
		goalTypesLoading
	) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	if (!userGoals || !goalTypes) return null

	if (error || isError) {
		return (
			<TouchableOpacity
				className='bg-red-500 py-3 rounded-xl items-center mt-5 mb-24'
				onPress={handleLogout}
			>
				<Text className='text-white font-bold'>Выйти из аккаунта</Text>
			</TouchableOpacity>
		)
	}

	if (!userData || !activityLevels) {
		return (
			<View className='flex-1 justify-center items-center p-5'>
				<Text className='text-lg font-bold mb-3'>
					Нет данных о пользователе
				</Text>
				<TouchableOpacity
					className='bg-red-500 py-3 px-6 rounded'
					onPress={handleLogout}
				>
					<Text className='text-white font-bold'>Выйти из аккаунта</Text>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<ScrollView className='flex-1 bg-white'>
			<View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-300'>
				<View className='flex-1 items-center p-2 rounded bg-blue-100 flex-row justify-between px-4 shadow-sm shadow-black'>
					<View>
						<Text className='text-base font-medium text-blue-600 '>
							Привет, {userData.name}
						</Text>
						<Text className='text-base text-blue-600'>{userData.email}</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							if (userRole === Role.Admin) navigation.navigate('AdminPanelPage')
						}}
					>
						<Image
							className='w-11 h-11 bg-white rounded-full border border-gray-300 shadow-xl shadow-black'
							source={require('../../assets/icons/logo.png')}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<ProfileForm
				userData={userData}
				updateUser={updateUser}
				userGoals={userGoals}
				updateUserGoal={updateUserGoal}
				activityLevels={activityLevels}
				goalTypes={goalTypes}
				userId={userId}
			/>

			<TouchableOpacity
				onPress={() => {
					navigation.navigate('ChatPage')
				}}
				className='flex-row justify-center items-center space-x-2 border-black border rounded-xl mx-5 mt-2'
			>
				<Text className='text-black text-center py-3'>
					{userRole === Role.Dietitian
						? 'Мои клиенты'
						: 'Обратиться к диетологу'}
				</Text>
				<Image
					className='w-6 h-6 shadow-xl shadow-black'
					source={require('../../assets/icons/chat.png')}
				/>
			</TouchableOpacity>

			<View className='px-5 mt-2'>
				<TouchableOpacity
					className='bg-red-500 py-3 rounded-xl items-center mb-1'
					onPress={handleLogout}
				>
					<Text className='text-white font-bold'>Выйти из аккаунта</Text>
				</TouchableOpacity>
			</View>

			<View className='px-5 mb-24'>
				<Text className='text-black text-center'>
					Если заметили проблемы, пишите нам: example@example.com
				</Text>
			</View>
		</ScrollView>
	)
}
