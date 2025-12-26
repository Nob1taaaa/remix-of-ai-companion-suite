import { Sparkles, Bot, Layers3, RadioTower } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ResumeScanner } from "@/components/ResumeScanner";
import { AboutLab } from "@/components/AboutLab";
import { useAuth } from "@/hooks/useAuth";

const projects = [
  {
    id: 1,
    title: "NLP Foundations Lab",
    tag: "NLP • Core skills",
    difficulty: "Beginner–Intermediate",
    description:
      "Start with predictive keyboards, text classification, and a resume scanner to master core NLP workflows.",
    focus: "Tokenization, classification, extraction",
    path: "/nlp-foundations",
  },
  {
    id: 2,
    title: "Structured JSON & TOON Studio",
    tag: "LLM • Structured output",
    difficulty: "Intermediate–Advanced",
    description:
      "Turn messy profiles, resumes, or notes into clean JSON plus a compact TOON line — no fake fields, only what\'s in the text.",
    focus: "Text → JSON, TOON format",
    path: "/fine-tuning",
  },
  {
    id: 3,
    title: "AI Agents & Real‑time Assistants",
    tag: "Agents • Systems",
    difficulty: "Advanced",
    description:
      "Design multi‑agent systems and live streaming assistants that feel fast, collaborative, and conversational.",
    focus: "Orchestration, tools, streaming UX",
    path: "/agents",
  },
];

const Index = () => {
  const { user } = useAuth();
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-14 pt-10 md:gap-12 md:px-8 md:pb-16 md:pt-16">
          <header className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between animate-enter">
            <div className="space-y-6">
              <span className="pill-soft inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-xs">
                  NLP • JSON &amp; TOON • Agents
                </span>
              </span>

              <div className="space-y-3 md:space-y-4">
                <h1 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  Cute NLP &amp; AI agent projects in one tiny lab.
                </h1>
                <p className="max-w-xl text-balance text-sm text-muted-foreground md:text-base">
                  Explore three project tracks that group seven ideas: core NLP workflows, structured JSON &amp; TOON studio,
                  and multi-agent / real-time assistants — all wrapped in a playful interface.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link to={user ? "/my-lab" : "/auth"} className="w-full sm:w-auto">
                  <Button variant="hero" className="hover-scale w-full justify-center px-5 py-3 text-sm md:w-auto">
                    <Bot className="h-4 w-4" />
                    {user ? "Go to My Lab" : "Sign in to start"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-center text-sm text-muted-foreground md:w-auto"
                >
                  View suggested learning path
                </Button>
              </div>

              <dl className="grid max-w-xl grid-cols-2 gap-4 text-xs text-muted-foreground sm:grid-cols-3 md:text-sm">
                <div>
                  <dt className="font-semibold text-foreground">3 tracks • 7 ideas</dt>
                  <dd>Grouped into clear learning paths</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Cute by design</dt>
                  <dd>Soft gradients, tiny animations</dd>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <dt className="font-semibold text-foreground">Agent ready</dt>
                  <dd>Ideas easy to turn into apps</dd>
                </div>
              </dl>
            </div>

            <aside className="mt-4 w-full max-w-sm animate-scale-in md:mt-0">
              <div className="relative rounded-3xl bg-card/80 p-5 shadow-xl shadow-primary/15 backdrop-blur-md">
              <div className="absolute right-3 top-3 flex max-w-[60%] items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-1 text-[10px] font-medium text-secondary-foreground shadow-sm md:right-6 md:top-6 md:max-w-none md:px-3 md:text-[11px]">
                <RadioTower className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate md:whitespace-normal">Real‑time friendly</span>
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
                    Start simple: classification &amp; predictive text. Then layer in structured JSON &amp; TOON extraction and
                    finally orchestrated multi-agent systems.
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

          <div className="hidden md:block">
            <AboutLab />
          </div>

          <section aria-label="NLP and AI agent projects" className="space-y-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight md:text-xl">Project gallery</h2>
              <p className="text-xs text-muted-foreground md:text-sm">Hover a card to see it come alive ✨</p>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => (
                <Link key={project.id} to={project.path} className="block">
                  <article
                    className="group relative flex h-full min-h-[140px] flex-col justify-between overflow-hidden rounded-3xl border-2 border-border/50 bg-gradient-to-br from-card to-card/50 px-4 py-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20 md:px-5 md:py-5"
                    style={{ animationDelay: `${idx * 100}ms` }}
                    aria-label={project.title}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/5 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="pill-soft text-[11px] transition-all duration-300 group-hover:bg-primary/20">
                          {project.tag}
                        </span>
                        <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium text-muted-foreground transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary">
                          {project.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold transition-colors duration-300 group-hover:text-primary md:text-lg">
                        {project.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                        {project.description}
                      </p>
                    </div>

                    <div className="relative z-10 mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="transition-colors duration-300 group-hover:text-foreground">Focus: {project.focus}</span>
                      <span className="story-link flex items-center gap-1 font-medium transition-all duration-300 group-hover:gap-2 group-hover:text-primary">
                        Explore →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>

          <section className="animate-fade-in rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8" style={{ animationDelay: '0.2s' }}>
            <ResumeScanner />
          </section>
        </div>
      </div>
    </main>
  );
};

export default Index;
