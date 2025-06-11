// Запрос на регистрацию
export interface IRegisterRequest {
	email: string
	password: string
	name: string
	age: number
	gender: string
	height: number
	weight: number
	activityLevelId: number
	goalTypeId: number
}

// Ответ на регистрацию
export interface IRegisterResponse {
	userId: string
	token: string
	userRole: string
}

// Запрос на вход
export interface ILoginRequest {
	email: string
	password: string
}

// Ответ на вход
export interface ILoginResponse {
	userId: string
	token: string
	userRole: string
}
