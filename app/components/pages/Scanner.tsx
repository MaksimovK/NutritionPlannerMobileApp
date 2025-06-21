import React, { useEffect, useRef, useState } from 'react'
import {
	AppState,
	Image,
	Linking,
	Modal,
	PermissionsAndroid,
	Platform,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { Camera, CameraType } from 'react-native-camera-kit'
import { axiosAuth } from '../../api/interceptor'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { IProduct } from '../../types/product.types'
import Error from '../pages/Error'
import AddProductModal from '../ui/modals/AddProductModal'

export default function ScannerPage() {
	const navigation = useTypedNavigation()

	const [hasCameraPermission, setHasCameraPermission] = useState<
		boolean | null
	>(null)
	const cameraRef = useRef<Camera>(null)
	const [isScanning, setIsScanning] = useState<boolean>(false)
	const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [isProductNotFound, setIsProductNotFound] = useState(false)

	const isScanningRef = useRef(false)

	const handleOpenSettings = () => {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:')
		} else if (Platform.OS === 'android') {
			Linking.openSettings()
		}
	}

	const requestCameraPermission = async () => {
		if (Platform.OS === 'android') {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.CAMERA
			)
			setHasCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
		} else {
			setHasCameraPermission(true)
		}
	}

	useEffect(() => {
		requestCameraPermission()

		const subscription = AppState.addEventListener('change', nextAppState => {
			if (nextAppState === 'active' && !hasCameraPermission) {
				requestCameraPermission()
			}
		})

		return () => {
			subscription.remove()
		}
	}, [hasCameraPermission])

	const handleBarcodeRead = async (event: Camera.BarcodeReadEvent) => {
		if (isScanning) return

		setIsScanning(true)
		const barcode = event.nativeEvent.codeStringValue
		console.log('Сканирован штрихкод:', barcode)

		try {
			const response = await axiosAuth.get<IProduct>(
				`/Products/barcode/${barcode}`
			)
			const product = response.data

			if (product) {
				setSelectedProduct(product)
				setIsModalVisible(true)
			} else {
				setIsModalVisible(true)
				setIsProductNotFound(true)
			}
		} catch (error) {
			setIsModalVisible(true)
			setIsProductNotFound(true)
		} finally {
			setTimeout(() => {
				isScanningRef.current = false
			}, 1000)
		}
	}

	if (!hasCameraPermission) {
		return (
			<Error
				title='Не удалось получить доступ к камере телефона'
				description='Пожалуйста, предоставьте доступ к камере телефона'
				children={
					<TouchableOpacity onPress={handleOpenSettings}>
						<Text>Перейти к настройкам</Text>
					</TouchableOpacity>
				}
			/>
		)
	}

	return (
		<View className='flex-1 relative bg-black'>
			<TouchableOpacity
				className='absolute z-10 bg-black/50 p-2 rounded-full'
				style={{ top: 20, left: 20 }}
				onPress={() => navigation.goBack()}
			>
				<Image
					className='w-6 h-6'
					source={require('../../assets/icons/back.png')}
				/>
			</TouchableOpacity>
			<Camera
				ref={cameraRef}
				cameraType={CameraType.Back}
				flashMode='auto'
				className='flex-1 z-0'
				scanBarcode={true}
				onReadCode={handleBarcodeRead}
				showFrame={true}
				laserColor='red'
				frameColor='white'
				focusMode='on'
				zoomMode='on'
				ratioOverlay='16:9'
				ratioOverlayColor='#ffffff77'
				pointerEvents='box-none'
			/>
			<View className='absolute bottom-20 left-5 flex justify-center items-center z-20'>
				<View className='bg-white/80 p-6 rounded-xl'>
					<Text className='text-black text-lg font-medium text-center'>
						Поднесите камеру к штрих-коду
					</Text>
				</View>
			</View>

			<Modal
				animationType='slide'
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => {
					setIsModalVisible(false)
					setSelectedProduct(null)
					setIsProductNotFound(false)
					navigation.goBack()
				}}
			>
				{selectedProduct || isProductNotFound ? (
					isProductNotFound ? (
						<View className='flex-1 justify-center items-center'>
							<View className='bg-white p-6 rounded-lg'>
								<Text className='text-lg font-medium mb-4'>
									Продукт не найден
								</Text>
								<Text className='mb-6'>Хотите добавить новый продукт?</Text>
								<View className='flex-row justify-between items-center gap-2'>
									<TouchableOpacity
										onPress={() => {
											setIsModalVisible(false)
											setIsProductNotFound(false)
											navigation.navigate('AddProductPage')
										}}
										className='bg-green-500 px-6 py-3 rounded-md items-center text-center w-[110px]'
									>
										<Text className='text-white text-xs text-center'>
											Добавить
										</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											setIsModalVisible(false)
											setIsProductNotFound(false)
											navigation.goBack()
										}}
										className='bg-red-500 px-6 py-3 rounded-md w-[110px]'
									>
										<Text className='text-white text-xs text-center'>Нет</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					) : (
						selectedProduct && (
							<AddProductModal
								product={selectedProduct}
								onClose={() => {
									setIsModalVisible(false)
									setSelectedProduct(null)
									navigation.goBack()
								}}
							/>
						)
					)
				) : null}
			</Modal>
		</View>
	)
}
