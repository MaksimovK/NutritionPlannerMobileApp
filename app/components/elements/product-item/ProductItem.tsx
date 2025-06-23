import React, { useRef } from 'react'
import {
	ActivityIndicator,
	Animated,
	Image,
	PanResponder,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useApproveProduct } from '../../../hooks/queries/product.queries'
import { useFavoritesStore } from '../../../store/favorites'
import { useProductStore } from '../../../store/products'
import { useAuthTokenStore } from '../../../store/token'
import { IProduct } from '../../../types/product.types'
import { Role } from '../../../types/user.types'

interface IProductItemProps {
	item: IProduct
	onPress?: () => void
	showApproveButton?: boolean
	isSelected?: boolean
}

export default function ProductItem({
	item,
	onPress,
	isSelected = false,
	showApproveButton = false
}: IProductItemProps) {
	const { favoriteProducts, toggleProductFavorite } = useFavoritesStore()
	const isFavorite = favoriteProducts.some(p => p.id === item.id)
	const pan = useRef(new Animated.ValueXY()).current

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) =>
				Math.abs(gestureState.dx) > 10,

			onPanResponderMove: Animated.event([null, { dx: pan.x }], {
				useNativeDriver: false
			}),

			onPanResponderRelease: (_, gesture) => {
				if (gesture.dx < -50) {
					toggleProductFavorite(item)
				}
				Animated.spring(pan, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: false
				}).start()
			}
		})
	).current

	const { products } = useProductStore()
	const { userId, userRole } = useAuthTokenStore()
	const { mutate: approveProduct, isPending: isApproving } = useApproveProduct()

	const isProductInStore = products.some(product => product.id === item.id)
	const isCurrentUserCreator = userId === item.createdByUserId
	const isAdmin = userRole === Role.Admin

	// Определяем цвет фона в зависимости от статуса
	const getBackgroundColor = () => {
		if (isSelected) return 'bg-green-200'
		if (isProductInStore) return 'bg-green-200'
		if (!item.isApproved && isCurrentUserCreator) return 'bg-yellow-100'
		if (!item.isApproved) return 'bg-gray-200'
		return 'bg-white'
	}

	return (
		<Animated.View
			style={{ transform: [{ translateX: pan.x }] }}
			{...panResponder.panHandlers}
		>
			<View
				className={`p-4 rounded-lg mb-3 shadow-sm shadow-gray-800 ${getBackgroundColor()}`}
			>
				{isFavorite && (
					<Image
						className='absolute top-2 right-2 w-5 h-5'
						source={require('../../../assets/icons/favorite-enabled.png')}
					/>
				)}
				<TouchableOpacity onPress={onPress}>
					<View className='flex-row justify-between items-center pr-0.5'>
						<Text className='text-lg font-bold text-gray-800'>{item.name}</Text>
						<Text className='text-base text-gray-800'>{item.weight} г</Text>
					</View>
					<View className='flex-row justify-between items-center mt-1'>
						<View className='flex-row gap-2'>
							<Text className='text-sm text-[#3b82f6]'>{item.protein} Б</Text>
							<Text className='text-sm text-[#FFC107]'>{item.fat} Ж</Text>
							<Text className='text-sm text-[#d1485f]'>
								{item.carbohydrates} У
							</Text>
						</View>
						<Text className='text-sm text-gray-600'>{item.calories} кКал</Text>
					</View>

					{/* Статус модерации */}
					{!item.isApproved && (
						<View className='mt-2'>
							{isCurrentUserCreator ? (
								<Text className='text-yellow-600 text-sm'>
									Ваш продукт ожидает модерации
								</Text>
							) : (
								<Text className='text-gray-500 text-sm'>
									Продукт ожидает модерации
								</Text>
							)}
						</View>
					)}
				</TouchableOpacity>

				{/* Кнопка одобрения для администратора */}
				{showApproveButton && isAdmin && !item.isApproved && (
					<TouchableOpacity
						onPress={() => approveProduct(item.id)}
						className='bg-green-500 py-2 rounded-md items-center mt-2'
						disabled={isApproving}
					>
						{isApproving ? (
							<ActivityIndicator color='white' />
						) : (
							<Text className='text-white text-sm'>Одобрить продукт</Text>
						)}
					</TouchableOpacity>
				)}
			</View>
		</Animated.View>
	)
}
