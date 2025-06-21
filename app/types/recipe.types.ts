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
	isApproved?: boolean
	createdByUserId?: string
	weight?: number // Добавим поле для хранения веса порции
	calories?: number // Добавим поля для расчетных значений
	protein?: number
	fat?: number
	carbohydrates?: number
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

export type RecipeFilter = {
	highProtein?: boolean
	lowCalorie?: boolean
	highCalorie?: boolean
	lowCarb?: boolean
	highCarb?: boolean
	lowFat?: boolean
	highFat?: boolean
}
