import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2 } from "lucide-react";
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
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type something</label>
        <Textarea
          placeholder="Start typing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <Button
        onClick={handlePredict}
        disabled={loading}
        size="sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Predicting...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Predict Next Word
          </>
        )}
      </Button>

      {predictions.length > 0 && (
        <div className="animate-fade-in space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Tap to add:</p>
          <div className="flex flex-wrap gap-2">
            {predictions.map((word, i) => (
              <button
                key={i}
                onClick={() => addWord(word)}
                className="rounded-lg border bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:scale-105"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
