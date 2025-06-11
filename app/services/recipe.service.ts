import { axiosAuth } from '../api/interceptor'
import { IRecipe, IRecipeCreateDto } from '../types/recipe.types'

class RecipeService {
	private BASE_URL = 'Recipes'

	async getAll() {
		const response = await axiosAuth.get<IRecipe[]>(this.BASE_URL)
		return response.data
	}

	async create(dto: IRecipeCreateDto): Promise<IRecipe> {
		const response = await axiosAuth.post<IRecipe>(this.BASE_URL, dto)
		return response.data
	}

	async search(name: string) {
		const response = await axiosAuth.get<IRecipe[]>(`${this.BASE_URL}/search`, {
			params: { name }
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
}

export const recipeService = new RecipeService()
