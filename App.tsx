import React from 'react'
import 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import Navigation from './app/navigation/Navigation'
import { Providers } from './app/providers/providers'
import { toastConfig } from './app/utils/toast/toast'

export default function App(): React.JSX.Element {
	return (
		<Providers>
			<Navigation />
			<Toast config={toastConfig} />
		</Providers>
	)
}
