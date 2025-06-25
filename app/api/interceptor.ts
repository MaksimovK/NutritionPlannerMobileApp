import axios, { CreateAxiosDefaults } from 'axios'
import { useAuthTokenStore } from '../store/token'

const BASE_URL = 'http://192.168.120.35:7086/api'

export const options: CreateAxiosDefaults = {
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosAuth = axios.create(options)

axiosAuth.interceptors.request.use((config: any) => {
	const token = useAuthTokenStore.getState().token
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`
	}

	return config
})

// axiosClassic.interceptors.response.use(
// 	response => response,
// 	error => {
// 		console.error('Axios classic error:', error.message)
// 		if (error.response) {
// 			console.error('Response status:', error.response.status)
// 			console.error('Response data:', error.response.data)
// 		}
// 		return Promise.reject(error)
// 	}
// )

// axiosAuth.interceptors.response.use(
// 	response => response,
// 	error => {
// 		console.error('Axios auth error:', error.message)
// 		if (error.response) {
// 			console.error('Response status:', error.response.status)
// 			console.error('Response data:', error.response.data)
// 		}
// 		return Promise.reject(error)
// 	}
// )

export { axiosAuth, axiosClassic }
