import { usePersona } from '@/contexts/PersonaContext';
import { categories } from '@/data/mockData';
import { useMemo, useState } from 'react';
import { Calendar, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export function ExpensesTab() {
  const { transactions } = usePersona();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchQuery, selectedCategory]);

  const groupedTransactions = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    filteredTransactions.forEach((t) => {
      let key: string;
      if (isToday(t.date)) {
        key = 'Today';
      } else if (isYesterday(t.date)) {
        key = 'Yesterday';
      } else if (isThisWeek(t.date)) {
        key = 'This Week';
      } else {
        key = format(t.date, 'MMMM d');
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const totalFiltered = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Expenses</h2>
          <span className="text-sm text-muted-foreground">30 days</span>
        </div>
        <p className="text-3xl font-bold font-display">₹{totalFiltered.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{filteredTransactions.length} transactions</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="pl-10 rounded-xl"
          />
        </div>
        <button className="px-3 py-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
          <Filter className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            !selectedCategory 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All
        </button>
        {categories.slice(0, 6).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              selectedCategory === cat.id
                ? `${cat.color}`
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, txns]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
            </div>
            <div className="space-y-2">
              {txns.map((transaction) => {
                const category = categories.find((c) => c.id === transaction.category);
                
                return (
                  <div
                    key={transaction.id}
                    className="glass-card p-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl ${category?.color || 'bg-muted'} flex items-center justify-center text-lg`}>
                      {category?.icon || '📦'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{transaction.merchant}</p>
                      <p className="text-xs text-muted-foreground truncate">{transaction.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">-₹{transaction.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{format(transaction.date, 'h:mm a')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
