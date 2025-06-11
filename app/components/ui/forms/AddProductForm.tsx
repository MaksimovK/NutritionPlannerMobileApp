import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	ActivityIndicator,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../../hooks/navigation/useTypedNavigation'
import { useAuthTokenStore } from '../../../store/token'
import { IProduct } from '../../../types/product.types'
import { toastShow } from '../../../utils/toast/toast'

interface IAddProductFormProps {
	createProduct: (data: IProduct, options?: any) => void
}

export default function AddProductForm({
	createProduct
}: IAddProductFormProps) {
	const navigation = useTypedNavigation()
	const { userId, userRole } = useAuthTokenStore()

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<IProduct>({
		defaultValues: {
			name: '',
			weight: 100,
			calories: 0,
			protein: 0,
			fat: 0,
			carbohydrates: 0,
			barcode: '',
			isApproved: userRole === 'Admin'
		}
	})

	const onSubmit = (data: IProduct) => {
		const productData = {
			...data,
			createdByUserId: userId
		}

		createProduct(productData, {
			onSuccess: () => {
				toastShow({
					status: 'success',
					text: 'Продукт успешно добавлен!'
				})

				navigation.goBack()
			},
			onError: () => {
				toastShow({
					status: 'error',
					text: 'Не удалось добавить продукт!'
				})
			}
		})
	}

	return (
		<View className=''>
			{/* Название продукта */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>Название продукта</Text>
				<Controller
					control={control}
					name='name'
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Название продукта'
							placeholderTextColor='gray'
							value={value}
							onChangeText={onChange}
						/>
					)}
					rules={{
						required: 'Поле обязательно для заполнения',
						minLength: {
							value: 3,
							message: 'Название должно содержать минимум 3 символа'
						}
					}}
				/>
				{errors.name && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.name.message}
					</Text>
				)}
			</View>
			{/* Калории */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>Калории, на 100 г</Text>
				<Controller
					control={control}
					name='calories'
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Калории'
							placeholderTextColor='gray'
							keyboardType='numeric'
							value={String(value)}
							onChangeText={text => {
								const correctedText = text.replace(',', '.')
								onChange(correctedText)
							}}
						/>
					)}
					rules={{
						required: 'Поле обязательно для заполнения',
						min: {
							value: 1,
							message: 'Калории должны быть больше 0'
						}
					}}
				/>
				{errors.calories && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.calories.message}
					</Text>
				)}
			</View>
			{/* Белки */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>Белки, на 100 г</Text>
				<Controller
					control={control}
					name='protein'
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Белки'
							placeholderTextColor='gray'
							keyboardType='numeric'
							value={String(value)}
							onChangeText={text => {
								const correctedText = text.replace(',', '.')
								onChange(correctedText)
							}}
						/>
					)}
					rules={{
						required: 'Поле обязательно для заполнения'
					}}
				/>
				{errors.protein && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.protein.message}
					</Text>
				)}
			</View>
			{/* Жиры */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>Жиры, на 100 г</Text>
				<Controller
					control={control}
					name='fat'
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Жиры'
							placeholderTextColor='gray'
							keyboardType='numeric'
							value={String(value)}
							onChangeText={text => {
								const correctedText = text.replace(',', '.')
								onChange(correctedText)
							}}
						/>
					)}
					rules={{
						required: 'Поле обязательно для заполнения'
					}}
				/>
				{errors.fat && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.fat.message}
					</Text>
				)}
			</View>
			{/* Углеводы */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>Углеводы, на 100 г</Text>
				<Controller
					control={control}
					name='carbohydrates'
					render={({ field: { onChange, value } }) => (
						<TextInput
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Углеводы'
							placeholderTextColor='gray'
							keyboardType='numeric'
							value={String(value)}
							onChangeText={text => {
								const correctedText = text.replace(',', '.')
								onChange(correctedText)
							}}
						/>
					)}
					rules={{
						required: 'Поле обязательно для заполнения'
					}}
				/>
				{errors.carbohydrates && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.carbohydrates.message}
					</Text>
				)}
			</View>
			{/* Штрих-код */}
			<View className='mb-4'>
				<Text className='text-base text-gray-700 mb-2'>
					Штрих-код (опционально)
				</Text>
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
							className='h-10 border border-gray-300 rounded px-3 text-base text-gray-800'
							placeholder='Штрих-код'
							placeholderTextColor='gray'
							value={value}
							onChangeText={onChange}
							keyboardType='numeric'
						/>
					)}
				/>
				{errors.barcode && (
					<Text className='text-sm text-red-500 mt-1'>
						{errors.barcode.message}
					</Text>
				)}
			</View>

			<TouchableOpacity
				onPress={handleSubmit(onSubmit)}
				className='bg-[#4CAF50] py-3 rounded-md items-center mt-5'
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<ActivityIndicator color='white' />
				) : (
					<Text className='text-white text-base'>Добавить продукт</Text>
				)}
			</TouchableOpacity>
			{/* Кнопка Назад */}
			<TouchableOpacity
				onPress={() => navigation.goBack()}
				className='bg-blue-500 py-3 rounded-md items-center mt-3 mb-4'
			>
				<Text className='text-white text-base'>Назад</Text>
			</TouchableOpacity>
		</View>
	)
}
