import { ArrowLeft, FileSearch, BookOpen } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RagDocumentQA } from "@/components/RagDocumentQA";
import { useAuth } from "@/hooks/useAuth";

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
              <FileSearch className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                NLP • Retrieval-Augmented Generation
              </span>
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                RAG / Document Q&amp;A Studio
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Upload real artifacts like course notes, job descriptions, or product docs, then ask grounded questions
                that must be answered using your sources—not model imagination.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Grounded document question-answering</h3>
              <p className="text-sm text-muted-foreground">
                Practice retrieval-augmented generation (RAG) by forcing the model to answer questions using only the
                content you provide: notes, specs, or job descriptions.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Retrieval vs. recall</span>
                  <span className="pill-soft text-[11px]">Grounded answers</span>
                  <span className="pill-soft text-[11px]">Hallucination control</span>
                  <span className="pill-soft text-[11px]">Document QA</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FileSearch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Text, PDF, &amp; image inputs</h3>
              <p className="text-sm text-muted-foreground">
                Upload plain text, parse PDFs into text, or point the model at images (like slide screenshots) and see
                how well it can ground its answers directly in your artifacts.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Great practice for:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Course &amp; exam prep</span>
                  <span className="pill-soft text-[11px]">Job search &amp; resumes</span>
                  <span className="pill-soft text-[11px]">Product &amp; API docs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <RagDocumentQA />
          </div>

          <div className="rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold">What you&apos;ll learn here</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How RAG differs from pure prompting and fine-tuning.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Why grounding answers in explicit sources reduces hallucinations.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Trade-offs of text, PDFs, and images as knowledge sources.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>How to design prompts that demand citations and quoted evidence.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FineTuning;
