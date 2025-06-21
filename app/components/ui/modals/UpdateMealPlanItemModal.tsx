import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Image,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useUpdateMealPlanItem } from '../../../hooks/queries/mealPlanItem.queries'
import { useGetProductById } from '../../../hooks/queries/product.queries'
import { useGetRecipeById } from '../../../hooks/queries/recipe.queries'
import { MealPlanItem } from '../../../types/mealPlanItem.types'
import { useProductCalculations } from '../../../utils/useProductCalculations'
import { useRecipeCalculations } from '../../../utils/useRecipeCalculations'

interface IUpdateMealPlanItemModalProps {
	onClose: () => void
	mealPlanItem: MealPlanItem
}

export default function UpdateMealPlanItemModal({
	onClose,
	mealPlanItem
}: IUpdateMealPlanItemModalProps) {
	const [itemType, setItemType] = useState<'product' | 'recipe'>('product')
	const [itemName, setItemName] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm({
		defaultValues: {
			amount: 0
		},
		mode: 'onChange'
	})

	// Определяем тип элемента (продукт или рецепт)
	useEffect(() => {
		if (mealPlanItem.productId) {
			setItemType('product')
		} else if (mealPlanItem.recipeId) {
			setItemType('recipe')
		}
	}, [mealPlanItem])

	// Запросы данных
	const { data: product, isLoading: productLoading } = useGetProductById(
		mealPlanItem.productId ?? 0
	)
	const { data: recipe, isLoading: recipeLoading } = useGetRecipeById(
		mealPlanItem.recipeId ?? 0
	)

	// Хуки для расчетов

	// Установка начальных значений

	const productCalculations = useProductCalculations(product!)
	const recipeCalculations = useRecipeCalculations(recipe)

	useEffect(() => {
		if (itemType === 'product' && product) {
			const weightInGrams = mealPlanItem.amount * 100
			setValue('amount', weightInGrams)
			productCalculations.calculateMacros(weightInGrams)
			setItemName(product.name)
			setIsLoading(false)
		} else if (itemType === 'recipe' && recipe) {
			setValue('amount', mealPlanItem.amount)
			recipeCalculations.calculateMacros(mealPlanItem.amount)
			setItemName(recipe.name)
			setIsLoading(false)
		} else if (
			(itemType === 'product' && !product) ||
			(itemType === 'recipe' && !recipe)
		) {
			setIsLoading(productLoading || recipeLoading)
		}
	}, [itemType, product, recipe, mealPlanItem.amount, setValue])

	// Обработчик изменения веса/количества
	const handleAmountChange = (value: number) => {
		if (itemType === 'product') {
			productCalculations.calculateMacros(value)
		} else if (itemType === 'recipe') {
			recipeCalculations.calculateMacros(value)
		}
	}

	const { mutate: updateMealPlanItem } = useUpdateMealPlanItem()

	const onSubmit = (data: { amount: number }) => {
		if (!mealPlanItem.id) {
			console.error('Meal plan item ID is missing')
			return
		}

		// Для продуктов преобразуем граммы в порции (amount = граммы / 100)
		// Для рецептов оставляем как есть (amount = вес порции)
		const amount = itemType === 'product' ? data.amount / 100 : data.amount

		updateMealPlanItem({
			id: mealPlanItem.id,
			mealPlanId: mealPlanItem.mealPlanId,
			mealTimeId: mealPlanItem.mealTimeId,
			productId: mealPlanItem.productId,
			recipeId: mealPlanItem.recipeId,
			amount: amount
		})

		onClose()
	}

	// Получаем текущие значения для отображения
	const getCurrentValues = () => {
		if (itemType === 'product' && product) {
			return {
				calories: productCalculations.calories,
				protein: productCalculations.protein,
				fat: productCalculations.fat,
				carbohydrates: productCalculations.carbohydrates
			}
		} else if (itemType === 'recipe' && recipe) {
			return {
				calories: recipeCalculations.calories,
				protein: recipeCalculations.protein,
				fat: recipeCalculations.fat,
				carbohydrates: recipeCalculations.carbohydrates
			}
		} else {
			return {
				calories: 0,
				protein: 0,
				fat: 0,
				carbohydrates: 0
			}
		}
	}

	const { calories, protein, fat, carbohydrates } = getCurrentValues()

	if (isLoading) {
		return (
			<View className='flex-1 justify-center items-center bg-black/50'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
		>
			<View className='m-4 bg-gray-100 rounded-xl w-4/5'>
				<View className='bg-gray-300 py-4 px-5 border-b border-gray-100 shadow-xl shadow-gray-500 rounded-xl'>
					<TouchableOpacity onPress={onClose}>
						<Image
							className='w-6 h-6'
							source={require('../../../assets/icons/back.png')}
						/>
					</TouchableOpacity>

					<Text className='text-xl font-bold pt-4 pl-1 text-gray-900'>
						{itemName}
					</Text>
				</View>

				<View className='py-4 px-5'>
					<Text className='text-base text-gray-900'>
						{itemType === 'product'
							? 'Редактирование продукта'
							: 'Редактирование рецепта'}
					</Text>

					<Controller
						control={control}
						name='amount'
						rules={{
							required: 'Значение обязательно',
							min: { value: 1, message: 'Значение должно быть больше 0' }
						}}
						render={({ field: { onChange, value } }) => (
							<View>
								<TextInput
									className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
									onChangeText={text => {
										const amount = Number(text)
										if (!isNaN(amount)) {
											onChange(amount)
											handleAmountChange(amount)
										}
									}}
									value={value.toString()}
									placeholder={
										itemType === 'product'
											? 'Введите вес в граммах'
											: 'Введите вес порции'
									}
									placeholderTextColor='gray'
									keyboardType='numeric'
								/>
								{errors.amount && (
									<Text className='text-red-500 pt-1 text-left'>
										{errors.amount.message}
									</Text>
								)}
							</View>
						)}
					/>

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
								{calories.toFixed(2)} ккал
							</Text>
						</View>
						<View className='border border-gray-100 w-1/2 '>
							<Text className='text-base text-gray-900 text-center'>
								Белки {'\n'}
								{protein.toFixed(2)} г
							</Text>
						</View>
					</View>
					<View className='flex-row'>
						<View className='border border-gray-100 w-1/2 rounded-bl-xl'>
							<Text className='text-base text-gray-900 text-center'>
								Жиры {'\n'}
								{fat.toFixed(2)} г
							</Text>
						</View>
						<View className='border border-gray-100 w-1/2 rounded-br-xl'>
							<Text className='text-base text-gray-900 text-center'>
								Углеводы {'\n'}
								{carbohydrates.toFixed(2)} г
							</Text>
						</View>
					</View>
				</View>
			</View>
		</View>
	)
}
