import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mealTimesService } from '../../services/mealTimes.services'
import { IMealTime } from '../../types/mealTimes.types'

export function useGetAllMealTimes() {
	return useQuery({
		queryKey: ['mealTimes'],
		queryFn: async () => mealTimesService.getAll()
	})
}

export function useCreateMealTime() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createMealTime'],
		mutationFn: (data: Omit<IMealTime, 'id'>) => mealTimesService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealTimes'] })
		}
	})
}

export function useUpdateMealTime() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['updateMealTime'],
		mutationFn: (data: IMealTime) => mealTimesService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealTimes'] })
		}
	})
}

export function useDeleteMealTime() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteMealTime'],
		mutationFn: (id: number) => mealTimesService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealTimes'] })
		}
	})
}
