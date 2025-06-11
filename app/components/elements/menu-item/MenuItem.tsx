import React, { useState } from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MenuModal from '../../ui/modals/menus/MenuModal'

type MenuItemType = 'loss' | 'gait' | 'maintaining'

interface MenuItemProps {
	type: MenuItemType
}

export default function MenuItem({ type }: MenuItemProps) {
	let gradientColors = ['#2563eb', 'rgba(0, 191, 255, 0)']
	let text = 'Меню для похудения'
	let imageSource

	switch (type) {
		case 'loss':
			gradientColors = ['#2563eb', 'rgba(255, 99, 71, 0)']
			text = `Меню для ${'\n'}похудения`
			imageSource = require('../../../assets/icons/weight_loss.jpg')
			break
		case 'gait':
			gradientColors = ['#d23d43', 'rgba(50, 205, 50, 0)']
			text = `Меню для ${'\n'}набора массы`
			imageSource = require('../../../assets/icons/gain_mass.jpg')
			break
		case 'maintaining':
			gradientColors = ['#9dcd64', 'rgba(30, 144, 255, 0)']
			text = `Меню для ${'\n'}поддержания веса`
			imageSource = require('../../../assets/icons/maintaining_weight.jpg')
			break
	}

	const [modalVisible, setModalVisible] = useState(false)

	const toggleModal = () => {
		setModalVisible(!modalVisible)
	}

	return (
		<View className=''>
			<TouchableOpacity onPress={toggleModal}>
				<View className='w-full h-36 rounded-lg shadow-md shadow-black relative'>
					<LinearGradient
						colors={gradientColors}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 0 }}
						className='absolute top-0 left-0 w-full h-full rounded-lg z-10'
					>
						<Text className='text-xl font-bold text-white absolute top-2 left-2'>
							{text}
						</Text>
					</LinearGradient>

					<Image className='w-full h-36 rounded-lg' source={imageSource} />
				</View>
			</TouchableOpacity>

			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				onRequestClose={toggleModal}
			>
				<MenuModal onClose={toggleModal} goalTypeId={1} />
			</Modal>
		</View>
	)
}
