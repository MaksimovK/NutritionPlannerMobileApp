import { axiosAuth } from '../api/interceptor'
import { IRecipe, IRecipeCreateDto, RecipeFilter } from '../types/recipe.types'

class RecipeService {
	private BASE_URL = 'Recipes'

	async getAll(filter?: RecipeFilter) {
		const response = await axiosAuth.get<IRecipe[]>(this.BASE_URL, {
			params: {
				highProtein: filter?.highProtein,
				lowCalorie: filter?.lowCalorie,
				highCalorie: filter?.highCalorie,
				lowCarb: filter?.lowCarb,
				highCarb: filter?.highCarb,
				lowFat: filter?.lowFat,
				highFat: filter?.highFat
			}
		})
		return response.data
	}

	async create(dto: IRecipeCreateDto): Promise<IRecipe> {
		const response = await axiosAuth.post<IRecipe>(this.BASE_URL, dto)
		return response.data
	}

	async search(name: string, filter?: RecipeFilter) {
		const response = await axiosAuth.get<IRecipe[]>(`${this.BASE_URL}/search`, {
			params: {
				name,
				highProtein: filter?.highProtein,
				lowCalorie: filter?.lowCalorie,
				highCalorie: filter?.highCalorie,
				lowCarb: filter?.lowCarb,
				highCarb: filter?.highCarb,
				lowFat: filter?.lowFat,
				highFat: filter?.highFat
			}
		})
		return response.data
	}

	async getUnapproved() {
		const response = await axiosAuth.get<IRecipe[]>(
			`${this.BASE_URL}/unapproved`
		)
		return response.data
	}

	async approve(id: number) {
		await axiosAuth.put(`${this.BASE_URL}/${id}/approve`)
	}

	async deleteRecipe(id: number) {
		await axiosAuth.delete(`${this.BASE_URL}/${id}`)
	}

	async getByIds(ids: number[]) {
		const validIds = ids.filter(id => Number.isInteger(id))
		if (validIds.length === 0) return []

		const response = await axiosAuth.post<IRecipe[]>(
			`${this.BASE_URL}/by-ids`,
			validIds
		)
		return response.data
	}

	async getById(id: number) {
		const response = await axiosAuth.get<IRecipe>(`${this.BASE_URL}/${id}`)
		return response.data
	}
}

export const recipeService = new RecipeService()
