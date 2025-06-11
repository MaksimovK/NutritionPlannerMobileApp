import axios, { CreateAxiosDefaults } from 'axios'
import { useAuthTokenStore } from '../store/token'

const BASE_URL = 'http://192.168.0.195:8000/api'

export const options: CreateAxiosDefaults = {
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)

const axiosAuth = axios.create(options)

axiosAuth.interceptors.request.use(config => {
	const token = useAuthTokenStore.getState().token
	const userId = useAuthTokenStore.getState().userId
	const role = useAuthTokenStore.getState().userRole

	if (token && userId) {
		config.headers['X-User-Id'] = userId
		config.headers['X-Auth-Token'] = token
		config.headers['X-User-Role'] = role
	}

	console.log('user-id', userId)
	console.log('token', token)
	console.log('role', role)

	return config
})

export { axiosAuth, axiosClassic }
