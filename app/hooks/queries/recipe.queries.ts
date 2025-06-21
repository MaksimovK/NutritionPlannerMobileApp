import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { recipeService } from '../../services/recipe.service'
import { IRecipeCreateDto, RecipeFilter } from '../../types/recipe.types'

export const useGetAllRecipes = (filter?: RecipeFilter) => {
	return useQuery({
		queryKey: ['recipes', filter],
		queryFn: () => recipeService.getAll(filter)
	})
}

export const useGetRecipeByIds = (ids: number[]) => {
	return useQuery({
		queryKey: ['recipes', ids],
		queryFn: () => recipeService.getByIds(ids),
		enabled: ids.length > 0
	})
}

export function useGetRecipeById(id: number) {
	return useQuery({
		queryKey: ['recipe', id],
		queryFn: async () => recipeService.getById(id)
	})
}

export const useSearchRecipes = (name: string, filter?: RecipeFilter) =>
	useQuery({
		queryKey: ['recipes', 'search', name, filter],
		queryFn: () => recipeService.search(name, filter),
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
