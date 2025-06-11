import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient
} from '@tanstack/react-query'
import { productService } from '../../services/product.services'
import { IProduct } from '../../types/product.types'

const ISSUE_SIZE = 10

export const useGetAllProducts = () => {
	const fetchProducts = ({ pageParam = 0 }) => {
		return productService.getAll({ size: ISSUE_SIZE, page: pageParam })
	}

	const result = useInfiniteQuery({
		queryKey: ['products'],
		queryFn: fetchProducts,
		initialPageParam: 0,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.length < 10 ? undefined : allPages.length + 1
		}
	})

	return { ...result }
}

export function useCreateProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['createProduct'],
		mutationFn: async (data: IProduct) => {
			return productService.create(data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
			queryClient.invalidateQueries({ queryKey: ['search-products'] })
		}
	})
}

export function useGetProductByIds(ids: number[]) {
	return useQuery({
		queryKey: ['products', ids],
		queryFn: async () => productService.getByIds(ids)
	})
}

export function useGetProductById(id: number) {
	return useQuery<IProduct>({
		queryKey: ['product', id],
		queryFn: async () => productService.getById(id)
	})
}

export function useSearchProducts(name: string) {
	return useQuery({
		queryKey: ['search-products', name],
		queryFn: async () => productService.search(name)
	})
}

export function useDeleteProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['deleteProduct'],
		mutationFn: (id: number) => productService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
			queryClient.invalidateQueries({ queryKey: ['search-products'] })
		}
	})
}

export function useUpdateProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['updateProduct'],
		mutationFn: (data: IProduct) => productService.update(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products'] })
			queryClient.invalidateQueries({ queryKey: ['search-products'] })
			queryClient.invalidateQueries({ queryKey: ['unapproved-products'] })
		}
	})
}

export function useGetProductByBarCode(barcode: string) {
	return useQuery({
		queryKey: ['product', barcode],
		queryFn: async () => productService.getByBarcode(barcode)
	})
}

export function useApproveProduct() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['approveProduct'],
		mutationFn: (id: number) => productService.approveProduct(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['unapprovedProducts'] })
		}
	})
}

export function useUnapprovedProducts() {
	return useQuery({
		queryKey: ['unapprovedProducts'],
		queryFn: async () => {
			return productService.getUnapproved()
		}
	})
}
