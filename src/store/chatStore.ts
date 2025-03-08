import { CHATPROPS, GROUPPROPS } from '@/types/chat'
import { create } from 'zustand'
import { useUserStore } from './userStore'


export interface ChatState {
	groups: GROUPPROPS[]
	chats: CHATPROPS[]
	previousUserIdRef: string
}

interface ChatActions {
	setGroups: (groups: ChatState['groups']) => void
	setChats: (chats: ChatState['chats']) => void
	deleteGroup: (gid: string) => void
	deleteChat: (cid: string) => void
	setPreviousUserIdRef: (previousUserIdRef: string) => void
}

const initialState: ChatState = {
	groups: [],
	chats: [],
	previousUserIdRef: '',
}

const useChatStore = create<ChatState & ChatActions>((set) => ({
	...initialState,
	setGroups: (groups: ChatState['groups']) => {
		set((state) => ({ ...state, groups }))
	},
	setChats: (chats: ChatState['chats']) => {
		set((state) => ({ ...state, chats }))
	},
	deleteGroup: (gid: GROUPPROPS['gid']) => {
		set((state) => ({
			...state,
			groups: state.groups.filter((group) => group.gid !== gid),
		}))
	},
	deleteChat: (cid: CHATPROPS['cid']) => {
		set((state) => ({ ...state, chats: state.chats.filter((chat) => chat.cid !== cid) }))
	},
	setPreviousUserIdRef: (previousUserIdRef: string | null) => {
		set((state) => ({ ...state, previousUserIdRef }))
	},
}))

export const selectUnseenGroupMessages = (gid: GROUPPROPS['gid']) => {
	const group = useChatStore.getState().groups.find((group) => group.gid === gid)
	const uid = useUserStore.getState().currentUser.user_id

	if (!group) {
		return null
	}

	return group.messages?.reduce((count, message) => {
		if (!message.seen.includes(uid) && message.user.uid !== uid) {
			return count + 1
		}
		return count
	}, 0)
}

export const selectUnseenChatMessages = (cid: CHATPROPS['cid']) => {
	const chat = useChatStore.getState().chats.find((chat) => chat.cid === cid)
	const uid = useAuthStoreSelectors.getState().currentUser.uid

	if (!chat) {
		return null
	}

	return chat.messages?.reduce((count, message) => {
		if (!message.seen.includes(uid) && message.user.uid !== uid) {
			return count + 1
		}
		return count
	}, 0)
}

// Selector to get total unseen messages for all groups
export const selectTotalUnseenGroupMessages = () => {
	const groups = useChatStore.getState().groups
	const uid = useAuthStoreSelectors.getState().currentUser.uid

	return groups.reduce((totalCount, group) => {
		const unseenMessages =
			group.messages?.reduce((count, message) => {
				if (!message.seen.includes(uid) && message.user.uid !== uid) {
					return count + 1
				}
				return count
			}, 0) || 0
		return totalCount + unseenMessages
	}, 0)
}

export const selectTotalUnseenChatMessages = () => {
	const chats = useChatStore.getState().chats
	const uid = useAuthStoreSelectors.getState().currentUser.uid

	return chats.reduce((totalCount, chat) => {
		const unseenMessages =
			chat.messages?.reduce((count, message) => {
				if (!message.seen.includes(uid) && message.user.uid !== uid) {
					return count + 1
				}
				return count
			}, 0) || 0
		return totalCount + unseenMessages
	}, 0)
}

export const selectGroupById = (gid: GROUPPROPS['gid']) => {
	return useChatStore.getState().groups.find((group) => group.gid === gid)
}

export const useChatStoreSelectors = createSelectors(useChatStore)
