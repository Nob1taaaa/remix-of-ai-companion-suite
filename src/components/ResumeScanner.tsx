import { errorMessage } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

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

      // Save to history for logged-in users
      if (user) {
        await supabase.from("resume_scan_history").insert({
          resume_text: resumeText,
          job_description: jobDescription,
          match_score: data.score,
          matched_skills: data.matchedSkills,
          missing_skills: data.missingSkills,
          analysis: data,
          user_id: user.id,
        });
      }
    } catch (error: unknown) {
      console.error('Scan error:', error);
      toast({
        title: "Scan failed",
        description: errorMessage(error) || "Failed to analyze resume. Please try again.",
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
            placeholder="Paste your resume here... or upload a .txt file below"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          <div className="space-y-1 pt-2">
            <label className="text-xs font-medium text-muted-foreground">
              {pdfLoading ? "Extracting text from PDF…" : "Upload resume (.txt or .pdf)"}
            </label>
            {pdfLoading && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Using AI to extract text from your PDF…</span>
              </div>
            )}
            <input
              type="file"
              accept=".txt,text/plain,application/pdf,.pdf"
              disabled={pdfLoading}
              className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-accent/20 disabled:opacity-50"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

                try {
                  let text = "";

                  if (isPdf) {
                    if (!user) {
                      toast({ title: "Login required", description: "Please sign in to upload PDFs", variant: "destructive" });
                      e.target.value = "";
                      return;
                    }

                    setPdfLoading(true);
                    // Convert PDF to base64 and send to server for extraction via Anthropic
                    const arrayBuffer = await file.arrayBuffer();
                    const uint8 = new Uint8Array(arrayBuffer);
                    let binary = "";
                    for (let i = 0; i < uint8.length; i++) {
                      binary += String.fromCharCode(uint8[i]);
                    }
                    const pdfBase64 = btoa(binary);

                    const { data, error } = await supabase.functions.invoke('extract-pdf', {
                      body: { pdfBase64 },
                    });

                    if (error) throw error;
                    if (!data?.text) throw new Error("No text extracted from PDF");

                    text = data.text;
                  } else {
                    text = await file.text();
                  }

                  setResumeText(text);
                  toast({
                    title: "Resume loaded",
                    description: `Imported text from ${file.name}`,
                  });
                } catch (err: unknown) {
                  console.error("File read / PDF parse error", err);
                  toast({
                    title: "Could not read resume",
                    description: (err instanceof Error ? err.message : undefined) || "Failed to extract text from this file. Please try again.",
                    variant: "destructive",
                  });
                } finally {
                  setPdfLoading(false);
                  e.target.value = "";
                }
              }}
            />
          </div>
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
        className="w-full md:w-auto relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
        size="lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
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
        <Card className="animate-scale-in overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 p-6 shadow-xl shadow-primary/10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Scan Results</h3>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {result.score}
                  </p>
                  <p className="text-xs text-muted-foreground">out of 100</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  Matched Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="animate-fade-in rounded-full border border-green-500/30 bg-gradient-to-br from-green-500/20 to-green-500/10 px-4 py-2 text-xs font-medium text-green-700 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:text-green-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/20">
                    <XCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="animate-fade-in rounded-full border border-orange-500/30 bg-gradient-to-br from-orange-500/20 to-orange-500/10 px-4 py-2 text-xs font-medium text-orange-700 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:text-orange-300"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-sm font-semibold">Actionable Feedback</h4>
                <ul className="space-y-3">
                  {result.feedback.map((point, i) => (
                    <li 
                      key={i} 
                      className="animate-fade-in flex gap-3 rounded-lg border border-border/50 bg-background/50 p-3 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
};
// cache-bust
