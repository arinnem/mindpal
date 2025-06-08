'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { AlertCircle } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '@/lib/chat/gemini'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const isCrisis = message.isCrisis

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-accent-warm text-warm-charcoal'
            : isCrisis
            ? 'bg-red-50 border border-red-200'
            : 'bg-white border border-accent-warm-light/20'
        }`}
      >
        {/* Crisis Alert */}
        {isCrisis && (
          <div 
            className="flex items-center gap-2 text-red-600 mb-2"
            role="alert"
            aria-label="Emergency notification"
          >
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Thông báo khẩn cấp</span>
          </div>
        )}

        {/* Message Content */}
        <div className="prose prose-sm max-w-none">
          {message.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Timestamp */}
        <div
          className={`text-xs mt-2 ${
            isUser ? 'text-warm-charcoal/80' : 'text-warm-charcoal/60'
          }`}
        >
          {format(message.timestamp, 'HH:mm', { locale: vi })}
        </div>
      </div>
    </motion.div>
  )
} 