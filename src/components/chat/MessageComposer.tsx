import { useState, useRef, useCallback } from 'react';
import { Send, Paperclip, Mic, MicOff, Image, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Attachment {
  file: File;
  type: 'image' | 'file';
  preview?: string;
}

interface MessageComposerProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onSendVoice?: (audioFile: File) => void;
  disabled?: boolean;
}

export function MessageComposer({ 
  onSendMessage, 
  onSendVoice, 
  disabled = false 
}: MessageComposerProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSend = useCallback(() => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    const attachmentFiles = attachments.map(att => att.file);
    onSendMessage(message.trim(), attachmentFiles.length > 0 ? attachmentFiles : undefined);
    
    setMessage('');
    setAttachments([]);
    
    // Cleanup previews
    attachments.forEach(att => {
      if (att.preview) {
        URL.revokeObjectURL(att.preview);
      }
    });
  }, [message, attachments, onSendMessage, disabled]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const isImage = file.type.startsWith('image/');
      const attachment: Attachment = {
        file,
        type: isImage ? 'image' : 'file',
        preview: isImage ? URL.createObjectURL(file) : undefined,
      };
      
      setAttachments(prev => [...prev, attachment]);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const attachment = prev[index];
      if (attachment.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Check for supported MIME types
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          mimeType = 'audio/wav';
        }
      }
      
      const recorder = new MediaRecorder(stream, { mimeType });
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const extension = mimeType.split('/')[1] || 'webm';
        const audioFile = new File([audioBlob], `voice-message.${extension}`, { type: mimeType });
        
        if (onSendVoice) {
          onSendVoice(audioFile);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setMediaRecorder(null);
  };

  const canSend = (message.trim().length > 0 || attachments.length > 0) && !disabled;

  return (
    <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="p-3 sm:p-4 border-b border-border/50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div key={index} className="relative group">
                {attachment.type === 'image' && attachment.preview ? (
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-border">
                    <img 
                      src={attachment.preview} 
                      alt={attachment.file.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      onClick={() => removeAttachment(index)}
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <Badge 
                    variant="secondary" 
                    className="pr-6 relative group-hover:bg-destructive/10 text-xs"
                  >
                    <FileIcon size={10} className="mr-1" />
                    <span className="max-w-20 sm:max-w-32 truncate">
                      {attachment.file.name}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 p-0 rounded-full text-destructive opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      onClick={() => removeAttachment(index)}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-3 sm:p-4">
        <div className="flex items-end gap-2 sm:gap-3">
          {/* File Upload */}
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 p-0 hover-lift"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip size={14} className="sm:w-4 sm:h-4" />
          </Button>

          {/* Text Input */}
          <div className="flex-1 relative min-w-0">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[40px] sm:min-h-[44px] max-h-32 resize-none glass text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3"
              disabled={disabled}
            />
          </div>

          {/* Voice Record */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 p-0 transition-all duration-200 hover-lift",
              isRecording && "text-destructive animate-pulse bg-destructive/10"
            )}
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={disabled}
          >
            {isRecording ? <MicOff size={14} className="sm:w-4 sm:h-4" /> : <Mic size={14} className="sm:w-4 sm:h-4" />}
          </Button>

          {/* Send Button */}
          <Button
            className={cn(
              "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 p-0 transition-all duration-200 hover-lift",
              canSend ? "btn-saffron" : "btn-glass"
            )}
            size="sm"
            onClick={handleSend}
            disabled={!canSend}
          >
            <Send size={14} className="sm:w-4 sm:h-4" />
          </Button>
        </div>

        {isRecording && (
          <div className="mt-2 text-xs sm:text-sm text-destructive flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            <span className="hidden sm:inline">Recording... (Release to send)</span>
            <span className="sm:hidden">Recording...</span>
          </div>
        )}
        
        <div className="mt-1 text-xs text-muted-foreground hidden sm:block">
          Enter to send, Shift+Enter for new line
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}