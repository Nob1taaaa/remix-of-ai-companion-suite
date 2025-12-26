import { Sparkles, Bot, Layers3, RadioTower } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Predictive Keyboard Model",
    tag: "NLP • Next-token",
    difficulty: "Beginner",
    description:
      "Train a tiny language model that suggests the next word as you type, like a cute mini phone keyboard.",
    focus: "Sequence modeling, tokenization, sampling",
  },
  {
    id: 2,
    title: "Text Classification Pipeline",
    tag: "NLP • Pipelines",
    difficulty: "Beginner–Intermediate",
    description:
      "Build a full pipeline that cleans text, extracts features and classifies sentiment, topics or spam.",
    focus: "Pre-processing, embeddings, evaluation",
  },
  {
    id: 3,
    title: "Fine-tune LLM on Your Data",
    tag: "LLM • Supervised",
    difficulty: "Intermediate",
    description:
      "Adapt a base model to your own Q&A or support data so it talks like your project or brand.",
    focus: "Prompt formats, training–eval loop",
  },
  {
    id: 4,
    title: "LoRA Fine-tuning Playground",
    tag: "LLM • LoRA",
    difficulty: "Intermediate–Advanced",
    description:
      "Use parameter-efficient LoRA adapters to teach an LLM a new style or domain on a budget.",
    focus: "Adapters, PEFT, experiment tracking",
  },
  {
    id: 5,
    title: "Multi‑Agent System",
    tag: "Agents • Orchestration",
    difficulty: "Advanced",
    description:
      "Design a little AI squad: planner, researcher and coder agents collaborating to solve tasks.",
    focus: "Tool use, routing, coordination",
  },
  {
    id: 6,
    title: "AI Resume Scanner",
    tag: "NLP • Extraction",
    difficulty: "Intermediate",
    description:
      "Parse resumes, extract skills and experience, and score candidates against a target role.",
    focus: "Structured extraction, scoring, UX",
  },
  {
    id: 7,
    title: "Real‑time Assistants",
    tag: "Agents • Live",
    difficulty: "Advanced",
    description:
      "Prototype live assistants that stream responses token‑by‑token for chatty, responsive UX.",
    focus: "Streaming, latency, conversation design",
  },
];

const Index = () => {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-12 md:px-8 md:pt-16">
          <header className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between animate-enter">
            <div className="space-y-6">
              <span className="pill-soft inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  NLP • Fine‑tuning • Agents
                </span>
              </span>

              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
                  Cute NLP &amp; AI agent projects in one tiny lab.
                </h1>
                <p className="max-w-xl text-balance text-sm text-muted-foreground md:text-base">
                  Explore seven hands‑on ideas covering prediction, classification, fine‑tuning, LoRA, multi‑agent systems,
                  resume screening and real‑time assistants — all wrapped in a playful interface.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button variant="hero" className="hover-scale">
                  <Bot className="h-4 w-4" />
                  Start exploring projects
                </Button>
                <button className="story-link text-sm font-medium text-muted-foreground">
                  <span>View suggested learning path</span>
                </button>
              </div>

              <dl className="grid max-w-xl grid-cols-3 gap-4 text-xs text-muted-foreground md:text-sm">
                <div>
                  <dt className="font-semibold text-foreground">7 mini builds</dt>
                  <dd>From first token to full agents</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Cute by design</dt>
                  <dd>Soft gradients, tiny animations</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Agent ready</dt>
                  <dd>Ideas easy to turn into apps</dd>
                </div>
              </dl>
            </div>

            <aside className="mt-4 w-full max-w-sm animate-scale-in md:mt-0">
              <div className="relative rounded-3xl bg-card/80 p-5 shadow-xl shadow-primary/15 backdrop-blur-md">
                <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-secondary/80 px-3 py-1 text-[11px] font-medium text-secondary-foreground">
                  <RadioTower className="h-3 w-3" />
                  <span>Real‑time friendly</span>
                </div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      PROJECT STACK
                    </p>
                    <p className="text-sm font-medium">NLP &amp; Agents Playground</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p>
                    Each card is a self‑contained idea. Pick one, design the data, then plug in your favourite framework or
                    AI provider.
                  </p>
                  <p>
                    Start simple: classification &amp; predictive text. Then layer in fine‑tuning, LoRA adapters and finally
                    orchestrated multi‑agent systems.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                  <span className="pill-soft">Python / JS friendly</span>
                  <span className="pill-soft">Can run on notebooks</span>
                  <span className="pill-soft">Great for portfolios</span>
                </div>
              </div>
            </aside>
          </header>

          <section aria-label="NLP and AI agent projects" className="space-y-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight md:text-xl">Project gallery</h2>
              <p className="text-xs text-muted-foreground md:text-sm">Hover a card to see it come alive ✨</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-card/90 p-4 shadow-sm shadow-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/25 md:p-5"
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="pill-soft text-[11px]">{project.tag}</span>
                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground">
                        {project.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold md:text-lg">{project.title}</h3>
                    <p className="text-xs text-muted-foreground md:text-sm">{project.description}</p>
                  </div>

                  <div className="relative z-10 mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Focus: {project.focus}</span>
                    <span className="story-link">View steps</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Index;
