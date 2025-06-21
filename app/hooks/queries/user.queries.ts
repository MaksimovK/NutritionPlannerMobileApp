import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../../services/user.services'
import { useAuthTokenStore } from '../../store/token'
import { IUser } from '../../types/user.types'

export function useUserProfile() {
	const userId = useAuthTokenStore(state => state.userId)

	return useQuery({
		queryKey: ['userProfile', userId],
		queryFn: async () => {
			if (userId === null) return
			return userService.getUserById(userId)
		},
		enabled: !!userId
	})
}

export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (updatedData: IUser) => {
			return userService.updateUser(updatedData)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userProfile'] })
		}
	})
}

export function useGetAllUsers() {
	return useQuery({
		queryKey: ['allUsers'],
		queryFn: async () => {
			return userService.getAllUsers()
		}
	})
}

export function useUpdateUserRole() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			userId,
			newRole
		}: {
			userId: string
			newRole: number
		}) => {
			return userService.updateUserRole(userId, newRole)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['allUsers'] })
		}
	})
}
