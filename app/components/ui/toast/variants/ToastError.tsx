import { Image, Text, View } from 'react-native'
import { ToastConfigParams } from 'react-native-toast-message'
import { SOMETHING_WRONG_ERROR } from '../../../../constants/error.constants'
import { ToastAlertContainer } from '../ToastAlert'

export default function ToastError({ text1 }: ToastConfigParams<any>) {
	return (
		<ToastAlertContainer>
			<View className='flex-row justify-center items-start'>
				<Image
					source={require('../../../../assets/icons/error.png')}
					className='w-5 h-5'
				/>
				<Text className='mx-2 text-black text-sm font-bold'>
					{text1 ?? SOMETHING_WRONG_ERROR}
				</Text>
			</View>
		</ToastAlertContainer>
	)
}
