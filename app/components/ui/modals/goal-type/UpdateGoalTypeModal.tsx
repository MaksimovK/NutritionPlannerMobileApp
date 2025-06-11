import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useUpdateGoalType } from '../../../../hooks/queries/goalTypes.queries'
import { IGoalType } from '../../../../types/goalTypes.types'

interface IUpdateGoalTypeModal {
	goalType: IGoalType
	onClose: () => void
}

export default function UpdateGoalTypeModal({
	goalType,
	onClose
}: IUpdateGoalTypeModal) {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<IGoalType>({
		defaultValues: {
			id: goalType.id,
			name: goalType.name,
			description: goalType.description
		},
		mode: 'onChange'
	})

	const { mutate: updateGoalType } = useUpdateGoalType()

	const onSubmit = (data: IGoalType) => {
		updateGoalType(data)

		onClose()
	}

	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
		>
			<View className='m-4 bg-gray-100 rounded-xl w-11/12'>
				<TouchableOpacity onPress={onClose} className='absolute right-2 top-2'>
					<Image
						className='w-6 h-6'
						source={require('../../../../assets/icons/close.png')}
					/>
				</TouchableOpacity>

				<View className='py-10 px-5'>
					<Text className='text-base text-gray-900'>
						Редактирование типа цели
					</Text>
					<Controller
						control={control}
						name='name'
						rules={{
							required: 'Имя обязательно'
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={onChange}
								value={value}
								placeholder='Введите название'
								placeholderTextColor='black'
								keyboardType='default'
								multiline={true} // Включаем возможность переноса текста
								style={{
									maxHeight: 100, // Ограничиваем максимальную высоту
									textAlignVertical: 'top' // Для корректного отображения многострочного ввода
								}}
								scrollEnabled={false} // Отключаем скроллинг внутри TextInput
							/>
						)}
					/>
					{errors.name && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.name.message}
						</Text>
					)}

					<Controller
						control={control}
						name='description'
						rules={{
							required: 'Описание обязательно'
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={onChange}
								value={value}
								placeholder='Введите описание'
								placeholderTextColor='black'
								keyboardType='default'
								multiline={true} // Включаем возможность переноса текста
								style={{
									maxHeight: 100, // Ограничиваем максимальную высоту
									textAlignVertical: 'top' // Для корректного отображения многострочного ввода
								}}
								scrollEnabled={false} // Отключаем скроллинг внутри TextInput
							/>
						)}
					/>
					{errors.description && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.description.message}
						</Text>
					)}

					<TouchableOpacity
						className='bg-[#4CAF50] justify-center items-center rounded mt-3'
						onPress={handleSubmit(onSubmit)}
					>
						<Text className='text-base text-white text-center py-2'>
							Сохранить
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}
