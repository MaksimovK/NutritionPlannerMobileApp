import { RouteProp, useRoute } from '@react-navigation/native'
import { TypeRootStackParamList } from '../../navigation/navigation.types.ts'

export const useTypedRoute = <T extends keyof TypeRootStackParamList>() => {
	return useRoute<RouteProp<TypeRootStackParamList, T>>()
}
