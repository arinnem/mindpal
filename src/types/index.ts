export enum Mood {
    Happy = 'Vui vẻ',
    Neutral = 'Bình thường',
    Sad = 'Buồn',
    Tired = 'Mệt mỏi',
    Confused = 'Rối bời',
  }
  
  export interface MoodOption {
    id: Mood;
    label: string;
    icon: string; // Emoji
    color: string; // Tailwind color class for filled state
    desaturatedColor: string; // Tailwind color class for desaturated state
  }
  
  export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    metadata?: Record<string, any>;
  }
  
  export interface JournalEntry {
    id: string;
    title: string;
    content: string;
    date: Date;
    mood?: Mood;
    aiPrompt?: string;
  }
  
  export interface ThoughtMonster {
    id: string;
    userInput: string;
    name: string;
    description: string;
    imageUrl: string;
    tamingProgress: number;
    createdAt: Date;
  }
  
  export interface CopingStrategy {
    id: string;
    title: string;
    description: string;
    category: string;
    imageUrl?: string;
    effectiveness?: 'positive' | 'negative' | null;
  }
  
  export interface GroundingChunk {
    web?: {
      uri?: string;
      title?: string;
    };
    retrievalQuery?: string;
    text?: string;
  }