import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useRecipeStore } from '../../../../store/recipes'
import { IRecipe } from '../../../../types/recipe.types'

interface IAddRecipeModal {
	recipe: IRecipe
	onClose: () => void
}

export default function AddRecipeModal({ recipe, onClose }: IAddRecipeModal) {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		defaultValues: {
			weight: 100
		},
		mode: 'onChange'
	})

	if (!recipe) return null

	const [calories, setCalories] = useState(recipe.caloriesPer100g)
	const [protein, setProtein] = useState(recipe.proteinPer100g)
	const [fat, setFat] = useState(recipe.fatPer100g)
	const [carbohydrates, setCarbohydrates] = useState(
		recipe.carbohydratesPer100g
	)

	const handleWeightChange = (weight: number) => {
		const factor = weight / 100
		setCalories(Math.round(recipe.caloriesPer100g * factor))
		setProtein(Math.round(recipe.proteinPer100g * factor))
		setFat(Math.round(recipe.fatPer100g * factor))
		setCarbohydrates(Math.round(recipe.carbohydratesPer100g * factor))
	}

	const { addRecipe } = useRecipeStore()

	const onSubmit = (data: { weight: number }) => {
		addRecipe({
			...recipe,
			weight: data.weight,
			calories,
			protein,
			fat,
			carbohydrates
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
						{recipe.name}
					</Text>
				</View>

				<View className='py-4 px-5'>
					<Text className='text-base text-gray-900'>
						Добавить в мой дневник
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
								placeholder='Введите вес блюда (г)'
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
							Сохранить
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
