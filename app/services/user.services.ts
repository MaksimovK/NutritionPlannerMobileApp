import { axiosAuth } from '../api/interceptor'
import { IUser } from '../types/user.types'

class UserServices {
	private BASE_URL = 'Users'

	async updateUser(updatedUser: IUser) {
		const response = await axiosAuth.put(
			`${this.BASE_URL}/${updatedUser.id}`,
			updatedUser
		)
		return response.data
	}

	async getUserById(id: string) {
		const response = await axiosAuth.get<IUser>(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async getAllUsers() {
		const response = await axiosAuth.get<IUser[]>(`${this.BASE_URL}`)
		return response.data
	}

	async updateUserRole(userId: string, newRole: number) {
		const response = await axiosAuth.put(`${this.BASE_URL}/${userId}/role`, {
			newRole
		})
		return response.data
	}

	async blockUser(userId: string, blockedUntil: Date, reason: string) {
		const response = await axiosAuth.post(`${this.BASE_URL}/${userId}/block`, {
			blockedUntil: blockedUntil.toISOString(),
			reason: reason
		})
		return response.data
	}

	async unblockUser(userId: string) {
		const response = await axiosAuth.post(`${this.BASE_URL}/${userId}/unblock`)
		return response.data
	}
}

export const userService = new UserServices()
