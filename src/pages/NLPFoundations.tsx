import { ArrowLeft, FileText, Tag, UserCheck, Keyboard } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResumeScanner } from "@/components/ResumeScanner";
import { PredictiveKeyboard } from "@/components/PredictiveKeyboard";
import { TextClassification } from "@/components/TextClassification";
import { useAuth } from "@/hooks/useAuth";

const NLPFoundations = () => {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Navigate to="/auth" replace />;

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl space-y-12 px-6 pb-16 pt-12 md:px-8 md:pt-16">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Lab
              </Button>
            </Link>
          </div>

          <header className="space-y-6 animate-enter">
            <span className="pill-soft inline-flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                NLP • Core Skills
              </span>
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                NLP Foundations Lab
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Master the fundamentals of Natural Language Processing through three hands-on projects: predictive
                keyboards, text classification pipelines, and resume scanning. Learn tokenization, embeddings, and
                structured extraction.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border bg-primary/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Keyboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Predictive Keyboard Model</h3>
              <p className="text-sm text-muted-foreground">
                Train a tiny language model that suggests the next word as you type, like a cute mini phone keyboard.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-green-500/20 px-2 py-1 font-medium text-green-700 dark:text-green-300">
                  ✓ Live Demo Below
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border bg-primary/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Tag className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Text Classification Pipeline</h3>
              <p className="text-sm text-muted-foreground">
                Build a full pipeline that cleans text, extracts features and classifies sentiment, topics or spam.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-green-500/20 px-2 py-1 font-medium text-green-700 dark:text-green-300">
                  ✓ Live Demo Below
                </span>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border bg-primary/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">AI Resume Scanner</h3>
              <p className="text-sm text-muted-foreground">
                Parse resumes, extract skills and experience, and score candidates against a target role.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-green-500/20 px-2 py-1 font-medium text-green-700 dark:text-green-300">
                  ✓ Live Demo Below
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Keyboard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">Predictive Keyboard</h2>
                <p className="text-sm text-muted-foreground">Type to get next-word suggestions</p>
              </div>
            </div>
            <PredictiveKeyboard />
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">Text Classification</h2>
                <p className="text-sm text-muted-foreground">Classify sentiment, spam, or topics</p>
              </div>
            </div>
            <TextClassification />
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <ResumeScanner />
          </div>

          <div className="rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold">What You'll Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Tokenization and text pre-processing techniques</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Feature extraction and embeddings for semantic understanding</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Building end-to-end classification pipelines</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Structured data extraction from unstructured text</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Real-world NLP application design patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NLPFoundations;
