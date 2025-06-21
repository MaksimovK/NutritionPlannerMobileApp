import React, { useCallback, useEffect, useState } from 'react'
import {
	Animated,
	Easing,
	Image,
	Modal,
	PanResponder,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../../hooks/navigation/useTypedNavigation'
import { useDeleteMealPlanItem } from '../../../hooks/queries/mealPlanItem.queries'
import { useGetProductByIds } from '../../../hooks/queries/product.queries'
import { useGetRecipeByIds } from '../../../hooks/queries/recipe.queries'
import { useProductStore } from '../../../store/products'
import { useRecipeStore } from '../../../store/recipes'
import { MealPlanItem } from '../../../types/mealPlanItem.types'
import { IMealTime } from '../../../types/mealTimes.types'
import UpdateMealPlanItemModal from '../../ui/modals/UpdateMealPlanItemModal'

interface IMealTimeCard extends IMealTime {
	mealPlanItems: MealPlanItem[]
	mealPlanId: number
}

type DisplayItem = {
	id: number
	type: 'product' | 'recipe'
	name: string
	amount: number
	nutrition: {
		calories: number
		protein: number
		fat: number
		carbohydrates: number
	}
}

export default function MealTimeCard({
	id,
	name,
	description,
	mealPlanId,
	mealPlanItems,
	calorieLimit
}: IMealTimeCard & { calorieLimit?: number }) {
	const navigation = useTypedNavigation()
	const [showItems, setShowItems] = useState(false)
	const [displayItems, setDisplayItems] = useState<DisplayItem[]>([])

	const totalCalories = displayItems.reduce(
		(sum, item) => sum + item.nutrition.calories,
		0
	)

	const getCalorieColor = () => {
		if (!calorieLimit) return 'text-gray-800'

		const percentage = (totalCalories / calorieLimit) * 100

		if (percentage > 100) return 'text-red-500'
		if (percentage > 90) return 'text-yellow-500'
		return 'text-gray-800'
	}

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedMealPlanItem, setSelectedMealPlanItem] =
		useState<MealPlanItem | null>(null)

	// Разделяем элементы на продукты и рецепты
	const productItems = mealPlanItems.filter(item => item.productId !== null)
	const recipeItems = mealPlanItems.filter(item => item.recipeId !== null)

	// Получаем ID продуктов и рецептов
	const productIds = productItems.map(item => item.productId!)
	const recipeIds = recipeItems.map(item => item.recipeId!)

	// Запросы на получение данных
	const { data: productsData } = useGetProductByIds(productIds)
	const { data: recipesData } = useGetRecipeByIds(recipeIds)

	// Удаление элемента плана питания
	const { mutate: deleteMealPlanItem } = useDeleteMealPlanItem()

	const arrowRotation = useState(new Animated.Value(0))[0]

	// Анимации для каждого элемента
	const [animations, setAnimations] = useState<
		{
			translateX: Animated.Value
			backgroundColor: Animated.Value
		}[]
	>(
		displayItems.map(() => ({
			translateX: new Animated.Value(0),
			backgroundColor: new Animated.Value(0)
		}))
	)

	// Формируем данные для отображения
	useEffect(() => {
		const items: DisplayItem[] = []

		// Добавляем продукты
		if (productsData) {
			productsData.forEach(product => {
				const item = productItems.find(i => i.productId === product.id)
				if (item) {
					items.push({
						id: item.id,
						type: 'product',
						name: product.name,
						amount: item.amount * product.weight,
						nutrition: {
							calories: product.calories * item.amount,
							protein: product.protein * item.amount,
							fat: product.fat * item.amount,
							carbohydrates: product.carbohydrates * item.amount
						}
					})
				}
			})
		}

		// Добавляем рецепты
		if (recipesData) {
			recipesData.forEach(recipe => {
				const item = recipeItems.find(i => i.recipeId === recipe.id)
				if (item) {
					// Расчет для рецептов на основе веса порции
					const portionWeight = item.amount

					items.push({
						id: item.id,
						type: 'recipe',
						name: recipe.name,
						amount: portionWeight,
						nutrition: {
							calories: (recipe.caloriesPer100g * portionWeight) / 100,
							protein: (recipe.proteinPer100g * portionWeight) / 100,
							fat: (recipe.fatPer100g * portionWeight) / 100,
							carbohydrates: (recipe.carbohydratesPer100g * portionWeight) / 100
						}
					})
				}
			})
		}

		setDisplayItems(items)

		// Инициализируем анимации
		setAnimations(
			items.map(() => ({
				translateX: new Animated.Value(0),
				backgroundColor: new Animated.Value(0)
			}))
		)
	}, [productsData, recipesData, mealPlanItems])

	const handleDeleteItem = useCallback(
		(itemId: number) => {
			deleteMealPlanItem(itemId)
		},
		[deleteMealPlanItem]
	)

	useEffect(() => {
		Animated.timing(arrowRotation, {
			toValue: showItems ? 1 : 0,
			duration: 300,
			easing: Easing.ease,
			useNativeDriver: true
		}).start()
	}, [showItems])

	useEffect(() => {
		setAnimations(
			displayItems.map(() => ({
				translateX: new Animated.Value(0),
				backgroundColor: new Animated.Value(0)
			}))
		)
	}, [displayItems])

	const arrowInterpolate = arrowRotation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	})

	const handleOpenModal = useCallback((item: MealPlanItem) => {
		setSelectedMealPlanItem(item)
		setIsModalVisible(true)
	}, [])

	const handleCloseModal = useCallback(() => {
		setIsModalVisible(false)
		setSelectedMealPlanItem(null)
	}, [])

	const { addProduct, clearProducts } = useProductStore()
	const { addRecipe, clearRecipes } = useRecipeStore()

	const handleTransitProduct = useCallback(() => {
		clearProducts()
		clearRecipes()
		if (productsData) {
			productsData.forEach(product => addProduct(product))
		}
		if (recipesData) {
			recipesData.forEach(recipe => addRecipe(recipe))
		}
	}, [productsData, clearProducts, addProduct, clearRecipes])

	// Расчет общих значений калорий и БЖУ
	const totalNutrition = displayItems.reduce(
		(acc, item) => ({
			calories: acc.calories + item.nutrition.calories,
			protein: acc.protein + item.nutrition.protein,
			fat: acc.fat + item.nutrition.fat,
			carbohydrates: acc.carbohydrates + item.nutrition.carbohydrates
		}),
		{
			calories: 0,
			protein: 0,
			fat: 0,
			carbohydrates: 0
		}
	)

	return (
		<View className='p-4 mb-4 bg-white rounded-lg shadow-md'>
			<View className='items-center justify-between flex-row'>
				<Text className='text-lg font-bold text-gray-800'>{name}</Text>
				<View className='flex-row items-center justify-center gap-3'>
					<Text className={`text-sm font-bold ${getCalorieColor()}`}>
						{calorieLimit
							? `${totalCalories.toFixed(2)} / ${calorieLimit.toFixed(2)} ккал`
							: `${totalCalories.toFixed(2)} ккал`}
					</Text>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('ProductPage', {
								mealTimeId: id,
								mealPlanId: mealPlanId,
								mealTimeName: name
							})
							handleTransitProduct()
						}}
					>
						<Image
							className='w-6 h-6'
							source={require('../../../assets/icons/plus-blue.png')}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{description && (
				<Text className='text-sm text-gray-600 mb-3'>{description}</Text>
			)}

			<Modal
				animationType='slide'
				transparent={true}
				visible={isModalVisible}
				onRequestClose={handleCloseModal}
			>
				{selectedMealPlanItem && (
					<UpdateMealPlanItemModal
						mealPlanItem={selectedMealPlanItem}
						onClose={handleCloseModal}
					/>
				)}
			</Modal>

			{displayItems.length > 0 && (
				<TouchableOpacity
					onPress={() => setShowItems(!showItems)}
					className='ml-1 flex-row items-center justify-between'
				>
					<View className='flex-row gap-3'>
						<Text className='text-sm text-gray-600 font-bold'>
							{totalNutrition.protein.toFixed(2)}
						</Text>
						<Text className='text-sm text-gray-600 font-bold'>
							{totalNutrition.fat.toFixed(2)}
						</Text>
						<Text className='text-sm text-gray-600 font-bold'>
							{totalNutrition.carbohydrates.toFixed(2)}
						</Text>
					</View>
					<Animated.View
						style={{
							transform: [{ rotate: arrowInterpolate }],
							width: 20,
							height: 20
						}}
					>
						<Image
							className='w-full h-full'
							source={require('../../../assets/icons/arrow-down.png')}
						/>
					</Animated.View>
				</TouchableOpacity>
			)}

			{showItems &&
				displayItems.map((item, index) => {
					const animation = animations[index] || {
						translateX: new Animated.Value(0),
						backgroundColor: new Animated.Value(0)
					}

					const panResponder = PanResponder.create({
						onMoveShouldSetPanResponder: (_, gestureState) =>
							Math.abs(gestureState.dx) > 10,
						onPanResponderMove: (_, { dx }) => {
							animation.translateX.setValue(dx)
							animation.backgroundColor.setValue(dx < -50 ? 1 : 0)
						},
						onPanResponderRelease: (_, { dx }) => {
							if (dx < -100) {
								Animated.parallel([
									Animated.timing(animation.translateX, {
										toValue: -400,
										duration: 300,
										useNativeDriver: true
									}),
									Animated.timing(animation.backgroundColor, {
										toValue: 1,
										duration: 300,
										useNativeDriver: true
									})
								]).start(() => handleDeleteItem(item.id))
							} else {
								Animated.parallel([
									Animated.spring(animation.translateX, {
										toValue: 0,
										useNativeDriver: true
									}),
									Animated.timing(animation.backgroundColor, {
										toValue: 0,
										duration: 300,
										useNativeDriver: true
									})
								]).start()
							}
						}
					})

					const bgColor = animation.backgroundColor.interpolate({
						inputRange: [0, 1],
						outputRange: ['#f3f4f6', '#d1485f']
					})

					return (
						<Animated.View
							key={item.id}
							style={{
								transform: [{ translateX: animation.translateX }],
								backgroundColor: bgColor
							}}
							className='p-2 my-1.5 rounded-lg'
							{...panResponder.panHandlers}
						>
							<TouchableOpacity
								onPress={() => {
									const mealPlanItem = mealPlanItems.find(i => i.id === item.id)
									if (mealPlanItem) handleOpenModal(mealPlanItem)
								}}
							>
								<View className='flex-row items-center justify-between mr-0.5'>
									<Text className='text-base'>{item.name}</Text>
									<Text className='text-base font-bold text-gray-600'>
										{item.amount.toFixed(2)} г.
									</Text>
								</View>

								<View className='flex-row justify-between'>
									<View className='flex-row gap-3'>
										<Text className='text-sm text-gray-600'>
											{item.nutrition.protein.toFixed(2)}
										</Text>
										<Text className='text-sm text-gray-600'>
											{item.nutrition.fat.toFixed(2)}
										</Text>
										<Text className='text-sm text-gray-600'>
											{item.nutrition.carbohydrates.toFixed(2)}
										</Text>
									</View>
									<View>
										<Text className='text-sm text-gray-600'>
											{item.nutrition.calories.toFixed(2)} кКал
										</Text>
									</View>
								</View>
							</TouchableOpacity>
						</Animated.View>
					)
				})}
		</View>
	)
}
