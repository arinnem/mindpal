'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatInput } from '../chat/ChatInput'
import { Heart, MessageCircle, Sparkles } from 'lucide-react'

const moods = [
  { 
    id: 'happy', 
    emoji: '😊', 
    label: 'Vui vẻ',
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    icon: Sparkles
  },
  { 
    id: 'neutral', 
    emoji: '🙂', 
    label: 'Bình thường',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    icon: MessageCircle
  },
  { 
    id: 'sad', 
    emoji: '😢', 
    label: 'Buồn',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    icon: Heart
  },
  { 
    id: 'tired', 
    emoji: '😩', 
    label: 'Mệt mỏi',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    icon: Heart
  },
  { 
    id: 'confused', 
    emoji: '🤯', 
    label: 'Rối bời',
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    icon: MessageCircle
  },
]

const moodPlaceholders = {
  happy: 'Hãy kể cho tớ nghe điều gì làm bạn vui vẻ hôm nay nhé!',
  neutral: 'Mình cùng kể cho nhau nghe vài câu chuyện nhỏ, cho ngày hôm nay thêm dịu dàng nhé?',
  sad: 'Tớ ở đây lắng nghe. Cứ kể ra cho nhẹ lòng nhé.',
  tired: 'Có vẻ như bạn đang mệt mỏi. Hãy chia sẻ với tớ để được thư giãn nhé.',
  confused: 'Đôi khi cảm thấy rối bời là điều bình thường. Hãy cùng tớ tìm cách giải tỏa nhé.',
}

interface WelcomeNookProps {
  selectedMood: string | null
  onMoodSelect: (mood: string) => void
}

export function WelcomeNook({ selectedMood, onMoodSelect }: WelcomeNookProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleMessageSubmit = (message: string) => {
    console.log('Message submitted:', message)
    setIsChatOpen(true)
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!isChatOpen ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-12"
          >
            {/* Welcome Message */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-be-vietnam font-bold text-warm-charcoal"
              >
                Chào bạn thương của tớ
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-warm-charcoal/80 max-w-2xl mx-auto"
              >
                Mong là hôm nay mọi điều đến với bạn đều thật hiền
              </motion.p>
            </div>

            {/* Mood Selection */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-medium text-warm-charcoal">
                Hôm nay bạn cảm thấy thế nào?
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-3xl mx-auto">
                {moods.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onMoodSelect(mood.id)}
                      className={`
                        flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all
                        ${mood.color}
                        ${selectedMood === mood.id ? 'ring-2 ring-accent-warm ring-offset-2' : ''}
                      `}
                      aria-label={mood.label}
                    >
                      <span className="text-3xl" role="img" aria-label={mood.label}>
                        {mood.emoji}
                      </span>
                      <span className="font-medium text-warm-charcoal">{mood.label}</span>
                      <Icon className="w-5 h-5 text-warm-charcoal/60" />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Chat Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <ChatInput
                placeholder={
                  selectedMood
                    ? moodPlaceholders[selectedMood as keyof typeof moodPlaceholders]
                    : moodPlaceholders.neutral
                }
                onSubmit={handleMessageSubmit}
                disabled={!selectedMood}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-8"
          >
            <div className="h-[60vh] overflow-y-auto mb-4 rounded-2xl bg-warm-linen/30 p-4">
              {/* Chat messages will go here */}
            </div>
            <ChatInput
              placeholder="Viết tin nhắn của bạn..."
              onSubmit={handleMessageSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 