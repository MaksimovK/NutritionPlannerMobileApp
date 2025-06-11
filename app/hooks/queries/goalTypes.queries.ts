import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { goalTypesService } from '../../services/goalTypes.services'
import { IGoalType } from '../../types/goalTypes.types'

export function useGetAllGoalTypes() {
	return useQuery({
		queryKey: ['goalTypes'],
		queryFn: async () => goalTypesService.getAll()
	})
}

export function useCreateGoalType() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createGoalType'],
		mutationFn: (data: Omit<IGoalType, 'id'>) => goalTypesService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['goalTypes'] })
		}
	})
}

export function useUpdateGoalType() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['updateGoalType'],
		mutationFn: (data: IGoalType) => goalTypesService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['goalTypes'] })
		}
	})
}

export function useDeleteGoalType() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteGoalType'],
		mutationFn: (id: number) => goalTypesService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['goalTypes'] })
		}
	})
}
