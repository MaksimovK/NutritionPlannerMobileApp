export interface IUser {
	id: string
	role: number
	name: string
	email: string
	age: number
	gender: string
	height: number
	weight: number
	activityLevelId: number
	createdAt: string
	isBlocked: boolean
	blockedUntil?: string
	blockReason?: string
}

export enum Role {
	User = 0,
	Admin = 1,
	Dietitian = 2
}
