'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { AnimatePresence } from 'framer-motion'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        value={{
          light: 'light',
          dark: 'dark',
        }}
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </ThemeProvider>
    </SessionProvider>
  )
} 