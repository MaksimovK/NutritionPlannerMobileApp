export interface MealPlanItem {
	id: number
	mealPlanId: number
	mealTimeId: number
	productId?: number
	recipeId?: number
	amount: number
}
