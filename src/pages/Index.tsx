import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PersonaProvider, usePersona } from '@/contexts/PersonaContext';
import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';
import { DiscoveryFlow, DiscoveryData } from '@/components/DiscoveryFlow';
import { OnboardingFlow } from '@/components/OnboardingFlow';

type OnboardingStage = 'discovery' | 'onboarding' | 'dashboard';

function AppContent() {
  const [stage, setStage] = useState<OnboardingStage>('discovery');
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | null>(null);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { setPersona } = usePersona();

  const handleDiscoveryComplete = (data: DiscoveryData) => {
    setDiscoveryData(data);
    setPersona(data.personaId);
    
    // If bank/SMS already linked in discovery, skip to dashboard
    if (data.bankLinked || data.smsEnabled) {
      setStage('dashboard');
    } else {
      // Otherwise show the onboarding flow for bank/SMS linking
      setStage('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setStage('dashboard');
  };

  return (
    <AnimatePresence mode="wait">
      {stage === 'discovery' && (
        <motion.div
          key="discovery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DiscoveryFlow onComplete={handleDiscoveryComplete} />
        </motion.div>
      )}
      
      {stage === 'onboarding' && discoveryData && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <OnboardingFlow 
            personaId={discoveryData.personaId} 
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
