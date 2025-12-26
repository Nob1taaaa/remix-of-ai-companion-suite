import { Code2, Lightbulb, Zap } from "lucide-react";

export const AboutLab = () => {
  return (
    <section className="space-y-6 rounded-3xl border bg-card/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold md:text-2xl">About this Lab</h2>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
          This is a <span className="font-medium text-foreground">portfolio project</span> showcasing hands-on
          exploration of Natural Language Processing, fine-tuning techniques, and AI agent systems. Built as a
          learning playground to understand modern AI architectures—from basic text classification to multi-agent
          orchestration.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2 rounded-2xl bg-background/50 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Why I Built This</h3>
          </div>
          <p className="text-xs text-muted-foreground md:text-sm">
            To understand the full stack of NLP and AI agents—from tokenization and embeddings to real-time
            streaming assistants and fine-tuned models.
          </p>
        </div>

        <div className="space-y-2 rounded-2xl bg-background/50 p-4">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Tech Stack</h3>
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground md:text-sm">
            <li>• React + TypeScript + Tailwind CSS</li>
            <li>• Lovable Cloud (backend + database)</li>
            <li>• Lovable AI (Gemini / GPT-5 gateway)</li>
            <li>• Edge functions for serverless logic</li>
          </ul>
        </div>

        <div className="space-y-2 rounded-2xl bg-background/50 p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">What Works Now</h3>
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground md:text-sm">
            <li className="flex items-center gap-1">
              <span className="text-green-500">✓</span> AI Resume Scanner (live)
            </li>
            <li className="flex items-center gap-1">
              <span className="text-muted-foreground/50">○</span> Text Classification (planned)
            </li>
            <li className="flex items-center gap-1">
              <span className="text-muted-foreground/50">○</span> Streaming Assistant (planned)
            </li>
          </ul>
        </div>
      </div>

      <div className="rounded-xl border-l-4 border-primary/50 bg-primary/5 p-4">
        <p className="text-xs italic text-muted-foreground md:text-sm">
          <span className="font-semibold not-italic text-foreground">Portfolio note:</span> This project demonstrates
          my ability to architect full-stack AI applications, design clean UIs, integrate backend APIs, and work with
          modern AI models—all without relying on pre-built templates.
        </p>
      </div>
    </section>
  );
};
