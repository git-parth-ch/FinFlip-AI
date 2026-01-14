import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Persona, personas, priyaTransactions, arjunTransactions, Transaction, getInitialMessages, ChatMessage, getUserStats, UserStats, getPeerBenchmarks, PeerBenchmark } from '@/data/mockData';

interface PersonaContextType {
  currentPersona: Persona;
  setPersona: (personaId: string) => void;
  transactions: Transaction[];
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  userStats: UserStats;
  peerBenchmarks: PeerBenchmark[];
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [currentPersona, setCurrentPersona] = useState<Persona>(personas[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(getInitialMessages(personas[0]));

  const setPersona = (personaId: string) => {
    const persona = personas.find(p => p.id === personaId) || personas[0];
    setCurrentPersona(persona);
    setChatMessages(getInitialMessages(persona));
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const transactions = currentPersona.id === 'priya' ? priyaTransactions : arjunTransactions;
  const userStats = getUserStats(currentPersona.id);
  const peerBenchmarks = getPeerBenchmarks(currentPersona.id);

  return (
    <PersonaContext.Provider value={{
      currentPersona,
      setPersona,
      transactions,
      chatMessages,
      addChatMessage,
      userStats,
      peerBenchmarks,
    }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
}
