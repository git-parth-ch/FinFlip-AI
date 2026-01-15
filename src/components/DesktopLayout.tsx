import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Receipt, PiggyBank, GraduationCap, User, Sparkles, PanelLeftClose, PanelLeft } from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import { AIChat } from './AIChat';
import { HomeTab } from './tabs/HomeTab';
import { ExpensesTab } from './tabs/ExpensesTab';
import { BudgetTab } from './tabs/BudgetTab';
import { LearnTab } from './tabs/LearnTab';
import { ProfileTab } from './tabs/ProfileTab';
import { Button } from '@/components/ui/button';

type TabType = 'home' | 'expenses' | 'budget' | 'learn' | 'profile';

const tabs = [
  { id: 'home' as TabType, label: 'Home', icon: Home },
  { id: 'expenses' as TabType, label: 'Expenses', icon: Receipt },
  { id: 'budget' as TabType, label: 'Budget', icon: PiggyBank },
  { id: 'learn' as TabType, label: 'Learn', icon: GraduationCap },
  { id: 'profile' as TabType, label: 'Profile', icon: User },
];

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const tabComponents: Record<TabType, React.ReactNode> = {
  home: <HomeTab />,
  expenses: <ExpensesTab />,
  budget: <BudgetTab />,
  learn: <LearnTab />,
  profile: <ProfileTab />,
};

export function DesktopLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showAIPane, setShowAIPane] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Pane - AI Chat */}
      <div 
        className={`fixed left-0 top-0 bottom-0 border-r border-border bg-card transition-all duration-300 z-40 ${
          showAIPane ? 'w-[400px]' : 'w-0'
        }`}
      >
        {showAIPane && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold">FinEd Assistant</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAIPane(false)}
                className="rounded-lg"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <AIChat />
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button when AI pane is hidden */}
      {!showAIPane && (
        <Button
          onClick={() => setShowAIPane(true)}
          className="fixed left-4 top-4 z-50 bg-gradient-primary hover:opacity-90 rounded-xl shadow-glow"
        >
          <PanelLeft className="w-4 h-4 mr-2" />
          Open AI
        </Button>
      )}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showAIPane ? 'ml-[400px]' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!showAIPane && (
                <div className="flex items-center gap-2 mr-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-lg">FinEd</span>
                </div>
              )}
              <nav className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-card text-primary shadow-sm' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            <PersonaSwitcher />
          </div>
        </header>

        {/* Content */}
        <main className="px-6 py-6 max-w-5xl mx-auto">
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tabComponents[activeTab]}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
