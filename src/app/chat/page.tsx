'use client'

import { ChatContainer } from '@/components/chat/ChatContainer'

export default function ChatPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="h-[calc(100vh-8rem)]">
        <ChatContainer />
      </div>
    </main>
  )
} 