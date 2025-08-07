import { Brain, Sparkles } from 'lucide-react';

interface TaporiBrainLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm' },
  md: { icon: 24, text: 'text-lg' },
  lg: { icon: 32, text: 'text-xl' },
  xl: { icon: 48, text: 'text-2xl' },
};

export function TaporiBrainLogo({ 
  size = 'md', 
  showText = true, 
  className = '' 
}: TaporiBrainLogoProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Brain 
          size={icon} 
          className="text-primary animate-glow-pulse" 
        />
        <Sparkles 
          size={icon * 0.6} 
          className="absolute -top-1 -right-1 text-success animate-pulse" 
        />
      </div>
      {showText && (
        <span className={`font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent ${text}`}>
          TaporiBrain
        </span>
      )}
    </div>
  );
}