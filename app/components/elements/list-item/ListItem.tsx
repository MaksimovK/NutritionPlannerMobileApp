import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

interface ListItemProps {
	name: string
	description: string
	onEdit?: () => void
	onDelete?: () => void
}

export default function ListItem({
	name,
	description,
	onEdit,
	onDelete
}: ListItemProps) {
	return (
		<View className='w-full px-5 bg-gray-300 py-3 rounded-lg mt-2 shadow-lg flex-row items-center justify-between'>
			<View>
				<Text className='text-black text-lg font-semibold'>{name}</Text>
				<Text
					className='text-gray-700 text-sm'
					numberOfLines={1}
					ellipsizeMode='tail'
				>
					{description}
				</Text>
			</View>
			<View className='absolute right-2 gap-2'>
				<TouchableOpacity onPress={onEdit}>
					<Image
						className='w-5 h-5'
						source={require('../../../assets/icons/edit.png')}
					/>
				</TouchableOpacity>
				<TouchableOpacity onPress={onDelete}>
					<Image
						className='w-5 h-5'
						source={require('../../../assets/icons/trash.png')}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}
