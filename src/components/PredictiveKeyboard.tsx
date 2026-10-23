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
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Type something</label>
        <Textarea
          placeholder="Start typing..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Button
        onClick={handlePredict}
        disabled={loading}
        size="lg"
        className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
        <div className="animate-fade-in space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Tap to add:</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {predictions.map((word, i) => (
              <button
                key={i}
                onClick={() => addWord(word)}
                className="group relative overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 px-5 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:scale-110 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative">{word}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
