'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatInputProps {
  onSubmit: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSubmit, disabled = false, placeholder = 'Type a message...' }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMessage = message.trim()
    
    // Basic sanitization - remove potentially harmful characters
    const sanitizedMessage = trimmedMessage
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .substring(0, 1000) // Limit length
    
    if (sanitizedMessage && !disabled) {
      onSubmit(sanitizedMessage)
      setMessage('')
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          className="flex-1 min-h-[44px] max-h-[150px] p-3 pr-12 bg-warm-linen/30 border border-accent-warm-light/20 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-accent-warm/20 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ overflow: 'hidden' }}
        />
        <motion.button
          type="submit"
          id="send-button"
          disabled={!message.trim() || disabled}
          className="absolute bottom-2 right-2 p-2 text-accent-warm hover:text-accent-warm-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          whileTap={{ scale: 0.95 }}
          aria-label="Gửi tin nhắn"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
    </form>
  )
} 