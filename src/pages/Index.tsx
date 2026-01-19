import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PersonaProvider, usePersona } from '@/contexts/PersonaContext';
import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { OnboardingFlow } from '@/components/OnboardingFlow';

type OnboardingStage = 'welcome' | 'onboarding' | 'dashboard';

function AppContent() {
  const [stage, setStage] = useState<OnboardingStage>('welcome');
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { setPersona } = usePersona();

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersonaId(personaId);
    setPersona(personaId);
    setStage('onboarding');
  };

  const handleOnboardingComplete = () => {
    setStage('dashboard');
  };

  return (
    <AnimatePresence mode="wait">
      {stage === 'welcome' && (
        <motion.div
          key="welcome"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <WelcomeScreen onPersonaSelect={handlePersonaSelect} />
        </motion.div>
      )}
      
      {stage === 'onboarding' && selectedPersonaId && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingFlow 
            personaId={selectedPersonaId} 
            onComplete={handleOnboardingComplete} 
          />
        </motion.div>
      )}
      
      {stage === 'dashboard' && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDesktop ? <DesktopLayout /> : <MobileLayout />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const Index = () => {
  return (
    <PersonaProvider>
      <AppContent />
    </PersonaProvider>
  );
};

export default Index;
