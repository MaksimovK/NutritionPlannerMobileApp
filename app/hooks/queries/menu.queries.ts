import { useQuery } from '@tanstack/react-query'
import { menuService } from '../../services/menu.services'

export function useMenuByGoalId(id: number) {
	return useQuery({
		queryKey: ['menus'],
		queryFn: async () => menuService.getByGoalId(id)
	})
}
