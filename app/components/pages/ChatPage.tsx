import React, { useState } from 'react'
import {
	FlatList,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from 'react-native'
import { useTypedNavigation } from '../../hooks/navigation/useTypedNavigation'
import { useClients, useDietitians } from '../../hooks/queries/chat.queries'
import { useAuthTokenStore } from '../../store/token'
import { IUser } from '../../types/user.types'
import ConversationScreen from './ConversationScreen'

export default function ChatPage() {
	const navigation = useTypedNavigation()
	const { userId, userRole } = useAuthTokenStore()
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

	// Получаем данные в зависимости от роли
	const { data: dietitians } = useDietitians()
	const { data: clients } = useClients(userId)

	const users = userRole === 'User' ? dietitians : clients

	if (selectedUser) {
		return (
			<ConversationScreen
				currentUserId={userId}
				otherUser={selectedUser}
				onBack={() => setSelectedUser(null)}
				isDietitian={userRole === 'Dietitian'}
			/>
		)
	}

	return (
		<View style={styles.container}>
			<View className='flex-row items-center justify-center'>
				<TouchableOpacity
					className='mr-auto'
					onPress={() => navigation.goBack()}
				>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/back.png')}
					/>
				</TouchableOpacity>
				<Text style={styles.title} className='mr-auto'>
					{userRole === 'User' ? 'Диетологи' : 'Ваши клиенты'}
				</Text>
			</View>

			<FlatList
				data={users}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						className='flex-row items-center space-x-2'
						style={styles.userItem}
						onPress={() => setSelectedUser(item)}
					>
						<Image
							className='w-11 h-11 bg-white rounded-full border border-gray-300 shadow-xl shadow-black'
							source={require('../../assets/icons/logo.png')}
						/>
						<View>
							<Text style={styles.userName}>{item.name}</Text>
							<Text style={styles.userEmail}>{item.email}</Text>
						</View>
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					<Text style={styles.emptyText}>
						{userRole === 'User'
							? 'Нет доступных диетологов'
							: 'У вас пока нет клиентов'}
					</Text>
				}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: '#fff'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#333'
	},
	userItem: {
		padding: 16,
		paddingHorizontal: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	userName: {
		fontSize: 18,
		fontWeight: '500'
	},
	userEmail: {
		fontSize: 14,
		color: '#666'
	},
	emptyText: {
		textAlign: 'center',
		marginTop: 20,
		fontSize: 16,
		color: '#888'
	}
})
