import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import DiaryPage from '../components/pages/DiaryPage'
import MenuPage from '../components/pages/MenuPage'
import ProfilePage from '../components/pages/ProfilePage'
import ReportsPage from '../components/pages/ReportsPage'
import { TypeRootStackParamList } from './navigation.types'

const Tab = createBottomTabNavigator<TypeRootStackParamList>()

export default function TabNavigator() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarShowLabel: false,
				headerShown: false,
				tabBarStyle: {
					position: 'absolute',
					bottom: 25,
					backgroundColor: 'white',
					borderRadius: 15,
					height: 60,
					marginHorizontal: 20,
					...styles.shadow
				}
			}}
		>
			<Tab.Screen
				name='DiaryPage'
				component={DiaryPage}
				options={{
					tabBarIcon: ({ focused }) => (
						<View className={`justify-center items-center top-3 w-14`}>
							<Image
								source={require('../assets/icons/diary.png')}
								resizeMode='contain'
								style={{
									width: 25,
									height: 25,
									tintColor: focused ? '#16161e' : '#748c94'
								}}
							/>
							<Text
								className={`text-[12px] font-bold ${
									focused ? 'text-[#16161e]' : 'text-[#748c94]'
								}`}
							>
								Дневник
							</Text>
						</View>
					)
				}}
			/>
			<Tab.Screen
				name='MenuPage'
				component={MenuPage}
				options={{
					tabBarIcon: ({ focused }) => (
						<View className={`justify-center items-center top-3 w-14`}>
							<Image
								source={require('../assets/icons/menu.png')}
								resizeMode='contain'
								style={{
									width: 25,
									height: 25,
									tintColor: focused ? '#16161e' : '#748c94'
								}}
							/>
							<Text
								className={`text-[12px] font-bold ${
									focused ? 'text-[#16161e]' : 'text-[#748c94]'
								}`}
							>
								Меню
							</Text>
						</View>
					)
				}}
			/>
			<Tab.Screen
				name='ReportsPage'
				component={ReportsPage}
				options={{
					tabBarIcon: ({ focused }) => (
						<View className={`justify-center items-center top-3 w-14`}>
							<Image
								source={require('../assets/icons/diagram.png')}
								resizeMode='contain'
								style={{
									width: 25,
									height: 25,
									tintColor: focused ? '#16161e' : '#748c94'
								}}
							/>
							<Text
								className={`text-[12px] font-bold ${
									focused ? 'text-[#16161e]' : 'text-[#748c94]'
								}`}
							>
								Очеты
							</Text>
						</View>
					)
				}}
			/>
			<Tab.Screen
				name='ProfilePage'
				component={ProfilePage}
				options={{
					tabBarIcon: ({ focused }) => (
						<View className={`justify-center items-center top-3 w-14`}>
							<Image
								source={require('../assets/icons/profile.png')}
								resizeMode='contain'
								style={{
									width: 25,
									height: 25,
									tintColor: focused ? '#16161e' : '#748c94'
								}}
							/>
							<Text
								className={`text-[12px] font-bold ${
									focused ? 'text-[#16161e]' : 'text-[#748c94]'
								}`}
							>
								Профиль
							</Text>
						</View>
					)
				}}
			/>
		</Tab.Navigator>
	)
}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: '#1a1b26',
		shadowOffset: {
			width: 0,
			height: 10
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.5,
		elevation: 5
	}
})
