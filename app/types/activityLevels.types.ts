export interface IActivityLevel {
	id: number
	name: string
	description: string
	coefficient: number
}

export interface IActivityLevelsResponse {
	levels: IActivityLevel[]
}
