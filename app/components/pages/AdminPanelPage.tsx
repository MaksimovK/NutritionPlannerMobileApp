import React, { useEffect, useState } from 'react'
import {
	ActivityIndicator,
	Image,
	Modal,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import {
	useDeleteActivityLevel,
	useGetAllActivityLevels
} from '../../hooks/queries/activityLevels.queries'
import {
	useDeleteGoalType,
	useGetAllGoalTypes
} from '../../hooks/queries/goalTypes.queries'
import {
	useDeleteMealTime,
	useGetAllMealTimes
} from '../../hooks/queries/mealTimes.queries'
import {
	useApproveProduct,
	useDeleteProduct,
	useSearchProducts,
	useUnapprovedProducts
} from '../../hooks/queries/product.queries'
import { useGetUnapprovedRecipes } from '../../hooks/queries/recipe.queries'
import {
	useGetAllUsers,
	useUpdateUserRole
} from '../../hooks/queries/user.queries'
import { useAuthTokenStore } from '../../store/token'
import { IActivityLevel } from '../../types/activityLevels.types'
import { IGoalType } from '../../types/goalTypes.types'
import { IMealTime } from '../../types/mealTimes.types'
import { IProduct } from '../../types/product.types'
import { Role } from '../../types/user.types'
import ListItem from '../elements/list-item/ListItem'
import RecipeItem from '../elements/recipe-item/RecipeItem'
import AddActivityLevelModal from '../ui/modals/activity-level/AddActivityLevelModal'
import UpdateActivityLevelModal from '../ui/modals/activity-level/UpdateActivityLevelModal'
import AddGoalTypeModal from '../ui/modals/goal-type/AddGoalTypeModal'
import UpdateGoalTypeModal from '../ui/modals/goal-type/UpdateGoalTypeModal'
import AddMealTimeModal from '../ui/modals/meal-time/AddMealTimeModal'
import UpdateMealTimeModal from '../ui/modals/meal-time/UpdateMealTimeModal'
import UpdateProductModal from '../ui/modals/product/UpdateProductModal'

type Section =
	| 'products'
	| 'activityLevels'
	| 'goalTypes'
	| 'mealTimes'
	| 'recipes'
	| 'users'

export default function AdminPanelPage() {
	const navigation = useTypedNavigation()
	const { userRole, userId } = useAuthTokenStore()

	// Выбранный раздел
	const [activeSection, setActiveSection] = useState<Section>('products')

	// Добавлено: данные пользователей
	const {
		data: users,
		isLoading: isUsersLoading,
		refetch: refetchUsers
	} = useGetAllUsers()
	const { mutate: updateUserRole } = useUpdateUserRole()

	const handleRoleChange = (userId: string, newRole: number) => {
		updateUserRole(
			{ userId, newRole },
			{
				onSuccess: () => refetchUsers()
			}
		)
	}

	// ________________ Продукты ________________
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedQuery, setDebouncedQuery] = useState('')
	const { data: products, isLoading: isProductsLoading } =
		useSearchProducts(debouncedQuery)
	const { data: unapprovedProducts, isLoading: isUnapprovedLoading } =
		useUnapprovedProducts()
	const { mutate: deleteProduct } = useDeleteProduct()
	const { mutate: approveProduct } = useApproveProduct()

	const [isModalEditProductVisible, setModalEditProductVisible] =
		useState(false)
	// ________________ Рецепты ________________
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
	const { data: unapprovedRecipes, isLoading: isUnapprovedRecipesLoading } =
		useGetUnapprovedRecipes()

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery)
		}, 500)
		return () => clearTimeout(handler)
	}, [searchQuery])

	const handleDeleteProduct = (id: number) => {
		deleteProduct(id)
	}

	const handleEditProduct = (id: number) => {
		const prod = products?.find(p => p.id === id)
		if (prod) {
			setSelectedProduct(prod)
			setModalEditProductVisible(true)
		}
	}

	const handleApproveProduct = (id: number) => {
		approveProduct(id)
	}

	// ________________ Уровни физической активности ________________
	const { data: activityLevels, isLoading: isActivityLoading } =
		useGetAllActivityLevels()
	const { mutate: deleteActivityLevel } = useDeleteActivityLevel()

	const [isModalCreateActivityVisible, setModalCreateActivityVisible] =
		useState(false)
	const [isEditActivityModalVisible, setEditActivityModalVisible] =
		useState(false)
	const [selectedActivityLevel, setSelectedActivityLevel] =
		useState<IActivityLevel | null>(null)

	const handleEditActivityLevel = (id: number) => {
		const level = activityLevels?.levels.find(l => l.id === id)
		if (level) {
			setSelectedActivityLevel(level)
			setEditActivityModalVisible(true)
		}
	}

	const handleDeleteActivityLevel = (id: number) => {
		deleteActivityLevel(id)
	}

	// ________________ Типы целей ________________
	const { data: goalTypes, isLoading: isGoalLoading } = useGetAllGoalTypes()
	const { mutate: deleteGoalType } = useDeleteGoalType()

	const [isModalCreateGoalVisible, setModalCreateGoalVisible] = useState(false)
	const [isEditGoalModalVisible, setEditGoalModalVisible] = useState(false)
	const [selectedGoalType, setSelectedGoalType] = useState<IGoalType | null>(
		null
	)

	const handleEditGoalType = (id: number) => {
		const type = goalTypes?.types.find(t => t.id === id)
		if (type) {
			setSelectedGoalType(type)
			setEditGoalModalVisible(true)
		}
	}

	const handleDeleteGoalType = (id: number) => {
		deleteGoalType(id)
	}

	// ________________ Типы приёма пищи ________________
	const { data: mealTimes, isLoading: isMealLoading } = useGetAllMealTimes()
	const { mutate: deleteMealTime } = useDeleteMealTime()

	const [isModalCreateMealVisible, setModalCreateMealVisible] = useState(false)
	const [isModalEditMealVisible, setEditMealModalVisible] = useState(false)
	const [selectedMealTime, setSelectedMealTime] = useState<IMealTime | null>(
		null
	)

	const handleEditMealTime = (id: number) => {
		const meal = mealTimes?.times.find(m => m.id === id)
		if (meal) {
			setSelectedMealTime(meal)
			setEditMealModalVisible(true)
		}
	}

	const handleDeleteMealTime = (id: number) => {
		deleteMealTime(id)
	}

	// ________________ Проверка роли ________________
	if (userRole !== Role.Admin) {
		return (
			<View className='flex-1 justify-center items-center bg-slate-100'>
				<Text className='text-3xl font-bold mb-4 text-red-500'>
					Доступ запрещен
				</Text>
				<Text className='text-gray-600 mb-8 text-center'>
					Только администраторы могут просматривать эту страницу
				</Text>
				<TouchableOpacity
					className='bg-blue-500 py-3 px-6 rounded'
					onPress={() => navigation.goBack()}
				>
					<Text className='text-white font-bold'>Назад</Text>
				</TouchableOpacity>
			</View>
		)
	}

	// ________________ Спиннер глобальной загрузки справочников ________________
	const anyLoading = isActivityLoading || isGoalLoading || isMealLoading

	if (anyLoading) {
		return (
			<View className='flex-1 justify-center items-center'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</View>
		)
	}

	// ________________ Рендер кнопок-разделов ________________
	const renderTabs = () => (
		<ScrollView horizontal className='flex-1 max-h-16'>
			<View className='flex-row items-center bg-white p-4 shadow space-x-2'>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'products' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('products')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'products' ? 'text-white' : 'text-gray-700'
						}`}
					>
						Продукты
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'recipes' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('recipes')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'recipes' ? 'text-white' : 'text-gray-700'
						}`}
					>
						Рецепты
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'users' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('users')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'users' ? 'text-white' : 'text-gray-700'
						}`}
					>
						Пользователи
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'activityLevels' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('activityLevels')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'activityLevels'
								? 'text-white'
								: 'text-gray-700'
						}`}
					>
						Активность
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'goalTypes' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('goalTypes')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'goalTypes' ? 'text-white' : 'text-gray-700'
						}`}
					>
						Цели
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`px-4 py-1 rounded ${
						activeSection === 'mealTimes' ? 'bg-blue-500' : 'bg-gray-200'
					}`}
					onPress={() => setActiveSection('mealTimes')}
				>
					<Text
						className={`font-semibold ${
							activeSection === 'mealTimes' ? 'text-white' : 'text-gray-700'
						}`}
					>
						Приёмы пищи
					</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)

	// ________________ Рендер разделов ________________
	const renderSection = () => {
		switch (activeSection) {
			case 'products':
				return (
					<View className='px-5 pt-4'>
						{/* Продукты, требующие модерации */}
						<Text className='text-base text-gray-600 font-semibold'>
							Продукты, требующие модерации
						</Text>
						{isUnapprovedLoading ? (
							<ActivityIndicator
								size='large'
								color='#4CAF50'
								className='mt-4'
							/>
						) : unapprovedProducts && unapprovedProducts.length > 0 ? (
							unapprovedProducts.map(product => (
								<View
									key={product.id}
									className='w-full bg-white p-3 rounded-lg mb-3 shadow-sm'
								>
									<Text className='text-lg font-bold'>{product.name}</Text>
									<Text className='text-gray-600 mt-1'>
										Ккал: {product.calories}, {product.protein} Б {product.fat}{' '}
										Ж {product.carbohydrates} У
									</Text>

									<View className='flex-row mt-2'>
										<TouchableOpacity
											className='bg-green-500 py-1 px-3 rounded mr-2'
											onPress={() => handleApproveProduct(product.id)}
										>
											<Text className='text-white'>Одобрить</Text>
										</TouchableOpacity>

										<TouchableOpacity
											className='bg-red-500 py-1 px-3 rounded'
											onPress={() => handleDeleteProduct(product.id)}
										>
											<Text className='text-white'>Удалить</Text>
										</TouchableOpacity>
									</View>
								</View>
							))
						) : (
							<Text className='mt-4 text-gray-500'>
								Нет продуктов для модерации
							</Text>
						)}

						{/* Все продукты */}
						<View className='flex-row items-center justify-between mt-7'>
							<Text className='text-base text-gray-600 font-semibold'>
								Все продукты
							</Text>
							<TouchableOpacity
								onPress={() => navigation.navigate('AddProductPage')}
							>
								<Image
									className='w-6 h-6'
									source={require('../../assets/icons/plus-blue.png')}
								/>
							</TouchableOpacity>
						</View>

						<TextInput
							placeholder='Введите название продукта'
							value={searchQuery}
							onChangeText={setSearchQuery}
							className='w-full bg-white border border-gray-300 rounded-md px-4 py-2 mt-2 mb-4'
							placeholderTextColor='gray'
						/>

						{isProductsLoading ? (
							<ActivityIndicator size='large' color='#4CAF50' />
						) : products && products.length > 0 ? (
							products.map(product => (
								<ListItem
									key={product.id}
									name={product.name}
									description={`Ккал: ${product.calories}, ${product.protein} Б ${product.fat} Ж ${product.carbohydrates} У`}
									onDelete={() => handleDeleteProduct(product.id)}
									onEdit={() => handleEditProduct(product.id)}
								/>
							))
						) : (
							<Text className='mt-4 text-gray-500'>Продукты не найдены</Text>
						)}

						<Modal
							animationType='slide'
							transparent={true}
							visible={isModalEditProductVisible}
							onRequestClose={() => setModalEditProductVisible(false)}
						>
							{selectedProduct && (
								<UpdateProductModal
									product={selectedProduct}
									onClose={() => setModalEditProductVisible(false)}
								/>
							)}
						</Modal>
					</View>
				)

			case 'activityLevels':
				return (
					<View className='px-5 pt-4'>
						<View className='flex-row justify-between items-center'>
							<Text className='text-base text-gray-600 font-semibold'>
								Уровни физической активности
							</Text>
							<TouchableOpacity
								onPress={() => setModalCreateActivityVisible(true)}
							>
								<Image
									className='w-6 h-6'
									source={require('../../assets/icons/plus-blue.png')}
								/>
							</TouchableOpacity>
						</View>
						{activityLevels?.levels.map(level => (
							<ListItem
								key={level.id}
								name={level.name}
								description={level.description}
								onEdit={() => handleEditActivityLevel(level.id)}
								onDelete={() => handleDeleteActivityLevel(level.id)}
							/>
						))}

						<Modal
							animationType='slide'
							transparent={true}
							visible={isEditActivityModalVisible}
							onRequestClose={() => setEditActivityModalVisible(false)}
						>
							{selectedActivityLevel && (
								<UpdateActivityLevelModal
									activityLevel={selectedActivityLevel}
									onClose={() => setEditActivityModalVisible(false)}
								/>
							)}
						</Modal>

						<Modal
							animationType='slide'
							transparent={true}
							visible={isModalCreateActivityVisible}
							onRequestClose={() => setModalCreateActivityVisible(false)}
						>
							<AddActivityLevelModal
								onClose={() => setModalCreateActivityVisible(false)}
							/>
						</Modal>
					</View>
				)

			case 'goalTypes':
				return (
					<View className='px-5 pt-4'>
						<View className='flex-row justify-between items-center'>
							<Text className='text-base text-gray-600 font-semibold'>
								Типы целей
							</Text>
							<TouchableOpacity onPress={() => setModalCreateGoalVisible(true)}>
								<Image
									className='w-6 h-6'
									source={require('../../assets/icons/plus-blue.png')}
								/>
							</TouchableOpacity>
						</View>
						{goalTypes?.types.map(goal => (
							<ListItem
								key={goal.id}
								name={goal.name}
								description={goal.description}
								onEdit={() => handleEditGoalType(goal.id)}
								onDelete={() => handleDeleteGoalType(goal.id)}
							/>
						))}

						<Modal
							animationType='slide'
							transparent={true}
							visible={isEditGoalModalVisible}
							onRequestClose={() => setEditGoalModalVisible(false)}
						>
							{selectedGoalType && (
								<UpdateGoalTypeModal
									goalType={selectedGoalType}
									onClose={() => setEditGoalModalVisible(false)}
								/>
							)}
						</Modal>

						<Modal
							animationType='slide'
							transparent={true}
							visible={isModalCreateGoalVisible}
							onRequestClose={() => setModalCreateGoalVisible(false)}
						>
							<AddGoalTypeModal
								onClose={() => setModalCreateGoalVisible(false)}
							/>
						</Modal>
					</View>
				)

			case 'mealTimes':
				return (
					<View className='px-5 pt-4'>
						<View className='flex-row justify-between items-center'>
							<Text className='text-base text-gray-600 font-semibold'>
								Типы приёма пищи
							</Text>
							<TouchableOpacity onPress={() => setModalCreateMealVisible(true)}>
								<Image
									className='w-6 h-6'
									source={require('../../assets/icons/plus-blue.png')}
								/>
							</TouchableOpacity>
						</View>
						{mealTimes?.times.map(meal => (
							<ListItem
								key={meal.id}
								name={meal.name}
								description={meal.description}
								onEdit={() => handleEditMealTime(meal.id)}
								onDelete={() => handleDeleteMealTime(meal.id)}
							/>
						))}

						<Modal
							animationType='slide'
							transparent={true}
							visible={isModalEditMealVisible}
							onRequestClose={() => setEditMealModalVisible(false)}
						>
							{selectedMealTime && (
								<UpdateMealTimeModal
									mealTime={selectedMealTime}
									onClose={() => setEditMealModalVisible(false)}
								/>
							)}
						</Modal>

						<Modal
							animationType='slide'
							transparent={true}
							visible={isModalCreateMealVisible}
							onRequestClose={() => setModalCreateMealVisible(false)}
						>
							<AddMealTimeModal
								onClose={() => setModalCreateMealVisible(false)}
							/>
						</Modal>
					</View>
				)

			case 'recipes':
				return (
					<View className='px-5 pt-4'>
						<Text className='text-base text-gray-600 font-semibold mb-4'>
							Рецепты, требующие модерации
						</Text>

						{isUnapprovedRecipesLoading ? (
							<ActivityIndicator size='large' color='#4CAF50' />
						) : unapprovedRecipes && unapprovedRecipes.length > 0 ? (
							unapprovedRecipes.map(recipe => (
								<View key={recipe.id} className='mb-2'>
									<RecipeItem recipe={recipe} isApprove={true} />
								</View>
							))
						) : (
							<Text className='text-gray-500 mt-4'>
								Нет рецептов для модерации
							</Text>
						)}
					</View>
				)

			case 'users':
				return (
					<View className='px-5 pt-4'>
						<Text className='text-base text-gray-600 font-semibold mb-4'>
							Управление пользователями
						</Text>

						{isUsersLoading ? (
							<ActivityIndicator size='large' color='#4CAF50' />
						) : users && users.length > 0 ? (
							users
								.filter(user => user.id !== userId)
								.map(user => {
									const userRole =
										user.role === 1
											? 'Admin'
											: user.role === 2
											? 'Dietitian'
											: 'User'

									return (
										<View
											key={user.id}
											className='bg-white p-4 rounded-lg mb-3'
										>
											<Text className='text-lg font-bold'>{user.name}</Text>
											<Text className='text-gray-600'>{user.email}</Text>
											<Text className='text-gray-600 mt-1'>
												Роль:{' '}
												{userRole === 'Admin'
													? 'Администратор'
													: userRole === 'Dietitian'
													? 'Диетолог'
													: 'Пользователь'}
											</Text>

											<View className='flex-row mt-2 space-x-2'>
												<TouchableOpacity
													className={`py-1 px-3 rounded ${
														userRole === 'Admin' ? 'bg-blue-500' : 'bg-gray-300'
													}`}
													onPress={() => handleRoleChange(user.id, 1)}
													disabled={userRole === 'Admin'}
												>
													<Text className='text-white'>Админ</Text>
												</TouchableOpacity>

												<TouchableOpacity
													className={`py-1 px-3 rounded ${
														userRole === 'Dietitian'
															? 'bg-blue-500'
															: 'bg-gray-300'
													}`}
													onPress={() => handleRoleChange(user.id, 2)}
													disabled={userRole === 'Dietitian'}
												>
													<Text className='text-white'>Диетолог</Text>
												</TouchableOpacity>

												<TouchableOpacity
													className={`py-1 px-3 rounded ${
														userRole === 'User' ? 'bg-blue-500' : 'bg-gray-300'
													}`}
													onPress={() => handleRoleChange(user.id, 0)}
													disabled={userRole === 'User'}
												>
													<Text className='text-white'>Пользователь</Text>
												</TouchableOpacity>
											</View>
										</View>
									)
								})
						) : (
							<Text className='mt-4 text-gray-500'>
								Пользователи не найдены
							</Text>
						)}
					</View>
				)

			default:
				return null
		}
	}

	return (
		<View className='flex-1 bg-slate-100'>
			<View className='flex-row items-center justify-center p-4'>
				<TouchableOpacity
					className='absolute left-4'
					onPress={() => navigation.goBack()}
				>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/back.png')}
					/>
				</TouchableOpacity>
				<Text className='text-black text-center font-bold text-2xl'>
					Админ панель
				</Text>
			</View>
			{renderTabs()}

			{/* Контент выбранного раздела */}
			<ScrollView className='flex-1'>{renderSection()}</ScrollView>
		</View>
	)
}
