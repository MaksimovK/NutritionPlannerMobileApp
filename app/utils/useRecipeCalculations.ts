import { useCallback, useEffect, useState } from 'react'
import { IRecipe } from '../types/recipe.types'

export const useRecipeCalculations = (recipe?: IRecipe) => {
	const [calories, setCalories] = useState(0)
	const [protein, setProtein] = useState(0)
	const [fat, setFat] = useState(0)
	const [carbohydrates, setCarbohydrates] = useState(0)

	const calculateMacros = useCallback(
		(portionWeight: number) => {
			if (!recipe) return

			const factor = portionWeight / 100

			setCalories(recipe.caloriesPer100g * factor)
			setProtein(recipe.proteinPer100g * factor)
			setFat(recipe.fatPer100g * factor)
			setCarbohydrates(recipe.carbohydratesPer100g * factor)
		},
		[recipe]
	)

	useEffect(() => {
		if (recipe) {
			calculateMacros(recipe.weight || 100)
		}
	}, [recipe, calculateMacros])

	return {
		calories,
		protein,
		fat,
		carbohydrates,
		calculateMacros
	}
}
