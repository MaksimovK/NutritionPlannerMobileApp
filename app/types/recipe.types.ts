import { IProduct } from './product.types'

export interface IRecipeIngredient {
	id: number
	recipeId: number
	productId: number
	amount: number
	product: IProduct
}

export interface IRecipe {
	id: number
	name: string
	description: string
	totalWeight: number
	caloriesPer100g: number
	proteinPer100g: number
	fatPer100g: number
	carbohydratesPer100g: number
	ingredients: IRecipeIngredient[]
}

export interface IRecipeCreateDto {
	name: string
	description: string
	ingredients: {
		id: number
		recipeId: number
		productId: number
		amount: number
		product: {
			id: number
			name: string
			calories: number
			protein: number
			fat: number
			carbohydrates: number
		}
	}[]
}
