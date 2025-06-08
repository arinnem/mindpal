'use client'

import React from 'react';
import { VIETNAMESE_HOTLINES, CRISIS_MESSAGE_TITLE, CRISIS_MESSAGE_BODY } from '@/lib/constants';
import { AlertTriangle } from 'lucide-react';

interface CrisisAlertModalProps {
  isOpen: boolean;
}

export const CrisisAlertModal: React.FC<CrisisAlertModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4">
      <div className="bg-warm-linen p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-300 ease-out scale-100 opacity-100">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500 mr-3"/>
          <h2 className="text-2xl font-bold font-be-vietnam text-red-600">{CRISIS_MESSAGE_TITLE}</h2>
        </div>
        <p className="text-warm-charcoal mb-4 text-left">
          {CRISIS_MESSAGE_BODY}
        </p>
        <ul className="space-y-2 mb-6 text-left">
          {VIETNAMESE_HOTLINES.map((hotline) => (
            <li key={hotline.name} className="text-warm-charcoal">
              <strong className="font-semibold">{hotline.name}:</strong>{' '}
              <a href={`tel:${hotline.number.replace(/\s/g, '')}`} className="text-soft-clay hover:underline font-medium">
                {hotline.number}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-sm text-warm-charcoal/80 text-left">
          Xin hãy nhớ rằng bạn không đơn độc và luôn có người sẵn sàng lắng nghe và giúp đỡ.
        </p>
      </div>
    </div>
  );
};