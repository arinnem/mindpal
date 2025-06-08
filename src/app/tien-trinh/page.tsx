'use client'

import React, { useState, useEffect } from 'react';
import { JournalEntry, ThoughtMonster, Mood } from '@/types';
import { MOOD_OPTIONS } from '@/lib/constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function ProgressPage() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [monsters, setMonsters] = useState<ThoughtMonster[]>([]);

  useEffect(() => {
    const storedEntries = localStorage.getItem('banThuongJournalEntries');
    if (storedEntries) {
      setJournalEntries(JSON.parse(storedEntries).map((e: JournalEntry) => ({...e, date: new Date(e.date)})));
    }
    const storedMonsters = localStorage.getItem('banThuongMonsters');
    if (storedMonsters) {
      setMonsters(JSON.parse(storedMonsters));
    }
  }, []);

  const moodCounts = journalEntries.reduce((acc, entry) => {
    if (entry.mood) {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    }
    return acc;
  }, {} as Record<Mood, number>);

  const moodDataForChart = MOOD_OPTIONS.map(moodOpt => ({
    name: moodOpt.label,
    count: moodCounts[moodOpt.id] || 0,
    fill: moodOpt.color.replace('text-', '#').replace('-500', ''), // Basic color mapping
  }));

  const tamedMonsters = monsters.filter(m => m.tamingProgress >= 100);

  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-10 pt-6">
        <h2 className="text-3xl font-bold font-be-vietnam text-soft-clay mb-3">Hành trình của bạn</h2>
        <p className="text-warm-charcoal/80 max-w-2xl mx-auto">
          Mỗi bước đi nhỏ đều là một chiến thắng đáng tự hào. Hãy cùng nhìn lại những thành tựu tuyệt vời mà bạn đã đạt được.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-warm-charcoal">Nhật ký đã viết</h3>
            <p className="text-4xl font-bold text-soft-clay">{journalEntries.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-warm-charcoal">Quái vật đã thuần hóa</h3>
            <p className="text-4xl font-bold text-sage-green">{tamedMonsters.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-semibold text-warm-charcoal">Cảm xúc chủ đạo</h3>
            <p className="text-4xl font-bold text-yellow-500">{Object.keys(moodCounts).length > 0 ? Object.entries(moodCounts).sort((a,b) => b[1] - a[1])[0][0] : 'Chưa có'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold font-display text-warm-charcoal mb-6">Phân bố cảm xúc</h3>
          {journalEntries.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={moodDataForChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Số lần" fill="#DAB894" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-warm-charcoal/70 text-center py-10">Chưa có dữ liệu cảm xúc.</p>}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold font-display text-warm-charcoal mb-6">Những người bạn đã đồng hành</h3>
          {tamedMonsters.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {tamedMonsters.map(monster => (
                <div key={monster.id} className="flex items-center bg-sage-green/10 p-3 rounded-lg">
                  <img src={monster.imageUrl} alt={monster.name} className="w-12 h-12 object-contain rounded-md mr-4"/>
                  <div>
                    <h4 className="font-semibold text-warm-charcoal">{monster.name}</h4>
                    <p className="text-xs text-warm-charcoal/70 italic">Từ: "{monster.userInput.substring(0, 30)}..."</p>
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="text-warm-charcoal/70 text-center py-10">Chưa có quái vật nào được thuần hóa.</p>}
        </div>
      </div>
    </div>
  );
}