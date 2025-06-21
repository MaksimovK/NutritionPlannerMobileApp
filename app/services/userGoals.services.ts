import { axiosAuth } from '../api/interceptor'
import {
	ICreateUserGoalRequest,
	IUpdateUserGoalRequest,
	IUserGoal,
	IUserGoalsResponse
} from '../types/userGoals.types'

class UserGoalsService {
	private BASE_URL = 'UserGoals'

	async getUserGoals(userId: string) {
		const response = await axiosAuth.get<IUserGoalsResponse>(
			`${this.BASE_URL}/${userId}`
		)
		return response.data
	}

	async createUserGoal(data: ICreateUserGoalRequest) {
		const response = await axiosAuth.post<IUserGoal>(`${this.BASE_URL}`, data)
		return response.data
	}

	async updateUserGoal(data: IUpdateUserGoalRequest) {
		const response = await axiosAuth.put<IUserGoal>(
			`${this.BASE_URL}/${data.userId}`,
			data
		)
		return response.data
	}
}

export const userGoalsService = new UserGoalsService()
