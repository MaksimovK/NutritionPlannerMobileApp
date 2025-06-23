import React, { useRef, useState } from 'react'
import {
	ActivityIndicator,
	Animated,
	FlatList,
	Image,
	Modal,
	PanResponder,
	Pressable,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import {
	useApproveRecipe,
	useDeleteRecipe
} from '../../../hooks/queries/recipe.queries'
import { useFavoritesStore } from '../../../store/favorites'
import { useAuthTokenStore } from '../../../store/token'
import { IRecipe } from '../../../types/recipe.types'
import { Role } from '../../../types/user.types'

interface RecipeCardProps {
	recipe: IRecipe
	onPress?: (recipe: IRecipe) => void
	isSelected?: boolean
}

export default function RecipeItem({
	recipe,
	onPress,
	isSelected = false
}: RecipeCardProps) {
	const { toggleRecipeFavorite, favoriteRecipes } = useFavoritesStore()
	const isFavorite = favoriteRecipes.some(r => r.id === recipe.id)
	const pan = useRef(new Animated.ValueXY()).current
	const [showIngredients, setShowIngredients] = useState(false)

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_, gestureState) =>
				Math.abs(gestureState.dx) > 10,

			onPanResponderMove: Animated.event([null, { dx: pan.x }], {
				useNativeDriver: false
			}),

			onPanResponderRelease: (_, gesture) => {
				if (gesture.dx < -50) {
					toggleRecipeFavorite(recipe)
				}
				Animated.spring(pan, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: false
				}).start()
			}
		})
	).current

	const { mutate: approveRecipe, isPending: isApproving } = useApproveRecipe()
	const { mutate: deleteRecipe } = useDeleteRecipe()
	const { userId, userRole } = useAuthTokenStore()

	const isCurrentUserCreator = userId === recipe.createdByUserId
	const isAdmin = userRole === Role.Admin

	const bgClass = isSelected
		? 'bg-green-200'
		: !recipe.isApproved && isCurrentUserCreator
		? 'bg-yellow-100'
		: !recipe.isApproved
		? 'bg-gray-200'
		: 'bg-white'

	return (
		<>
			<Animated.View
				style={{ transform: [{ translateX: pan.x }] }}
				{...panResponder.panHandlers}
			>
				<View
					className={`p-4 rounded-lg mb-3 shadow-sm shadow-gray-800 ${bgClass}`}
				>
					{isFavorite && (
						<Image
							className='absolute top-2 right-2 w-5 h-5'
							source={require('../../../assets/icons/favorite-enabled.png')}
						/>
					)}

					{/* Кликабельная область для выбора рецепта */}
					<Pressable onPress={() => onPress && onPress(recipe)}>
						<View className='flex-row justify-between items-center'>
							<Text className='text-lg font-bold text-gray-800 flex-1 mr-2'>
								{recipe.name}
							</Text>
						</View>

						{recipe.description && (
							<Text className='text-sm text-gray-600 mt-1' numberOfLines={2}>
								{recipe.description}
							</Text>
						)}

						<View className='flex-row justify-between items-center mt-2'>
							<View className='flex-row gap-3'>
								<Text className='text-sm text-[#3b82f6]'>
									{recipe.proteinPer100g} Б
								</Text>
								<Text className='text-sm text-[#FFC107]'>
									{recipe.fatPer100g} Ж
								</Text>
								<Text className='text-sm text-[#d1485f]'>
									{recipe.carbohydratesPer100g} У
								</Text>
							</View>
							<Text className='text-sm text-gray-600'>
								{recipe.caloriesPer100g} кКал/100г
							</Text>
						</View>
					</Pressable>

					{/* Блок ингредиентов */}
					<View className='mt-2'>
						<Text className='text-sm font-medium text-gray-800'>
							Ингредиенты:
						</Text>
						<View className='flex-row flex-wrap mt-1'>
							{recipe.ingredients.slice(0, 3).map((ingredient, index) => (
								<Text
									key={`${ingredient.id}-${index}`}
									className='text-sm text-gray-600 mr-2'
								>
									{ingredient.product.name} ({ingredient.amount}g)
								</Text>
							))}
							{recipe.ingredients.length > 3 && (
								<TouchableOpacity onPress={() => setShowIngredients(true)}>
									<Text className='text-sm text-blue-500'>
										+{recipe.ingredients.length - 3} ещё...
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>

					{/* Статус модерации */}
					{!recipe.isApproved && (
						<View className='mt-2'>
							{isCurrentUserCreator ? (
								<Text className='text-yellow-600 text-sm'>
									Ваш рецепт ожидает модерации
								</Text>
							) : (
								<Text className='text-gray-500 text-sm'>
									Рецепт ожидает модерации
								</Text>
							)}
						</View>
					)}

					{/* Кнопки одобрения/удаления для админа */}
					{isAdmin && !recipe.isApproved && (
						<View className='flex-row mt-3 space-x-2'>
							<TouchableOpacity
								className='flex-1 bg-green-500 py-2 rounded items-center'
								onPress={() => approveRecipe(recipe.id)}
								disabled={isApproving}
							>
								{isApproving ? (
									<ActivityIndicator color='white' />
								) : (
									<Text className='text-white text-sm'>Одобрить</Text>
								)}
							</TouchableOpacity>
							<TouchableOpacity
								className='flex-1 bg-red-500 py-2 rounded items-center'
								onPress={() => deleteRecipe(recipe.id)}
							>
								<Text className='text-white text-sm'>Удалить</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</Animated.View>

			{/* Модальное окно с полным списком ингредиентов */}
			<Modal
				visible={showIngredients}
				transparent
				animationType='slide'
				onRequestClose={() => setShowIngredients(false)}
			>
				<View className='flex-1 justify-center items-center bg-black/50 p-4'>
					<View className='bg-white rounded-lg p-5 w-full max-w-md'>
						<Text className='text-lg font-bold mb-3 text-center'>
							Ингредиенты для "{recipe.name}"
						</Text>

						<FlatList
							data={recipe.ingredients}
							keyExtractor={item => `ingredient-${item.id}`}
							renderItem={({ item }) => (
								<View className='flex-row justify-between py-2 border-b border-gray-100'>
									<Text className='text-base'>{item.product.name}</Text>
									<Text className='text-base font-medium'>{item.amount}g</Text>
								</View>
							)}
							ListFooterComponent={
								<View className='mt-3 pt-3 border-t border-gray-200'>
									<Text className='text-sm text-gray-500 text-center'>
										Всего ингредиентов: {recipe.ingredients.length}
									</Text>
								</View>
							}
						/>

						<TouchableOpacity
							className='mt-4 bg-blue-500 py-3 rounded-lg items-center'
							onPress={() => setShowIngredients(false)}
						>
							<Text className='text-white font-medium'>Закрыть</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	)
}
