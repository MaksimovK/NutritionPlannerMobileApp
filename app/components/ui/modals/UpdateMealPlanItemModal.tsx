import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useUpdateMealPlanItem } from '../../../hooks/queries/mealPlanItem.queries'
import { useGetProductById } from '../../../hooks/queries/product.queries'
import { MealPlanItem } from '../../../types/mealPlanItem.types'
import { IProduct } from '../../../types/product.types'
import { useProductCalculations } from '../../../utils/useProductCalculations'

interface IUpdateMealPlanItemModalProps {
	onClose: () => void
	mealPlanItem: MealPlanItem
}

export default function UpdateMealPlanItemModal({
	onClose,
	mealPlanItem
}: IUpdateMealPlanItemModalProps) {
	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: {
			weight: mealPlanItem.amount * 100
		},
		mode: 'onChange'
	})
	const defaultProduct: IProduct = {
		id: 0,
		name: '',
		calories: 0,
		protein: 0,
		fat: 0,
		carbohydrates: 0,
		weight: 0
	}

	const { data: product } = useGetProductById(mealPlanItem.productId)

	const { calories, protein, fat, carbohydrates, calculateMacros } =
		useProductCalculations(product ?? defaultProduct)

	const handleWeightChange = (weight: number) => {
		calculateMacros(weight)
	}

	useEffect(() => {
		const initialWeight = mealPlanItem.amount * 100
		setValue('weight', initialWeight)

		calculateMacros(initialWeight)
	}, [mealPlanItem.amount, setValue])

	const { mutate: updateMealPlanItem } = useUpdateMealPlanItem()

	const onSubmit = (data: { weight: number }) => {
		updateMealPlanItem({
			id: mealPlanItem!.id,
			mealPlanId: mealPlanItem!.mealPlanId,
			mealTimeId: mealPlanItem!.mealTimeId,
			productId: mealPlanItem!.productId,
			amount: data.weight / 100
		})

		onClose()
	}

	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
		>
			<View className='m-4 bg-gray-100 rounded-xl'>
				<View className='bg-gray-300 py-4 px-5 border-b border-gray-100 shadow-xl shadow-gray-500 rounded-xl'>
					<TouchableOpacity onPress={onClose}>
						<Image
							className='w-6 h-6'
							source={require('../../../assets/icons/back.png')}
						/>
					</TouchableOpacity>

					<Text className='text-xl font-bold pt-4 pl-1 text-gray-900'>
						{product?.name}
					</Text>
				</View>

				<View className='py-4 px-5'>
					<Text className='text-base text-gray-900'>
						Редактирование продукта
					</Text>
					<Controller
						control={control}
						name='weight'
						rules={{
							required: 'Вес обязателен',
							min: { value: 1, message: 'Вес должен быть больше 0' }
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => {
									const weight = Number(text)
									if (!isNaN(weight)) {
										onChange(text)
										handleWeightChange(weight)
									}
								}}
								value={value.toString()}
								placeholder='Введите вес продукта'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.weight && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.weight.message}
						</Text>
					)}

					<TouchableOpacity
						className='bg-[#4CAF50] justify-center items-center rounded mt-3'
						onPress={handleSubmit(onSubmit)}
					>
						<Text className='text-base text-white text-center py-2'>
							Обновить
						</Text>
					</TouchableOpacity>
				</View>

				<View className='bg-gray-300 rounded-xl'>
					<View className='flex-row'>
						<View className='border border-gray-100 w-1/2'>
							<Text className='text-base text-gray-900 text-center'>
								Калории {'\n'}
								{calories} ккал
							</Text>
						</View>
						<View className='border border-gray-100 w-1/2 '>
							<Text className='text-base text-gray-900 text-center'>
								Белки {'\n'}
								{protein} г
							</Text>
						</View>
					</View>
					<View className='flex-row'>
						<View className='border border-gray-100 w-1/2 rounded-bl-xl'>
							<Text className='text-base text-gray-900 text-center'>
								Жиры {'\n'}
								{fat} г
							</Text>
						</View>
						<View className='border border-gray-100 w-1/2 rounded-br-xl'>
							<Text className='text-base text-gray-900 text-center'>
								Углеводы {'\n'}
								{carbohydrates} г
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}
