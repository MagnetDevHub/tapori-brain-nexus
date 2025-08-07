import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useSessionStore } from '@/store/sessions';
import { chatAPI } from '@/services/api';
import { ChatSidebar } from '@/components/chat/Sidebar';
import { MessageList } from '@/components/chat/MessageList';
import { MessageComposer } from '@/components/chat/MessageComposer';
import { TaporiBrainLogo } from '@/components/ui/TaporiBrainLogo';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Chat() {
  const { 
    sessions, 
    currentSessionId, 
    createSession, 
    addMessage, 
    getCurrentSession,
    isLoading,
    setLoading 
  } = useSessionStore();
  
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);

  const currentSession = getCurrentSession();

  // Create initial session if none exists
  useEffect(() => {
    if (sessions.length === 0) {
      createSession('Welcome Chat');
    }
  }, [sessions.length, createSession]);

  const handleSendMessage = async (message: string, attachments?: File[]) => {
    if (!currentSessionId) return;

    try {
      setLoading(true);
      setIsTyping(true);

      // Add user message
      addMessage(currentSessionId, {
        role: 'user',
        content: message,
        attachments: attachments?.map(file => ({
          type: file.type.startsWith('image/') ? 'image' : 'file',
          name: file.name,
          url: URL.createObjectURL(file),
          size: file.size,
        })) || [],
      });

      // Send to API
      const response = await chatAPI.sendMessage(message, attachments);

      // Add assistant response
      addMessage(currentSessionId, {
        role: 'assistant',
        content: response.response,
        agent: response.agent,
        emotions: response.emotions,
      });

      toast({
        title: "Message sent",
        description: `${response.agent} responded successfully`,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      addMessage(currentSessionId, {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        agent: 'System',
      });

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleSendVoice = async (audioFile: File) => {
    try {
      const response = await chatAPI.sendVoice(audioFile);
      
      if (response.ok) {
        toast({
          title: "Voice message sent",
          description: "Your voice message has been processed",
        });
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast({
        title: "Error",
        description: "Failed to send voice message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-[calc(100vh-4rem)] w-full">
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className="hidden sm:block">
        <ChatSidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentSession ? (
          <>
            {/* Messages */}
            <MessageList 
              messages={currentSession.messages} 
              isLoading={isTyping}
            />

            {/* Composer */}
            <MessageComposer
              onSendMessage={handleSendMessage}
              onSendVoice={handleSendVoice}
              disabled={isLoading}
            />
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <TaporiBrainLogo size="xl" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Welcome to TaporiBrain
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Your advanced AGI assistant is ready to help. Start a conversation 
                  by creating a new chat session.
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Proudly Made in India 🇮🇳
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="sm:hidden fixed bottom-4 left-4 z-50">
        <Button
          size="sm"
          className="btn-saffron w-12 h-12 rounded-full shadow-lg"
          onClick={() => {
            console.log('Toggle mobile sidebar');
          }}
        >
          <MessageSquare size={20} />
        </Button>
      </div>
    </div>
  );
}