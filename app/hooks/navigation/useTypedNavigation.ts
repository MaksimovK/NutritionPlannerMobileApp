import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { TypeRootStackParamList } from '../../navigation/navigation.types'

export const useTypedNavigation = () => {
	return useNavigation<NativeStackNavigationProp<TypeRootStackParamList>>()
}
