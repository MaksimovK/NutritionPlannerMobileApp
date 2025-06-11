import React from 'react'
import { Animated, View, ViewProps } from 'react-native'

interface SliderProps extends ViewProps {
	count: number
	animatedValue: Animated.Value
	width: number
}

export default function Slider({
	count,
	animatedValue,
	width,
	...rest
}: SliderProps) {
	return (
		<View {...rest} className={`flex-row self-center`}>
			{Array.from({ length: count }).map((_, index) => {
				const inputRange = [
					(index - 0.5) * width,
					index * width,
					(index + 0.5) * width
				]
				const scale = animatedValue.interpolate({
					inputRange,
					outputRange: [1, 1, 1],
					extrapolate: 'clamp'
				})
				const widthInterpolated = animatedValue.interpolate({
					inputRange,
					outputRange: [2, 10, 2],
					extrapolate: 'clamp'
				})
				const backgroundColor = animatedValue.interpolate({
					inputRange,
					outputRange: ['#a9b1d6', '#1a1b26', '#a9b1d6'],
					extrapolate: 'clamp'
				})

				return (
					<Animated.View
						key={index}
						className={`h-0.5 w-0.5 rounded mr-1`}
						style={[
							{
								transform: [{ scale }],
								width: widthInterpolated,
								backgroundColor
							}
						]}
					/>
				)
			})}
		</View>
	)
}
