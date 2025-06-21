import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { IProduct } from '../../types/product.types'

interface IProductStore {
	products: IProduct[]
	addProduct: (product: IProduct) => void
	removeProduct: (id: number) => void
	clearProducts: () => void
}

export const useProductStore = create<IProductStore>()(
	persist(
		set => ({
			products: [],
			addProduct: product =>
				set(state => {
					const isProductInStore = state.products.some(p => p.id === product.id)
					if (isProductInStore) {
						console.log(`Продукт с id ${product.id} уже существует в store.`)
						return state
					}

					console.log(`Добавление продукта с id ${product.id} в store.`)
					return { products: [...state.products, product] }
				}),

			removeProduct: id =>
				set(state => {
					const productExists = state.products.some(
						product => product.id === id
					)
					if (!productExists) {
						console.log(`Продукт с id ${id} не найден в store.`)
						return state
					}

					console.log(`Удаление продукта с id ${id} из store.`)
					const filteredProducts = state.products.filter(
						product => product.id !== id
					)
					return { products: filteredProducts }
				}),
			clearProducts: () => set(() => ({ products: [] }))
		}),
		{
			name: 'product-store',
			version: 1,
			storage: createJSONStorage(() => AsyncStorage)
		}
	)
)
