import { Mood, MoodOption } from '@/types';

export const APP_NAME = "Bạn thương";

export const COLORS = {
  background: '#FDFBF6',
  text: '#4E443C',
  primary: '#DAB894',
  secondary: '#B4C6A6',
};

export const MOOD_OPTIONS: MoodOption[] = [
  { id: Mood.Happy, label: 'Vui vẻ', icon: '😊', color: 'text-yellow-500', desaturatedColor: 'text-yellow-300' },
  { id: Mood.Neutral, label: 'Bình thường', icon: '🙂', color: 'text-blue-500', desaturatedColor: 'text-blue-300' },
  { id: Mood.Sad, label: 'Buồn', icon: '😢', color: 'text-indigo-500', desaturatedColor: 'text-indigo-300' },
  { id: Mood.Tired, label: 'Mệt mỏi', icon: '😩', color: 'text-purple-500', desaturatedColor: 'text-purple-300' },
  { id: Mood.Confused, label: 'Rối bời', icon: '🤯', color: 'text-pink-500', desaturatedColor: 'text-pink-300' },
];

export const VIETNAMESE_HOTLINES = [
  { name: "Tổng đài quốc gia bảo vệ trẻ em", number: "111" },
  { name: "Đường dây nóng Ngày mai", number: "096 306 1414 (Hà Nội) / 096 273 3055 (TP.HCM)"},
  { name: "Trung tâm tư vấn pháp luật (Hội Liên hiệp Phụ nữ Việt Nam)", number: "1900 545489" }
];

export const CRISIS_MESSAGE_TITLE = "Cảm ơn bạn đã chia sẻ điều này.";
export const CRISIS_MESSAGE_BODY = "Sự an toàn của bạn là quan trọng nhất ngay lúc này. Dưới đây là những số điện thoại bạn có thể gọi ngay để được hỗ trợ khẩn cấp:";

export const DEFAULT_GEMINI_TEXT_MODEL = "gemini-1.5-flash";
export const DEFAULT_GEMINI_IMAGE_MODEL = "imagen-3";

export const CRISIS_KEYWORDS = [
  'tự tử', 'tự sát', 'chết', 'không muốn sống', 'kết thúc', 'biến mất', 'nhảy lầu', 'uống thuốc', 'rạch tay',
  'kill myself', 'suicide', 'end my life', 'want to die'
];