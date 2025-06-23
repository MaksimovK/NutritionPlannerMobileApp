import { AxiosError } from 'axios'
import { axiosClassic } from '../api/interceptor'
import {
	ILoginRequest,
	IRegisterRequest,
	IRegisterResponse
} from '../types/auth.types'

class AuthServices {
	private BASE_URL = 'Auth'

	async register(data: IRegisterRequest) {
		const response = await axiosClassic.post<IRegisterResponse>(
			`${this.BASE_URL}/register`,
			data
		)
		return response.data
	}

	async login(data: ILoginRequest) {
		try {
			const response = await axiosClassic.post(`${this.BASE_URL}/login`, data)
			return response.data
		} catch (error) {
			const axiosError = error as AxiosError
			if (axiosError.response?.status === 403) {
				const errorMessage =
					axiosError.response.data?.error || 'Аккаунт заблокирован'
				throw new Error(errorMessage)
			}
			throw error
		}
	}
}

export const authService = new AuthServices()
