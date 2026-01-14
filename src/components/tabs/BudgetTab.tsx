import { usePersona } from '@/contexts/PersonaContext';
import { budgetTemplates } from '@/data/mockData';
import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Check, Info, Sparkles } from 'lucide-react';

export function BudgetTab() {
  const { currentPersona, transactions } = usePersona();
  const [selectedTemplate, setSelectedTemplate] = useState(
    currentPersona.type === 'student' ? 'student' : 'standard'
  );

  const template = budgetTemplates.find((t) => t.id === selectedTemplate) || budgetTemplates[0];

  const budgetAmounts = useMemo(() => ({
    needs: Math.floor(currentPersona.monthlyIncome * (template.needs / 100)),
    wants: Math.floor(currentPersona.monthlyIncome * (template.wants / 100)),
    savings: Math.floor(currentPersona.monthlyIncome * (template.savings / 100)),
  }), [currentPersona.monthlyIncome, template]);

  const monthlySpending = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const chartData = [
    { name: 'Needs', value: template.needs, color: 'hsl(240, 55%, 50%)' },
    { name: 'Wants', value: template.wants, color: 'hsl(175, 55%, 45%)' },
    { name: 'Savings', value: template.savings, color: 'hsl(15, 85%, 60%)' },
  ];

  const remaining = currentPersona.monthlyIncome - monthlySpending;
  const dailyAllowance = Math.max(0, Math.floor(remaining / 7));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Daily Allowance Card */}
      <div className="spending-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm mb-1">You can spend today</p>
            <p className="text-4xl font-bold font-display">₹{dailyAllowance}</p>
            <p className="text-white/60 text-xs mt-2">Based on your {template.name} budget</p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Budget Template</h3>
        <div className="grid grid-cols-2 gap-3">
          {budgetTemplates.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                selectedTemplate === tmpl.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {selectedTemplate === tmpl.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <p className="font-semibold text-sm">{tmpl.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{tmpl.description}</p>
              <p className="text-xs font-mono text-primary mt-2">
                {tmpl.needs}/{tmpl.wants}/{tmpl.savings}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Breakdown Chart */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-4">Your Budget Split</h3>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-sm font-bold">₹{Object.values(budgetAmounts)[index].toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.value}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-lg">🏠</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Needs</p>
              <p className="text-xs text-muted-foreground">Rent, food, transport, utilities</p>
            </div>
            <p className="font-bold">₹{budgetAmounts.needs.toLocaleString()}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (monthlySpending * 0.6 / budgetAmounts.needs) * 100)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="text-secondary text-lg">🎬</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Wants</p>
              <p className="text-xs text-muted-foreground">Entertainment, shopping, dining out</p>
            </div>
            <p className="font-bold">₹{budgetAmounts.wants.toLocaleString()}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
            <div 
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (monthlySpending * 0.3 / budgetAmounts.wants) * 100)}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <span className="text-accent text-lg">🐷</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Savings</p>
              <p className="text-xs text-muted-foreground">Emergency fund, goals, investments</p>
            </div>
            <p className="font-bold">₹{budgetAmounts.savings.toLocaleString()}</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-3">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: '45%' }}
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/10 border border-secondary/20">
        <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-secondary">Pro Tip</p>
          <p className="text-xs text-muted-foreground mt-1">
            The {template.name} template is optimized for {currentPersona.type === 'student' ? 'students' : 'young professionals'} like you!
          </p>
        </div>
      </div>
    </div>
  );
}
