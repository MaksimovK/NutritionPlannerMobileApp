import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userGoalsService } from '../../services/userGoals.services'
import {
	ICreateUserGoalRequest,
	IUpdateUserGoalRequest
} from '../../types/userGoals.types'

export function useUserGoals(userId: string) {
	return useQuery({
		queryKey: ['userGoals', userId],
		queryFn: () => userGoalsService.getUserGoals(userId),
		enabled: !!userId
	})
}

export function useCreateUserGoal() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['createUserGoal'],
		mutationFn: (data: ICreateUserGoalRequest) =>
			userGoalsService.createUserGoal(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userGoals'] })
		}
	})
}

export function useUpdateUserGoal() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['updateUserGoal'],
		mutationFn: (data: IUpdateUserGoalRequest) =>
			userGoalsService.updateUserGoal(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['userGoals'] })
		}
	})
}
