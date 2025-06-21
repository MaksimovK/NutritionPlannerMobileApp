import { axiosAuth } from '../api/interceptor'
import { MealPlan, WeeklyReport } from '../types/mealPlan.types'

class MealPlanServices {
	private BASE_URL = 'MealPlans'

	async getByDate(userId: string, date: string) {
		const response = await axiosAuth.get<MealPlan>(
			`${this.BASE_URL}/${userId}/${date}`
		)
		return response.data
	}

	async create(data: MealPlan) {
		const response = await axiosAuth.post<number>(`${this.BASE_URL}`, data)
		return response.data
	}

	async getCurrentWeeklyReport(userId: string) {
		const response = await axiosAuth.get<WeeklyReport>(
			`${this.BASE_URL}/weekly-report/current/${userId}`
		)
		return response.data
	}

	async getPreviousWeeklyReport(userId: string) {
		const response = await axiosAuth.get<WeeklyReport>(
			`${this.BASE_URL}/weekly-report/previous/${userId}`
		)
		return response.data
	}
}

export const mealPlanService = new MealPlanServices()
