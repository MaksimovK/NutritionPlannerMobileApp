// src/components/ui/forms/AddRecipeForm.tsx
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../../hooks/navigation/useTypedNavigation'
import { useGetAllProducts } from '../../../hooks/queries/product.queries'
import { useAuthTokenStore } from '../../../store/token'
import { IProduct } from '../../../types/product.types'
import { IRecipeCreateDto } from '../../../types/recipe.types'
import { toastShow } from '../../../utils/toast/toast'

interface IngredientSelection {
	product: IProduct
	amount: number
}

interface AddRecipeFormProps {
	createRecipe: (data: IRecipeCreateDto, options?: any) => void
	isSubmitting: boolean
}

export default function AddRecipeForm({
	createRecipe,
	isSubmitting
}: AddRecipeFormProps) {
	const navigation = useTypedNavigation()
	const { userId } = useAuthTokenStore()
	const { data: infiniteData, isLoading: isLoadingProducts } =
		useGetAllProducts()

	const products: IProduct[] = useMemo(
		() => infiniteData?.pages.flat() ?? [],
		[infiniteData]
	)

	const [search, setSearch] = useState('')
	const [isModalVisible, setModalVisible] = useState(false)
	const [ingredientPool, setIngredientPool] = useState<IngredientSelection[]>(
		[]
	)

	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<IRecipeCreateDto>({
		defaultValues: { name: '', description: '', ingredients: [] }
	})

	const filteredProducts = useMemo(
		() =>
			products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
		[products, search]
	)

	const openModal = () => setModalVisible(true)
	const closeModal = () => {
		setModalVisible(false)
		setSearch('')
	}

	const addIngredient = (product: IProduct) => {
		setIngredientPool(prev =>
			prev.some(i => i.product.id === product.id)
				? prev
				: [...prev, { product, amount: product.weight ?? 100 }]
		)
		closeModal()
	}

	const removeIngredient = (productId: number) => {
		setIngredientPool(prev => prev.filter(i => i.product.id !== productId))
	}

	const updateAmount = (productId: number, value: string) => {
		const num = parseFloat(value) || 0
		setIngredientPool(prev =>
			prev.map(i => (i.product.id === productId ? { ...i, amount: num } : i))
		)
	}

	const onSubmit = (data: IRecipeCreateDto) => {
		if (!ingredientPool.length) {
			toastShow({ status: 'error', text: 'Добавьте хотя бы один ингредиент' })
			return
		}

		// строим массив полного DTO
		const ingredientsDto = ingredientPool.map(i => ({
			id: 0, // новый, сервер заполнит
			recipeId: 0, // при создании этот параметр игнорируется
			productId: i.product.id,
			amount: i.amount,
			product: {
				id: i.product.id,
				name: i.product.name,
				calories: i.product.calories,
				protein: i.product.protein,
				fat: i.product.fat,
				carbohydrates: i.product.carbohydrates
			}
		}))

		const payload: IRecipeCreateDto = {
			name: data.name,
			description: data.description,
			ingredients: ingredientsDto
		}

		console.log('🍳 [CreateRecipe] payload:', payload)
		createRecipe(payload, {
			onSuccess: () => {
				toastShow({ status: 'success', text: 'Рецепт успешно создан!' })
				navigation.goBack()
			},
			onError: () => {
				toastShow({ status: 'error', text: 'Ошибка при создании рецепта' })
			}
		})
	}

	return (
		<View className='p-2'>
			{/* Название */}
			<View className='mb-4'>
				<Text className='mb-1 text-gray-700'>Название рецепта</Text>
				<Controller
					control={control}
					name='name'
					rules={{
						required: 'Обязательное поле',
						minLength: { value: 3, message: 'Минимум 3 символа' }
					}}
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='border border-gray-300 rounded px-3 h-10 text-gray-800'
							placeholder='Введите название'
							value={value}
							onChangeText={onChange}
						/>
					)}
				/>
				{errors.name && (
					<Text className='mt-1 text-red-500'>{errors.name.message}</Text>
				)}
			</View>

			{/* Описание */}
			<View className='mb-4'>
				<Text className='mb-1 text-gray-700'>Описание</Text>
				<Controller
					control={control}
					name='description'
					rules={{ required: 'Обязательное поле' }}
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='border border-gray-300 rounded px-3 text-gray-800 h-20 text-top'
							placeholder='Краткое описание'
							value={value}
							onChangeText={onChange}
							multiline
						/>
					)}
				/>
				{errors.description && (
					<Text className='mt-1 text-red-500'>
						{errors.description.message}
					</Text>
				)}
			</View>

			{/* Кнопка открытия модального списка */}
			<TouchableOpacity
				className='bg-green-500 py-3 rounded mb-4 items-center'
				onPress={openModal}
			>
				<Text className='text-white text-base'>Добавить ингредиент</Text>
			</TouchableOpacity>

			{/* Модальное окно выбора продуктов */}
			<Modal visible={isModalVisible} animationType='slide'>
				<View className='flex-1 p-4 bg-white'>
					<TextInput
						className='border border-gray-300 rounded px-3 h-10 mb-2 text-gray-800'
						placeholder='Поиск продукта...'
						placeholderTextColor='gray'
						value={search}
						onChangeText={setSearch}
					/>
					{isLoadingProducts ? (
						<ActivityIndicator size='large' color='#4CAF50' />
					) : (
						<FlatList
							data={filteredProducts}
							keyExtractor={item => item.id.toString()}
							renderItem={({ item }) => (
								<TouchableOpacity
									className='py-3 border-b border-gray-200'
									onPress={() => addIngredient(item)}
								>
									<Text className='text-gray-800 text-base'>{item.name}</Text>
									<Text className='text-gray-500 text-sm'>
										{item.calories} ккал · Б {item.protein} / Ж {item.fat} / У{' '}
										{item.carbohydrates}
									</Text>
								</TouchableOpacity>
							)}
						/>
					)}
					<TouchableOpacity className='mt-4 items-center' onPress={closeModal}>
						<Text className='text-green-500 text-base'>Закрыть</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* Список выбранных ингредиентов с полем веса */}
			<View className='mb-4'>
				<Text className='mb-1 text-gray-700'>Ингредиенты:</Text>
				{ingredientPool.length === 0 ? (
					<Text className='text-gray-500 text-sm'>Пусто</Text>
				) : (
					ingredientPool.map(i => (
						<View key={i.product.id} className='flex-row items-center mb-2'>
							<Text className='flex-1 text-gray-800'>{i.product.name}</Text>
							<TextInput
								className='border border-gray-300 rounded px-2 h-10 w-16 text-gray-800 text-center'
								keyboardType='numeric'
								value={String(i.amount)}
								onChangeText={text => updateAmount(i.product.id, text)}
							/>
							<TouchableOpacity onPress={() => removeIngredient(i.product.id)}>
								<Text className='text-red-500 ml-2'>Удалить</Text>
							</TouchableOpacity>
						</View>
					))
				)}
			</View>

			<TouchableOpacity
				className='bg-green-500 py-3 rounded items-center'
				onPress={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<ActivityIndicator color='white' />
				) : (
					<Text className='text-white text-base'>Добавить рецепт</Text>
				)}
			</TouchableOpacity>
			<TouchableOpacity
				className='bg-blue-500 py-3 rounded items-center mt-3'
				onPress={() => navigation.goBack()}
			>
				<Text className='text-white text-base'>Назад</Text>
			</TouchableOpacity>
		</View>
	)
}
