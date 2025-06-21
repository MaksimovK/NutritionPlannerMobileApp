import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Role } from '../../types/user.types'

interface IAuthTokenState {
	token: string
	userId: string
	userRole: Role
	saveToken: (accessToken: string, userId: string, userRole: Role) => void
	removeToken: () => void
}

const store = create<IAuthTokenState>()(
	persist(
		set => ({
			token: '',
			userId: '',
			userRole: Role.User,
			saveToken: (accessToken, userId, userRole) => {
				set({
					token: accessToken,
					userId,
					userRole
				})
			},
			removeToken: () => {
				set({
					token: '',
					userId: '',
					userRole: Role.User
				})
			}
		}),
		{
			name: 'auth-token-store',
			version: 1,
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)

store.subscribe(state => {
	console.log('AuthTokenStore updated:', {
		token: state.token,
		userId: state.userId,
		userRole: state.userRole
	})
})

export const useAuthTokenStore = store
