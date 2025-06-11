import { useEffect, useState } from 'react'
import { IProduct } from '../types/product.types'

export const useProductCalculations = (product: IProduct) => {
	const [values, setValues] = useState({
		calories: 0,
		protein: 0,
		fat: 0,
		carbohydrates: 0
	})

	const calculateMacros = (weight: number) => {
		const factor = weight / 100
		setValues({
			calories: parseFloat((product.calories * factor).toFixed(1)),
			protein: parseFloat((product.protein * factor).toFixed(1)),
			fat: parseFloat((product.fat * factor).toFixed(1)),
			carbohydrates: parseFloat((product.carbohydrates * factor).toFixed(1))
		})
	}

	useEffect(() => {
		if (product) {
			calculateMacros(product.weight || 100)
		}
	}, [product])

	return { ...values, calculateMacros }
}
