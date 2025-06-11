import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mealPlanItemService } from '../../services/mealPlanItem.services'
import { MealPlanItem } from '../../types/mealPlanItem.types'

export const useGetMealPlanItems = (mealPlanId: number) => {
	return useQuery({
		queryKey: ['mealPlanItems', mealPlanId],
		queryFn: () => mealPlanItemService.getByMealPlanId(mealPlanId)
	})
}

export const useAddProductToMealPlan = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['addProductToMealPlan'],
		mutationFn: async (params: {
			mealPlanId: number
			mealTimeId: number
			productId: number
			amount: number
		}) => {
			console.log('Отправляем запрос:', params)
			return mealPlanItemService.addProductToMealPlan(
				params.mealPlanId,
				params.mealTimeId,
				params.productId,
				params.amount
			)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealPlan'] })
		},
		onError: error => {
			console.error('Ошибка добавления продукта в план питания', error)
		}
	})
}

export const useUpdateMealPlanItem = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['updateMealPlanItem'],
		mutationFn: (data: MealPlanItem) => mealPlanItemService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['mealPlan'] })
		}
	})
}

export const useDeleteMealPlanItem = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteMealPlanItem'],
		mutationFn: (id: number) => mealPlanItemService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['mealPlan']
			})
		},
		onError: error => {
			console.error('Ошибка удаления продукта из плана питания', error)
		}
	})
}
