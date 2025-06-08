'use client'

import React, { useState, useEffect } from 'react';
import { ThoughtMonster } from '@/types';
import { Button } from '@/components/ui/Button';
import { geminiService } from '@/services/geminiService';
import { Wand2Icon } from '@/components/icons/Wand2Icon';
import { useCrisisAlert } from '@/hooks/useCrisisAlert';
import { Edit3Icon } from '@/components/icons/Edit3Icon';

interface MonsterCardProps {
  monster: ThoughtMonster;
  onTameProgress: (id: string) => Promise<void>;
  isTaming: boolean; 
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster, onTameProgress, isTaming }) => {
  const showLoadingState = monster.imageUrl === 'loading' || monster.imageUrl === 'loading_update' || isTaming;
  let loadingMessage = 'Đang vẽ quái vật...';
  if (monster.imageUrl === 'loading_update' || (isTaming && monster.imageUrl !== 'loading')) {
    loadingMessage = 'Đang tiến hoá...';
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-soft-clay/20 transform transition-all hover:shadow-xl hover:-translate-y-1 relative overflow-hidden">
      {monster.imageUrl && (
        <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-sage-green/10 flex items-center justify-center">
          {showLoadingState ? (
             <div className="animate-pulse text-sage-green p-2 text-center">{loadingMessage}</div>
          ) : (
            <img src={monster.imageUrl} alt={monster.name} className="w-full h-full object-contain" />
          )}
        </div>
      )}
      <h3 className="text-xl font-semibold font-display text-soft-clay mb-1">{monster.name}</h3>
      <p className="text-xs text-warm-charcoal/60 mb-2 italic">Từ suy nghĩ: "{monster.userInput.substring(0, 50)}{monster.userInput.length > 50 ? '...' : ''}"</p>
      <p className="text-sm text-warm-charcoal/80 mb-3 h-16 overflow-y-auto">{monster.description}</p>
      
      <div className="mb-3">
        <p className="text-xs text-warm-charcoal/70 mb-1">Mức độ thuần hóa:</p>
        <div className="w-full bg-sage-green/20 rounded-full h-2.5">
          <div 
            className="bg-sage-green h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${monster.tamingProgress}%` }}
          ></div>
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="secondary" 
        onClick={() => onTameProgress(monster.id)}
        disabled={monster.tamingProgress >= 100 || isTaming || monster.imageUrl === 'loading'}
        isLoading={isTaming && monster.imageUrl !== 'loading'} 
        className="w-full"
      >
        {monster.tamingProgress >= 100 ? 'Đã thuần hóa!' : 'Chăm sóc (+10%)'}
      </Button>
      {monster.tamingProgress >= 100 && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-800 text-xs font-semibold rounded animate-pulse">
          Thành tựu!
        </div>
      )}
       <div 
        className={`absolute inset-0 border-4 rounded-xl transition-opacity duration-1000 ease-in-out pointer-events-none ${monster.tamingProgress >= 100 ? 'border-yellow-400 opacity-100 animate-pulse-border' : 'border-transparent opacity-0'}`}
        style={{ animation: monster.tamingProgress >= 100 ? 'pulseBorder 2s infinite' : 'none' }}
      ></div>
      <style>{`
        @keyframes pulseBorder {
          0%, 100% { box-shadow: 0 0 0 0px rgba(250, 204, 21, 0.7); }
          50% { box-shadow: 0 0 0 10px rgba(250, 204, 21, 0); }
        }
      `}</style>
    </div>
  );
};


export default function ThoughtMonstersPage() {
  const [monsters, setMonsters] = useState<ThoughtMonster[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isGeneratingInitial, setIsGeneratingInitial] = useState(false); 
  const [tamingMonsterId, setTamingMonsterId] = useState<string | null>(null); 
  const { checkTextForCrisis, isCrisisAlertVisible } = useCrisisAlert();
  const [gardenFlourishLevel, setGardenFlourishLevel] = useState(0); 

  useEffect(() => {
    const storedMonsters = localStorage.getItem('banThuongMonsters');
    if (storedMonsters) {
      setMonsters(JSON.parse(storedMonsters).map((m: ThoughtMonster)=> ({...m, createdAt: new Date(m.createdAt)})));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('banThuongMonsters', JSON.stringify(monsters));
    const tamedCount = monsters.filter(m => m.tamingProgress >= 100).length;
    if (tamedCount >= 5) setGardenFlourishLevel(3);
    else if (tamedCount >= 3) setGardenFlourishLevel(2);
    else if (tamedCount >= 1) setGardenFlourishLevel(1);
    else setGardenFlourishLevel(0);
  }, [monsters]);

  const handleGenerateMonster = async () => {
    if (!userInput.trim() || isCrisisAlertVisible || isGeneratingInitial) return;
    if (checkTextForCrisis(userInput)) return;

    setIsGeneratingInitial(true);
    const tempMonsterId = Date.now().toString();

    const placeholderMonster: ThoughtMonster = {
      id: tempMonsterId,
      userInput: userInput,
      name: "Đang hình thành...",
      description: "Một người bạn mới sắp xuất hiện từ suy nghĩ của bạn.",
      imageUrl: "loading", 
      tamingProgress: 0,
      createdAt: new Date(),
    };
    setMonsters(prev => [placeholderMonster, ...prev]);

    const nameDescPrompt = `Tôi đang có một suy nghĩ: "${userInput}". Hãy tạo ra một cái tên thật đáng yêu, thân thiện (kiểu 'kawaii', 'thú nhồi bông') cho một 'quái vật suy nghĩ' đại diện cho điều này, cùng với một mô tả ngắn (2-3 câu) trấn an, tích cực về nó. Ví dụ, nếu suy nghĩ là 'tôi sợ thất bại', quái vật có thể tên là 'Bé Lo Lắng' và mô tả là 'Bé Lo Lắng chỉ muốn bảo vệ bạn thôi. Cùng nhau học hỏi từ mọi thử thách nhé!'. Trả lời dưới dạng JSON: {"name": "Tên quái vật", "description": "Mô tả quái vật"}.`;
    
    const nameDescResult = await geminiService.generateTextWithJsonOutput<{name: string, description: string}>(nameDescPrompt, "Bạn là một AI sáng tạo, chuyên biến những suy nghĩ thành những nhân vật đáng yêu và tích cực theo phong cách anime.");

    if (nameDescResult) {
      const imagePrompt = `An adorable anime style monster, cute and kawaii, plush toy style, named '${nameDescResult.name}'. It embodies the thought: "${userInput.substring(0,100)}". The monster looks ${nameDescResult.description.includes("lo lắng") ? "a little anxious but very endearing" : nameDescResult.description.includes("buồn") ? "slightly sad but gentle and sweet" : "curious and friendly"}. ${nameDescResult.description}. Detailed anime illustration, vibrant colors, high quality.`;
      const imageUrlResult = await geminiService.generateImage(imagePrompt);
      
      const newMonster: ThoughtMonster = {
        id: tempMonsterId,
        userInput: userInput,
        name: nameDescResult.name,
        description: nameDescResult.description,
        imageUrl: imageUrlResult || 'https://picsum.photos/seed/defaultmonster/200/200',
        tamingProgress: 0,
        createdAt: new Date(),
      };
      setMonsters(prev => prev.map(m => m.id === tempMonsterId ? newMonster : m));
    } else {
       setMonsters(prev => prev.map(m => m.id === tempMonsterId ? {...m, name: "Lỗi tạo hình", description: "Không thể tạo quái vật lúc này.", imageUrl: "https://picsum.photos/seed/error/200/200"} : m));
    }

    setUserInput('');
    setIsGeneratingInitial(false);
  };
  
  const handleTameProgress = async (id: string) => {
    if (tamingMonsterId) return; 

    const monsterIndex = monsters.findIndex(m => m.id === id);
    if (monsterIndex === -1) return;

    const currentMonster = monsters[monsterIndex];
    if (currentMonster.tamingProgress >= 100 || currentMonster.imageUrl === 'loading') return;

    setTamingMonsterId(id); 

    const newProgress = Math.min(100, currentMonster.tamingProgress + 10);

    setMonsters(prevMonsters =>
      prevMonsters.map(m =>
        m.id === id ? { ...m, tamingProgress: newProgress, imageUrl: 'loading_update' } : m
      )
    );
    
    let finalImageUrl = currentMonster.imageUrl; 

    if (newProgress <= 100) { 
      const evolutionKeywords = [
        "even cuter, with a gentle, knowing smile and slightly more detailed, charming features", 
        "adorably evolved, with sparkling eyes, softer lines, and a very endearing, wise aura", 
        "radiating an enhanced, heartwarming cuteness, with a serene expression and delightful new details",
        "the pinnacle of its cute evolution, exuding calm wisdom, with an irresistibly charming and polished anime design",
        "fully realized in its ultimate cute and wise form, incredibly huggable, with a gentle, powerful presence and intricate, beautiful anime details. Make it exceptionally cute and appealing." 
      ];
      
      let keywordIndex = Math.floor((newProgress / 20)) -1; 
      if (newProgress === 100) keywordIndex = evolutionKeywords.length -1;
      else keywordIndex = Math.max(0, Math.min(keywordIndex, evolutionKeywords.length - 2));

      const selectedEvolutionKeyword = evolutionKeywords[keywordIndex];

      const evolvedImagePrompt = `An evolved, even cuter, and more mature anime style version of the monster named '${currentMonster.name}'. It has grown and now looks ${selectedEvolutionKeyword}, while amplifying its original adorable kawaii charm and plush toy appeal. This monster represents the thought: "${currentMonster.userInput.substring(0,100)}". The design should be high-quality, detailed anime illustration, maintaining character consistency but showcasing this cute and wise evolution. Emphasize its amplified cuteness and gentle maturity. Avoid anything scary or intimidating; it should be more endearing and charming than before.`;
      
      try {
        const updatedImageUrl = await geminiService.generateImage(evolvedImagePrompt);
        if (updatedImageUrl) {
          finalImageUrl = updatedImageUrl;
        } else {
          console.warn("Image re-generation failed for evolution.");
          const originalMonsterState = monsters.find(m => m.id === id);
          if (originalMonsterState && originalMonsterState.imageUrl !== 'loading_update' && originalMonsterState.imageUrl !== 'loading') {
            finalImageUrl = originalMonsterState.imageUrl;
          } else {
            finalImageUrl = 'https://picsum.photos/seed/evolutionerror/200/200'; 
          }
        }
      } catch (error) {
        console.error("Error re-generating image for evolution:", error);
         const originalMonsterState = monsters.find(m => m.id === id);
          if (originalMonsterState && originalMonsterState.imageUrl !== 'loading_update' && originalMonsterState.imageUrl !== 'loading') {
            finalImageUrl = originalMonsterState.imageUrl;
          } else {
            finalImageUrl = 'https://picsum.photos/seed/evolutioncriticalerror/200/200';
          }
      }
    }

    setMonsters(prevMonsters =>
      prevMonsters.map(m =>
        m.id === id ? { ...m, tamingProgress: newProgress, imageUrl: finalImageUrl } : m
      )
    );
    setTamingMonsterId(null); 
  };
  
  const gardenStyles = [
    "bg-gradient-to-br from-warm-linen to-sage-green/10", 
    "bg-gradient-to-br from-warm-linen to-sage-green/20", 
    "bg-gradient-to-br from-warm-linen via-sage-green/20 to-sage-green/30", 
    "bg-gradient-to-br from-sage-green/10 via-sage-green/30 to-soft-clay/20" 
  ];


  return (
    <div className={`container mx-auto p-4 rounded-xl transition-colors duration-1000 ${gardenStyles[gardenFlourishLevel]}`}>
      <div className="text-center mb-10 pt-6">
        <h2 className="text-3xl font-bold font-be-vietnam text-soft-clay mb-3">Hình dáng tôi</h2>
        <p className="text-warm-charcoal/80 max-w-2xl mx-auto">
          Mỗi suy nghĩ đều có một hình hài. Hãy thử nhập một suy nghĩ hay cảm xúc của bạn, và để AI giúp bạn hình dung nó thành một "quái vật" anime đáng yêu. Cùng nhau chăm sóc và "thuần hóa" những người bạn này nhé!
        </p>
         {gardenFlourishLevel > 0 && (
          <p className="mt-3 text-sm text-sage-green font-semibold animate-fade-in-up">
            Khu vườn của bạn đang {gardenFlourishLevel === 1 ? "bắt đầu hé nở" : gardenFlourishLevel === 2 ? "trở nên tươi tốt" : "rực rỡ sắc màu"}!
          </p>
        )}
      </div>

      <div className="max-w-xl mx-auto mb-10 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg border border-soft-clay/20">
        <label htmlFor="thoughtInput" className="block text-lg font-semibold text-warm-charcoal mb-2">Bạn đang nghĩ gì?</label>
        <textarea
          id="thoughtInput"
          rows={3}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ví dụ: 'Mình sợ bài kiểm tra sắp tới', hoặc 'Mình cảm thấy cô đơn'..."
          className="w-full p-3 border border-sage-green/50 rounded-md focus:ring-2 focus:ring-soft-clay focus:border-soft-clay resize-none bg-white placeholder-warm-charcoal/60"
          disabled={isGeneratingInitial || !!tamingMonsterId || isCrisisAlertVisible}
        />
        <Button 
          onClick={handleGenerateMonster} 
          isLoading={isGeneratingInitial} 
          disabled={!userInput.trim() || !!tamingMonsterId || isCrisisAlertVisible}
          className="w-full mt-4"
          leftIcon={<Wand2Icon className="w-5 h-5"/>}
        >
          Hiện hình nào!
        </Button>
      </div>

      {(monsters.length === 0 && !isGeneratingInitial) && (
        <div className="text-center py-10">
          <Edit3Icon className="w-16 h-16 text-sage-green/40 mx-auto mb-4"/>
          <p className="text-xl text-warm-charcoal/70">Khu vườn quái vật của bạn đang chờ đợi những người bạn đầu tiên.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {monsters.map(monster => (
          <MonsterCard 
            key={monster.id} 
            monster={monster} 
            onTameProgress={handleTameProgress} 
            isTaming={tamingMonsterId === monster.id}
          />
        ))}
      </div>
    </div>
  );
};