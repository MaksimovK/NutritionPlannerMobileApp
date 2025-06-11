import Toast, { ToastConfig } from 'react-native-toast-message'
import ToastAlert from '../../components/ui/toast/ToastAlert'
import { DEFAULT_TOAST_VISIBLE_TIME } from '../../constants/component.constants'
import { ToastPropsType } from './toast.interface'

export const toastConfig: ToastConfig = {
	info: props => <ToastAlert {...props} />,
	success: props => <ToastAlert {...props} />,
	error: props => <ToastAlert {...props} />
}

export const toastShow = ({
	status,
	text,
	position = 'top',
	autoHide = true,
	bottomOffset = 80,
	visibilityTime = DEFAULT_TOAST_VISIBLE_TIME,
	...rest
}: ToastPropsType) => {
	Toast.show({
		...rest,
		type: status,
		text1: text,
		position: position,
		autoHide: autoHide,
		bottomOffset: bottomOffset,
		visibilityTime: visibilityTime
	})
}
