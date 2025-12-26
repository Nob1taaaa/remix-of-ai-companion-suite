import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  score: number;
  feedback: string[];
  matchedSkills: string[];
  missingSkills: string[];
}

export const ResumeScanner = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both resume and job description",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('scan-resume', {
        body: { resumeText, jobDescription }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: "Analysis complete!",
        description: `Match score: ${data.score}/100`,
      });
    } catch (error: any) {
      console.error('Scan error:', error);
      toast({
        title: "Scan failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">AI Resume Scanner</h2>
            <p className="text-sm text-muted-foreground">
              Get instant match scoring &amp; feedback
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Resume Text</label>
          <Textarea
            placeholder="Paste your resume here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Job Description</label>
          <Textarea
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>
      </div>

      <Button
        onClick={handleScan}
        disabled={loading}
        className="w-full md:w-auto"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Scan Resume
          </>
        )}
      </Button>

      {result && (
        <Card className="animate-fade-in space-y-6 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Results</h3>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-primary">{result.score}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Matched Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <XCircle className="h-4 w-4 text-orange-500" />
                Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-700 dark:text-orange-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold">Feedback</h4>
              <ul className="space-y-2">
                {result.feedback.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
};
