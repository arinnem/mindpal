import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

// Initialize the Gemini API
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY env var is not set')
}
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

// Chat model configuration
const model = genAI.getGenerativeModel({
  model: 'gemini-pro',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
})

// System prompt for the AI
const SYSTEM_PROMPT = `Bạn là một người bạn thân thiện và thấu hiểu, đang trò chuyện với học sinh Việt Nam. 
Hãy luôn:
1. Thể hiện sự quan tâm và thấu hiểu
2. Sử dụng ngôn ngữ phù hợp với lứa tuổi học sinh
3. Khuyến khích và động viên một cách tích cực
4. Hướng dẫn nhẹ nhàng khi cần thiết
5. Tôn trọng cảm xúc và suy nghĩ của người đối thoại

Nếu phát hiện dấu hiệu khủng hoảng (như tự làm hại bản thân, ý định tự tử, bạo lực), 
hãy trả lời với thông điệp khủng hoảng và đánh dấu tin nhắn đó là khủng hoảng.`

// Crisis detection prompt
const CRISIS_DETECTION_PROMPT = `Hãy phân tích tin nhắn sau và xác định xem có dấu hiệu khủng hoảng không.
Dấu hiệu khủng hoảng bao gồm:
- Ý định tự làm hại bản thân
- Ý định tự tử
- Bạo lực nghiêm trọng
- Lạm dụng chất kích thích
- Bị bạo hành hoặc bắt nạt nghiêm trọng

Trả lời với một số từ 0 đến 1, trong đó:
0: Không có dấu hiệu khủng hoảng
1: Có dấu hiệu khủng hoảng rõ ràng

Tin nhắn cần phân tích: `

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isCrisis?: boolean
}

export interface ChatResponse {
  message: ChatMessage
  isCrisis: boolean
}

export class ChatService {
  private chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  })

  private async detectCrisis(message: string): Promise<boolean> {
    try {
      const result = await model.generateContent(
        `${CRISIS_DETECTION_PROMPT}\n---\n${message}\n---`
      )
      const response = await result.response
      const score = Number.parseFloat(response.text().trim())
      if (Number.isNaN(score)) return false
      return score >= parseFloat(process.env.CRISIS_DETECTION_THRESHOLD || '0.8')
    } catch (error) {
      console.error('Error detecting crisis:', error)
      return false
    }
  }

  private createCrisisResponse(): ChatMessage {
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Cảm ơn bạn đã chia sẻ điều này. Sự an toàn của bạn là quan trọng nhất ngay lúc này. 
Dưới đây là những số điện thoại bạn có thể gọi ngay để được hỗ trợ khẩn cấp:

- Tổng đài Quốc gia về Bảo vệ trẻ em: 111
- Đường dây nóng Bộ Y tế: 1900 9095
- Tổng đài Tư vấn & Hỗ trợ trẻ em: 1800 1567

Bạn không đơn độc, và luôn có người sẵn sàng lắng nghe và hỗ trợ bạn.`,
      timestamp: new Date(),
      isCrisis: true,
    }
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      // Detect crisis first
      const isCrisis = await this.detectCrisis(message)
      if (isCrisis) {
        return {
          message: this.createCrisisResponse(),
          isCrisis: true,
        }
      }

      // Normal chat flow
      const result = await this.chat.sendMessage(message)
      const response = await result.response
      const text = response.text()

      return {
        message: {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: text,
          timestamp: new Date(),
        },
        isCrisis: false,
      }
    } catch (error) {
      console.error('Error in chat:', error)
      throw new Error('Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.')
    }
  }

  // Reset chat history
  resetChat() {
    this.chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    })
  }
} 