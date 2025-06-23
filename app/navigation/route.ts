import AddProductPage from '../components/pages/AddProductPage'
import AddRecipePage from '../components/pages/AddRecipePage'
import AdminPanelPage from '../components/pages/AdminPanelPage'
import ChatPage from '../components/pages/ChatPage'
import FavoritesPage from '../components/pages/FavoritesPage'
import ProductPage from '../components/pages/ProductPage'
import ScannerPage from '../components/pages/Scanner'
import { IRoute } from './navigation.types'

export const routes: IRoute[] = [
	{ name: 'AddProductPage', component: AddProductPage },
	{ name: 'AddRecipePage', component: AddRecipePage },
	{ name: 'ProductPage', component: ProductPage },
	{ name: 'AdminPanelPage', component: AdminPanelPage },
	{ name: 'ScannerPage', component: ScannerPage },
	{ name: 'ChatPage', component: ChatPage },
	{ name: 'FavoritesPage', component: FavoritesPage }
]
