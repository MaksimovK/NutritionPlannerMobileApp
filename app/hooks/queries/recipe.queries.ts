import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '../../services/recipe.service'
import { IRecipeCreateDto } from '../../types/recipe.types'

export const useGetAllRecipes = () => {
	return useQuery({
		queryKey: ['recipes'],
		queryFn: () => recipeService.getAll()
	})
}

export const useSearchRecipes = (name: string) =>
	useQuery({
		queryKey: ['recipes', 'search', name],
		queryFn: () => recipeService.search(name),
		enabled: name.length > 0
	})

export function useCreateRecipe() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createRecipe'],
		mutationFn: (data: IRecipeCreateDto) => recipeService.create(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['recipes'] })
		}
	})
}

export const useDeleteRecipe = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => recipeService.deleteRecipe(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['unapprovedRecipes'] })
			queryClient.invalidateQueries({ queryKey: ['recipes'] })
		}
	})
}

export const useGetUnapprovedRecipes = () => {
	return useQuery({
		queryKey: ['recipes', 'unapproved'],
		queryFn: () => recipeService.getUnapproved()
	})
}

export const useApproveRecipe = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => recipeService.approve(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['unapprovedRecipes'] })
			queryClient.invalidateQueries({ queryKey: ['recipes'] })
		}
	})
}
