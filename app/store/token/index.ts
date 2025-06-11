import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface IAuthTokenState {
	token: string
	userId: string
	userRole: string
	saveToken: (accessToken: string, userId: string, userRole: string) => void
	removeToken: () => void
}

export const useAuthTokenStore = create<IAuthTokenState>()(
	persist(
		set => ({
			token: '',
			userId: '',
			userRole: '',
			saveToken: (accessToken, userId, userRole) =>
				set({
					token: accessToken,
					userId,
					userRole
				}),
			removeToken: () =>
				set({
					token: '',
					userId: '',
					userRole: ''
				})
		}),
		{
			name: 'auth-token-store',
			version: 1,
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
