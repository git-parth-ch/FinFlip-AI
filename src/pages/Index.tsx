import { useMediaQuery } from '@/hooks/useMediaQuery';
import { PersonaProvider } from '@/contexts/PersonaContext';
import { MobileLayout } from '@/components/MobileLayout';
import { DesktopLayout } from '@/components/DesktopLayout';

const Index = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <PersonaProvider>
      {isDesktop ? <DesktopLayout /> : <MobileLayout />}
    </PersonaProvider>
  );
};

export default Index;
