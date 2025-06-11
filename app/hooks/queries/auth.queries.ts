import { useMutation } from '@tanstack/react-query'
import { authService } from '../../services/auth.services'
import { useAuthTokenStore } from '../../store/token'
import { ILoginRequest, IRegisterRequest } from '../../types/auth.types'

export function useRegister() {
	const saveToken = useAuthTokenStore(state => state.saveToken)

	return useMutation({
		mutationKey: ['register'],
		mutationFn: async (data: IRegisterRequest) => {
			const response = await authService.register(data)
			saveToken(response.token, response.userId, response.userRole)
			return response
		}
	})
}

export function useLogin() {
	const saveToken = useAuthTokenStore(state => state.saveToken)

	return useMutation({
		mutationKey: ['login'],
		mutationFn: async (data: ILoginRequest) => {
			const response = await authService.login(data)
			saveToken(response.token, response.userId, response.userRole)
			return response
		}
	})
}
