import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCreateRecipe } from '../../hooks/queries/recipe.queries'
import AddRecipeForm from '../ui/forms/AddRecipeForm'

export default function AddRecipePage() {
	const { mutate: createRecipe, isPending } = useCreateRecipe()

	return (
		<ScrollView className='flex-1 p-5 bg-gray-100'>
			<View className='bg-white rounded-lg p-5 shadow-md'>
				<Text className='text-xl font-bold mb-5 text-center text-gray-800'>
					Добавить рецепт
				</Text>
				<AddRecipeForm createRecipe={createRecipe} isSubmitting={isPending} />
			</View>
		</ScrollView>
	)
}
