'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage as ChatMessageComponent } from './ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { useChatStore } from '@/store/chat'
import { ChatService } from '@/lib/chat/gemini'
import type { ChatMessage } from '@/lib/chat/gemini'
import { AlertCircle, RefreshCw } from 'lucide-react'

// Initialize chat service
const chatService = new ChatService()

export function ChatContainer() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, error, addMessage, setLoading, setError, resetChat } = useChatStore()

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (content: string) => {
    try {
      // Validate content
      if (!content.trim()) {
        setError('Tin nhắn không được để trống')
        return
      }

      // Add user message
      const userMessage: ChatMessage = {
        id: crypto.randomUUID?.() || `msg-${Date.now()}-${Math.random()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      }
      addMessage(userMessage)

      // Set loading state
      setLoading(true)
      setError(null)

      // Get AI response
      const response = await chatService.sendMessage(content)
      addMessage(response.message)

      // If it's a crisis message, we might want to do additional handling
      if (response.isCrisis) {
        // TODO: Implement crisis handling (e.g., notify parents, counselors)
        console.log('Crisis detected:', response.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn')
    } finally {
      setLoading(false)
    }
  }

  const handleResetChat = () => {
    resetChat()
    chatService.resetChat()
  }

  return (
    <div className="flex flex-col h-full bg-warm-linen/50 rounded-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-accent-warm-light/20">
        <h2 className="text-lg font-semibold text-warm-charcoal">Trò chuyện</h2>
        <button
          onClick={handleResetChat}
          className="p-2 text-accent-warm hover:text-accent-warm-dark transition-colors"
          title="Bắt đầu cuộc trò chuyện mới"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {messages.map((message) => (
            <ChatMessageComponent
              key={message.id}
              message={message}
            />
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start mb-4"
          >
            <div className="bg-white border border-accent-warm-light/20 rounded-2xl px-4 py-2">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-accent-warm rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-accent-warm rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-accent-warm rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-accent-warm-light/20">
        <ChatInput
          onSubmit={handleSendMessage}
          disabled={isLoading}
          placeholder="Viết tin nhắn của bạn..."
        />
      </div>
    </div>
  )
} 