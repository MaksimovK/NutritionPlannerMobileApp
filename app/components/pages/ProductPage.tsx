import React, { useMemo, useState } from 'react'
import {
	ActivityIndicator,
	FlatList,
	Image,
	Modal,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { useTypedRoute } from '../../hooks/navigation/useTypedRoute'
import { useAddProductToMealPlan } from '../../hooks/queries/mealPlanItem.queries'
import { useGetAllProducts } from '../../hooks/queries/product.queries'
import {
	useGetAllRecipes,
	useSearchRecipes
} from '../../hooks/queries/recipe.queries'
import { useDebounce } from '../../hooks/useDebounce'
import { useProductStore } from '../../store/products'
import { useAuthTokenStore } from '../../store/token'
import { IProduct } from '../../types/product.types'
import { IRecipe } from '../../types/recipe.types'
import ProductItem from '../elements/product-item/ProductItem'
import RecipeItem from '../elements/recipe-item/RecipeItem'
import AddProductModal from '../ui/modals/AddProductModal'

export default function ProductPage() {
	const { userId, userRole } = useAuthTokenStore()
	const navigation = useTypedNavigation()
	const route = useTypedRoute<'ProductPage'>()
	const mealTimeId = route.params.mealTimeId
	const mealPlanId = route.params.mealPlanId
	const mealTimeName = route.params.mealTimeName

	const [recipeSearch, setRecipeSearch] = useState('')
	const { data: allRecipes, isLoading: isLoadingRecipesAll } =
		useGetAllRecipes()
	const { data: searchedRecipes, isLoading: isLoadingRecipesSearch } =
		useSearchRecipes(recipeSearch)

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetAllProducts()
	const { products, removeProduct } = useProductStore()
	const [searchText, setSearchText] = useState('')
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isAtBottom, setIsAtBottom] = useState(false)
	const [activeTab, setActiveTab] = useState<'products' | 'recipes'>('products')

	const debouncedSearchText = useDebounce(searchText, 500)
	const debouncedRecipeSearch = useDebounce(recipeSearch, 500)

	const { mutate: addProductToMealPlan } = useAddProductToMealPlan()

	const filteredProducts = useMemo(() => {
		if (!data?.pages) return []
		const allProducts = data.pages.flat()

		// Фильтрация продуктов для обычного пользователя
		let filtered = allProducts
		if (userRole !== 'Admin') {
			filtered = allProducts.filter(
				p => p.isApproved || p.createdByUserId === userId
			)
		}

		const mergedProducts = filtered.map(product => {
			const productInStore = products.find(item => item.id === product.id)
			if (productInStore) {
				return { ...product, ...productInStore }
			}
			return product
		})

		if (!searchText) return mergedProducts

		return mergedProducts.filter(product =>
			product.name.toLowerCase().includes(searchText.toLowerCase())
		)
	}, [data, products, userId, userRole, debouncedSearchText])

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

	const renderContent = () => {
		if (activeTab === 'products') {
			return (
				<>
					<TextInput
						className='h-10 border ml-1 border-gray-300 rounded-lg px-3 text-sm flex-nowrap text-gray-800 w-full mb-2'
						placeholder='Поиск продукта...'
						placeholderTextColor='gray'
						value={searchText}
						onChangeText={setSearchText}
					/>

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
					<TextInput
						className='h-10 border border-gray-300 rounded-lg px-3 mb-1 text-gray-800'
						placeholder='Поиск рецепта...'
						placeholderTextColor='gray'
						value={recipeSearch}
						onChangeText={setRecipeSearch}
					/>

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
								<RecipeItem recipe={item} onPress={() => {}} />
							)}
						/>
					)}

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

				<TouchableOpacity
					onPress={() => navigation.navigate('ScannerPage')}
					className='p-2 rounded-full items-end justify-end rotate-90'
				>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/scanner.png')}
					/>
				</TouchableOpacity>
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

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#f5f5f5' },
	tabs: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ddd' },
	tab: { flex: 1, padding: 12, alignItems: 'center' },
	tabActive: { borderBottomWidth: 2, borderColor: '#4CAF50' },
	tabText: { color: '#777' },
	tabTextActive: { color: '#4CAF50', fontWeight: 'bold' },
	content: { flex: 1, padding: 8 },
	empty: { textAlign: 'center', color: '#999', marginTop: 20 }
})
