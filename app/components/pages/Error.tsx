import React, { FC, PropsWithChildren } from 'react'
import { Text, View, ViewProps, useWindowDimensions } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface IErrorPageProps extends ViewProps {
	title: string
	description: string
	ImageSvg?: FC<SvgProps>
}

export default function Error({
	title,
	description,
	children,
	className,
	...rest
}: PropsWithChildren<IErrorPageProps>) {

	return (
		<View
			{...rest}
			className={'flex-1 justify-center items-center bg-white px-4'}
		>
			<Text className={'text-rg font-bold text-darkGray-light text-center'}>
				{title}
			</Text>
			<Text
				className={'text-md pt-3 pb-4 text-darkGray-light text-center w-2/3'}
			>
				{description}
			</Text>
			{children}
		</View>
	)
}
