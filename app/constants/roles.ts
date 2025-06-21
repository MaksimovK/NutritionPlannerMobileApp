import { Role } from '../types/user.types'

export const ROLE_TITLES: Record<Role, string> = {
	[Role.User]: 'Диетологи',
	[Role.Admin]: 'Диетологи',
	[Role.Dietitian]: 'Ваши клиенты'
}

export const EMPTY_TEXT: Record<Role, string> = {
	[Role.User]: 'Нет доступных диетологов',
	[Role.Admin]: 'Нет доступных диетологов',
	[Role.Dietitian]: 'У вас пока нет клиентов'
}
