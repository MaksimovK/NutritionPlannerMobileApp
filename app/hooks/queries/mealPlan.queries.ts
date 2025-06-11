import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mealPlanService } from '../../services/mealPlan.services'
import { MealPlan } from '../../types/mealPlan.types'

export const useGetMealPlanByDate = (userId: string, date: string) => {
	return useQuery({
		queryKey: ['mealPlan', userId, date],
		queryFn: () => mealPlanService.getByDate(userId, date)
	})
}

export const useGetCurrentWeeklyReport = (userId: string) => {
	return useQuery({
		queryKey: ['weeklyReport', 'current', userId],
		queryFn: () => mealPlanService.getCurrentWeeklyReport(userId)
	})
}

export const useGetPreviousWeeklyReport = (userId: string) => {
	return useQuery({
		queryKey: ['weeklyReport', 'previous', userId],
		queryFn: () => mealPlanService.getPreviousWeeklyReport(userId)
	})
}

export const useCreateMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createMealPlan'],
		mutationFn: (data: MealPlan) => mealPlanService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealPlan'] })
		}
	})
}
