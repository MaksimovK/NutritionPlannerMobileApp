import { ComponentType, PropsWithChildren } from 'react'
import { View, useWindowDimensions } from 'react-native'
import { ViewProps } from 'react-native-svg/lib/typescript/fabric/utils'
import { ToastConfigParams, ToastType } from 'react-native-toast-message'
import ToastError from './variants/ToastError'
import ToastInfo from './variants/ToastInfo'
import ToastSuccess from './variants/ToastSuccess'

export function ToastAlertContainer({
	children,
	className,
	style,
	...rest
}: PropsWithChildren<ViewProps>) {
	const { width } = useWindowDimensions()

	return (
		<View
			{...rest}
			style={[{ width: width * 0.8, minHeight: 40 }]}
			className={`border-[1px] border-sky-light rounded mx-3`}
		>
			<View className='flex-1 bg-white rounded justify-center items-start px-4 py-2'>
				{children}
			</View>
		</View>
	)
}

export default function ToastAlert(props: ToastConfigParams<any>) {
	const type: Record<ToastType, ComponentType<ToastConfigParams<any>>> = {
		info: ToastInfo,
		success: ToastSuccess,
		error: ToastError
	}

	const TypeToast = type[props.type]

	return <TypeToast {...props} />
}
