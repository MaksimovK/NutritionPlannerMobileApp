import React, { useState } from 'react'
import {
	Dimensions,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { BarChart, PieChart, StackedBarChart } from 'react-native-chart-kit'
import RNPickerSelect from 'react-native-picker-select'
import {
	useGetCurrentWeeklyReport,
	useGetMealPlanByDate,
	useGetPreviousWeeklyReport
} from '../../hooks/queries/mealPlan.queries'
import { useGetProductByIds } from '../../hooks/queries/product.queries'
import { useUserGoals } from '../../hooks/queries/userGoals.queries'
import { useUserProgressByDate } from '../../hooks/queries/userProgress.queries'
import { useAuthTokenStore } from '../../store/token'
import { MealPlanItem } from '../../types/mealPlanItem.types'
import { IProduct } from '../../types/product.types'

const groupProductIdsByMealTime = (
	mealPlanItems: MealPlanItem[]
): Record<number, number[]> => {
	return mealPlanItems.reduce((acc: Record<number, number[]>, item) => {
		if (!acc[item.mealTimeId]) {
			acc[item.mealTimeId] = []
		}
		acc[item.mealTimeId].push(item.productId)
		return acc
	}, {})
}

const getDateForReport = (report: string): string => {
	const today = new Date()
	switch (report) {
		case 'Сегодня':
			return today.toISOString().split('T')[0]
		case 'Вчера':
			const yesterday = new Date(today)
			yesterday.setDate(today.getDate() - 1)
			return yesterday.toISOString().split('T')[0]
		case 'Текущая неделя':
			return today.toISOString().split('T')[0]
		case 'Предыдущая неделя':
			return today.toISOString().split('T')[0]
		default:
			return today.toISOString().split('T')[0]
	}
}

export default function ReportsPage({ forUserId }: { forUserId?: string }) {
	const authUserId = useAuthTokenStore(state => state.userId)
	const userId = forUserId || authUserId
	const [selectedReport, setSelectedReport] = useState('Сегодня')
	const [viewMode, setViewMode] = useState<'calories' | 'macros'>('calories')

	const reportDate = getDateForReport(selectedReport)

	const { data: dailyProgress } = useUserProgressByDate(userId, reportDate)
	const { data: currentWeeklyReport } = useGetCurrentWeeklyReport(userId)
	const { data: previousWeeklyReport } = useGetPreviousWeeklyReport(userId)
	const { data: userGoals } = useUserGoals(userId)
	const { data: mealPlan } = useGetMealPlanByDate(userId, reportDate)

	const mealTimeIds = [1, 2, 3, 4]

	const productIds = mealPlan?.mealPlanItems.map(product => product.productId)
	const productWeeklyCurrentIds =
		currentWeeklyReport?.mealPlans.flatMap(mealPlan =>
			mealPlan.mealPlanItems.map(item => item.productId)
		) || []
	const productWeeklyPreviousIds =
		previousWeeklyReport?.mealPlans.flatMap(mealPlan =>
			mealPlan.mealPlanItems.map(item => item.productId)
		) || []
	const { data: productWeeklyCurrentData } = useGetProductByIds(
		productWeeklyCurrentIds
	)
	const { data: productWeeklyPreviousData } = useGetProductByIds(
		productWeeklyPreviousIds
	)
	const { data: productsData } = useGetProductByIds(productIds!)
	const productIdsByMealTime = mealPlan?.mealPlanItems
		? groupProductIdsByMealTime(mealPlan.mealPlanItems)
		: {}

	const userGoal = userGoals?.goals[0]
	const caloriesGoal = userGoal?.calories || 0

	const calculateCaloriesByMealTime = (mealTimeId: number): number => {
		const productIdsForMealTime = productIdsByMealTime[mealTimeId] || []
		const calories = productsData
			?.filter((p: IProduct) => productIdsForMealTime.includes(p.id))
			.reduce((sum, p) => sum + p.calories, 0)
		return calories || 0
	}

	const calculateMacrosByMealTime = (mealTimeId: number) => {
		const productIdsForMealTime = productIdsByMealTime[mealTimeId] || []
		const macros = productsData
			?.filter((p: IProduct) => productIdsForMealTime.includes(p.id))
			.reduce(
				(sum, p) => {
					sum.protein += p.protein
					sum.fat += p.fat
					sum.carbs += p.carbohydrates
					return sum
				},
				{ protein: 0, fat: 0, carbs: 0 }
			)
		return macros || { protein: 0, fat: 0, carbs: 0 }
	}

	const macrosConsumed = calculateMacrosByMealTime(1)
	const totalMacros =
		macrosConsumed.protein + macrosConsumed.fat + macrosConsumed.carbs

	const macrosPieChartData = [
		{
			name: 'Белки',
			percentage:
				macrosConsumed.protein > 0
					? ((macrosConsumed.protein / totalMacros) * 100).toFixed(1)
					: '0.0',
			color: '#3b82f6',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15
		},
		{
			name: 'Жиры',
			percentage:
				macrosConsumed.fat > 0
					? ((macrosConsumed.fat / totalMacros) * 100).toFixed(1)
					: '0.0',
			color: '#FFC107',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15
		},
		{
			name: 'Углеводы',
			percentage:
				macrosConsumed.carbs > 0
					? ((macrosConsumed.carbs / totalMacros) * 100).toFixed(1)
					: '0.0',
			color: '#d1485f',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15
		}
	]

	const caloriesConsumed = dailyProgress?.caloriesConsumed || 0
	const percentageOfGoal = caloriesGoal
		? (caloriesConsumed / caloriesGoal) * 100
		: 0

	const pieChartData = [
		{
			name: 'Калорий потреблено',
			percentage: percentageOfGoal.toFixed(1),
			color: '#ef4444',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15
		},
		{
			name: 'Осталось до цели',
			percentage: (100 - percentageOfGoal).toFixed(1),
			color: '#E0E0E0',
			legendFontColor: '#7F7F7F',
			legendFontSize: 15
		}
	]

	const selectedWeeklyReport =
		selectedReport === 'Текущая неделя'
			? currentWeeklyReport
			: previousWeeklyReport

	// Функция для получения данных за неделю
	const getWeeklyData = (weeklyReport: any) => {
		// Определяем начальную дату недели
		const startDate = new Date(weeklyReport.startDate)

		// Массив дней недели
		const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

		// Создаем объект с данными по дням недели
		const dailyDataMap: Record<string, number> = {}
		for (let i = 0; i < 7; i++) {
			const currentDate = new Date(startDate)
			currentDate.setDate(startDate.getDate() + i)
			const formattedDate = currentDate.toISOString().split('T')[0]
			dailyDataMap[formattedDate] = 0
		}

		// Заполняем данные из weeklyReport
		weeklyReport.mealPlans.forEach((mealPlan: any) => {
			if (dailyDataMap[mealPlan.date] !== undefined) {
				dailyDataMap[mealPlan.date] = mealPlan.totalCalories
			}
		})

		// Формируем массив данных
		const data = weekdays.map((_, index) => {
			const currentDate = new Date(startDate)
			currentDate.setDate(startDate.getDate() + index)
			const formattedDate = currentDate.toISOString().split('T')[0]
			return dailyDataMap[formattedDate]
		})

		return {
			labels: weekdays,
			datasets: [
				{
					data
				}
			]
		}
	}

	const getWeeklyMacrosDataForStackedBarChart = (weeklyReport: any) => {
		if (!weeklyReport?.mealPlans || weeklyReport.mealPlans.length === 0) {
			return {
				labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
				legend: ['Белки', 'Жиры', 'Углеводы'],
				data: Array(7).fill([0, 0, 0]), // Заполняем нулями
				barColors: ['#3b82f6', '#FFC107', '#d1485f']
			}
		}

		const startDate = new Date(weeklyReport.startDate)
		const weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

		// Создаем объект с данными по дням недели
		const dailyDataMap: Record<
			string,
			{ protein: number; fat: number; carbs: number }
		> = {}
		for (let i = 0; i < 7; i++) {
			const currentDate = new Date(startDate)
			currentDate.setDate(startDate.getDate() + i)
			const formattedDate = currentDate.toISOString().split('T')[0]
			dailyDataMap[formattedDate] = { protein: 0, fat: 0, carbs: 0 }
		}

		// Заполняем данные из weeklyReport
		weeklyReport.mealPlans.forEach((mealPlan: any) => {
			if (dailyDataMap[mealPlan.date] !== undefined) {
				dailyDataMap[mealPlan.date].protein += mealPlan.totalProtein
				dailyDataMap[mealPlan.date].fat += mealPlan.totalFat
				dailyDataMap[mealPlan.date].carbs += mealPlan.totalCarbohydrates
			}
		})

		// Формируем массив данных
		const data = weekdays.map((_, index) => {
			const currentDate = new Date(startDate)
			currentDate.setDate(startDate.getDate() + index)
			const formattedDate = currentDate.toISOString().split('T')[0]
			const dayData = dailyDataMap[formattedDate]
			return [dayData.protein, dayData.fat, dayData.carbs]
		})

		return {
			labels: weekdays,
			legend: ['Белки', 'Жиры', 'Углеводы'],
			data,
			barColors: ['#3b82f6', '#FFC107', '#d1485f']
		}
	}

	const calculateTotalCaloriesForWeek = (weeklyReport: any) => {
		if (!weeklyReport?.mealPlans || weeklyReport.mealPlans.length === 0) {
			return 0
		}

		const totalCalories = weeklyReport.mealPlans.reduce(
			(sum: number, mealPlan: any) => sum + (mealPlan.totalCalories || 0),
			0
		)

		return totalCalories
	}

	const calculateTotalMacrosForWeek = (weeklyReport: any) => {
		if (!weeklyReport?.mealPlans || weeklyReport.mealPlans.length === 0) {
			return { totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 }
		}

		const totals = weeklyReport.mealPlans.reduce(
			(acc: any, mealPlan: any) => {
				acc.totalProtein += mealPlan.totalProtein || 0
				acc.totalFat += mealPlan.totalFat || 0
				acc.totalCarbohydrates += mealPlan.totalCarbohydrates || 0
				return acc
			},
			{ totalProtein: 0, totalFat: 0, totalCarbohydrates: 0 }
		)

		return totals
	}

	const totalMacrosWeek = calculateTotalMacrosForWeek(selectedWeeklyReport)

	const totalCaloriesWeek = calculateTotalCaloriesForWeek(selectedWeeklyReport)

	const weeklyTestData = selectedWeeklyReport
		? getWeeklyData(selectedWeeklyReport)
		: {
				labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
				datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
		  }

	const weeklyMacrosData =
		selectedWeeklyReport && viewMode === 'macros'
			? getWeeklyMacrosDataForStackedBarChart(selectedWeeklyReport)
			: {
					labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
					legend: ['Белки', 'Жиры', 'Углеводы'],
					data: Array(7).fill([0, 0, 0]),
					barColors: ['#3b82f6', '#FFC107', '#d1485f']
			  }

	const reportOptions = [
		{ label: 'Сегодня', value: 'Сегодня' },
		{ label: 'Вчера', value: 'Вчера' },
		{ label: 'Текущая неделя', value: 'Текущая неделя' },
		{ label: 'Предыдущая неделя', value: 'Предыдущая неделя' }
	]

	return (
		<ScrollView className='bg-gray-100'>
			<View className='flex-row justify-between items-center p-4 bg-white border-b border-gray-300'>
				<View className='flex-1 items-center p-2 rounded bg-blue-100 flex-row justify-between px-4 shadow-sm shadow-black'>
					<View className='w-full items-center'>
						<Text className='text-base font-medium text-blue-600'>Отчеты</Text>
					</View>
				</View>
			</View>

			<View className='bg-white m-4 rounded'>
				<View className='px-5 flex-1 py-2'>
					<View className='border-b border-gray-300 w-full py-2'>
						<RNPickerSelect
							onValueChange={value => setSelectedReport(value)}
							items={reportOptions}
							style={{
								inputAndroid: { color: 'black', fontSize: 16 },
								inputIOS: { color: 'black', fontSize: 16 }
							}}
							placeholder={{}}
						>
							<View className='flex-row justify-between items-center w-full'>
								<Text className='text-lg'>{selectedReport}</Text>
								<Image
									className='w-5 h-5'
									source={require('../../assets/icons/arrow-down.png')}
								/>
							</View>
						</RNPickerSelect>
					</View>

					<View className='flex-row  items-center justify-between py-2'>
						<TouchableOpacity onPress={() => setViewMode('calories')}>
							<Text
								className={`text-black text-lg ${
									viewMode === 'calories' &&
									'font-bold text-blue-500 border-b-2 border-blue-500'
								}`}
							>
								Калории
							</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => setViewMode('macros')}>
							<Text
								className={`text-black text-lg ${
									viewMode === 'macros' &&
									'font-bold text-blue-500 border-b-2 border-blue-500'
								}`}
							>
								Макронутриенты
							</Text>
						</TouchableOpacity>
					</View>

					{['Текущая неделя', 'Предыдущая неделя'].includes(selectedReport) && (
						<ScrollView horizontal={true}>
							{viewMode === 'calories' ? (
								<BarChart
									data={weeklyTestData}
									width={Dimensions.get('window').width}
									height={240}
									yAxisLabel=''
									yAxisSuffix=' кКал'
									chartConfig={{
										backgroundColor: '#ffffff',
										backgroundGradientFrom: '#f7f7f7',
										backgroundGradientTo: '#f7f7f7',
										decimalPlaces: 0,
										color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

										propsForLabels: {
											fontSize: 12 // Размер шрифта для меток
										}
									}}
									style={{}}
									fromZero={true} // Начинаем ось Y с нуля
									showValuesOnTopOfBars={true} // Показываем значения над столбцами
									showBarTops={true} // Обязательно для отображения значений
								/>
							) : (
								<StackedBarChart
									data={weeklyMacrosData}
									width={Dimensions.get('window').width * 1.1}
									height={240}
									chartConfig={{
										backgroundColor: '#ffffff',
										backgroundGradientFrom: '#f7f7f7',
										backgroundGradientTo: '#f7f7f7',
										decimalPlaces: 1,
										color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										propsForLabels: { fontSize: 12 }
									}}
									style={{
										left: -75
									}}
									withHorizontalLabels={false}
									fromZero={true}
									hideLegend={true}
								/>
							)}
						</ScrollView>
					)}

					{['Текущая неделя', 'Предыдущая неделя'].includes(selectedReport) && (
						<View className='mt-4 flex-row items-center justify-between'>
							{viewMode === 'calories' ? (
								<>
									<Text className='text-sm'>
										Цель: {(caloriesGoal * 7).toFixed(0)} кКал
									</Text>
									<Text className='text-sm'>
										Потреблено: {totalCaloriesWeek} кКал
									</Text>
								</>
							) : (
								<>
									<Text className='text-sm'>Всего:</Text>
									<View className='flex-row gap-2'>
										<Text className='text-sm '>
											{totalMacrosWeek?.totalProtein.toFixed(1)} Б
										</Text>
										<Text className='text-sm '>
											{totalMacrosWeek?.totalFat.toFixed(1)} Ж
										</Text>
										<Text className='text-sm '>
											{totalMacrosWeek?.totalCarbohydrates.toFixed(1)} У
										</Text>
									</View>
								</>
							)}
						</View>
					)}
					{!['Текущая неделя', 'Предыдущая неделя'].includes(
						selectedReport
					) && (
						<View className='items-center'>
							{viewMode === 'macros' ? (
								<PieChart
									data={macrosPieChartData.map(item => ({
										...item,
										population: parseFloat(item.percentage)
									}))}
									width={Dimensions.get('window').width * 0.8}
									height={220}
									chartConfig={{
										backgroundColor: '#ffffff',
										backgroundGradientFrom: '#f7f7f7',
										backgroundGradientTo: '#f7f7f7',
										decimalPlaces: 1,
										color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
									}}
									accessor='population'
									backgroundColor='transparent'
									paddingLeft='0'
									center={[(Dimensions.get('window').width * 0.8) / 4, 0]}
									hasLegend={false}
								/>
							) : (
								<PieChart
									data={pieChartData.map(item => ({
										...item,
										population: parseFloat(item.percentage)
									}))}
									width={Dimensions.get('window').width * 0.8}
									height={220}
									chartConfig={{
										backgroundColor: '#ffffff',
										backgroundGradientFrom: '#f7f7f7',
										backgroundGradientTo: '#f7f7f7',
										decimalPlaces: 1,
										color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
										labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
									}}
									accessor='population'
									backgroundColor='transparent'
									paddingLeft='0'
									center={[(Dimensions.get('window').width * 0.8) / 4, 0]}
									hasLegend={false}
								/>
							)}

							<View className='mt-4'>
								{viewMode !== 'macros'
									? pieChartData.map((item, index) => (
											<View key={index} className='flex-row items-center mb-2'>
												<View
													style={{
														backgroundColor: item.color,
														width: 16,
														height: 16,
														borderRadius: 8,
														marginRight: 8
													}}
												/>
												<Text className='text-sm'>{`${item.name}: ${item.percentage}%`}</Text>
											</View>
									  ))
									: macrosPieChartData.map((item, index) => (
											<View key={index} className='flex-row items-center mb-2'>
												<View
													style={{
														backgroundColor: item.color,
														width: 16,
														height: 16,
														borderRadius: 8,
														marginRight: 8
													}}
												/>
												<Text className='text-sm'>{`${item.name}: ${item.percentage}%`}</Text>
											</View>
									  ))}
							</View>
						</View>
					)}

					{!['Текущая неделя', 'Предыдущая неделя'].includes(
						selectedReport
					) && (
						<View className='mt-4 flex-row items-center justify-between'>
							{viewMode === 'calories' ? (
								<>
									<Text className='text-sm'>
										Цель: {caloriesGoal.toFixed(0)} кКал
									</Text>
									<Text className='text-sm'>
										Потреблено: {caloriesConsumed.toFixed(0)} кКал
									</Text>
								</>
							) : (
								<>
									<Text className='text-sm'>Всего:</Text>
									<View className='flex-row gap-2'>
										<Text className='text-sm '>
											{mealPlan?.totalProtein.toFixed(1)} Б
										</Text>
										<Text className='text-sm '>
											{mealPlan?.totalFat.toFixed(1)} Ж
										</Text>
										<Text className='text-sm '>
											{mealPlan?.totalCarbohydrates.toFixed(1)} У
										</Text>
									</View>
								</>
							)}
						</View>
					)}

					{!['Текущая неделя', 'Предыдущая неделя'].includes(
						selectedReport
					) && (
						<View className='px-0.5 py-2'>
							{viewMode === 'calories'
								? mealTimeIds.map(mealTimeId => {
										const totalCalories = calculateCaloriesByMealTime(
											Number(mealTimeId)
										)
										const percentage = caloriesGoal
											? ((totalCalories / caloriesConsumed) * 100).toFixed(1)
											: '0.0'

										return (
											<View
												key={mealTimeId}
												className='py-3 border-b border-gray-300 justify-between flex-row items-center '
											>
												<Text className='text-sm font-bold '>
													{mealTimeId === 1
														? 'Завтрак'
														: mealTimeId === 2
														? 'Обед'
														: mealTimeId === 3
														? 'Ужин'
														: 'Перекус'}
												</Text>
												<View className='flex-row'>
													<Text className='text-sm absolute right-24'>
														{isNaN(Number(percentage))
															? '0.0'
															: `${percentage}%`}
													</Text>

													<Text className='text-sm'>{totalCalories}</Text>
												</View>
											</View>
										)
								  })
								: mealTimeIds.map(mealTimeId => {
										const { fat, carbs, protein } = calculateMacrosByMealTime(
											Number(mealTimeId)
										)

										return (
											<View
												key={mealTimeId}
												className='py-3 border-b border-gray-300 justify-between flex-row items-center '
											>
												<Text className='text-sm font-bold'>
													{mealTimeId === 1
														? 'Завтрак'
														: mealTimeId === 2
														? 'Обед'
														: mealTimeId === 3
														? 'Ужин'
														: 'Перекус'}
												</Text>
												<View className='flex-row'>
													<View className='flex-row'>
														<Text className='text-sm text-[#3b82f6] absolute right-24'>
															{protein.toFixed(1)}
														</Text>
														<Text className='text-sm text-[#FFC107] absolute right-14'>
															{fat.toFixed(1)}
														</Text>
														<Text className='text-sm text-[#d1485f] pr-1'>
															{carbs.toFixed(1)}
														</Text>
													</View>
												</View>
											</View>
										)
								  })}
						</View>
					)}
				</View>
			</View>

			{!['Текущая неделя', 'Предыдущая неделя'].includes(selectedReport) && (
				<View className='bg-white mx-4 rounded px-5 py-4 mb-16'>
					<Text className='text-lg font-bold'>Съеденная еда</Text>
					{viewMode === 'calories' ? (
						<>
							<View className='flex-row justify-between py-1  border-b border-gray-300 pr-0.5'>
								<Text className='text-base font-medium'>Продукты</Text>
								<View className='flex-row'>
									<Text className='text-base font-medium '>кКал</Text>
								</View>
							</View>
							{productsData?.map((product, index) => (
								<View
									key={index}
									className='flex-row items-center justify-between border-b border-gray-300 py-2'
								>
									<Text className='text-sm'>{product.name}</Text>
									<Text className='text-sm pr-1'>{product.calories}</Text>
								</View>
							))}
						</>
					) : (
						<>
							<View className='flex-row justify-between py-1  border-b border-gray-300 pr-0.5'>
								<Text className='text-base font-medium'>Продукты</Text>
								<View className='flex-row'>
									<Text className='text-base font-medium absolute right-24'>
										Б
									</Text>
									<Text className='text-base font-medium absolute right-12'>
										Ж
									</Text>
									<Text className='text-base font-medium absolute right-1'>
										У
									</Text>
								</View>
							</View>
							{productsData?.map((product, index) => (
								<View
									key={index}
									className='flex-row items-center justify-between border-b border-gray-300 py-2'
								>
									<Text className='text-sm'>{product.name}</Text>
									<View className='flex-row'>
										<Text className='text-sm absolute right-24'>
											{product.protein.toFixed(1)}
										</Text>
										<Text className='text-sm absolute right-12'>
											{product.fat.toFixed(1)}
										</Text>
										<Text className='text-sm '>
											{product.carbohydrates.toFixed(1)}
										</Text>
									</View>
								</View>
							))}
						</>
					)}
				</View>
			)}

			{['Текущая неделя', 'Предыдущая неделя'].includes(selectedReport) && (
				<View className='bg-white mx-4 rounded px-5 py-4 mb-16'>
					<Text className='text-lg font-bold'>Съеденная еда</Text>
					{viewMode === 'calories' ? (
						<>
							<View className='flex-row justify-between py-1  border-b border-gray-300 pr-0.5'>
								<Text className='text-base font-medium'>Продукты</Text>
								<View className='flex-row'>
									<Text className='text-base font-medium '>кКал</Text>
								</View>
							</View>
							{(selectedReport === 'Текущая неделя'
								? productWeeklyCurrentData
								: productWeeklyPreviousData
							)?.map((product, index) => (
								<View
									key={index}
									className='flex-row items-center justify-between border-b border-gray-300 py-2'
								>
									<Text className='text-sm'>{product.name}</Text>
									<Text className='text-sm pr-1'>{product.calories}</Text>
								</View>
							))}
						</>
					) : (
						<>
							<View className='flex-row justify-between py-1  border-b border-gray-300 pr-0.5'>
								<Text className='text-base font-medium'>Продукты</Text>
								<View className='flex-row'>
									<Text className='text-base font-medium absolute right-24'>
										Б
									</Text>
									<Text className='text-base font-medium absolute right-12'>
										Ж
									</Text>
									<Text className='text-base font-medium absolute right-1'>
										У
									</Text>
								</View>
							</View>
							{(selectedReport === 'Текущая неделя'
								? productWeeklyCurrentData
								: productWeeklyPreviousData
							)?.map((product, index) => (
								<View
									key={index}
									className='flex-row items-center justify-between border-b border-gray-300 py-2'
								>
									<Text className='text-sm'>{product.name}</Text>
									<View className='flex-row'>
										<Text className='text-sm absolute right-24'>
											{product.protein.toFixed(1)}
										</Text>
										<Text className='text-sm absolute right-12'>
											{product.fat.toFixed(1)}
										</Text>
										<Text className='text-sm'>
											{product.carbohydrates.toFixed(1)}
										</Text>
									</View>
								</View>
							))}
						</>
					)}
				</View>
			)}
		</ScrollView>
	)
}
