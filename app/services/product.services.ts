import { axiosAuth } from '../api/interceptor'
import { IProduct, ProductFilter } from '../types/product.types'

class ProductServices {
	private BASE_URL = 'Products'

	async getAll({
		page,
		size,
		highProtein,
		lowCalorie,
		highCalorie,
		lowCarb,
		highCarb,
		lowFat,
		highFat
	}: {
		size: number
		page: number
		highProtein?: boolean
		lowCalorie?: boolean
		highCalorie?: boolean
		lowCarb?: boolean
		highCarb?: boolean
		lowFat?: boolean
		highFat?: boolean
	}) {
		const response = await axiosAuth.get<IProduct[]>(`${this.BASE_URL}`, {
			params: {
				page,
				size,
				highProtein,
				lowCalorie,
				highCalorie,
				lowCarb,
				highCarb,
				lowFat,
				highFat
			}
		})
		return response.data
	}

	async getByIds(ids: number[]) {
		const response = await axiosAuth.post<IProduct[]>(
			`${this.BASE_URL}/by-ids`,
			ids
		)
		return response.data
	}

	async getById(id: number) {
		const response = await axiosAuth.get<IProduct>(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async create(data: IProduct) {
		const response = await axiosAuth.post<number>(`${this.BASE_URL}`, data)
		return response.data
	}

	async search(name: string, filter?: ProductFilter) {
		const response = await axiosAuth.get<IProduct[]>(
			`${this.BASE_URL}/search`,
			{
				params: {
					name,
					highProtein: filter?.highProtein,
					lowCalorie: filter?.lowCalorie,
					highCalorie: filter?.highCalorie,
					lowCarb: filter?.lowCarb,
					highCarb: filter?.highCarb,
					lowFat: filter?.lowFat,
					highFat: filter?.highFat
				}
			}
		)
		return response.data
	}

	async delete(id: number) {
		const response = await axiosAuth.delete(`${this.BASE_URL}/${id}`)
		return response.data
	}

	async update(data: IProduct) {
		const response = await axiosAuth.put(`${this.BASE_URL}/${data.id}`, data)
		return response.data
	}

	async getByBarcode(barcode: string) {
		const response = await axiosAuth.get<IProduct>(
			`${this.BASE_URL}/barcode/${barcode}`
		)
		return response.data
	}

	async approveProduct(id: number) {
		const response = await axiosAuth.put(`${this.BASE_URL}/${id}/approve`)
		return response.data
	}

	async getUnapproved() {
		const response = await axiosAuth.get<IProduct[]>(
			`${this.BASE_URL}/unapproved`
		)
		return response.data
	}
}

export const productService = new ProductServices()
