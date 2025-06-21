import { axiosAuth } from '../api/interceptor'
import { IMenus } from '../types/menu.types'

class MenuService {
	private BASE_URL = 'WeeklyMenus'

	async getByGoalId(goalId: number) {
		const response = await axiosAuth.get<IMenus[]>(`${this.BASE_URL}/${goalId}`)
		return response.data
	}
}

export const menuService = new MenuService()
