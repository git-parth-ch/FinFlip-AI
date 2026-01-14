import { usePersona } from '@/contexts/PersonaContext';
import { personas } from '@/data/mockData';
import { ChevronDown, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function PersonaSwitcher() {
  const { currentPersona, setPersona } = usePersona();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 shadow-sm">
        <span className="text-2xl">{currentPersona.avatar}</span>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground">{currentPersona.name}</p>
          <p className="text-xs text-muted-foreground">₹{currentPersona.monthlyIncome.toLocaleString()}/mo</p>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Switch Persona
          </p>
        </div>
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onClick={() => setPersona(persona.id)}
            className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer ${
              currentPersona.id === persona.id ? 'bg-primary/10' : ''
            }`}
          >
            <span className="text-2xl">{persona.avatar}</span>
            <div className="flex-1">
              <p className="font-medium text-foreground">{persona.name}</p>
              <p className="text-xs text-muted-foreground">{persona.description}</p>
            </div>
            <span className="text-xs font-semibold text-primary">
              ₹{persona.monthlyIncome.toLocaleString()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
