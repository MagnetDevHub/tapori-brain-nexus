import { Link } from 'react-router-dom';
import { Clock, Zap, Sparkles, CheckCircle, ArrowRight, MessageSquare, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Roadmap() {
  const roadmapSections = {
    now: {
      title: 'Now',
      description: 'Currently available features',
      icon: CheckCircle,
      color: 'text-success',
      features: [
        {
          title: 'Multi-Session Chat',
          description: 'Create, manage, and switch between multiple chat sessions',
          status: 'live',
        },
        {
          title: 'File & Image Upload',
          description: 'Attach files and images to your messages',
          status: 'live',
        },
        {
          title: 'Voice Recording',
          description: 'Hold-to-record voice messages with WebM support',
          status: 'live',
        },
        {
          title: 'Real-time Streaming',
          description: 'Stream responses in real-time from AGI agents',
          status: 'live',
        },
        {
          title: 'Dark/Light Mode',
          description: 'Beautiful glass morphism design with theme switching',
          status: 'live',
        },
        {
          title: 'Admin Dashboard',
          description: 'Monitor system stats and configure settings',
          status: 'live',
        },
      ],
    },
    next: {
      title: 'Next',
      description: 'Coming soon features',
      icon: Zap,
      color: 'text-primary',
      features: [
        {
          title: 'Slash Commands',
          description: 'Quick commands like /code, /plan, /summarize',
          status: 'development',
        },
        {
          title: 'WebSocket Integration',
          description: 'Real-time bidirectional communication',
          status: 'development',
        },
        {
          title: 'Session Memory Visualization',
          description: 'Visual representation of conversation context',
          status: 'planning',
        },
        {
          title: 'Text-to-Speech',
          description: 'Voice replies with natural TTS playback',
          status: 'planning',
        },
        {
          title: 'Hindi/English Toggle',
          description: 'Multi-language support for Indian users',
          status: 'planning',
        },
        {
          title: 'Agent Personalities',
          description: 'Choose different AI personalities and expertise',
          status: 'planning',
        },
      ],
    },
    later: {
      title: 'Later',
      description: 'Future possibilities',
      icon: Sparkles,
      color: 'text-navy',
      features: [
        {
          title: 'Plugin Ecosystem',
          description: 'Third-party integrations and custom plugins',
          status: 'research',
        },
        {
          title: 'Collaborative Sessions',
          description: 'Share and collaborate on chat sessions',
          status: 'research',
        },
        {
          title: 'Mobile App',
          description: 'Native iOS and Android applications',
          status: 'research',
        },
        {
          title: 'API Access',
          description: 'Public API for developers and integrations',
          status: 'research',
        },
        {
          title: 'Custom Model Training',
          description: 'Train specialized models for specific use cases',
          status: 'research',
        },
        {
          title: 'Enterprise Features',
          description: 'Team management, analytics, and enterprise SSO',
          status: 'research',
        },
      ],
    },
  };

  const statusColors = {
    live: 'bg-success text-success-foreground',
    development: 'bg-primary text-primary-foreground',
    planning: 'bg-navy text-navy-foreground',
    research: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-success to-navy bg-clip-text text-transparent">
          TaporiBrain Roadmap
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our journey of building the most advanced AGI interface in India
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Button asChild className="btn-primary">
            <Link to="/">
              <MessageSquare size={16} className="mr-2" />
              Try Chat
            </Link>
          </Button>
          <Button asChild variant="outline" className="btn-glass">
            <Link to="/admin">
              <Settings size={16} className="mr-2" />
              Admin Panel
            </Link>
          </Button>
        </div>
      </div>

      {/* Roadmap Sections */}
      <div className="space-y-8">
        {Object.entries(roadmapSections).map(([key, section]) => {
          const IconComponent = section.icon;
          
          return (
            <div key={key} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-background border ${section.color}`}>
                  <IconComponent size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p className="text-muted-foreground">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {section.features.map((feature, index) => (
                  <Card key={index} className="glass-card hover-lift">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                        <Badge 
                          className={statusColors[feature.status as keyof typeof statusColors]}
                          variant="secondary"
                        >
                          {feature.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed text-xs sm:text-sm">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <Card className="glass-card text-center">
        <CardContent className="p-8 space-y-4">
          <h3 className="text-2xl font-bold">Help Shape the Future</h3>
          <p className="text-muted-foreground max-w-lg mx-auto">
            TaporiBrain is continuously evolving. Your feedback helps us prioritize features 
            and build the AGI interface that India needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="btn-success">
              Share Feedback
            </Button>
            <Button variant="outline" className="btn-glass">
              Join Community
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
        <p className="flex items-center justify-center gap-2">
          Made with ❤️ in India 🇮🇳 
          <span className="mx-2">•</span>
          Proudly Building the Future of AGI
        </p>
      </div>
    </div>
  );
}