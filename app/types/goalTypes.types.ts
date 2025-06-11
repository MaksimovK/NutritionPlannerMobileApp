export interface IGoalType {
	id: number
	name: string
	description: string
}

export interface IGoalTypesResponse {
	types: IGoalType[]
}
