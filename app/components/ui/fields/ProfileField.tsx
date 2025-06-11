import React from 'react'
import { Text, TextInput, View } from 'react-native'

export default function ProfileField({
	label,
	value,
	placeholder,
	keyboardType,
	onChange,
	error
}) {
	return (
		<View className='mb-4'>
			<Text className='text-sm font-bold mb-1'>{label}</Text>
			<TextInput
				className='border border-gray-300 rounded p-2'
				value={String(value)}
				placeholder={placeholder}
				placeholderTextColor='black'
				keyboardType={keyboardType || 'default'}
				onChangeText={onChange}
			/>
			{error && <Text className='text-red-500 text-xs mt-1'>{error}</Text>}
		</View>
	)
}
