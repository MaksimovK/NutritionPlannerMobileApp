import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useCreateProduct } from '../../hooks/queries/product.queries'
import AddProductForm from '../ui/forms/AddProductForm'

export default function AddProductPage() {
	const { mutate: createProduct } = useCreateProduct()

	return (
		<ScrollView className='flex-1 p-5'>
			<View className='w-full bg-white rounded-lg p-5 shadow-md'>
				<Text className='text-xl font-bold mb-5 text-center text-gray-800'>
					Добавить продукт
				</Text>

				<AddProductForm createProduct={createProduct} />
			</View>
		</ScrollView>
	)
}
