import { axiosClassic } from '../api/interceptor'
import { IUser } from '../types/user.types'

class UserServices {
	private BASE_URL = 'Users'

	async updateUser(updatedUser: IUser) {
		const response = await axiosClassic.put(
			`${this.BASE_URL}/${updatedUser.id}`,
			updatedUser
		)
		return response.data
	}

	async getUserById(id: string) {
		const response = await axiosClassic.get<IUser>(`${this.BASE_URL}/${id}`)
		return response.data
	}
}

export const userService = new UserServices()
