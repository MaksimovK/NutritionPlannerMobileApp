import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { IGoalTypesResponse } from '../../../types/goalTypes.types'
import { IUser } from '../../../types/user.types'
import { IUserGoalsResponse } from '../../../types/userGoals.types'
import calculateCalories from '../../../utils/calc-calories'

interface IInformationCaloriesModalProps {
	userData: IUser
	userGoals: IUserGoalsResponse
	goalTypes: IGoalTypesResponse
	onClose(): void
}

export default function InformationCaloriesModal({
	userData,
	userGoals,
	goalTypes,
	onClose
}: IInformationCaloriesModalProps) {
	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
		>
			<View className='bg-white rounded-lg p-4'>
				<Text className='text-base text-center mb-4'>
					Суточная норма калорий по формуле{' '}
					<Text className='text-lg font-bold text-center'>
						Миффлина - Сан Жеора:{'\n'}
					</Text>
					<Text className='text-lg text-center'>
						{Math.floor(
							calculateCalories(
								userData.gender,
								userData.weight,
								userData.height,
								userData.age,
								userData.activityLevelId
							)
						)}{' '}
						ккал
					</Text>
				</Text>

				{userGoals?.goals?.[0].goalTypeId !== 3 && (
					<Text className='text-lg text-center mb-4'>
						Суточная норма калорий для цели{' '}
						<Text className='font-bold lowercase'>
							{
								goalTypes?.types?.find(
									type => type.id === userGoals?.goals?.[0].goalTypeId
								)?.name
							}
							:{' '}
						</Text>
						{Math.floor(Number(userGoals?.goals?.[0].calories))} ккал
					</Text>
				)}
				<TouchableOpacity
					className='bg-blue-500 py-2 rounded-xl items-center justify-center w-12 mx-auto'
					onPress={onClose}
				>
					<Text className='text-white font-bold'>Ок</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}
