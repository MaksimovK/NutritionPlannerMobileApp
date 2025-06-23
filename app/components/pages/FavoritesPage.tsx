import { useState } from 'react'
import {
	FlatList,
	Image,
	Modal,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { useTypedRoute } from '../../hooks/navigation/useTypedRoute'
import {
	useAddProductToMealPlan,
	useAddRecipeToMealPlan
} from '../../hooks/queries/mealPlanItem.queries'
import { useFavoritesStore } from '../../store/favorites'
import { useProductStore } from '../../store/products'
import { useRecipeStore } from '../../store/recipes'
import { IProduct } from '../../types/product.types'
import { IRecipe } from '../../types/recipe.types'
import ProductItem from '../elements/product-item/ProductItem'
import RecipeItem from '../elements/recipe-item/RecipeItem'
import AddProductModal from '../ui/modals/AddProductModal' // Импортируем модалку для продуктов
import AddRecipeModal from '../ui/modals/AddRecipeModal' // Импортируем модалку для рецептов

export default function FavoritesPage() {
	const navigation = useTypedNavigation()
	const route = useTypedRoute<'FavoritesPage'>()
	const { mealTimeId, mealPlanId, mealTimeName } = route.params
	const [activeTab, setActiveTab] = useState<'products' | 'recipes'>('products')
	const [isAtBottom, setIsAtBottom] = useState(false)

	// Состояния для модальных окон
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
	const [isProductModalVisible, setIsProductModalVisible] = useState(false)
	const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null)
	const [isRecipeModalVisible, setIsRecipeModalVisible] = useState(false)

	const {
		favoriteProducts,
		favoriteRecipes,
		toggleProductFavorite,
		toggleRecipeFavorite
	} = useFavoritesStore()

	// Используем локальные хранилища для выбранных элементов
	const { products, addProduct, removeProduct, clearProducts } =
		useProductStore()
	const { recipes, addRecipe, removeRecipe, clearRecipes } = useRecipeStore()

	const { mutate: addProductToMealPlan } = useAddProductToMealPlan()
	const { mutate: addRecipeToMealPlan } = useAddRecipeToMealPlan()

	const handleProductPress = (product: IProduct) => {
		setSelectedProduct(product)
		setIsProductModalVisible(true)
	}

	const handleRecipePress = (recipe: IRecipe) => {
		setSelectedRecipe(recipe)
		setIsRecipeModalVisible(true)
	}

	const handleAddProduct = (product: IProduct, weight: number) => {
		addProduct({ ...product, weight })
		setIsProductModalVisible(false)
	}

	const handleAddRecipe = (recipe: IRecipe, weight: number) => {
		addRecipe({ ...recipe, weight })
		setIsRecipeModalVisible(false)
	}

	const handleAddSelectedProducts = async () => {
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
		clearProducts()
		navigation.goBack()
	}

	const handleAddSelectedRecipes = async () => {
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
		clearRecipes()
		navigation.goBack()
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
				<View style={{ width: 24 }} />
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
						Продукты ({favoriteProducts.length})
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
						Рецепты ({favoriteRecipes.length})
					</Text>
				</TouchableOpacity>
			</View>

			{activeTab === 'products' ? (
				<>
					<FlatList
						data={favoriteProducts}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => (
							<ProductItem
								item={item}
								onPress={() => handleProductPress(item)}
								isSelected={products.some(p => p.id === item.id)}
							/>
						)}
						onScroll={handleScroll}
						scrollEventThrottle={16}
						ListEmptyComponent={
							<Text className='text-center text-gray-500 py-4'>
								Нет избранных продуктов
							</Text>
						}
					/>

					{!isAtBottom && products.length > 0 && (
						<View
							className='absolute bottom-20 left-1/2'
							style={{ transform: [{ translateX: -22.5 }] }}
						>
							<TouchableOpacity
								onPress={handleAddSelectedProducts}
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
				</>
			) : (
				<>
					<FlatList
						data={favoriteRecipes}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) => (
							<RecipeItem
								recipe={item}
								onPress={() => handleRecipePress(item)}
								isSelected={recipes.some(r => r.id === item.id)}
							/>
						)}
						onScroll={handleScroll}
						scrollEventThrottle={16}
						ListEmptyComponent={
							<Text className='text-center text-gray-500 py-4'>
								Нет избранных рецептов
							</Text>
						}
					/>

					{!isAtBottom && recipes.length > 0 && (
						<View
							className='absolute bottom-20 left-1/2'
							style={{ transform: [{ translateX: -22.5 }] }}
						>
							<TouchableOpacity
								onPress={handleAddSelectedRecipes}
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
				</>
			)}

			{/* Модальное окно для выбора веса продукта */}
			<Modal
				animationType='slide'
				transparent={true}
				visible={isProductModalVisible}
				onRequestClose={() => setIsProductModalVisible(false)}
			>
				{selectedProduct && (
					<AddProductModal
						product={selectedProduct}
						onClose={() => setIsProductModalVisible(false)}
					/>
				)}
			</Modal>

			{/* Модальное окно для выбора веса рецепта */}
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
		</View>
	)
}
