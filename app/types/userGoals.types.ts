// Тип данных о цели пользователя
export interface IUserGoal {
	id: string
	userId: number
	goalTypeId: number
	calories: number
	protein: number
	fat: number
	carbohydrates: number
	createdAt: string
}

// Ответ на запрос целей пользователя
export interface IUserGoalsResponse {
	goals: IUserGoal[]
}

// Тип для создания новой цели
export interface ICreateUserGoalRequest {
	userId: string
	goalTypeId: number
	calories: number
	protein: number
	fat: number
	carbohydrates: number
}

export interface IUpdateUserGoalRequest {
	userId: string
	goalTypeId: number
}
