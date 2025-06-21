import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IRecipe } from '../../types/recipe.types'

interface IRecipeStore {
	recipes: IRecipe[]
	addRecipe: (recipe: IRecipe) => void
	removeRecipe: (id: number) => void
	clearRecipes: () => void
}

export const useRecipeStore = create<IRecipeStore>()(
	persist(
		set => ({
			recipes: [],
			addRecipe: recipe =>
				set(state => {
					const isRecipeInStore = state.recipes.some(r => r.id === recipe.id)
					if (isRecipeInStore) {
						console.log(`Рецепт с id ${recipe.id} уже существует в store.`)
						return state
					}
					console.log(`Добавление рецепта с id ${recipe.id} в store.`)
					return { recipes: [...state.recipes, recipe] }
				}),

			removeRecipe: id =>
				set(state => {
					const recipeExists = state.recipes.some(recipe => recipe.id === id)
					if (!recipeExists) {
						console.log(`Рецепт с id ${id} не найден в store.`)
						return state
					}
					console.log(`Удаление рецепта с id ${id} из store.`)
					const filteredRecipes = state.recipes.filter(
						recipe => recipe.id !== id
					)
					return { recipes: filteredRecipes }
				}),
			clearRecipes: () => set(() => ({ recipes: [] }))
		}),
		{
			name: 'recipe-store',
			version: 1,
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
