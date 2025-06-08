import { create } from 'zustand'
import { ChatMessage } from '@/lib/chat/gemini'

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  addMessage: (message: ChatMessage) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  resetChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setLoading: (isLoading) =>
    set(() => ({
      isLoading,
    })),

  setError: (error) =>
    set(() => ({
      error,
    })),

  resetChat: () =>
    set(() => ({
      messages: [],
      isLoading: false,
      error: null,
    })),
})) 