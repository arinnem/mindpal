'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { CopingStrategy, Mood } from '@/types';
import { Button } from '@/components/ui/Button';
import { geminiService } from '@/services/geminiService';
import { MOOD_OPTIONS } from '@/lib/constants';
import { ThumbsUp, ThumbsDown, Compass, Lightbulb } from 'lucide-react';

const initialStrategies: CopingStrategy[] = [
  { id: '1', title: 'Hít thở sâu 5 phút', description: 'Tìm một nơi yên tĩnh, nhắm mắt và tập trung vào hơi thở. Hít vào từ từ bằng mũi, giữ lại vài giây, rồi thở ra từ từ bằng miệng.', category: 'Thư giãn', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', effectiveness: null },
  { id: '2', title: 'Viết nhật ký biết ơn', description: 'Liệt kê 3-5 điều bạn cảm thấy biết ơn trong ngày hôm nay, dù là nhỏ nhặt. Điều này giúp thay đổi góc nhìn tích cực hơn.', category: 'Suy ngẫm', imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', effectiveness: null },
  { id: '3', title: 'Đi dạo ngắn', description: 'Ra ngoài hít thở không khí trong lành và vận động nhẹ nhàng. Chỉ 15-20 phút cũng có thể giúp cải thiện tâm trạng.', category: 'Vận động', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', effectiveness: null },
  { id: '4', title: 'Nghe nhạc yêu thích', description: 'Chọn những bài hát khiến bạn cảm thấy vui vẻ, thư thái hoặc được truyền cảm hứng. Âm nhạc có sức mạnh chữa lành tuyệt vời.', category: 'Giải trí', imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', effectiveness: null },
];

const StrategyCard: React.FC<{ strategy: CopingStrategy; onRate: (id: string, rating: 'positive' | 'negative') => void }> = ({ strategy, onRate }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-soft-clay/20 flex flex-col justify-between transform transition-all hover:shadow-xl hover:-translate-y-1">
      <div>
        {strategy.imageUrl && <img src={strategy.imageUrl} alt={strategy.title} className="w-full h-40 object-cover rounded-lg mb-4" />}
        <span className="text-xs px-2 py-0.5 bg-sage-green/20 text-sage-green font-medium rounded-full mb-2 inline-block">{strategy.category}</span>
        <h3 className="text-xl font-semibold font-be-vietnam text-warm-charcoal mb-2">{strategy.title}</h3>
        <p className="text-sm text-warm-charcoal/80 mb-4 flex-grow">{strategy.description}</p>
      </div>
      <div className="flex justify-end items-center space-x-2 pt-3 border-t border-soft-clay/10 mt-auto">
        <p className="text-xs text-warm-charcoal/60 mr-auto">Bạn thấy hoạt động này thế nào?</p>
        <button 
          onClick={() => onRate(strategy.id, 'positive')} 
          className={`p-1.5 rounded-full transition-colors ${strategy.effectiveness === 'positive' ? 'bg-green-500 text-white' : 'hover:bg-green-100 text-green-500'}`}
          aria-label="Hữu ích"
        >
          <ThumbsUp className="w-5 h-5" />
        </button>
        <button 
          onClick={() => onRate(strategy.id, 'negative')} 
          className={`p-1.5 rounded-full transition-colors ${strategy.effectiveness === 'negative' ? 'bg-red-500 text-white' : 'hover:bg-red-100 text-red-500'}`}
          aria-label="Không hữu ích"
        >
          <ThumbsDown className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};


export default function ExplorePage() {
  const [strategies, setStrategies] = useState<CopingStrategy[]>(initialStrategies);
  const [filter, setFilter] = useState<string>('all');
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [selectedMoodForRec, setSelectedMoodForRec] = useState<Mood | undefined>(undefined);

  useEffect(() => {
    const storedRatings = localStorage.getItem('banThuongStrategyRatings');
    if (storedRatings) {
      const ratings = JSON.parse(storedRatings) as Record<string, 'positive' | 'negative'>;
      setStrategies(prevStrategies => prevStrategies.map(s => ({
        ...s,
        effectiveness: ratings[s.id] || null,
      })));
    }
  }, []);

  const handleRateStrategy = (id: string, rating: 'positive' | 'negative') => {
    setStrategies(prevStrategies => {
      const updatedStrategies = prevStrategies.map(s =>
        s.id === id ? { ...s, effectiveness: s.effectiveness === rating ? null : rating } : s
      );
      const newRatings = updatedStrategies.reduce((acc, curr) => {
        if (curr.effectiveness) acc[curr.id] = curr.effectiveness;
        return acc;
      }, {} as Record<string, 'positive' | 'negative'>);
      localStorage.setItem('banThuongStrategyRatings', JSON.stringify(newRatings));
      return updatedStrategies;
    });
  };
  
  const handleGetRecommendations = useCallback(async () => {
    setIsLoadingRecommendations(true);
    const moodContext = selectedMoodForRec ? `cho người đang cảm thấy ${selectedMoodForRec}` : "để cải thiện tâm trạng nói chung";
    const prompt = `Hãy gợi ý 3 hoạt động hoặc chiến lược đối phó ${moodContext} cho một học sinh. Mỗi gợi ý bao gồm tiêu đề (title), mô tả ngắn (description), và một danh mục (category) phù hợp (ví dụ: Thư giãn, Vận động, Sáng tạo, Suy ngẫm, Kết nối). Trả lời dưới dạng JSON array: [{"title": "...", "description": "...", "category": "..."}, ...]. Đảm bảo các gợi ý đa dạng và phù hợp với lứa tuổi học sinh.`;
    
    const result = await geminiService.generateTextWithJsonOutput<Array<{title: string, description: string, category: string}>>(prompt, "Bạn là một AI tư vấn sức khỏe tinh thần, đưa ra những gợi ý hữu ích và thực tế.");

    if (result && Array.isArray(result)) {
      const newStrategies: CopingStrategy[] = result.map((item, index) => ({
        id: `ai-${Date.now()}-${index}`,
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: `https://picsum.photos/seed/ai${item.title.replace(/\s/g, '')}/400/300`,
        effectiveness: null,
      }));
      setStrategies(prev => [...newStrategies, ...prev.filter(ps => !newStrategies.find(ns => ns.title === ps.title))]);
    }
    setIsLoadingRecommendations(false);
  }, [selectedMoodForRec]);

  const categories = ['all', ...new Set(strategies.map(s => s.category))];
  const filteredStrategies = filter === 'all' ? strategies : strategies.filter(s => s.category === filter);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-10 pt-6">
        <Compass className="w-16 h-16 text-sage-green mx-auto mb-4 opacity-70"/>
        <h2 className="text-3xl font-bold font-be-vietnam text-soft-clay mb-3">Khám phá và Chăm sóc</h2>
        <p className="text-warm-charcoal/80 max-w-2xl mx-auto">
          Tìm kiếm những cách thức giúp bạn cảm thấy tốt hơn, từ những bài tập nhỏ đến các hoạt động ý nghĩa.
          Đây là không gian để bạn tự do lựa chọn những gì phù hợp với mình.
        </p>
      </div>

      <div className="my-10 p-6 bg-sage-green/10 rounded-xl shadow-md border border-sage-green/20">
        <h3 className="text-xl font-semibold font-be-vietnam text-warm-charcoal mb-4 flex items-center">
          <Lightbulb className="w-6 h-6 text-yellow-500 mr-2"/>Gợi ý cho bạn
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <select 
            value={selectedMoodForRec || ''} 
            onChange={(e) => setSelectedMoodForRec(e.target.value as Mood)}
            className="p-2 border border-sage-green/50 rounded-md focus:ring-soft-clay focus:border-soft-clay bg-white flex-grow sm:flex-grow-0"
          >
            <option value="">-- Chọn tâm trạng để có gợi ý tốt hơn --</option>
            {MOOD_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
          </select>
          <Button onClick={handleGetRecommendations} isLoading={isLoadingRecommendations} variant="secondary">
            {isLoadingRecommendations ? 'Đang tìm...' : 'Nhận gợi ý từ AI'}
          </Button>
        </div>
      </div>
      
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filter === cat ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(cat)}
            className="capitalize"
          >
            {cat === 'all' ? 'Tất cả' : cat}
          </Button>
        ))}
      </div>

      {filteredStrategies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map(strategy => (
            <StrategyCard key={strategy.id} strategy={strategy} onRate={handleRateStrategy} />
          ))}
        </div>
      ) : (
        <p className="text-center text-warm-charcoal/70 py-10">
          {isLoadingRecommendations ? "Đang tải các gợi ý..." : "Không tìm thấy hoạt động nào phù hợp."}
        </p>
      )}
    </div>
  );
};