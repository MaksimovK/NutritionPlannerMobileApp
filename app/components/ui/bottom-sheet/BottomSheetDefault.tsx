import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import {
	PropsWithChildren,
	forwardRef,
	useImperativeHandle,
	useRef
} from 'react'
import { Text, View } from 'react-native'
import { IBottomSheetDefaultProps } from './bottom-sheets.interface'

const BottomSheetDefault = forwardRef<
	BottomSheet,
	PropsWithChildren<IBottomSheetDefaultProps>
>(
	(
		{
			children,
			text,
			container,
			snapPoints = ['25%'],
			index = -1,
			withCross = true,
			LeftHeaderComponent,
			isRightTriangleDisable = false,
			...rest
		},
		ref
	) => {
		const sheetRef = useRef<BottomSheet>(null)
		useImperativeHandle(ref, () => sheetRef.current!)

		return (
			<BottomSheet
				{...rest}
				ref={sheetRef}
				snapPoints={snapPoints}
				index={index}
			>
				<View className='mx-8 flex-row justify-between items-center'>
					<Text className='text-lg text-darkGray-darker'>{text}</Text>
				</View>
				<BottomSheetScrollView
					{...container}
					showsVerticalScrollIndicator={
						!!container?.showsVerticalScrollIndicator
					}
				>
					{children}
				</BottomSheetScrollView>
			</BottomSheet>
		)
	}
)

BottomSheetDefault.displayName = 'BottomSheetDefault'
export default BottomSheetDefault
