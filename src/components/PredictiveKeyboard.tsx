import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const PredictiveKeyboard = () => {
  const [text, setText] = useState("");
  const [predictions, setPredictions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePredict = async () => {
    if (!text.trim()) {
      toast({
        title: "Enter some text",
        description: "Type at least a few words to get predictions",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('predictive-keyboard', {
        body: { text }
      });

      if (error) throw error;
      setPredictions(data.predictions);
    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        title: "Prediction failed",
        description: error.message || "Failed to predict next words",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addWord = (word: string) => {
    setText(prev => `${prev} ${word}`);
    setPredictions([]);
  };

  return (
    <div className="space-y-4" aria-busy={loading} aria-live="polite">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type something</label>
        <Textarea
          placeholder="Start typing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button
          onClick={handlePredict}
          disabled={loading}
          size="lg"
          className="hover-scale relative flex items-center gap-2 px-5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking of next words…</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Predict Next Word</span>
            </>
          )}
        </Button>

        {loading && (
          <p className="text-xs text-muted-foreground">
            Using the text you&apos;ve typed so far – suggestions may take a moment.
          </p>
        )}
      </div>

      {predictions.length > 0 && (
        <div className="animate-fade-in space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">
              Tap a suggestion to keep writing
              {loading && <span className="ml-2 text-xs text-muted-foreground">(refreshing…)</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {predictions.map((word, i) => (
              <button
                key={i}
                onClick={() => addWord(word)}
                className="hover-scale group relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="relative">{word}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
