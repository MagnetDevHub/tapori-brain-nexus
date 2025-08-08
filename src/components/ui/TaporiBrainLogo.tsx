import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaporiBrainLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function TaporiBrainLogo({ size = 'md', className }: TaporiBrainLogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Brain 
          size={iconSizes[size]} 
          className="text-primary animate-pulse"
        />
        <div className="absolute inset-0 animate-ping opacity-30">
          <Brain 
            size={iconSizes[size]} 
            className="text-primary/50"
          />
        </div>
      </div>
      <span className={cn(
        "font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent",
        sizes[size]
      )}>
        TaporiBrain
      </span>
    </div>
  );
}