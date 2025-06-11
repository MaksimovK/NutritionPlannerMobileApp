import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import React, { useEffect, useRef, useState } from 'react'
import {
	FlatList,
	Image,
	KeyboardAvoidingView,
	Modal,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View
} from 'react-native'
import {
	useConversation,
	useMarkAsRead,
	useSendMessage
} from '../../hooks/queries/chat.queries'
import { IChatMessage } from '../../types/chat.types'
import { IUser } from '../../types/user.types'
import ReportsPage from './ReportsPage'

const ConversationScreen = ({
	currentUserId,
	otherUser,
	onBack,
	isDietitian
}: {
	currentUserId: string
	otherUser: IUser
	onBack: () => void
	isDietitian: boolean
}) => {
	const [message, setMessage] = useState('')
	const { data: messages, refetch } = useConversation(
		currentUserId,
		otherUser.id
	)
	const { mutate: sendMessage } = useSendMessage()
	const { mutate: markAsRead } = useMarkAsRead()
	const flatListRef = useRef<FlatList>(null)

	useEffect(() => {
		if (!messages) return

		const unreadMessages = messages.filter(
			m => m.senderId === otherUser.id && !m.isRead
		)

		unreadMessages.forEach(msg => {
			markAsRead(msg.id)
		})
	}, [messages])

	useEffect(() => {
		if (messages && messages.length > 0) {
			setTimeout(() => {
				flatListRef.current?.scrollToEnd({ animated: true })
			}, 100)
		}
	}, [messages])
	const [showReports, setShowReports] = useState(false)

	const handleSend = () => {
		if (!message.trim()) return

		const newMessage: Omit<IChatMessage, 'id'> = {
			senderId: currentUserId,
			receiverId: otherUser.id,
			content: message.trim(),
			sentAt: new Date().toISOString(),
			isRead: false
		}

		sendMessage(newMessage as IChatMessage)
		setMessage('')
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={90}
		>
			<View style={styles.header}>
				<TouchableOpacity onPress={onBack}>
					<Image
						className='w-6 h-6'
						source={require('../../assets/icons/back.png')}
					/>
				</TouchableOpacity>
				<View className='flex-row items-center ml-2'>
					<Image
						className='w-8 h-8'
						source={require('../../assets/icons/logo.png')}
					/>
					<Text style={styles.headerName} className='ml-2'>
						{otherUser.name}
					</Text>
				</View>

				{isDietitian && (
					<TouchableOpacity
						style={styles.reportsButton}
						onPress={() => setShowReports(true)}
					>
						<Image
							source={require('../../assets/icons/diagram.png')}
							style={styles.reportsIcon}
						/>
					</TouchableOpacity>
				)}
			</View>

			<FlatList
				ref={flatListRef}
				data={messages}
				keyExtractor={item => item.id}
				contentContainerStyle={styles.messagesContainer}
				onContentSizeChange={() =>
					flatListRef.current?.scrollToEnd({ animated: true })
				}
				renderItem={({ item }) => (
					<View
						style={[
							styles.messageBubble,
							item.senderId === currentUserId
								? styles.myMessage
								: styles.theirMessage
						]}
					>
						<Text style={styles.messageText}>{item.content}</Text>
						<Text style={styles.messageTime}>
							{format(new Date(item.sentAt), 'HH:mm', { locale: ru })}
						</Text>
					</View>
				)}
			/>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					placeholderTextColor={'black'}
					placeholder='Напишите сообщение...'
					multiline
				/>
				<TouchableOpacity style={styles.sendButton} onPress={handleSend}>
					<Text style={styles.sendButtonText}>Отправить</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={showReports}
				animationType='slide'
				onRequestClose={() => setShowReports(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalHeader}>
						<Text style={styles.modalTitle}>Отчёты {otherUser.name}</Text>
						<TouchableOpacity
							style={styles.closeButton}
							onPress={() => setShowReports(false)}
						>
							<Image
								source={require('../../assets/icons/close.png')}
								style={styles.closeIcon}
							/>
						</TouchableOpacity>
					</View>
					<ReportsPage forUserId={otherUser.id} />
				</View>
			</Modal>
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f5f5f5'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	backButton: {
		fontSize: 24,
		marginRight: 15,
		color: '#3498db'
	},
	headerName: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	messagesContainer: {
		padding: 16,
		paddingBottom: 80
	},
	messageBubble: {
		maxWidth: '80%',
		padding: 12,
		borderRadius: 12,
		marginBottom: 8
	},
	myMessage: {
		alignSelf: 'flex-end',
		backgroundColor: '#dcf8c6',
		borderTopRightRadius: 0
	},
	theirMessage: {
		alignSelf: 'flex-start',
		backgroundColor: '#fff',
		borderTopLeftRadius: 0
	},
	messageText: {
		fontSize: 16
	},
	messageTime: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
		alignSelf: 'flex-end'
	},
	inputContainer: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#eee',
		alignItems: 'flex-end'
	},
	input: {
		flex: 1,
		minHeight: 40,
		maxHeight: 120,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: '#f0f0f0',
		borderRadius: 20,
		marginRight: 10
	},
	sendButton: {
		backgroundColor: '#3498db',
		borderRadius: 20,
		paddingVertical: 10,
		paddingHorizontal: 20
	},
	sendButtonText: {
		color: '#fff',
		fontWeight: 'bold'
	},
	reportsButton: {
		position: 'absolute',
		right: 16,
		padding: 8
	},
	reportsIcon: {
		width: 24,
		height: 24,
		tintColor: '#3498db'
	},
	modalContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	closeButton: {
		padding: 8
	},
	closeIcon: {
		width: 24,
		height: 24,
		tintColor: '#777'
	}
})

export default ConversationScreen
