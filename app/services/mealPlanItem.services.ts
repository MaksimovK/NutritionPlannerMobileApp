import { axiosClassic } from '../api/interceptor'
import { MealPlanItem } from '../types/mealPlanItem.types'

class MealPlanItemServices {
	private BASE_URL = 'MealPlanItems'

	async getByMealPlanId(mealPlanId: number) {
		const response = await axiosClassic.get<MealPlanItem[]>(
			`${this.BASE_URL}/${mealPlanId}`
		)
		return response.data
	}

	async addProductToMealPlan(
		mealPlanId: number,
		mealTimeId: number,
		productId: number,
		amount: number
	) {
		const response = await axiosClassic.post(`${this.BASE_URL}`, {
			MealPlanId: mealPlanId,
			MealTimeId: mealTimeId,
			ProductId: productId,
			Amount: amount
		})
		return response.data
	}

	async update(data: MealPlanItem) {
		const response = await axiosClassic.put(`${this.BASE_URL}/${data.id}`, data)
		return response.data
	}

	async delete(id: number) {
		const response = await axiosClassic.delete(`${this.BASE_URL}/${id}`)
		return response.data
	}
}

export const mealPlanItemService = new MealPlanItemServices()
