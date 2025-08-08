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
    <nav className="glass border-b border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="hover-lift">
              <TaporiBrainLogo size="lg" />
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    "hover:bg-accent/10 hover-lift",
                    isActive 
                      ? "nav-active" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <IconComponent size={16} />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="btn-glass w-9 h-9 p-0">
                  <ThemeIcon size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun size={16} className="mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon size={16} className="mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor size={16} className="mr-2" />
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