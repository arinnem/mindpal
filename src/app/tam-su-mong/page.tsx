'use client'

import React, { useState, useEffect } from 'react';
import { JournalEntry, Mood } from '@/types';
import { MOOD_OPTIONS } from '@/lib/constants';
import { Button } from '@/components/ui/Button';
import { geminiService } from '@/services/geminiService';
import { PlusCircle, BookOpen, Lightbulb } from 'lucide-react';
import { useCrisisAlert } from '@/hooks/useCrisisAlert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentMood, setCurrentMood] = useState<Mood | undefined>(undefined);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [activeTab, setActiveTab] = useState<'entries' | 'progress'>('entries');
  const { checkTextForCrisis, isCrisisAlertVisible } = useCrisisAlert();

  useEffect(() => {
    const storedEntries = localStorage.getItem('banThuongJournalEntries');
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries).map((e: JournalEntry) => ({...e, date: new Date(e.date)})));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('banThuongJournalEntries', JSON.stringify(entries));
  }, [entries]);

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setCurrentTitle(entry.title);
    setCurrentContent(entry.content);
    setCurrentMood(entry.mood);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setSelectedEntry(null);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentMood(undefined);
    setIsCreatingNew(true);
  };

  const handleSaveEntry = () => {
    if (isCrisisAlertVisible && checkTextForCrisis(currentContent)) return;
    if (checkTextForCrisis(currentContent) || checkTextForCrisis(currentTitle)) {
        return;
    }

    if (selectedEntry) {
      setEntries(entries.map(e => e.id === selectedEntry.id ? { ...selectedEntry, title: currentTitle, content: currentContent, mood: currentMood, date: new Date() } : e));
    } else {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentTitle || `Nhật ký ngày ${new Date().toLocaleDateString('vi-VN')}`,
        content: currentContent,
        date: new Date(),
        mood: currentMood,
      };
      setEntries([newEntry, ...entries]);
    }
    setIsCreatingNew(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
      setIsCreatingNew(false);
      setCurrentTitle('');
      setCurrentContent('');
    }
  };

  const handleGetAIPrompt = async () => {
    setIsLoadingPrompt(true);
    const moodText = currentMood ? `cho người đang cảm thấy ${currentMood}` : "chung chung";
    const prompt = `Hãy tạo một gợi ý viết nhật ký sâu sắc và tích cực ${moodText}. Gợi ý nên ngắn gọn, khoảng 1-2 câu.`;
    const result = await geminiService.generateText(prompt, "Bạn là một AI hỗ trợ viết nhật ký, đưa ra những gợi ý tinh tế và khơi gợi suy ngẫm.");
    if (result.text && !result.text.toLowerCase().includes("xin lỗi")) {
      setCurrentContent(prev => `${result.text}\n\n${prev}`);
    }
    setIsLoadingPrompt(false);
  };
  
  const moodCounts = entries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<Mood, number>);

  const moodDataForChart = MOOD_OPTIONS.map(moodOpt => ({
    name: moodOpt.label,
    count: moodCounts[moodOpt.id] || 0,
  }));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold font-be-vietnam text-soft-clay mb-6">Tâm sự mỏng</h2>
      <p className="text-warm-charcoal/80 mb-8">Nơi bạn có thể tự do ghi lại những dòng tâm tư. Chỉ riêng bạn mới có thể đọc được những dòng này.</p>
      
      <div className="mb-6 border-b border-soft-clay/30">
        <nav className="flex space-x-4">
          {['entries', 'progress'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'entries' | 'progress')}
              className={`py-2 px-4 font-medium transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-soft-clay text-soft-clay' 
                  : 'text-warm-charcoal/70 hover:text-soft-clay'
              }`}
            >
              {tab === 'entries' ? 'Nhật ký' : 'Tiến trình'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'entries' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-warm-linen p-1 rounded-lg">
             <Button onClick={handleCreateNew} variant="secondary" className="w-full mb-4" leftIcon={<PlusCircle className="w-5 h-5"/>}>
              Viết nhật ký mới
            </Button>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {entries.length === 0 && !isCreatingNew && (
                <p className="text-warm-charcoal/70 text-center py-4">Chưa có nhật ký nào.</p>
              )}
              {entries.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => handleSelectEntry(entry)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEntry?.id === entry.id || (isCreatingNew && !selectedEntry)
                      ? 'bg-soft-clay/20 ring-2 ring-soft-clay'
                      : 'bg-sage-green/10 hover:bg-sage-green/20'
                  }`}
                >
                  <h3 className="font-semibold text-warm-charcoal truncate">{entry.title}</h3>
                  <p className="text-sm text-warm-charcoal/70">{new Date(entry.date).toLocaleDateString('vi-VN')}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-soft-clay/20">
            {isCreatingNew || selectedEntry ? (
              <>
                <input
                  type="text"
                  placeholder="Tiêu đề nhật ký..."
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  className="w-full text-2xl font-semibold p-2 mb-4 border-b-2 border-soft-clay/30 focus:border-soft-clay outline-none bg-transparent"
                  disabled={isCrisisAlertVisible}
                />
                <textarea
                  placeholder="Viết những điều bạn nghĩ ở đây..."
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  className="w-full h-64 p-3 border border-sage-green/50 rounded-md focus:ring-soft-clay focus:border-soft-clay resize-none bg-white"
                  disabled={isCrisisAlertVisible}
                />
                <div className="flex flex-wrap justify-between items-center mt-6 gap-2">
                  <Button onClick={handleGetAIPrompt} variant="outline" size="sm" isLoading={isLoadingPrompt} disabled={isCrisisAlertVisible} leftIcon={<Lightbulb className="w-4 h-4"/>}>
                    Gợi ý từ AI
                  </Button>
                  <div className="flex gap-2">
                    {selectedEntry && (
                      <Button onClick={() => handleDeleteEntry(selectedEntry.id)} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10 focus:ring-red-500" size="sm" disabled={isCrisisAlertVisible}>
                        Xóa
                      </Button>
                    )}
                    <Button onClick={handleSaveEntry} size="sm" disabled={isCrisisAlertVisible || (!currentContent.trim() && !currentTitle.trim())}>
                      {selectedEntry ? 'Lưu thay đổi' : 'Lưu nhật ký'}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-20 flex flex-col items-center justify-center h-full">
                <BookOpen className="w-16 h-16 text-sage-green/50 mb-4"/>
                <p className="text-xl text-warm-charcoal/70">Chọn một nhật ký để đọc hoặc tạo mới.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-soft-clay/20">
          <h3 className="text-xl font-semibold font-be-vietnam text-warm-charcoal mb-6">Thống kê tâm trạng</h3>
          {entries.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={moodDataForChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#B4C6A630" />
                        <XAxis dataKey="name" stroke="#4E443C" />
                        <YAxis stroke="#4E443C" allowDecimals={false} />
                        <Tooltip contentStyle={{backgroundColor: '#FDFBF6', border: '1px solid #DAB894'}} itemStyle={{color: '#4E443C'}} />
                        <Legend wrapperStyle={{color: '#4E443C'}} />
                        <Line type="monotone" dataKey="count" name="Số lần" stroke="#DAB894" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            ) : (
                <p className="text-warm-charcoal/70 text-center py-10">Chưa có đủ dữ liệu.</p>
            )}
        </div>
      )}
    </div>
  );
};