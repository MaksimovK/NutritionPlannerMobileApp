import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Image,
	Modal,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { useTypedRoute } from '../../hooks/navigation/useTypedRoute'
import {
	useAddProductToMealPlan,
	useAddRecipeToMealPlan
} from '../../hooks/queries/mealPlanItem.queries'
import {
	useGetAllProducts,
	useSearchProducts
} from '../../hooks/queries/product.queries'
import {
	useGetAllRecipes,
	useSearchRecipes
} from '../../hooks/queries/recipe.queries'
import { useDebounce } from '../../hooks/useDebounce'
import { useProductStore } from '../../store/products'
import { useRecipeStore } from '../../store/recipes'
import { useAuthTokenStore } from '../../store/token'
import {
	ProductFilter as FilterType,
	IProduct
} from '../../types/product.types'
import { IRecipe, RecipeFilter } from '../../types/recipe.types'
import { Role } from '../../types/user.types'
import ProductItem from '../elements/product-item/ProductItem'
import RecipeItem from '../elements/recipe-item/RecipeItem'
import AddProductModal from '../ui/modals/AddProductModal'
import AddRecipeModal from '../ui/modals/AddRecipeModal'
import FilterProductModal from '../ui/modals/filters/products/FilterProductModal'
import FilterRecipeModal from '../ui/modals/filters/recipes/FilterRecipeModal'

export default function ProductPage() {
	const [filterProduct, setFilterProduct] = useState<FilterType>({
		highProtein: false,
		lowCalorie: false,
		highCalorie: false,
		lowCarb: false,
		highCarb: false,
		lowFat: false,
		highFat: false
	})
	const [isFilterProductModalVisible, setIsFilterProductModalVisible] =
		useState(false)

	const [filterRecipe, setFilterRecipe] = useState<RecipeFilter>({
		highProtein: false,
		lowCalorie: false,
		highCalorie: false,
		lowCarb: false,
		highCarb: false,
		lowFat: false,
		highFat: false
	})
	const [isFilterRecipeModalVisible, setIsFilterRecipeModalVisible] =
		useState(false)

	const { userId, userRole } = useAuthTokenStore()
	const navigation = useTypedNavigation()
	const route = useTypedRoute<'ProductPage'>()
	const mealTimeId = route.params.mealTimeId
	const mealPlanId = route.params.mealPlanId
	const mealTimeName = route.params.mealTimeName

	const { recipes, removeRecipe } = useRecipeStore()
	const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null)
	const [isRecipeModalVisible, setIsRecipeModalVisible] = useState(false)
	const [recipeSearch, setRecipeSearch] = useState('')
	const { data: allRecipes, isLoading: isLoadingRecipesAll } =
		useGetAllRecipes(filterRecipe)
	const { data: searchedRecipes, isLoading: isLoadingRecipesSearch } =
		useSearchRecipes(recipeSearch, filterRecipe)
	const { mutate: addRecipeToMealPlan } = useAddRecipeToMealPlan()

	const [searchText, setSearchText] = useState('')
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetAllProducts(filterProduct)

	const { products, removeProduct } = useProductStore()
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [activeTab, setActiveTab] = useState<'products' | 'recipes'>('products')

	const debouncedSearchText = useDebounce(searchText, 500)
	const debouncedRecipeSearch = useDebounce(recipeSearch, 500)

	const { mutate: addProductToMealPlan } = useAddProductToMealPlan()

	const { data: searchedProducts } = useSearchProducts(
		debouncedSearchText,
		filterProduct
	)

	const filteredProducts = useMemo(() => {
		if (debouncedSearchText && searchedProducts) {
			let filtered = searchedProducts
			if (userRole !== Role.Admin) {
				filtered = filtered.filter(
					p => p.isApproved || p.createdByUserId === userId
				)
			}
			return filtered.map(product => {
				const productInStore = products.find(item => item.id === product.id)
				return productInStore ? { ...product, ...productInStore } : product
			})
		}

		// Иначе используем основной список
		if (!data?.pages) return []
		const allProducts = data.pages.flat()

		let filtered = allProducts
		if (userRole !== Role.Admin) {
			filtered = filtered.filter(
				p => p.isApproved || p.createdByUserId === userId
			)
		}

		return filtered.map(product => {
			const productInStore = products.find(item => item.id === product.id)
			return productInStore ? { ...product, ...productInStore } : product
		})
	}, [data, products, userId, userRole, debouncedSearchText, searchedProducts])

	const loadMoreData = () => {
		if (!isLoading && hasNextPage) {
			fetchNextPage()
		}
	}

	const handleProductPress = (product: IProduct) => {
		const isProductInStore = products.some(item => item.id === product.id)

		if (isProductInStore) {
			removeProduct(product.id)
		} else {
			setSelectedProduct(product)
			setIsModalVisible(true)
		}
	}

	const handleRecipePress = (recipe: IRecipe) => {
		const isRecipeInStore = recipes.some(r => r.id === recipe.id)

		if (isRecipeInStore) {
			removeRecipe(recipe.id)
		} else {
			setSelectedRecipe(recipe)
			setIsRecipeModalVisible(true)
		}
	}

	const handleModalClose = () => {
		setIsModalVisible(false)
		setSelectedProduct(null)
	}

	const handleAddMultipleProductsToMealPlan = async (
		mealPlanId: number,
		mealTimeId: number,
		products: IProduct[]
	) => {
		for (const product of products) {
			try {
				await addProductToMealPlan({
					mealPlanId,
					mealTimeId,
					productId: product.id,
					amount: product.weight / 100
				})
			} catch (error) {
				console.error(`Ошибка добавления продукта ${product.name}:`, error)
			}
		}
	}

	const handleAddMultipleRecipesToMealPlan = async (
		mealPlanId: number,
		mealTimeId: number,
		recipes: IRecipe[]
	) => {
		for (const recipe of recipes) {
			try {
				const weight = recipe.weight || recipe.totalWeight || 100

				await addRecipeToMealPlan({
					mealPlanId,
					mealTimeId,
					recipeId: recipe.id,
					amount: weight
				})
			} catch (error) {
				console.error(`Ошибка добавления рецепта ${recipe.name}:`, error)
			}
		}
	}

	const handleScroll = (event: any) => {
		const contentHeight = event.nativeEvent.contentSize.height
		const contentOffsetY = event.nativeEvent.contentOffset.y
		const layoutHeight = event.nativeEvent.layoutMeasurement.height

		if (contentOffsetY + layoutHeight >= contentHeight - 20) {
			setIsAtBottom(true)
		} else {
			setIsAtBottom(false)
		}
	}

	if (isLoading) {
		return (
			<Text className='text-center text-lg text-gray-700 mt-5'>
				<ActivityIndicator size='large' color='#4CAF50' />
			</Text>
		)
	}

	const recipesToShow = debouncedRecipeSearch ? searchedRecipes : allRecipes
	const isLoadingRecipes = debouncedRecipeSearch
		? isLoadingRecipesSearch
		: isLoadingRecipesAll

	const countActiveFilters = (filter: any) => {
		return Object.values(filter).filter(value => value).length
	}

	const renderContent = () => {
		if (activeTab === 'products') {
			return (
				<>
					<View className='flex-row items-center justify-between gap-2 mb-2'>
						<TextInput
							className='h-10 border ml-1 border-gray-300 rounded-lg px-3 text-sm flex-nowrap text-gray-800 w-[85%]'
							placeholder='Поиск продукта...'
							placeholderTextColor='gray'
							value={searchText}
							onChangeText={setSearchText}
						/>

						<TouchableOpacity
							onPress={() => setIsFilterProductModalVisible(true)}
						>
							{countActiveFilters(filterProduct) > 0 && (
								<View className='absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center'>
									<Text className='text-white text-xs'>
										{countActiveFilters(filterProduct)}
									</Text>
								</View>
							)}

							<Image
								className='w-6 h-6 mr-2'
								source={require('../../assets/icons/filters.png')}
							/>
						</TouchableOpacity>

						<FilterProductModal
							visible={isFilterProductModalVisible}
							onClose={() => setIsFilterProductModalVisible(false)}
							onApply={newFilter => {
								setFilterProduct(newFilter)
								setIsFilterProductModalVisible(false)
							}}
							initialFilter={filterProduct}
						/>
					</View>

					<FlatList
						data={filteredProducts}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => (
							<ProductItem
								item={item}
								onPress={() => handleProductPress(item)}
								showApproveButton={true}
							/>
						)}
						onEndReached={loadMoreData}
						onEndReachedThreshold={0.5}
						ListFooterComponent={
							isFetchingNextPage ? (
								<View className='py-4'>
									<ActivityIndicator size='small' color='#4CAF50' />
								</View>
							) : (
								<Text className='text-center text-gray-500 py-4'>
									Это все продукты
								</Text>
							)
						}
						onScroll={handleScroll}
						scrollEventThrottle={16}
					/>

					{!isAtBottom && products.length > 0 && (
						<View className='absolute bottom-20 left-1/2'>
							<TouchableOpacity
								onPress={() => {
									handleAddMultipleProductsToMealPlan(
										mealPlanId,
										mealTimeId,
										products
									),
										navigation.goBack()
								}}
								className='relative w-[45px] h-[45px] bg-[#3b82f6] rounded-full items-center justify-center shadow-lg shadow-gray-800'
							>
								<Image
									className='w-[30px] h-[30px]'
									source={require('../../assets/icons/check-mark.png')}
								/>
								<View className='w-5 h-5 absolute bottom-0 -right-1 bg-white rounded-full shadow-sm shadow-gray-800'>
									<Text className='text-gray-800 text-sm text-center'>
										{products.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}

					<Modal
						animationType='slide'
						transparent={true}
						visible={isModalVisible}
						onRequestClose={handleModalClose}
					>
						{selectedProduct && (
							<AddProductModal
								product={selectedProduct}
								onClose={handleModalClose}
							/>
						)}
					</Modal>

					<TouchableOpacity
						onPress={() => navigation.navigate('AddProductPage')}
						className='bg-[#4CAF50] py-2 rounded-lg items-center mt-2'
					>
						<Text className='text-white text-base'>Добавить продукт</Text>
					</TouchableOpacity>
				</>
			)
		} else {
			return (
				<>
					<View className='flex-row items-center justify-between gap-2 mb-2'>
						<TextInput
							className='h-10 border border-gray-300 rounded-lg px-3 text-gray-800 w-[85%]'
							placeholder='Поиск рецепта...'
							placeholderTextColor='gray'
							value={recipeSearch}
							onChangeText={setRecipeSearch}
						/>

						<TouchableOpacity
							onPress={() => setIsFilterRecipeModalVisible(true)}
						>
							{countActiveFilters(filterRecipe) > 0 && (
								<View className='absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center'>
									<Text className='text-white text-xs'>
										{countActiveFilters(filterRecipe)}
									</Text>
								</View>
							)}

							<Image
								className='w-6 h-6 mr-2'
								source={require('../../assets/icons/filters.png')}
							/>
						</TouchableOpacity>

						<FilterRecipeModal
							visible={isFilterRecipeModalVisible}
							onClose={() => setIsFilterRecipeModalVisible(false)}
							onApply={newFilter => {
								setFilterRecipe(newFilter)
								setIsFilterRecipeModalVisible(false)
							}}
							initialFilter={filterRecipe}
						/>
					</View>

					{isLoadingRecipes ? (
						<ActivityIndicator size='large' color='#4CAF50' />
					) : !recipesToShow?.length ? (
						<Text className='text-center text-gray-500 py-4'>
							Рецептов не найдено
						</Text>
					) : (
						<FlatList
							data={recipesToShow}
							keyExtractor={(item: IRecipe) => item.id.toString()}
							renderItem={({ item }) => (
								<RecipeItem
									recipe={item}
									onPress={handleRecipePress}
									isSelected={recipes.some(r => r.id === item.id)}
								/>
							)}
						/>
					)}

					{!isAtBottom && recipes.length > 0 && (
						<View className='absolute bottom-20 left-1/2'>
							<TouchableOpacity
								onPress={() => {
									handleAddMultipleRecipesToMealPlan(
										mealPlanId,
										mealTimeId,
										recipes
									)
									navigation.goBack()
								}}
								className='relative w-[45px] h-[45px] bg-[#3b82f6] rounded-full items-center justify-center shadow-lg shadow-gray-800'
							>
								<Image
									className='w-[30px] h-[30px]'
									source={require('../../assets/icons/check-mark.png')}
								/>
								<View className='w-5 h-5 absolute bottom-0 -right-1 bg-white rounded-full shadow-sm shadow-gray-800'>
									<Text className='text-gray-800 text-sm text-center'>
										{recipes.length}
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					)}

					<Modal
						animationType='slide'
						transparent={true}
						visible={isRecipeModalVisible}
						onRequestClose={() => setIsRecipeModalVisible(false)}
					>
						{selectedRecipe && (
							<AddRecipeModal
								recipe={selectedRecipe}
								onClose={() => setIsRecipeModalVisible(false)}
							/>
						)}
					</Modal>

					<TouchableOpacity
						className='bg-[#4CAF50] py-2 rounded-lg items-center mt-2'
						onPress={() => navigation.navigate('AddRecipePage')}
					>
						<Text className='text-white text-base'>Добавить рецепт</Text>
					</TouchableOpacity>
				</>
			)
		}
	}

	return (
		<View className='flex-1 px-2 py-2 bg-gray-100'>
			<View className='flex-row items-center py-1 justify-between'>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/back.png')}
					/>
				</TouchableOpacity>

				<Text className='text-center font-bold text-xl'>{mealTimeName}</Text>

				<View className='flex-row'>
					<TouchableOpacity
						onPress={() => navigation.navigate('ScannerPage')}
						className='p-2 rounded-full items-end justify-end rotate-90 mr-2'
					>
						<Image
							className='w-6 h-6'
							source={require('../../assets/icons/scanner.png')}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={() =>
							navigation.navigate('FavoritesPage', {
								mealTimeId,
								mealPlanId,
								mealTimeName
							})
						}
						className='p-2 rounded-full items-end justify-end'
					>
						<Image
							className='w-6 h-6'
							source={require('../../assets/icons/favorite-disabled.png')}
						/>
					</TouchableOpacity>
				</View>
			</View>

			<View className='flex-row mb-2 border-b border-gray-300'>
				<TouchableOpacity
					className={`flex-1 py-1.5 items-center ${
						activeTab === 'products' ? 'border-b-2 border-blue-500' : ''
					}`}
					onPress={() => setActiveTab('products')}
				>
					<Text
						className={`font-medium ${
							activeTab === 'products' ? 'text-blue-500' : 'text-gray-500'
						}`}
					>
						Продукты
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					className={`flex-1 py-1.5 items-center ${
						activeTab === 'recipes' ? 'border-b-2 border-blue-500' : ''
					}`}
					onPress={() => setActiveTab('recipes')}
				>
					<Text
						className={`font-medium ${
							activeTab === 'recipes' ? 'text-blue-500' : 'text-gray-500'
						}`}
					>
						Рецепты
					</Text>
				</TouchableOpacity>
			</View>

			{renderContent()}
		</View>
	)
}
