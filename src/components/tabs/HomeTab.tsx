import { usePersona } from '@/contexts/PersonaContext';
import { TrendingDown, Wallet, Target, ArrowRight, Flame } from 'lucide-react';
import { categories } from '@/data/mockData';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FinEdLogo } from '@/components/FinEdLogo';

export function HomeTab() {
  const { currentPersona, transactions, userStats } = usePersona();

  const monthlySpending = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const spendingByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });
    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [transactions]);

  const remaining = currentPersona.monthlyIncome - monthlySpending;
  const dailyAllowance = Math.max(0, Math.floor(Math.max(0, remaining) / 7));
  const isOverBudget = remaining < 0;
  const spendingPercent = (monthlySpending / currentPersona.monthlyIncome) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Branding Section */}
      <motion.div 
        className="flex flex-col items-center py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FinEdLogo size="lg" showTagline animate />
      </motion.div>

      {/* Welcome Card */}
      <motion.div 
        className="spending-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{currentPersona.avatar}</span>
            <p className="text-white/80 text-sm">Hey {currentPersona.name}!</p>
          </div>
          <h2 className="text-3xl font-bold font-display mb-1">
            {isOverBudget ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
          </h2>
          <p className="text-white/70 text-sm">{isOverBudget ? 'over budget' : 'remaining this month'}</p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, spendingPercent)}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-sm font-medium">{spendingPercent.toFixed(0)}% spent</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 text-success mb-2">
            <Wallet className="w-4 h-4" />
            <span className="text-xs font-medium">Income</span>
          </div>
          <p className="text-xl font-bold font-display">₹{currentPersona.monthlyIncome.toLocaleString()}</p>
        </motion.div>
        <motion.div 
          className="glass-card p-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <div className="flex items-center gap-2 text-accent mb-2">
            <TrendingDown className="w-4 h-4" />
            <span className="text-xs font-medium">Spent</span>
          </div>
          <p className="text-xl font-bold font-display">₹{monthlySpending.toLocaleString()}</p>
        </motion.div>
      </div>

      {/* Daily Allowance */}
      <motion.div 
        className="allowance-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Daily Spending Allowance</p>
            <p className="text-3xl font-bold font-display text-secondary">₹{dailyAllowance}</p>
            <p className="text-xs text-muted-foreground mt-1">Stay within this to hit your goals</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center animate-float">
            <Target className="w-8 h-8 text-secondary" />
          </div>
        </div>
      </motion.div>

      {/* XP & Streak */}
      <motion.div 
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="xp-badge">
              <Flame className="w-3 h-3" />
              {userStats.streak} day streak
            </div>
            <div className="text-sm">
              <span className="font-bold text-primary">{userStats.totalXP}</span>
              <span className="text-muted-foreground"> XP</span>
            </div>
          </div>
          <div className="flex gap-1">
            {userStats.badges.slice(0, 3).map((badge, i) => (
              <span key={i} className="text-lg animate-badge-pop" style={{ animationDelay: `${i * 100}ms` }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Spending Categories */}
      <motion.div 
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Top Spending</h3>
          <button className="text-sm text-primary flex items-center gap-1 hover:underline">
            See all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {spendingByCategory.map(([categoryId, amount], index) => {
            const category = categories.find((c) => c.id === categoryId);
            if (!category) return null;
            const percent = (amount / monthlySpending) * 100;
            
            return (
              <motion.div 
                key={categoryId} 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
              >
                <div className={`w-10 h-10 rounded-xl ${category.color} flex items-center justify-center text-lg`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="text-sm font-bold">₹{amount.toLocaleString()}</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div 
                      className={`h-full ${category.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
