import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Tag, Loader2 } from "lucide-react";
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

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Text to Classify</label>
          <Textarea
            placeholder="Paste or type text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Classification Type</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
              <SelectItem value="spam">Spam Detection</SelectItem>
              <SelectItem value="topic">Topic Classification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleClassify} disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Classifying...
          </>
        ) : (
          <>
            <Tag className="h-4 w-4" />
            Classify Text
          </>
        )}
      </Button>

      {result && (
        <Card className="animate-fade-in p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Classification Result</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{Math.round(result.confidence * 100)}%</span>
              <span className="text-xs text-muted-foreground">confidence</span>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Label</p>
              <p className="text-lg font-semibold capitalize">{result.label}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">Explanation</p>
              <p className="text-sm text-muted-foreground">{result.explanation}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
