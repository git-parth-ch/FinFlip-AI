import { usePersona } from '@/contexts/PersonaContext';
import { getPeerBenchmarks } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Legend } from 'recharts';
import { Download, FileText, Share2, Settings, HelpCircle, LogOut, Users } from 'lucide-react';

export function ProfileTab() {
  const { currentPersona, userStats, peerBenchmarks } = usePersona();

  const chartData = peerBenchmarks.map(b => ({
    name: b.category,
    You: b.userSpending,
    Peers: b.peerAverage,
  }));

  const exportOptions = [
    { id: 'notion', name: 'Export to Notion', icon: FileText, description: 'Markdown summary' },
    { id: 'jira', name: 'Sync to Jira/Linear', icon: Share2, description: 'Create tickets' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header */}
      <div className="glass-card p-6 text-center">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center text-4xl mb-4">
          {currentPersona.avatar}
        </div>
        <h2 className="text-xl font-bold font-display">{currentPersona.name}</h2>
        <p className="text-sm text-muted-foreground">{currentPersona.description}</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{userStats.level}</p>
            <p className="text-xs text-muted-foreground">Level</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{userStats.totalXP}</p>
            <p className="text-xs text-muted-foreground">XP</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-2xl font-bold text-secondary">{userStats.streak}</p>
            <p className="text-xs text-muted-foreground">Streak</p>
          </div>
        </div>
      </div>

      {/* Peer Comparison Chart */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Spending vs Peers</h3>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" barCategoryGap={8}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Bar dataKey="You" radius={[0, 4, 4, 0]} fill="hsl(240, 55%, 50%)" />
              <Bar dataKey="Peers" radius={[0, 4, 4, 0]} fill="hsl(175, 55%, 45%)" />
              <Legend 
                wrapperStyle={{ paddingTop: 8 }}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Compare your spending with others your age
        </p>
      </div>

      {/* Export Actions */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Export Actions</h3>
        </div>
        <div className="space-y-2">
          {exportOptions.map((option) => (
            <button
              key={option.id}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <option.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{option.name}</p>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
      <div className="glass-card overflow-hidden">
        {[
          { icon: Settings, label: 'Settings', color: 'text-muted-foreground' },
          { icon: HelpCircle, label: 'Help & Support', color: 'text-muted-foreground' },
          { icon: LogOut, label: 'Sign Out', color: 'text-destructive' },
        ].map((item, index) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors ${
              index !== 0 ? 'border-t border-border' : ''
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.color}`} />
            <span className={`font-medium ${item.color}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
