import { useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PersonaProvider, usePersona } from '@/contexts/PersonaContext';
import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';
import { WelcomeScreen } from '@/components/WelcomeScreen';

function AppContent() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const { setPersona } = usePersona();

  const handlePersonaSelect = (personaId: string) => {
    setPersona(personaId);
    setHasOnboarded(true);
  };

  if (!hasOnboarded) {
    return <WelcomeScreen onPersonaSelect={handlePersonaSelect} />;
  }

  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}

const Index = () => {
  return (
    <PersonaProvider>
      <AppContent />
    </PersonaProvider>
  );
};

export default Index;
