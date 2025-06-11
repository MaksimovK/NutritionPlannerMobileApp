import { IUserGoal } from '../types/userGoals.types'

export const chartData = (userGoal: IUserGoal) => [
	{
		name: 'Белки',
		population: Math.floor(userGoal.protein),
		color: '#3b82f6',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15
	},
	{
		name: 'Жиры',
		population: Math.floor(userGoal.fat),
		color: '#FFC107',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15
	},
	{
		name: 'Углеводы',
		population: Math.floor(userGoal.carbohydrates),
		color: '#d1485f',
		legendFontColor: '#7F7F7F',
		legendFontSize: 15
	}
]
