import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import React, { useState } from 'react'
import {
	ActivityIndicator,
	ScrollView,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View
} from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import { chartData } from '../../constants/chartData'
import { useGetAllGoalTypes } from '../../hooks/queries/goalTypes.queries'
import { useGetMealPlanByDate } from '../../hooks/queries/mealPlan.queries'
import { useGetAllMealTimes } from '../../hooks/queries/mealTimes.queries'
import { useUserGoals } from '../../hooks/queries/userGoals.queries'
import { useAuthTokenStore } from '../../store/token'
import MealTimeCard from '../elements/meal-time/MealTimeCard'

export default function DiaryPage() {
	const [selectedDate, setSelectedDate] = useState(new Date())
	const { width } = useWindowDimensions()
	const userId = useAuthTokenStore(state => state.userId)
	const {
		data,
		isError: dataError,
		isLoading: dataLoading,
		refetch
	} = useUserGoals(userId)
	const {
		data: mealTimes,
		isError: mealTimesError,
		isLoading: mealTimesLoading,
		refetch: refetchMealTimes
	} = useGetAllMealTimes()
	const {
		data: goalTypes,
		isError: goalTypesError,
		isLoading: goalTypesLoading,
		refetch: refetchGoalTypes
	} = useGetAllGoalTypes()
	const {
		data: mealPlan,
		isError: mealPlanError,
		isLoading: mealPlanLoading,
		refetch: refetchMealPlan
	} = useGetMealPlanByDate(userId, selectedDate.toISOString().split('T')[0])

	if (!data?.goals.length || !goalTypes?.types.length) {
		return null
	}

	const goal = goalTypes?.types.find(
		goal => goal.id === data.goals[0].goalTypeId
	)

	const today = new Date()
	const isToday =
		selectedDate.getDate() === today.getDate() &&
		selectedDate.getMonth() === today.getMonth() &&
		selectedDate.getFullYear() === today.getFullYear()

	const formattedDate = isToday
		? 'Сегодня'
		: `${selectedDate.toLocaleString('default', {
				month: 'long'
		  })}, ${selectedDate.getDate()}`

	const openDatePicker = () => {
		DateTimePickerAndroid.open({
			value: selectedDate,
			onChange: (event, date) => {
				if (date) {
					setSelectedDate(date)
				}
			},
			mode: 'date',
			is24Hour: true
		})
	}

	const totalDailyCalories = data?.goals[0]?.calories || 0

	const getMealTimeCalorieLimits = (
		goalName: string
	): Record<string, number> => {
		const roundToTen = (value: number) => Math.round(value / 10) * 10

		const goal = goalName.toLowerCase()

		if (goal.includes('похудение') || goal.includes('снижение веса')) {
			return {
				Завтрак: roundToTen(totalDailyCalories * 0.3),
				Обед: roundToTen(totalDailyCalories * 0.4),
				Ужин: roundToTen(totalDailyCalories * 0.15),
				Перекус: roundToTen(totalDailyCalories * 0.15)
			}
		}

		if (goal.includes('набор массы') || goal.includes('увеличение массы')) {
			return {
				Завтрак: roundToTen(totalDailyCalories * 0.25),
				Обед: roundToTen(totalDailyCalories * 0.3),
				Ужин: roundToTen(totalDailyCalories * 0.35),
				Перекус: roundToTen(totalDailyCalories * 0.1)
			}
		}

		return {
			Завтрак: roundToTen(totalDailyCalories * 0.3),
			Обед: roundToTen(totalDailyCalories * 0.35),
			Ужин: roundToTen(totalDailyCalories * 0.25),
			Перекус: roundToTen(totalDailyCalories * 0.1)
		}
	}

	const getCalorieLimit = (mealName: string) => {
		const name = mealName.toLowerCase()

		if (name.includes('завтрак')) return mealTimeLimits['Завтрак'] || 0

		if (name.includes('обед')) return mealTimeLimits['Обед'] || 0

		if (name.includes('ужин')) return mealTimeLimits['Ужин'] || 0

		return mealTimeLimits['Перекус'] || 0
	}

	const goalName = goal?.name || ''
	const mealTimeLimits = getMealTimeCalorieLimits(goalName)

	if (dataError || mealTimesError || goalTypesError || mealPlanError) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='text-lg text-black'>Ошибка загрузки данных</Text>
				<TouchableOpacity
					className='bg-blue-500 px-4 py-2 mt-4 rounded'
					onPress={() => {
						refetch()
						refetchMealTimes()
						refetchGoalTypes()
						refetchMealPlan()
					}}
				>
					<Text className='text-white text-base'>Повторить</Text>
				</TouchableOpacity>
			</View>
		)
	}

	if (dataLoading || mealTimesLoading || goalTypesLoading || mealPlanLoading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	return (
		<ScrollView scrollEventThrottle={16} className='flex-1 bg-gray-50'>
			<View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-300'>
				<TouchableOpacity
					onPress={openDatePicker}
					className='flex-1 items-center p-2 rounded bg-blue-100 shadow-sm shadow-black'
				>
					<Text className='text-base font-medium text-blue-600'>
						{formattedDate}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={openDatePicker}
					className='ml-2 p-2 rounded bg-gray-100'
				>
					<Text className='text-base'>📅</Text>
				</TouchableOpacity>
			</View>

			<View className='my-5 items-center'>
				<Text className='text-xl font-medium'>Цель: {goal?.name}</Text>
				<PieChart
					data={chartData(data.goals[0])}
					width={width - 40}
					height={200}
					chartConfig={{
						backgroundColor: '#ffffff',
						backgroundGradientFrom: '#ffffff',
						backgroundGradientTo: '#ffffff',
						decimalPlaces: 2,
						color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
						style: { borderRadius: 16 }
					}}
					accessor='population'
					backgroundColor='transparent'
					paddingLeft='15'
					absolute
				/>
			</View>

			<View className='p-4 bg-white rounded shadow-md'>
				<Text className='text-lg text-gray-700'>
					Калорий в день: {Math.floor(data.goals[0].calories)} кКал
				</Text>
			</View>

			<View className='flex-row justify-between items-center px-8 pt-1'>
				<Text className='text-sm text-[#3b82f6] text-center'>
					Белки:{'\n'}
					{mealPlan?.totalProtein || '-'}
				</Text>
				<Text className='text-sm text-[#FFC107] text-center'>
					Жиры:{'\n'}
					{mealPlan?.totalFat || '-'}
				</Text>
				<Text className='text-sm text-[#d1485f] text-center'>
					Углеводы:{'\n'}
					{mealPlan?.totalCarbohydrates || '-'}
				</Text>
				<Text className='text-sm text-gray-600 h-full'>
					{mealPlan?.totalCalories || '0'} кКал
				</Text>
			</View>

			<View className='my-5 px-4 pb-14'>
				{mealTimes?.times.map(meal => (
					<MealTimeCard
						key={meal.id}
						id={meal.id}
						name={meal.name}
						description={meal.description}
						mealPlanId={mealPlan?.id || 0}
						mealPlanItems={
							mealPlan?.mealPlanItems
								? mealPlan?.mealPlanItems.filter(
										item => item.mealTimeId === meal.id
								  )
								: []
						}
						calorieLimit={getCalorieLimit(meal.name)}
					/>
				))}
			</View>
		</ScrollView>
	)
}
