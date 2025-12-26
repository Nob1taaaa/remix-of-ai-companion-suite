import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const StreamingAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stream-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
          },
          body: JSON.stringify({ messages: [...messages, userMessage] })
        }
      );

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let textBuffer = "";

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;

        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1].content = assistantContent;
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, will retry
          }
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Streaming error:', error);
      toast({
        title: "Chat error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
      setLoading(false);
      setMessages(prev => prev.slice(0, -1)); // Remove empty assistant message
    }
  };

  return (
    <div className="flex h-[500px] flex-col space-y-4">
      <Card className="flex-1 overflow-y-auto border-2 border-primary/20 bg-gradient-to-b from-card to-card/50 p-4 shadow-xl">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center space-y-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 animate-pulse">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">Start a conversation</p>
                <p className="text-sm text-muted-foreground">
                  Ask anything and get real-time streaming responses
                </p>
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div
                className={`group relative max-w-[85%] transform rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground'
                    : 'border border-border/50 bg-gradient-to-br from-muted to-muted/50 text-foreground'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="absolute -left-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Send className="h-3 w-3" />
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.content === '' && (
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <div className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          disabled={loading}
          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
        <Button 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
