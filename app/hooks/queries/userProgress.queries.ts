import { useQuery } from '@tanstack/react-query'
import { userProgressService } from '../../services/userProgress.services'

export function useUserProgresses(userId: string) {
	return useQuery({
		queryKey: ['userProgress', userId],
		queryFn: () => userProgressService.getByUserId(userId)
	})
}

export function useUserProgressByDate(userId: string, date: string) {
	return useQuery({
		queryKey: ['userProgress', userId, date],
		queryFn: () => userProgressService.getByUserIdAndDate(userId, date)
	})
}
