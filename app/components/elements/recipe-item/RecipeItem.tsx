import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useApproveRecipe, useDeleteRecipe } from '../../../hooks/queries/recipe.queries'
import { IRecipe } from '../../../types/recipe.types'

interface RecipeCardProps {
	recipe: IRecipe
	onPress?: (recipe: IRecipe) => void
	isApprove?: boolean
}

export default function RecipeItem({
	recipe,
	onPress,
	isApprove = false
}: RecipeCardProps) {
	const { mutate: approveRecipe } = useApproveRecipe()
	const { mutate: deleteRecipe } = useDeleteRecipe()

	return (
		<TouchableOpacity style={styles.card} onPress={() => onPress?.(recipe)}>
			<Text style={styles.title}>{recipe.name}</Text>
			<Text style={styles.description} numberOfLines={2}>
				{recipe.description}
			</Text>
			<View style={styles.nutritionRow}>
				<Text style={styles.nutritionItem}>{recipe.caloriesPer100g} кКал</Text>

				<Text className='text-sm text-[#3b82f6]' style={styles.nutritionItem}>
					{recipe.proteinPer100g} Б
				</Text>
				<Text className='text-sm text-[#FFC107]' style={styles.nutritionItem}>
					{recipe.fatPer100g} Ж
				</Text>
				<Text className='text-sm text-[#d1485f]' style={styles.nutritionItem}>
					{recipe.carbohydratesPer100g} У
				</Text>
			</View>

			{isApprove && (
				<View className='flex-row mt-1 space-x-2'>
					<TouchableOpacity
						className='flex-1 bg-green-500 py-2 rounded'
						onPress={() => approveRecipe(recipe.id)}
					>
						<Text className='text-white text-center'>Одобрить</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => deleteRecipe(recipe.id)}
						className='flex-1 bg-red-500 py-2 rounded'
					>
						<Text className='text-white text-center'>Удалить</Text>
					</TouchableOpacity>
				</View>
			)}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 12,
		marginVertical: 6,
		shadowColor: '#000',
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2
	},
	title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
	description: { fontSize: 14, color: '#555', marginBottom: 8 },
	nutritionRow: { flexDirection: 'row', justifyContent: 'space-between' },
	nutritionItem: { fontSize: 12 },
	weight: { fontSize: 12, color: '#777', marginTop: 8, textAlign: 'right' }
})
