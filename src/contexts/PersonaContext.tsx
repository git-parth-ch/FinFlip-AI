import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  Persona,
  personas,
  priyaTransactions,
  arjunTransactions,
  Transaction,
  getInitialMessages,
  ChatMessage,
  getUserStats,
  UserStats,
  getPeerBenchmarks,
  PeerBenchmark,
} from '@/data/mockData';

interface PersonaContextType {
  // Persona template driving data (Priya vs Arjun)
  currentPersona: Persona;
  setPersona: (personaId: string) => void;

  // User-entered identity (kept across persona templates)
  userName: string;
  setUserName: (name: string) => void;

  transactions: Transaction[];
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  userStats: UserStats;
  peerBenchmarks: PeerBenchmark[];
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

function getStoredPersonaId() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('fined_personaId');
}

function getStoredUserName() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('fined_userName');
}

export function PersonaProvider({ children }: { children: ReactNode }) {
  const initialPersona = useMemo(() => {
    const stored = getStoredPersonaId();
    return personas.find((p) => p.id === stored) || personas[0];
  }, []);

  const [currentPersona, setCurrentPersona] = useState<Persona>(initialPersona);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => getInitialMessages(initialPersona));

  // Default must be "User" so the UI never looks empty during testing.
  const [userName, setUserNameState] = useState<string>(() => getStoredUserName() || 'User');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('fined_userName', userName);
  }, [userName]);

  const setUserName = (name: string) => {
    setUserNameState(name?.trim() || 'User');
  };

  const setPersona = (personaId: string) => {
    const persona = personas.find((p) => p.id === personaId) || personas[0];
    setCurrentPersona(persona);
    setChatMessages(getInitialMessages(persona));

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('fined_personaId', persona.id);
    }
  };

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const transactions = currentPersona.id === 'priya' ? priyaTransactions : arjunTransactions;
  const userStats = getUserStats(currentPersona.id);
  const peerBenchmarks = getPeerBenchmarks(currentPersona.id);

  return (
    <PersonaContext.Provider
      value={{
        currentPersona,
        setPersona,
        userName,
        setUserName,
        transactions,
        chatMessages,
        addChatMessage,
        userStats,
        peerBenchmarks,
      }}
    >
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

