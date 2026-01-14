import { usePersona } from '@/contexts/PersonaContext';
import { learningModules } from '@/data/mockData';
import { useState } from 'react';
import { Trophy, Lock, CheckCircle, Play, Star, Flame, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function LearnTab() {
  const { userStats } = usePersona();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const getModuleProgress = (module: typeof learningModules[0]) => {
    const completed = module.lessons.filter((l) => l.completed).length;
    return (completed / module.lessons.length) * 100;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* XP Header */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Your Progress</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold font-display text-primary">{userStats.totalXP}</p>
              <span className="text-muted-foreground text-sm">XP</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="xp-badge">
              <Flame className="w-3 h-3" />
              {userStats.streak} days
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Level {userStats.level}</span>
            </div>
          </div>
        </div>
        
        {/* XP Progress to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {userStats.level}</span>
            <span>Level {userStats.level + 1}</span>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">350 XP to next level</p>
        </div>
      </div>

      {/* Badges */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Your Badges</h3>
        <div className="flex gap-2 flex-wrap">
          {userStats.badges.map((badge, i) => (
            <div 
              key={i} 
              className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-2xl animate-badge-pop shadow-md"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {badge}
            </div>
          ))}
          {[...Array(5 - userStats.badges.length)].map((_, i) => (
            <div 
              key={`locked-${i}`} 
              className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* Learning Modules */}
      <div>
        <h3 className="font-semibold mb-3">Learning Modules</h3>
        <div className="space-y-3">
          {learningModules.map((module) => {
            const progress = getModuleProgress(module);
            const isCompleted = progress === 100;
            const isExpanded = selectedModule === module.id;

            return (
              <div key={module.id} className="glass-card overflow-hidden">
                <button
                  onClick={() => setSelectedModule(isExpanded ? null : module.id)}
                  className="w-full p-4 flex items-center gap-3 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    isCompleted ? 'bg-success/20' : 'bg-primary/10'
                  }`}>
                    {module.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{module.title}</p>
                      {isCompleted && <CheckCircle className="w-4 h-4 text-success" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-accent">+{module.xpReward} XP</span>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 border-t border-border animate-fade-in">
                    <div className="space-y-2 mt-3">
                      {module.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                            lesson.completed 
                              ? 'bg-success/10' 
                              : index === module.lessons.findIndex(l => !l.completed)
                                ? 'bg-primary/10 cursor-pointer hover:bg-primary/20'
                                : 'bg-muted/50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            lesson.completed 
                              ? 'bg-success text-white' 
                              : index === module.lessons.findIndex(l => !l.completed)
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : index === module.lessons.findIndex(l => !l.completed) ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <Lock className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${!lesson.completed && index !== module.lessons.findIndex(l => !l.completed) ? 'text-muted-foreground' : ''}`}>
                              {lesson.title}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-accent">+{lesson.xp} XP</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Card */}
      <div className="glass-card p-4 bg-gradient-hero text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="font-semibold">Budget Master Badge</p>
            <p className="text-sm text-white/80">Complete all modules to unlock!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
