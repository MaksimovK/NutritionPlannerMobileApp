import { Image, Text, View } from 'react-native'
import { ToastConfigParams } from 'react-native-toast-message'
import { ToastAlertContainer } from '../ToastAlert'

export default function ToastInfo({ text1 }: ToastConfigParams<any>) {
	return (
		<ToastAlertContainer>
			<View className='flex-row justify-start items-center'>
				<Image
					source={require('../../../../assets/icons/info.png')}
					className='w-5 h-5'
				/>
				<Text className='mx-2.5 text-black text-sm font-bold'>{text1}</Text>
			</View>
		</ToastAlertContainer>
	)
}
