import { ToastProps, ToastType } from 'react-native-toast-message'

interface IToast {
	status: ToastType
	text: string
}

export type ToastPropsType = ToastProps & IToast
