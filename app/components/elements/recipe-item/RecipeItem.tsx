import React from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import {
	useApproveRecipe,
	useDeleteRecipe
} from '../../../hooks/queries/recipe.queries'
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
		<TouchableOpacity
			className={`p-4 rounded-lg mb-3 shadow-sm shadow-gray-800 ${bgClass}`}
			onPress={() => onPress && onPress(recipe)}
		>
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
					<Text className='text-sm text-[#FFC107]'>{recipe.fatPer100g} Ж</Text>
					<Text className='text-sm text-[#d1485f]'>
						{recipe.carbohydratesPer100g} У
					</Text>
				</View>
				<Text className='text-sm text-gray-600'>
					{recipe.caloriesPer100g} кКал/100г
				</Text>
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

			{/* Кнопки одобрения/удаления */}
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
						onPress={() => deleteRecipe(recipe.id)}
						className='flex-1 bg-red-500 py-2 rounded items-center'
					>
						<Text className='text-white text-sm'>Удалить</Text>
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	)
}
