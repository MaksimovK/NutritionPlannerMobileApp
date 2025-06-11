export interface IChatMessage {
	id: string
	senderId: string
	receiverId: string
	content: string
	sentAt: string
	isRead: boolean
}
