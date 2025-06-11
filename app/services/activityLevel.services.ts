import { axiosClassic } from '../api/interceptor'
import {
	IActivityLevel,
	IActivityLevelsResponse
} from '../types/activityLevels.types'

class ActivityLevelsService {
	private BASE_URL = 'ActivityLevels'

	async getAll() {
		const response = await axiosClassic.get<IActivityLevelsResponse>(
			this.BASE_URL
		)
		return response.data
	}

	async create(data: Omit<IActivityLevel, 'id'>) {
		const response = await axiosClassic.post(this.BASE_URL, data)
		return response.data
	}

	async delete(id: number) {
		const response = await axiosClassic.delete(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async update(data: IActivityLevel) {
		const { name, description, coefficient } = data
		const params = { name, description, coefficient }
		const response = await axiosClassic.put(
			`${this.BASE_URL}/${data.id}`,
			params
		)
		return response.data
	}
}

export const activityLevelService = new ActivityLevelsService()
