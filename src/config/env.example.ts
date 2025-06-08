/**
 * Environment Variables Documentation
 * 
 * Copy this file to .env.local and fill in your values
 */

export const envExample = {
  // Database
  DATABASE_URL: 'postgresql://user:password@localhost:5432/ban_thuong',

  // NextAuth.js
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'your-nextauth-secret',

  // Google OAuth
  GOOGLE_CLIENT_ID: 'your-google-client-id',
  GOOGLE_CLIENT_SECRET: 'your-google-client-secret',

  // Google Gemini API
  GOOGLE_GEMINI_API_KEY: 'your-gemini-api-key',

  // Email (for notifications)
  SMTP_HOST: 'smtp.example.com',
  SMTP_PORT: '587',
  SMTP_USER: 'your-smtp-user',
  SMTP_PASSWORD: 'your-smtp-password',
  SMTP_FROM: 'noreply@banthuong.vn',

  // Storage (for user uploads)
  STORAGE_ACCESS_KEY: 'your-storage-access-key',
  STORAGE_SECRET_KEY: 'your-storage-secret-key',
  STORAGE_BUCKET: 'ban-thuong-uploads',
  STORAGE_REGION: 'ap-southeast-1',

  // Analytics
  NEXT_PUBLIC_GA_ID: 'your-ga-id',

  // Feature Flags
  ENABLE_AI_CHAT: 'true',
  ENABLE_JOURNAL: 'true',
  ENABLE_MONSTERS: 'true',
  ENABLE_EXPLORE: 'true',
  ENABLE_THERAPY: 'true',

  // Security
  CRISIS_DETECTION_THRESHOLD: '0.8',
  MAX_MESSAGE_LENGTH: '1000',
  RATE_LIMIT_WINDOW: '3600',
  RATE_LIMIT_MAX: '100',
}

/**
 * Environment Variables Type Definition
 */
export type Env = typeof envExample

/**
 * Environment Variables Validation
 * 
 * This type ensures that all required environment variables are defined
 */
export type EnvValidation = {
  [K in keyof Env]: string
}

/**
 * Usage:
 * 
 * 1. Copy this file to .env.local
 * 2. Fill in your values
 * 3. Import and use in your code:
 * 
 * import { env } from '@/config/env'
 * 
 * const apiKey = env.GOOGLE_GEMINI_API_KEY
 */ 