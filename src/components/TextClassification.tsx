import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tag, Loader2, TrendingUp, Shield, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClassificationResult {
  label: string;
  confidence: number;
  explanation: string;
}

export const TextClassification = () => {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("sentiment");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const { toast } = useToast();

  const handleClassify = async () => {
    if (!text.trim()) {
      toast({
        title: "Enter some text",
        description: "Please provide text to classify",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('classify-text', {
        body: { text, category }
      });

      if (error) throw error;
      setResult(data);

      // Save to history
      await supabase.from('text_classification_history').insert({
        input_text: text,
        category,
        label: data?.label,
        confidence: data?.confidence,
        raw_result: data
      });
    } catch (error: any) {
      console.error('Classification error:', error);
      toast({
        title: "Classification failed",
        description: error.message || "Failed to classify text",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'sentiment': return <TrendingUp className="h-4 w-4" />;
      case 'spam': return <Shield className="h-4 w-4" />;
      case 'topic': return <Layers className="h-4 w-4" />;
      default: return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Classify</label>
          <Textarea
            placeholder="Paste or type text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[140px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Classification Type</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="transition-all duration-200 hover:border-primary/40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sentiment" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sentiment Analysis
                </div>
              </SelectItem>
              <SelectItem value="spam" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Spam Detection
                </div>
              </SelectItem>
              <SelectItem value="topic" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Topic Classification
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleClassify} 
        disabled={loading}
        size="lg"
        className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Classifying...
          </>
        ) : (
          <>
            {getCategoryIcon()}
            Classify Text
          </>
        )}
      </Button>

      {result && (
        <Card className="animate-scale-in overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 p-6 shadow-xl shadow-primary/10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Classification Result</h3>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {Math.round(result.confidence * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">confidence</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {getCategoryIcon()}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg" />
              <div className="relative space-y-4 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Predicted Label</p>
                  <p className="text-2xl font-bold capitalize">{result.label}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Explanation</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{result.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
