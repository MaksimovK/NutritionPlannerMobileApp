import React from 'react'
import {
	ActivityIndicator,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useGetAllMealTimes } from '../../../../hooks/queries/mealTimes.queries'
import { useMenuByGoalId } from '../../../../hooks/queries/menu.queries'
import { useGetProductById } from '../../../../hooks/queries/product.queries'
import { IMenus } from '../../../../types/menu.types'

interface IMenuModalProps {
	goalTypeId: number
	onClose(): void
}

export default function MenuModal({ goalTypeId, onClose }: IMenuModalProps) {
	const { data: menu, isLoading: isLoadingMenu } = useMenuByGoalId(goalTypeId)
	const { data: mealTimes, isLoading: isLoadingMealTimes } =
		useGetAllMealTimes()

	const groupByDayAndMealTime = (menu: IMenus[]) => {
		const groupedData: { [day: string]: { [mealTime: number]: number[] } } = {}
		menu.forEach(item => {
			if (!groupedData[item.dayOfWeek]) {
				groupedData[item.dayOfWeek] = {}
			}
			if (!groupedData[item.dayOfWeek][item.mealTimeId]) {
				groupedData[item.dayOfWeek][item.mealTimeId] = []
			}
			groupedData[item.dayOfWeek][item.mealTimeId].push(item.productId)
		})
		return groupedData
	}

	const groupedMenu = menu ? groupByDayAndMealTime(menu) : {}

	const getMealTimeName = (mealTimeId: number) => {
		return (
			mealTimes?.times.find(mealTime => mealTime.id === mealTimeId)?.name ||
			'Неизвестный прием пищи'
		)
	}

	const ProductItem = ({
		productId,
		amount
	}: {
		productId: number
		amount: number
	}) => {
		const { data: product, isLoading: isLoadingProduct } =
			useGetProductById(productId)

		if (isLoadingProduct || !product)
			return <Text className='font-bold text-sm'>Загрузка продукта...</Text>

		const adjustedWeight = product ? product.weight * amount : 0

		return (
			<View className='mb-2 bg-slate-100 p-2 rounded'>
				<Text className='font-bold text-sm'>
					{product.name} ({adjustedWeight} г)
				</Text>
				<View className='flex-row gap-2'>
					<Text className='text-sm text-gray-500'>
						{(product.calories * amount).toFixed(1)} ккал
					</Text>
					<Text className='text-sm text-gray-500'>
						{(product.protein * amount).toFixed(1)} Б
					</Text>
					<Text className='text-sm text-gray-500'>
						{(product.fat * amount).toFixed(1)} Ж
					</Text>
					<Text className='text-sm text-gray-500'>
						{product.carbohydrates.toFixed(1)} У
					</Text>
				</View>
			</View>
		)
	}

	const renderMenu = () => {
		return Object.entries(groupedMenu).map(([day, meals]) => (
			<View key={day} className='mb-4 bg-white rounded-lg p-4'>
				<Text className='text-lg font-bold mb-2 text-center'>{day}</Text>
				{Object.entries(meals).map(([mealTime, products]) => (
					<View key={mealTime} className='mb-2'>
						<Text className='text-base font-semibold'>
							{getMealTimeName(parseInt(mealTime, 10))}
						</Text>
						{products.map(productId => {
							const menuItem = menu?.find(item => item.productId === productId)
							const amount = menuItem ? menuItem.amount : 1
							return (
								<ProductItem
									key={productId}
									productId={productId}
									amount={amount}
								/>
							)
						})}
					</View>
				))}
			</View>
		))
	}

	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)',
				position: 'relative'
			}}
		>
			{isLoadingMenu || isLoadingMealTimes ? (
				<ActivityIndicator size='large' color='#0000ff' />
			) : (
				<ScrollView className='p-4 w-full'>
					<View
						style={{
							position: 'absolute',
							top: 16,
							right: 16,
							padding: 0,
							zIndex: 999
						}}
					>
						<TouchableOpacity onPress={onClose}>
							<Image
								className='w-5 h-5'
								source={require('../../../../assets/icons/close.png')}
							/>
						</TouchableOpacity>
					</View>
					{menu && renderMenu()}
				</ScrollView>
			)}
		</View>
	)
}
