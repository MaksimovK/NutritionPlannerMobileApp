export interface IProduct {
	id: number
	name: string
	weight: number
	calories: number
	protein: number
	fat: number
	carbohydrates: number
	barcode: string
	isApproved: boolean // Добавляем новое поле
	createdByUserId?: string // Добавляем новое поле
}
