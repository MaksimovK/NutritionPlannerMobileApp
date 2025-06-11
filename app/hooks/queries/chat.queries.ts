import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatService } from '../../services/chat.services'
import { IChatMessage } from '../../types/chat.types'

export const useSendMessage = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (message: IChatMessage) => chatService.sendMessage(message),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ['conversation', variables.senderId, variables.receiverId]
			})
		}
	})
}

export const useConversation = (userId1: string, userId2: string) => {
	return useQuery({
		queryKey: ['conversation', userId1, userId2],
		queryFn: () => chatService.getConversation(userId1, userId2),
		enabled: !!userId1 && !!userId2
	})
}

export const useMarkAsRead = () => {
	return useMutation({
		mutationFn: (messageId: string) => chatService.markAsRead(messageId)
	})
}

export const useDietitians = () => {
	return useQuery({
		queryKey: ['dietitians'],
		queryFn: () => chatService.getDietitians()
	})
}

export const useClients = (dietitianId: string) => {
	return useQuery({
		queryKey: ['clients', dietitianId],
		queryFn: () => chatService.getClients(dietitianId),
		enabled: !!dietitianId
	})
}
