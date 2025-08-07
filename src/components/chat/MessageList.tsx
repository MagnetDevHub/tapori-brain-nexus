import { useEffect, useRef } from 'react';
import { Bot, User, Paperclip, Heart, Laugh, ThumbsUp } from 'lucide-react';
import { Message } from '@/store/sessions';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

const emotionIcons = {
  happy: Laugh,
  love: Heart,
  thumbsup: ThumbsUp,
};

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="animate-slide-up">
          {message.role === 'user' ? (
            <div className="flex justify-end">
              <div className="message-user max-w-2xl">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs bg-white/10 rounded p-2">
                            <Paperclip size={12} />
                            <span>{attachment.name}</span>
                            {attachment.size && (
                              <span className="text-white/70">
                                ({(attachment.size / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User size={12} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-start">
              <div className="message-assistant max-w-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot size={12} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    {message.agent && (
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {message.agent}
                        </Badge>
                      </div>
                    )}
                    
                    <p className="text-sm leading-relaxed mb-2">{message.content}</p>
                    
                    {message.emotions && message.emotions.length > 0 && (
                      <div className="flex items-center gap-1">
                        {message.emotions.map((emotion, index) => {
                          const IconComponent = emotionIcons[emotion as keyof typeof emotionIcons];
                          return IconComponent ? (
                            <IconComponent 
                              key={index} 
                              size={14} 
                              className="text-primary opacity-70" 
                            />
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start animate-slide-up">
          <div className="message-assistant max-w-2xl">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot size={12} className="text-primary animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}