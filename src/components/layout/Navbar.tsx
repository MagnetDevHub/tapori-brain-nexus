import { Moon, Sun, Monitor, Settings, Map, MessageSquare } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaporiBrainLogo } from '@/components/ui/TaporiBrainLogo';
import { useTheme } from '@/utils/theme';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { theme, setTheme, getEffectiveTheme } = useTheme();
  const location = useLocation();
  
  const navigation = [
    { name: 'Chat', href: '/', icon: MessageSquare },
    { name: 'Admin', href: '/admin', icon: Settings },
    { name: 'Roadmap', href: '/roadmap', icon: Map },
  ];

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <nav className="glass-card border-b border-border/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover-lift">
              <TaporiBrainLogo size="lg" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/50 hover-lift",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <IconComponent size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="btn-glass w-8 h-8 sm:w-9 sm:h-9 p-0">
                  <ThemeIcon size={14} className="sm:w-4 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun size={14} className="mr-2 sm:w-4 sm:h-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon size={14} className="mr-2 sm:w-4 sm:h-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor size={14} className="mr-2 sm:w-4 sm:h-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}