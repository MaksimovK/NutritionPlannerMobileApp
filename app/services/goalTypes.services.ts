import { axiosClassic } from '../api/interceptor'
import { IGoalType, IGoalTypesResponse } from '../types/goalTypes.types'

class GoalTypesService {
	private BASE_URL = 'GoalTypes'

	async getAll() {
		const response = await axiosClassic.get<IGoalTypesResponse>(this.BASE_URL)
		return response.data
	}

	async create(data: Omit<IGoalType, 'id'>) {
		const response = await axiosClassic.post(this.BASE_URL, data)
		return response.data
	}

	async update(data: IGoalType) {
		const response = await axiosClassic.put(`${this.BASE_URL}/${data.id}`, data)
		return response.data
	}

	async delete(id: number) {
		const response = await axiosClassic.delete(`${this.BASE_URL}/${id}`)
		return response.data
	}
}

export const goalTypesService = new GoalTypesService()
