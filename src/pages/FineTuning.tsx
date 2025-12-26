import { ArrowLeft, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const FineTuning = () => {
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
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                LLM • Fine-tuning
              </span>
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                Fine-tuning Studio (LLM + LoRA)
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Learn to adapt foundation models to your own data using supervised fine-tuning and parameter-efficient
                methods like LoRA. Understand the training loop, evaluation metrics, and experiment tracking for
                production-ready models.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Fine-tune LLM on Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Adapt a base model to your own Q&A or support data so it talks like your project or brand. Master
                prompt formats, training-eval loops, and hyperparameter tuning.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Dataset preparation</span>
                  <span className="pill-soft text-[11px]">Training loop</span>
                  <span className="pill-soft text-[11px]">Evaluation metrics</span>
                  <span className="pill-soft text-[11px]">Loss curves</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">LoRA Fine-tuning Playground</h3>
              <p className="text-sm text-muted-foreground">
                Use parameter-efficient LoRA adapters to teach an LLM a new style or domain on a budget. Understand
                rank, alpha, dropout, and how to merge adapters for deployment.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">LoRA rank & alpha</span>
                  <span className="pill-soft text-[11px]">PEFT adapters</span>
                  <span className="pill-soft text-[11px]">Memory efficiency</span>
                  <span className="pill-soft text-[11px]">Adapter merging</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">Coming Soon: Interactive Demos</h2>
                <p className="text-sm text-muted-foreground">Fine-tuning workflows under construction</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-6">
              <h3 className="mb-4 font-semibold">Planned Features:</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Upload custom dataset (CSV/JSON) for fine-tuning simulation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Visual training progress with loss curves and metrics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Compare before/after predictions from base vs fine-tuned model</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>LoRA configuration playground (rank, alpha, target modules)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Experiment tracking dashboard with hyperparameter logs</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold">What You'll Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Supervised fine-tuning workflow from data prep to deployment</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Parameter-efficient fine-tuning (PEFT) with LoRA and adapters</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Training hyperparameters: learning rate, batch size, epochs</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Evaluation metrics and preventing overfitting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Cost-effective training strategies for resource-constrained environments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FineTuning;
