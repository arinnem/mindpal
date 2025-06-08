'use client'
import { useEffect } from 'react'
import { setupStagewise } from '@/lib/stagewise'

export function StagewiseClient() {
  useEffect(() => {
    setupStagewise()
  }, [])
  return null
} 