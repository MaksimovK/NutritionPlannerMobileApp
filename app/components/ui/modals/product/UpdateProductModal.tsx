import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useUpdateProduct } from '../../../../hooks/queries/product.queries'
import { IProduct } from '../../../../types/product.types'

interface IUpdateProductModal {
	product: IProduct
	onClose: () => void
}

export default function UpdateProductModal({
	product,
	onClose
}: IUpdateProductModal) {
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm<IProduct>({
		defaultValues: {
			id: product.id,
			name: product.name,
			weight: 100,
			calories: product.calories,
			protein: product.protein,
			fat: product.fat,
			carbohydrates: product.carbohydrates,
			barcode: product.barcode,
			isApproved: product.isApproved, // Добавлено
			createdByUserId: product.createdByUserId // Добавлено
		},
		mode: 'onChange'
	})

	const { mutate: updateProduct } = useUpdateProduct()

	const onSubmit = (data: IProduct) => {
		updateProduct(data)
		onClose()
	}

	return (
		<View
			className='flex-1 justify-center items-center'
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.5)'
			}}
		>
			<View className='m-4 bg-gray-100 rounded-xl w-11/12'>
				<TouchableOpacity onPress={onClose} className='absolute right-2 top-2'>
					<Image
						className='w-6 h-6'
						source={require('../../../../assets/icons/close.png')}
					/>
				</TouchableOpacity>

				<View className='py-10 px-5'>
					<Text className='text-base text-gray-900'>
						Редактирование продукта
					</Text>

					<Text className='text-base text-gray-900 mt-3'>Название:</Text>
					<Controller
						control={control}
						name='name'
						rules={{ required: 'Название обязательно' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={onChange}
								value={value}
								placeholder='Введите название'
								placeholderTextColor='black'
							/>
						)}
					/>
					{errors.name && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.name.message}
						</Text>
					)}

					<Text className='text-base text-gray-900 mt-3'>Калории:</Text>
					<Controller
						control={control}
						name='calories'
						rules={{
							required: 'Поле обязательно',
							min: { value: 1, message: 'Вес должен быть больше 0' }
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => onChange(Number(text))}
								value={value?.toString() || ''}
								placeholder='Введите калории'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.calories && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.calories.message}
						</Text>
					)}

					<Text className='text-base text-gray-900 mt-3'>Белки:</Text>
					<Controller
						control={control}
						name='protein'
						rules={{ required: 'Поле обязательно' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => onChange(Number(text))}
								value={value?.toString() || ''}
								placeholder='Введите протеины'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.protein && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.protein.message}
						</Text>
					)}

					<Text className='text-base text-gray-900 mt-3'>Жиры:</Text>
					<Controller
						control={control}
						name='fat'
						rules={{ required: 'Поле обязательно' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => onChange(Number(text))}
								value={value?.toString() || ''}
								placeholder='Введите жиры'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.fat && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.fat.message}
						</Text>
					)}

					<Text className='text-base text-gray-900 mt-3'>Углеводы:</Text>
					<Controller
						control={control}
						name='carbohydrates'
						rules={{ required: 'Поле обязательно' }}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => onChange(Number(text))}
								value={value?.toString() || ''}
								placeholder='Введите углеводы'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.carbohydrates && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.carbohydrates.message}
						</Text>
					)}

					<Text className='text-base text-gray-900 mt-3'>Штрих-код</Text>
					<Controller
						control={control}
						name='barcode'
						rules={{
							validate: value => {
								if (!value) return undefined
								const strValue = String(value)
								if (strValue.length !== 8 && strValue.length !== 13) {
									return 'Штрих-код должен содержать 8 или 13 цифр'
								}
								if (!/^\d+$/.test(strValue)) {
									return 'Штрих-код должен содержать только цифры'
								}
								return undefined
							}
						}}
						render={({ field: { onChange, value } }) => (
							<TextInput
								className='border border-gray-300 rounded text-black p-2 bg-white mt-3'
								onChangeText={text => onChange(Number(text))}
								value={value?.toString() || ''}
								placeholder='Введите штрих-код'
								placeholderTextColor='black'
								keyboardType='numeric'
							/>
						)}
					/>
					{errors.barcode && (
						<Text className='text-red-500 pt-1 text-left'>
							{errors.barcode.message}
						</Text>
					)}

					<TouchableOpacity
						className='bg-[#4CAF50] justify-center items-center rounded mt-3'
						onPress={handleSubmit(onSubmit)}
					>
						<Text className='text-base text-white text-center py-2'>
							Сохранить
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}
