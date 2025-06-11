import { axiosClassic } from '../api/interceptor'
import {
	ILoginRequest,
	ILoginResponse,
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
		const response = await axiosClassic.post<ILoginResponse>(
			`${this.BASE_URL}/login`,
			data
		)
		return response.data
	}
}

export const authService = new AuthServices()
