import { useState } from 'react';
import { Home, Receipt, PiggyBank, GraduationCap, User, Sparkles, X } from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import { AIChat } from './AIChat';
import { HomeTab } from './tabs/HomeTab';
import { ExpensesTab } from './tabs/ExpensesTab';
import { BudgetTab } from './tabs/BudgetTab';
import { LearnTab } from './tabs/LearnTab';
import { ProfileTab } from './tabs/ProfileTab';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TabType = 'home' | 'expenses' | 'budget' | 'learn' | 'profile';

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'expenses' as TabType, label: 'Expenses', icon: Receipt },
  { id: 'budget' as TabType, label: 'Budget', icon: PiggyBank },
  { id: 'learn' as TabType, label: 'Learn', icon: GraduationCap },
  { id: 'profile' as TabType, label: 'Profile', icon: User },
];

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAIChat, setShowAIChat] = useState(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'expenses':
        return <ExpensesTab />;
      case 'budget':
        return <BudgetTab />;
      case 'learn':
        return <LearnTab />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 px-4 py-3 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg">FinEd</span>
          </div>
          <PersonaSwitcher />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-4 pb-28 overflow-y-auto">
        {renderTab()}
      </main>

      {/* Floating AI Button */}
      <button
        onClick={() => setShowAIChat(true)}
        className="floating-ai-btn animate-pulse-glow"
      >
        <Sparkles className="w-6 h-6 text-white" />
      </button>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* AI Chat Modal */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="max-w-md h-[80vh] p-0 gap-0">
          <AIChat isFullScreen />
        </DialogContent>
      </Dialog>
    </div>
  );
}
