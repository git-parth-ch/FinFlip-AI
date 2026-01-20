import { usePersona } from '@/contexts/PersonaContext';
import { useStreak } from '@/contexts/StreakContext';
import { learningModules, Lesson } from '@/data/mockData';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, CheckCircle, Play, Star, Flame, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CelebrationModal } from '@/components/Confetti';

export function LearnTab() {
  const { userStats } = usePersona();
  const { markDailyActivity, bonusXp } = useStreak();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    xpEarned?: number;
    badge?: string;
  }>({ isOpen: false, title: '', message: '' });

  const isLessonCompleted = (lessonId: string, originalCompleted: boolean) => {
    return originalCompleted || completedLessons.has(lessonId);
  };

  const getModuleProgress = (module: typeof learningModules[0]) => {
    const completed = module.lessons.filter((l) => isLessonCompleted(l.id, l.completed)).length;
    return (completed / module.lessons.length) * 100;
  };

  const handleLessonComplete = (lesson: Lesson, module: typeof learningModules[0]) => {
    if (lesson.completed || completedLessons.has(lesson.id)) return;

    const newCompleted = new Set(completedLessons);
    newCompleted.add(lesson.id);
    setCompletedLessons(newCompleted);

    // Streak trigger: finishing one bite-sized lesson completes today.
    markDailyActivity('learning');

    // Check if this completes the module
    const allLessonsCompleted = module.lessons.every((l) => l.completed || newCompleted.has(l.id));

    if (allLessonsCompleted) {
      setCelebration({
        isOpen: true,
        title: 'Module Complete! 🎓',
        message: `You've mastered "${module.title}"! Keep up the amazing work!`,
        xpEarned: module.xpReward,
        badge: module.badge,
      });
    } else {
      setCelebration({
        isOpen: true,
        title: 'Lesson Complete! 🌟',
        message: `Great job finishing "${lesson.title}"!`,
        xpEarned: lesson.xp,
        badge: '✅',
      });
    }
  };

  const getNextLesson = (module: typeof learningModules[0]) => {
    return module.lessons.findIndex((l) => !isLessonCompleted(l.id, l.completed));
  };

  const displayedXp = userStats.totalXP + bonusXp + completedLessons.size * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration({ ...celebration, isOpen: false })}
        title={celebration.title}
        message={celebration.message}
        xpEarned={celebration.xpEarned}
        badge={celebration.badge}
      />

      {/* XP Header */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Your Progress</p>
            <div className="flex items-baseline gap-2">
              <motion.p
                className="text-3xl font-bold font-display text-primary"
                key={displayedXp}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
              >
                {displayedXp}
              </motion.p>
              <span className="text-muted-foreground text-sm">XP</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div className="xp-badge" whileHover={{ scale: 1.05 }}>
              <Flame className="w-3 h-3" />
              {userStats.streak} days
            </motion.div>
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
          <Progress value={65 + completedLessons.size * 5} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.max(0, 350 - completedLessons.size * 100)} XP to next level
          </p>
        </div>
      </motion.div>


      {/* Badges */}
      <motion.div 
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-semibold mb-3">Your Badges</h3>
        <div className="flex gap-2 flex-wrap">
          {userStats.badges.map((badge, i) => (
            <motion.div 
              key={i} 
              className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center text-2xl shadow-md"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {badge}
            </motion.div>
          ))}
          {[...Array(5 - userStats.badges.length)].map((_, i) => (
            <motion.div 
              key={`locked-${i}`} 
              className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Learning Modules */}
      <div>
        <h3 className="font-semibold mb-3">Learning Modules</h3>
        <div className="space-y-3">
          {learningModules.map((module, moduleIndex) => {
            const progress = getModuleProgress(module);
            const isCompleted = progress === 100;
            const isExpanded = selectedModule === module.id;
            const nextLessonIndex = getNextLesson(module);

            return (
              <motion.div 
                key={module.id} 
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + moduleIndex * 0.1 }}
              >
                <motion.button
                  onClick={() => setSelectedModule(isExpanded ? null : module.id)}
                  className="w-full p-4 flex items-center gap-3 text-left"
                  whileHover={{ backgroundColor: 'rgba(var(--primary), 0.02)' }}
                  whileTap={{ scale: 0.995 }}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-success/20' : 'bg-primary/10'
                    }`}
                    animate={isCompleted ? { 
                      boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0)', '0 0 0 8px rgba(34, 197, 94, 0.2)', '0 0 0 0 rgba(34, 197, 94, 0)']
                    } : {}}
                    transition={{ repeat: isCompleted ? Infinity : 0, duration: 2 }}
                  >
                    {module.icon}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{module.title}</p>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring' }}
                        >
                          <CheckCircle className="w-4 h-4 text-success" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-accent">+{module.xpReward} XP</span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="space-y-2 mt-3">
                          {module.lessons.map((lesson, index) => {
                            const completed = isLessonCompleted(lesson.id, lesson.completed);
                            const isNext = index === nextLessonIndex;
                            
                            return (
                              <motion.div
                                key={lesson.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={isNext ? { scale: 1.01, x: 4 } : {}}
                                whileTap={isNext ? { scale: 0.99 } : {}}
                                onClick={() => isNext && handleLessonComplete(lesson, module)}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                  completed 
                                    ? 'bg-success/10' 
                                    : isNext
                                      ? 'bg-primary/10 cursor-pointer hover:bg-primary/20'
                                      : 'bg-muted/50'
                                }`}
                              >
                                <motion.div 
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    completed 
                                      ? 'bg-success text-white' 
                                      : isNext
                                        ? 'bg-primary text-white'
                                        : 'bg-muted text-muted-foreground'
                                  }`}
                                  animate={isNext ? { 
                                    scale: [1, 1.1, 1],
                                  } : {}}
                                  transition={{ repeat: isNext ? Infinity : 0, duration: 1.5 }}
                                >
                                  {completed ? (
                                    <CheckCircle className="w-4 h-4" />
                                  ) : isNext ? (
                                    <Play className="w-4 h-4" />
                                  ) : (
                                    <Lock className="w-3 h-3" />
                                  )}
                                </motion.div>
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${!completed && !isNext ? 'text-muted-foreground' : ''}`}>
                                    {lesson.title}
                                  </p>
                                  {isNext && (
                                    <p className="text-xs text-primary mt-0.5">Tap to complete</p>
                                  )}
                                </div>
                                <motion.span 
                                  className="text-xs font-medium text-accent"
                                  animate={completed ? { scale: [1, 1.2, 1] } : {}}
                                >
                                  +{lesson.xp} XP
                                </motion.span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Card */}
      <motion.div 
        className="glass-card p-4 bg-gradient-hero text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Trophy className="w-6 h-6" />
          </motion.div>
          <div>
            <p className="font-semibold">Budget Master Badge</p>
            <p className="text-sm text-white/80">Complete all modules to unlock!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
