import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IProduct } from '../../types/product.types'
import { IRecipe } from '../../types/recipe.types'

interface IFavoritesStore {
	favoriteProducts: IProduct[]
	favoriteRecipes: IRecipe[]
	toggleProductFavorite: (product: IProduct) => void
	toggleRecipeFavorite: (recipe: IRecipe) => void
	clearFavorites: () => void
}

export const useFavoritesStore = create<IFavoritesStore>()(
	persist(
		set => ({
			favoriteProducts: [],
			favoriteRecipes: [],

			toggleProductFavorite: product =>
				set(state => {
					const isFavorite = state.favoriteProducts.some(
						p => p.id === product.id
					)
					return {
						favoriteProducts: isFavorite
							? state.favoriteProducts.filter(p => p.id !== product.id)
							: [...state.favoriteProducts, product]
					}
				}),

			toggleRecipeFavorite: recipe =>
				set(state => {
					const isFavorite = state.favoriteRecipes.some(r => r.id === recipe.id)
					return {
						favoriteRecipes: isFavorite
							? state.favoriteRecipes.filter(r => r.id !== recipe.id)
							: [...state.favoriteRecipes, recipe]
					}
				}),

			clearFavorites: () => set({ favoriteProducts: [], favoriteRecipes: [] })
		}),
		{
			name: 'favorites-store',
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
