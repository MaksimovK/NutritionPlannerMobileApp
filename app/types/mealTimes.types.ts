export interface IMealTime {
	id: number
	name: string
	description: string
}

export interface IMealTimesResponse {
	times: IMealTime[]
}
