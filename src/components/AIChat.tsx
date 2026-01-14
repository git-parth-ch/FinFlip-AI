import { useState, useRef, useEffect } from 'react';
import { usePersona } from '@/contexts/PersonaContext';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

const aiResponses = [
  "Samajh gaya! Let me analyze your spending pattern... 📊",
  "That's a great question! Here's what I think yaar...",
  "Hmm, looking at your expenses, I'd suggest creating a weekly food budget. Shall we try ₹500/week? 🍕",
  "Bahut accha! Setting goals is the first step. What amount feels realistic for you?",
  "I see you've been consistent with tracking - that's already better than 80% of people your age! 🎉",
  "Pro tip: Try the '24-hour rule' before any purchase over ₹500. Works like magic! ✨",
  "Your savings rate is improving week over week. Keep this momentum going! 💪",
];

export function AIChat({ isFullScreen = false }: { isFullScreen?: boolean }) {
  const { chatMessages, addChatMessage, currentPersona } = usePersona();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim()) return;

    addChatMessage({
      role: 'user',
      content: input,
    });
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      addChatMessage({
        role: 'assistant',
        content: randomResponse,
      });
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`flex flex-col ${isFullScreen ? 'h-[calc(100vh-8rem)]' : 'h-full'} bg-card rounded-2xl border border-border overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-primary text-white">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold">FinEd Assistant</h3>
          <p className="text-xs text-white/80">Your financial buddy</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  message.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{currentPersona.avatar}</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-2 items-center animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="chat-bubble-ai">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about your finances..."
            className="flex-1 rounded-xl border-muted"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-gradient-primary hover:opacity-90 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {['Set savings goal', 'Analyze spending', 'Budget tips'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
