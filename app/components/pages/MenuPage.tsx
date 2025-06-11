import React from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useUserGoals } from '../../hooks/queries/userGoals.queries'
import { useAuthTokenStore } from '../../store/token'
import MenuItem from '../elements/menu-item/MenuItem'

export default function MenuPage() {
	const userId = useAuthTokenStore(state => state.userId)

	const { data: userGoals, isLoading: userGoalsLoading } = useUserGoals(userId)

	if (userGoalsLoading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	return (
		<ScrollView className='flex-1 bg-gray-100'>
			<View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-300'>
				<View className='items-center p-2 rounded bg-blue-100 flex-row justify-between px-4 shadow-sm shadow-black'>
					<View className='w-full items-center'>
						<Text className='text-base font-medium text-blue-600'>Меню</Text>
					</View>
				</View>
			</View>

			<View className='p-5'>
				<MenuItem
					type={
						userGoals?.goals[0].goalTypeId === 1
							? 'loss'
							: userGoals?.goals[0].goalTypeId === 2
							? 'gait'
							: 'maintaining'
					}
				/>
			</View>

			<View className='p-5 bg-white rounded-lg shadow-lg mx-5 shadow-black mb-24'>
				<Text className='text-xl font-semibold text-center text-gray-800'>
					Важная информация
				</Text>
				<Text className='mt-2 text-base text-gray-700 leading-relaxed text-center'>
					Каждая диета в нашем меню является лишь рекомендацией. Мы понимаем,
					что каждый организм уникален и требует индивидуального подхода. То,
					что подходит одному, может не подойти другому. Проконсультируйтесь с
					врачом или специалистом, прежде чем приступить к любому изменению
					рациона. Ваше здоровье — это наибольшее богатство, и мы рекомендуем
					подходить к процессу с уважением и вниманием.
				</Text>
			</View>
		</ScrollView>
	)
}
