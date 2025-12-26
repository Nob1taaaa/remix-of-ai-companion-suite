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
                Build rock‑solid NLP instincts on real mini projects.
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Learn how modern NLP actually works by playing with three tiny, practical tools: a predictive keyboard,
                smart text classifier, and resume‑to‑job match analyzer.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3 rounded-2xl border bg-primary/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                <Keyboard className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">Predictive Keyboard Playground</h3>
              <p className="text-sm text-muted-foreground">
                See how tiny language models guess your next word, just like the keyboard on your phone.
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
              <h3 className="font-semibold">Text Classification Studio</h3>
              <p className="text-sm text-muted-foreground">
                Turn messy sentences into clean labels like sentiment, spam vs. not‑spam, or high‑priority tickets.
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
              <h3 className="font-semibold">AI‑Powered Resume Matcher</h3>
              <p className="text-sm text-muted-foreground">
                Compare a resume to a role, surface key skills, and spot the gaps like a tiny hiring assistant.
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
                <p className="text-sm text-muted-foreground">Type a sentence and watch next‑word suggestions appear in real time.</p>
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
                <p className="text-sm text-muted-foreground">Classify reviews, emails, or messages into clear buckets in a single click.</p>
              </div>
            </div>
            <TextClassification />
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">AI Resume Scanner</h2>
                <p className="text-sm text-muted-foreground">Paste or upload your resume and see how well it matches a target role.</p>
              </div>
            </div>
            <ResumeScanner />
          </div>

          <div className="rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold">What you’ll take away</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How raw text becomes tokens the model can understand.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How to go from unstructured text to clean labels and scores.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How embeddings capture meaning beyond exact keywords.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How to design simple, end‑to‑end NLP flows that feel like real products.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Patterns you can reuse later in chatbots, search, and agents.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NLPFoundations;
