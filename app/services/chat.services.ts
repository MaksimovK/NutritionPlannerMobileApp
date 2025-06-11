import { axiosAuth } from '../api/interceptor'
import { IChatMessage } from '../types/chat.types'
import { IUser } from '../types/user.types'

class ChatService {
	private BASE_URL = 'Chat'

	async sendMessage(message: IChatMessage) {
		const response = await axiosAuth.post<IChatMessage>(
			`${this.BASE_URL}/send`,
			message
		)
		return response.data
	}

	async getConversation(userId1: string, userId2: string) {
		const response = await axiosAuth.get<IChatMessage[]>(
			`${this.BASE_URL}/conversation/${userId1}/${userId2}`
		)
		return response.data
	}

	async markAsRead(messageId: string) {
		await axiosAuth.put(`${this.BASE_URL}/read/${messageId}`)
	}

	async getDietitians() {
		const response = await axiosAuth.get<IUser[]>(`${this.BASE_URL}/dietitians`)
		return response.data
	}

	async getClients(dietitianId: string) {
		const response = await axiosAuth.get<IUser[]>(
			`${this.BASE_URL}/clients/${dietitianId}`
		)
		return response.data
	}
}

export const chatService = new ChatService()
