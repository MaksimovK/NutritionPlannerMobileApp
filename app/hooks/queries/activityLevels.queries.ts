import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activityLevelService } from '../../services/activityLevel.services'
import { IActivityLevel } from '../../types/activityLevels.types'

export function useGetAllActivityLevels() {
	return useQuery({
		queryKey: ['activityLevels'],
		queryFn: async () => activityLevelService.getAll()
	})
}

export function useCreateActivityLevel() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createActivityLevel'],
		mutationFn: (data: Omit<IActivityLevel, 'id'>) =>
			activityLevelService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['activityLevels'] })
		}
	})
}

export function useUpdateActivityLevel() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['updateActivityLevel'],
		mutationFn: (data: IActivityLevel) => activityLevelService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['activityLevels'] })
		}
	})
}

export function useDeleteActivityLevel() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteActivityLevel'],
		mutationFn: (id: number) => activityLevelService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['activityLevels'] })
		}
	})
}
