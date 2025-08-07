import { useState } from 'react';
import { Plus, MessageSquare, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { useSessionStore } from '@/store/sessions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function ChatSidebar() {
  const {
    sessions,
    currentSessionId,
    createSession,
    deleteSession,
    renameSession,
    setCurrentSession,
  } = useSessionStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateSession = () => {
    createSession();
  };

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingId && editTitle.trim()) {
      renameSession(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  return (
    <div className="w-80 sidebar-glass flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <Button
          onClick={handleCreateSession}
          className="w-full btn-saffron flex items-center gap-2"
          size="sm"
        >
          <Plus size={16} />
          New Chat
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group relative rounded-lg p-3 cursor-pointer transition-all duration-200",
              "hover:bg-accent/50 hover-lift",
              currentSessionId === session.id 
                ? "bg-accent border border-primary/20 shadow-md" 
                : "hover:bg-muted/50"
            )}
            onClick={() => setCurrentSession(session.id)}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-muted-foreground flex-shrink-0" />
              
              {editingId === session.id ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleSaveRename}
                  className="h-6 px-1 text-sm bg-transparent border-primary/50"
                  autoFocus
                />
              ) : (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {session.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.messages.length} messages
                  </p>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                  >
                    <MoreHorizontal size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(session.id, session.title);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Edit2 size={14} />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className="flex items-center gap-2 text-destructive"
                  >
                    <Trash2 size={14} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}

        {sessions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No chat sessions yet</p>
            <p className="text-xs">Create your first chat to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}