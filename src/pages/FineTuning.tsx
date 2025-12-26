import { Suspense, lazy } from "react";
import { ArrowLeft, Braces, Wand2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

const StructuredExtractionToneStudioLazy = lazy(() =>
  import("@/components/StructuredExtractionToneStudio").then((m) => ({ default: m.StructuredExtractionToneStudio }))
);

const FineTuning = () => {
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
              <Braces className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                NLP • Structured output
              </span>
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                Structured Extraction &amp; Tone Studio
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Paste messy text, extract clean JSON fields, and compare how the same content sounds in different tones
                like formal, casual, or recruiter.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Braces className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Text → JSON extraction</h3>
              <p className="text-sm text-muted-foreground">
                Turn free-form text into neat key–value pairs that backends, databases, and APIs can actually use —
                without hallucinating missing data.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Great for:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Resume / profile parsing</span>
                  <span className="pill-soft text-[11px]">Job post normalization</span>
                  <span className="pill-soft text-[11px]">Support ticket triage</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Wand2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Tone comparison lab</h3>
              <p className="text-sm text-muted-foreground">
                Rewrite the same content into multiple tones side-by-side — perfect for recruiters, marketers, and UX
                writers who care about voice.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Example tones:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Formal cover letter</span>
                  <span className="pill-soft text-[11px]">Friendly DM</span>
                  <span className="pill-soft text-[11px]">Recruiter outreach</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-40 w-full" />
                </div>
              }
            >
              <StructuredExtractionToneStudioLazy />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FineTuning;
