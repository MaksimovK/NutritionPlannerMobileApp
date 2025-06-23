import { NativeStackNavigationOptions } from '@react-navigation/native-stack'
import { ComponentType } from 'react'

export type TypeRootStackParamList = {
	TabNavigator: undefined
	DiaryPage: undefined
	MenuPage: undefined
	AddProductPage: undefined
	AddRecipePage: undefined
	ProductPage: { mealTimeId: number; mealPlanId: number; mealTimeName: string }
	ProfilePage: undefined
	ReportsPage: undefined
	RegisterPage: undefined
	LoginPage: undefined
	AdminPanelPage: undefined
	ScannerPage: undefined
	ChatPage: undefined
	FavoritesPage: {
		mealTimeId: number
		mealPlanId: number
		mealTimeName: string
	}
	TermsPage: undefined
}

export interface IRoute {
	name: keyof TypeRootStackParamList
	component: ComponentType
	options?: NativeStackNavigationOptions
}
