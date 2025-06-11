import { axiosClassic } from '../api/interceptor'
import { IMealTime, IMealTimesResponse } from '../types/mealTimes.types'

class MealTimesService {
	private BASE_URL = 'MealTimes'

	async getAll() {
		const response = await axiosClassic.get<IMealTimesResponse>(this.BASE_URL)
		return response.data
	}

	async create(data: Omit<IMealTime, 'id'>) {
		const response = await axiosClassic.post(this.BASE_URL, data)
		return response.data
	}

	async update(data: IMealTime) {
		const response = await axiosClassic.put(`${this.BASE_URL}/${data.id}`, data)
		return response.data
	}

	async delete(id: number) {
		const response = await axiosClassic.delete(`${this.BASE_URL}/${id}`)
		return response.data
	}
}

export const mealTimesService = new MealTimesService()
