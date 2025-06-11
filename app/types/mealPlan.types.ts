import { MealPlanItem } from './mealPlanItem.types'

export interface MealPlan {
	id: number
	userId: string
	date: string
	totalCalories: number
	totalProtein: number
	totalFat: number
	totalCarbohydrates: number
	mealPlanItems: MealPlanItem[]
}

export interface WeeklyReport {
	userId: string
	startDate: string
	endDate: string
	mealPlans: MealPlan[]
}
