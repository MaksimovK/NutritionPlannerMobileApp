import React, { useEffect, useState } from 'react'
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
import { useProductStore } from '../../../store/products'
import { MealPlanItem } from '../../../types/mealPlanItem.types'
import { IMealTime } from '../../../types/mealTimes.types'
import { IProduct } from '../../../types/product.types'
import UpdateMealPlanItemModal from '../../ui/modals/UpdateMealPlanItemModal'

interface IMealTimeCard extends IMealTime {
	mealPlanItems: MealPlanItem[]
	mealPlanId: number
}

export default function MealTimeCard({
	id,
	name,
	description,
	mealPlanId,
	mealPlanItems
}: IMealTimeCard) {
	const navigation = useTypedNavigation()
	const [showProducts, setShowProducts] = useState(false)
	const [products, setProducts] = useState<IProduct[]>([])
	const [localMealPlanItems, setLocalMealPlanItems] =
		useState<MealPlanItem[]>(mealPlanItems)

	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedMealPlanItem, setSelectedMealPlanItem] =
		useState<MealPlanItem | null>(null)

	// Получаем productId для продуктов
	const productIds = localMealPlanItems.map(item => item.productId)

	// Запрос на получение продуктов по их ID
	const { data: productsData } = useGetProductByIds(productIds)

	// Удаление элемента плана питания
	const { mutate: deletedProduct } = useDeleteMealPlanItem()

	const arrowRotation = useState(new Animated.Value(0))[0]

	// Анимации для каждого продукта
	const [translateX, setTranslateX] = useState(() =>
		localMealPlanItems.map(() => new Animated.Value(0))
	)
	const [backgroundColors, setBackgroundColors] = useState(() =>
		localMealPlanItems.map(() => new Animated.Value(0))
	)

	useEffect(() => {
		// Обновляем локальные данные при изменении mealPlanItems
		setLocalMealPlanItems(mealPlanItems)
	}, [mealPlanItems])

	// Загружаем продукты при изменении mealPlanItems
	useEffect(() => {
		if (productsData) {
			setProducts(productsData)
		} else {
			setProducts([])
		}

		// Обновляем анимации при изменении списка продуктов
		setTranslateX(localMealPlanItems.map(() => new Animated.Value(0)))
		setBackgroundColors(localMealPlanItems.map(() => new Animated.Value(0)))
	}, [localMealPlanItems, productsData])

	const handleDeleteProduct = (mealPlanItemId: number) => {
		try {
			deletedProduct(mealPlanItemId) // Удаление элемента плана питания

			// Обновляем локальное состояние mealPlanItems и удаляем продукт
			setLocalMealPlanItems(prev =>
				prev.filter(item => item.id !== mealPlanItemId)
			)

			// Обновляем список продуктов
			setProducts(prev => prev.filter(product => product.id !== mealPlanItemId))

			// Пересчитываем анимации
			setTranslateX(prev =>
				products
					.filter(product => product.id !== mealPlanItemId)
					.map(() => new Animated.Value(0))
			)
			setBackgroundColors(prev =>
				products
					.filter(product => product.id !== mealPlanItemId)
					.map(() => new Animated.Value(0))
			)
		} catch (error) {
			console.error('Error deleting product:', error)
		}
	}

	useEffect(() => {
		Animated.timing(arrowRotation, {
			toValue: showProducts ? 1 : 0,
			duration: 300,
			easing: Easing.ease,
			useNativeDriver: true
		}).start()
	}, [showProducts])

	const arrowInterpolate = arrowRotation.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '180deg']
	})

	const handleOpenModal = (mealPlanItem: MealPlanItem) => {
		setSelectedMealPlanItem(mealPlanItem)
		setIsModalVisible(true)
	}

	const handleCloseModal = () => {
		setIsModalVisible(false)
		setSelectedMealPlanItem(null)
	}

	const { addProduct, clearProducts } = useProductStore()

	const handleTransitProduct = () => {
		clearProducts()
		if (!productsData) return

		for (const product of productsData) {
			addProduct(product)
		}
	}

	const totalCalories = localMealPlanItems
		.reduce((total, item) => {
			const product = products.find(p => p.id === item.productId)
			if (product) {
				total += product.calories * item.amount
			}
			return total
		}, 0)
		.toFixed(2)

	const totalProtein = localMealPlanItems
		.reduce((total, item) => {
			const product = products.find(p => p.id === item.productId)
			if (product) {
				total += product.protein * item.amount
			}
			return total
		}, 0)
		.toFixed(2)

	const totalFat = localMealPlanItems
		.reduce((total, item) => {
			const product = products.find(p => p.id === item.productId)
			if (product) {
				total += product.fat * item.amount
			}
			return total
		}, 0)
		.toFixed(2)

	const totalCarbohydrates = localMealPlanItems
		.reduce((total, item) => {
			const product = products.find(p => p.id === item.productId)
			if (product) {
				total += product.carbohydrates * item.amount
			}
			return total
		}, 0)
		.toFixed(2)

	return (
		<View className='p-4 mb-4 bg-white rounded-lg shadow-md'>
			<View className='items-center justify-between flex-row'>
				<Text className='text-lg font-bold text-gray-800'>{name}</Text>
				<View className='flex-row items-center justify-center gap-3'>
					<Text className='text-sm font-bold text-gray-800'>
						{totalCalories} кКал
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
			<Text className='text-sm text-gray-600 mb-3'>{description}</Text>

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

			{products.length > 0 && (
				<TouchableOpacity
					onPress={() => setShowProducts(!showProducts)}
					className='ml-1 flex-row items-center justify-between'
				>
					<View className='flex-row gap-3'>
						<Text className='text-sm text-gray-600 font-bold'>
							{totalProtein}
						</Text>
						<Text className='text-sm text-gray-600 font-bold'>{totalFat}</Text>
						<Text className='text-sm text-gray-600 font-bold'>
							{totalCarbohydrates}
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

			{showProducts && (
				<View className='mt-3'>
					{localMealPlanItems.map((item, index) => {
						const product = products.find(p => p.id === item.productId)
						if (!product) return null

						const panResponder = PanResponder.create({
							onMoveShouldSetPanResponder: (_, gestureState) =>
								Math.abs(gestureState.dx) > 10,
							onPanResponderMove: (_, { dx }) => {
								translateX[index]?.setValue(dx)
								backgroundColors[index]?.setValue(dx < -50 ? 1 : 0)
							},
							onPanResponderRelease: (_, { dx }) => {
								if (dx < -100) {
									Animated.sequence([
										Animated.timing(translateX[index], {
											toValue: -400,
											duration: 300,
											useNativeDriver: true
										}),
										Animated.timing(backgroundColors[index], {
											toValue: 1,
											duration: 300,
											useNativeDriver: true
										})
									]).start(() => handleDeleteProduct(item.id))
								} else {
									Animated.spring(translateX[index], {
										toValue: 0,
										useNativeDriver: true
									}).start()
									Animated.timing(backgroundColors[index], {
										toValue: 0,
										duration: 300,
										useNativeDriver: true
									}).start()
								}
							}
						})

						const interpolatedBackgroundColor =
							backgroundColors[index]?.interpolate({
								inputRange: [0, 1],
								outputRange: ['#f3f4f6', '#d1485f']
							}) || '#f3f4f6'

						return (
							<Animated.View
								key={item.id}
								style={{
									transform: [{ translateX: translateX[index] }],
									backgroundColor: interpolatedBackgroundColor
								}}
								className='p-2 mb-2 rounded-lg'
								{...panResponder.panHandlers}
							>
								<TouchableOpacity onPress={() => handleOpenModal(item)}>
									<View className='flex-row items-center justify-between mr-0.5'>
										<Text className='text-base'>{product.name}</Text>
										<Text className='text-base font-bold text-gray-600'>
											{product.weight * item.amount} г.
										</Text>
									</View>

									<View className='flex-row justify-between'>
										<View className='flex-row gap-3'>
											<Text className='text-sm text-gray-600'>
												{(product.protein * item.amount).toFixed(2)}
											</Text>
											<Text className='text-sm text-gray-600'>
												{(product.fat * item.amount).toFixed(2)}
											</Text>
											<Text className='text-sm text-gray-600'>
												{(product.carbohydrates * item.amount).toFixed(2)}
											</Text>
										</View>
										<View>
											<Text className='text-sm text-gray-600'>
												{(product.calories * item.amount).toFixed(2)} кКал
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							</Animated.View>
						)
					})}
				</View>
			)}
		</View>
	)
}
