import { axiosClassic } from '../api/interceptor'
import {
	ICreateUserGoalRequest,
	IUpdateUserGoalRequest,
	IUserGoal,
	IUserGoalsResponse
} from '../types/userGoals.types'

class UserGoalsService {
	private BASE_URL = 'UserGoals'

	async getUserGoals(userId: string) {
		const response = await axiosClassic.get<IUserGoalsResponse>(
			`${this.BASE_URL}/${userId}`
		)
		return response.data
	}

	async createUserGoal(data: ICreateUserGoalRequest) {
		const response = await axiosClassic.post<IUserGoal>(
			`${this.BASE_URL}`,
			data
		)
		return response.data
	}

	async updateUserGoal(data: IUpdateUserGoalRequest) {
		const response = await axiosClassic.put<IUserGoal>(
			`${this.BASE_URL}/${data.userId}`,
			data
		)
		return response.data
	}
}

export const userGoalsService = new UserGoalsService()
