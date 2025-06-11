import { BottomSheetProps } from '@gorhom/bottom-sheet'
import { ComponentType, ReactNode } from 'react'
import { ScrollViewProps } from 'react-native'

export interface IBottomSheetDefaultProps extends BottomSheetProps {
	container?: ScrollViewProps
	withCross?: boolean
	LeftHeaderComponent?: ComponentType
	text?: string
	isRightTriangleDisable?: boolean
}

export interface IBottomSheetFormProps extends IBottomSheetDefaultProps {
	title: string
}

export interface IBottomSheetHelpProps
	extends Omit<IBottomSheetDefaultProps, 'children'> {
	icon?: ReactNode
	text: string
}
