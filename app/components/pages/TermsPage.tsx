// TermsPage.tsx
import React from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'

export default function TermsPage() {
	const navigation = useTypedNavigation()

	return (
		<ScrollView className='p-4 bg-white'>
			<View className='flex-row items-center py-1 justify-between mb-4'>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/back.png')}
					/>
				</TouchableOpacity>

				<Text className='text-2xl font-bold mx-auto'>Правила сообщества</Text>
			</View>

			<Text className='text-lg mb-2'>1. Уважайте других участников</Text>
			<Text className='mb-4'>
				Мы приветствуем разнообразие мнений, но просим выражать их уважительно.
			</Text>

			<Text className='text-lg mb-2'>2. Запрещено:</Text>
			<Text className='mb-2'>- Оскорбления и дискриминация</Text>
			<Text className='mb-2'>- Распространение ложной информации</Text>
			<Text className='mb-4'>- Спам и реклама без согласования</Text>

			<Text className='text-lg mb-2'>3. Конфиденциальность</Text>
			<Text className='mb-4'>
				Не публикуйте личную информацию других людей без их разрешения.
			</Text>

			<Text className='text-lg mb-2'>4. Авторские права</Text>
			<Text className='mb-4'>
				Размещая контент, вы подтверждаете, что имеете на него права.
			</Text>

			<Text className='mb-4'>
				Администрация оставляет за собой право блокировать аккаунты, нарушающие
				правила сообщества.
			</Text>

			<Text className='italic'>
				Дата последнего обновления: {new Date().toLocaleDateString()}
			</Text>
		</ScrollView>
	)
}
