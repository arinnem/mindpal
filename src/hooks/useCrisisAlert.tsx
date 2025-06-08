'use client'

import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { CrisisAlertModal } from '@/components/CrisisAlertModal';
import { CRISIS_KEYWORDS } from '@/lib/constants';

interface CrisisAlertContextType {
  isCrisisAlertVisible: boolean;
  triggerCrisisAlert: () => void;
  checkTextForCrisis: (text: string) => boolean;
}

const CrisisAlertContext = createContext<CrisisAlertContextType | undefined>(undefined);

export const CrisisAlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isCrisisAlertVisible, setIsCrisisAlertVisible] = useState(false);

  const triggerCrisisAlert = useCallback(() => {
    setIsCrisisAlertVisible(true);
  }, []);

  const checkTextForCrisis = useCallback((text: string): boolean => {
    if (!text) return false;
    const lowercasedText = text.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some(keyword => lowercasedText.includes(keyword));
    if (isCrisis) {
      triggerCrisisAlert();
    }
    return isCrisis;
  }, [triggerCrisisAlert]);

  return (
    <CrisisAlertContext.Provider value={{ isCrisisAlertVisible, triggerCrisisAlert, checkTextForCrisis }}>
      {children}
      <CrisisAlertModal isOpen={isCrisisAlertVisible} />
    </CrisisAlertContext.Provider>
  );
};

export const useCrisisAlert = (): CrisisAlertContextType => {
  const context = useContext(CrisisAlertContext);
  if (context === undefined) {
    throw new Error('useCrisisAlert must be used within a CrisisAlertProvider');
  }
  return context;
};