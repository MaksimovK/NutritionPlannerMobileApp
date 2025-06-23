import { Picker } from '@react-native-picker/picker'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Image,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { IActivityLevelsResponse } from '../../../types/activityLevels.types'
import { IGoalTypesResponse } from '../../../types/goalTypes.types'
import { IUser } from '../../../types/user.types'
import { IUserGoalsResponse } from '../../../types/userGoals.types'
import { toastShow } from '../../../utils/toast/toast'
import InformationCaloriesModal from '../modals/InformationCaloriesModal'

interface IProfileFormProps {
	updateUser: (data: any, options?: any) => void
	updateUserGoal: (data: any, options?: any) => void
	activityLevels: IActivityLevelsResponse
	userGoals: IUserGoalsResponse
	goalTypes: IGoalTypesResponse
	userId: string
	userData: IUser
}

export default function ProfileForm({
	userData,
	updateUser,
	updateUserGoal,
	activityLevels,
	userGoals,
	goalTypes,
	userId
}: IProfileFormProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [modalVisible, setModalVisible] = useState(false)
	const { control, handleSubmit, setValue } = useForm()

	const handleEdit = () => {
		if (userData) {
			setValue('name', userData.name)
			setValue('email', userData.email)
			setValue('age', String(userData.age))
			setValue('gender', userData.gender)
			setValue('height', String(userData.height))
			setValue('weight', String(userData.weight))
			setValue('activityLevelId', userData.activityLevelId)
			setValue('goalTypeId', userGoals?.goals[0].goalTypeId)
		}
		setIsEditing(true)
	}

	const onSubmit = async (formData: any) => {
		console.log('data', {
			...userData,
			...formData,
			age: Number(formData.age),
			height: Number(formData.height),
			weight: Number(formData.weight),
			activityLevelId: formData.activityLevelId
		})
		updateUser(
			{
				...userData,
				...formData,
				age: Number(formData.age),
				height: Number(formData.height),
				weight: Number(formData.weight),
				activityLevelId: formData.activityLevelId
			},
			{
				onSuccess: () => {
					updateUserGoal(
						{
							goalTypeId: formData.goalTypeId,
							userId: userId
						},
						{
							onSuccess: () => {
								setIsEditing(false)
							},
							onError: (error: any) => {
								console.error('Ошибка при обновлении цели:', error)
								toastShow({
									status: 'error',
									text: 'Не удалось обновить данные!'
								})
							}
						}
					)

					setIsEditing(false)
					toastShow({
						status: 'success',
						text: 'Данные успешно обновлены!'
					})
				},
				onError: (error: any) => {
					console.error('Error updating user:', error)

					const errorMessage =
						error.response?.data?.Message ||
						error.response?.data?.message ||
						'Не удалось обновить данные!'

					toastShow({
						status: 'error',
						text: `Ошибка: ${errorMessage}`
					})
				}
			}
		)
	}

	return (
		<View className='px-5'>
			<View className='flex-row justify-center items-center'>
				<Text className='text-xl font-bold my-5 pr-1'>
					{isEditing ? 'Редактирование профиля' : 'Информация'}
				</Text>
				{!isEditing && (
					<TouchableOpacity onPress={handleEdit}>
						<Image
							className='w-5 h-5'
							source={require('../../../assets/icons/edit.png')}
						/>
					</TouchableOpacity>
				)}
			</View>

			{isEditing ? (
				<>
					{['name', 'email', 'age', 'height', 'weight'].map((field, index) => (
						<Controller
							key={index}
							control={control}
							name={field}
							rules={{
								required: `${
									field === 'name'
										? 'Имя'
										: field === 'email'
										? 'Электронная почта'
										: field === 'age'
										? 'Возраст'
										: field === 'height'
										? 'Рост'
										: field === 'weight'
										? 'Вес'
										: field
								} обязательно для заполнения`,
								...(field === 'name' && {
									minLength: {
										value: 4,
										message: 'Имя должно содержать минимум 4 символа'
									}
								}),
								...(field === 'email' && {
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: 'Неверный формат электронной почты'
									}
								}),
								...(field === 'age' && {
									min: {
										value: 1,
										message: 'Возраст должен быть от 1 до 150'
									},
									max: {
										value: 150,
										message: 'Возраст должен быть от 1 до 150'
									}
								}),
								...(field === 'height' || field === 'weight'
									? {
											valueAsNumber: true,
											min: {
												value: 1,
												message: `${
													field === 'height' ? 'Рост' : 'Вес'
												} должен быть больше 0`
											}
									  }
									: {})
							}}
							render={({
								field: { onChange, value },
								fieldState: { error }
							}) => (
								<View className='mb-4'>
									{/* Подписи на русском языке */}
									<Text className='text-sm font-bold mb-1 capitalize'>
										{field === 'name'
											? 'Имя:'
											: field === 'email'
											? 'Электронная почта:'
											: field === 'age'
											? 'Возраст:'
											: field === 'height'
											? 'Рост:'
											: field === 'weight'
											? 'Вес:'
											: field}
									</Text>
									<TextInput
										className='border border-gray-300 rounded p-2'
										value={String(value)}
										placeholder={
											field === 'name'
												? 'Имя'
												: field === 'email'
												? 'Электронная почта'
												: field === 'age'
												? 'Возраст'
												: field === 'height'
												? 'Введите рост в см'
												: field === 'weight'
												? 'Введите вес в кг'
												: field
										}
										placeholderTextColor='black'
										keyboardType={
											field === 'age' ||
											field === 'height' ||
											field === 'weight'
												? 'numeric'
												: field === 'email'
												? 'email-address'
												: 'default'
										}
										onChangeText={text => {
											const correctedText = text.replace(',', '.')
											onChange(correctedText)
										}}
									/>
									{/* Покажем ошибку, если есть */}
									{error && (
										<Text className='text-red-500 text-xs mt-1'>
											{error.message}
										</Text>
									)}
								</View>
							)}
						/>
					))}

					{/* Уровень активности */}
					<Controller
						control={control}
						name='activityLevelId'
						render={({ field: { onChange, value } }) => (
							<View className='mb-4'>
								<Text className='text-sm font-bold mb-1'>
									Уровень активности:
								</Text>
								<Picker
									selectedValue={value}
									onValueChange={onChange}
									style={{
										borderWidth: 1,
										borderColor: '#ddd',
										borderRadius: 5,
										color: 'black' // Уровень активности текст черным
									}}
								>
									{activityLevels.levels.map(level => (
										<Picker.Item
											key={level.id}
											label={level.name}
											value={level.id}
										/>
									))}
								</Picker>
								<Text className='text-sm text-gray-500 mt-1'>
									{
										activityLevels?.levels?.find(
											(level: any) => level.id === value
										)?.description
									}
								</Text>
							</View>
						)}
					/>

					{/* Выбор цели */}
					<Controller
						control={control}
						name='goalTypeId'
						render={({ field: { onChange, value } }) => (
							<View className='mb-4'>
								<Text className='text-sm font-bold mb-1'>Выберите цель:</Text>
								<Picker
									selectedValue={value}
									onValueChange={onChange}
									style={{
										borderWidth: 1,
										borderColor: '#ddd',
										borderRadius: 5,

										color: 'black'
									}}
								>
									{goalTypes?.types?.map(type => (
										<Picker.Item
											key={type.id}
											label={type.name}
											value={type.id}
										/>
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

					<TouchableOpacity
						className='bg-[#4CAF50] py-3 rounded-xl items-center'
						onPress={handleSubmit(onSubmit)}
					>
						<Text className='text-white font-bold'>Сохранить изменения</Text>
					</TouchableOpacity>
				</>
			) : (
				<>
					{/* Вывод информации о пользователе */}
					{[
						{ label: 'Возраст', value: `${userData.age} лет` },
						{
							label: 'Пол',
							value:
								userData.gender === 'male'
									? 'Мужской'
									: userData.gender === 'female'
									? 'Женский'
									: 'Не указан'
						},
						{ label: 'Рост', value: `${userData.height} см` },
						{ label: 'Вес', value: `${userData.weight} кг` },
						{
							label: 'Уровень активности',
							value:
								activityLevels.levels.find(
									level => level.id === userData.activityLevelId
								)?.name || 'Не указан'
						}
					].map((item, index) => (
						<View
							key={index}
							className='flex-row justify-between items-center mb-3 border-b border-gray-300 pb-2'
						>
							<Text className='text-base font-medium'>{item.label}:</Text>
							<Text
								className='text-base text-right max-w-[160px]'
								numberOfLines={2}
								ellipsizeMode='tail'
							>
								{item.value}
							</Text>
						</View>
					))}

					{/* Вывод цели пользователя */}
					{userGoals?.goals?.map((goal, index) => (
						<View
							key={index}
							className='flex-row justify-between items-center mb-3 border-b border-gray-300 pb-2'
						>
							<Text className='text-base font-medium'>Цель:</Text>
							<Text className='text-base text-right'>
								{goalTypes?.types?.find(type => type.id === goal.goalTypeId)
									?.name || 'Не указана'}
							</Text>
						</View>
					))}

					<View className='justify-center items-center mt-6'>
						<View className='flex-row justify-center items-center '>
							<Text className='text-xl font-bold text-center pr-2'>
								{Math.floor(Number(userGoals?.goals?.[0].calories))} кКал
							</Text>
							<TouchableOpacity
								onPress={() => setModalVisible(true)}
								className='flex-row items-center'
							>
								<Image
									className='w-4 h-4'
									source={require('../../../assets/icons/info.png')}
								/>
							</TouchableOpacity>
						</View>
						<Text className='text-base text-center mt-1'>
							Рекомендуемое количество калорий
						</Text>
						<Text className='text-base text-center mt-2'>
							Каждый организм уникален. Пробуйте и ищите свою оптимальную
							калорийность
						</Text>
					</View>

					<Modal
						animationType='slide'
						transparent={true}
						visible={modalVisible}
						onRequestClose={() => setModalVisible(false)}
					>
						<InformationCaloriesModal
							userData={userData}
							userGoals={userGoals}
							goalTypes={goalTypes}
							onClose={() => setModalVisible(false)}
						/>
					</Modal>
				</>
			)}
		</View>
	)
}
