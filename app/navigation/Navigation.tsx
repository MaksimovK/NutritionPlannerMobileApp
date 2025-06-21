import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import LoginPage from '../components/pages/LoginPage'
import RegisterPage from '../components/pages/RegisterPage'
import { useAuthTokenStore } from '../store/token'
import { TypeRootStackParamList } from './navigation.types'
import { routes } from './route'
import TabNavigator from './TabNavigator'

export default function Navigation() {
	const token = useAuthTokenStore(state => state.token)

	return (
		<NavigationContainer>
			{token ? <ProtectedStack /> : <AuthStack />}
		</NavigationContainer>
	)
}

function AuthStack() {
	const Stack = createNativeStackNavigator<TypeRootStackParamList>()

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='LoginPage' component={LoginPage} />
			<Stack.Screen name='RegisterPage' component={RegisterPage} />
		</Stack.Navigator>
	)
}

function ProtectedStack() {
	const Stack = createNativeStackNavigator<TypeRootStackParamList>()

	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name='TabNavigator' component={TabNavigator} />
			{routes.map(item => (
				<Stack.Screen
					key={item.name}
					name={item.name}
					component={item.component}
					options={item.options}
				/>
			))}
		</Stack.Navigator>
	)
}
