import { axiosClassic } from '../api/interceptor'
import { IUserProgress } from '../types/userProgress.types'

class UserProgressService {
	private BASE_URL = 'UserProgress'

	async getByUserId(userId: string) {
		const response = await axiosClassic.get<IUserProgress[]>(
			`${this.BASE_URL}/${userId}`
		)
		return response.data
	}

	async getByUserIdAndDate(userId: string, date: string) {
		const response = await axiosClassic.get<IUserProgress>(
			`${this.BASE_URL}/${userId}/${date}`
		)
		return response.data
	}
}

export const userProgressService = new UserProgressService()
