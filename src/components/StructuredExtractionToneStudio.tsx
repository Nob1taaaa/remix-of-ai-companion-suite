import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Braces, Wand2, Sparkles, Loader2 } from "lucide-react";

interface StructuredResult {
  extracted: Record<string, string>;
  toon: string;
}

export const StructuredExtractionToneStudio = () => {
  const { toast } = useToast();

  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<StructuredResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!rawText.trim()) {
      toast({
        title: "Paste some text first",
        description: "Add a messy paragraph, email, or job description to transform.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke<StructuredResult>("structured-studio", {
        body: { text: rawText },
      });

      if (error) throw error;

      setResult(data || null);
      toast({
        title: "Transformation complete",
        description: "JSON and TOON views generated from your text.",
      });
    } catch (err: any) {
      console.error("Structured studio error", err);
      toast({
        title: "Could not transform text",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="space-y-4 rounded-3xl border bg-card/80 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold md:text-lg">1. Paste messy input</h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                Drop in a chaotic paragraph, cold email, or job description. We&apos;ll tidy it and extract structure.
              </p>
            </div>
          </div>

          <Textarea
            placeholder="Example: Hi! I'm Alex, a data scientist at Acme with 3+ years in NLP, Python, and LLMs..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="min-h-[180px] text-sm"
          />

          <Button
            onClick={handleRun}
            disabled={loading || !rawText.trim()}
            className="mt-3 w-full md:w-auto relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking over your text...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Extract JSON &amp; TOON
              </>
            )}
          </Button>
        </Card>

        <Card className="space-y-4 rounded-3xl border bg-card/80 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Braces className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold md:text-lg">Why this matters</h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                Real apps often need both a clean JSON object for backends and a compact token-style format for models.
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-muted-foreground md:text-sm">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Turn unstructured text into tidy JSON objects you can save or pipe into APIs.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>See a TOON view that is compact and token-friendly for LLM prompts.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Only fields truly present in the input are extracted; nothing is invented.</span>
            </li>
          </ul>
        </Card>
      </div>

      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-scale-in overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/60 p-6 shadow-xl shadow-primary/10">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold md:text-base">
                <Braces className="h-4 w-4 text-primary" />
                JSON view
              </h3>
              <pre className="max-h-72 overflow-auto rounded-xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
                {JSON.stringify(result.extracted, null, 2)}
              </pre>
            </div>
          </Card>

          <Card className="animate-scale-in overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/60 p-6 shadow-xl shadow-primary/10">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-semibold md:text-base">
                <Wand2 className="h-4 w-4 text-primary" />
                TOON view
              </h3>
              <div className="max-h-72 overflow-auto rounded-xl bg-muted/70 p-4 text-xs leading-relaxed text-muted-foreground">
                <p className="whitespace-pre-line">{result.toon}</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </section>
  );
};
