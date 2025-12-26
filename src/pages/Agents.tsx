import { ArrowLeft, Bot, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Agents = () => {
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
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Agents • Systems
              </span>
            </span>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold leading-tight md:text-5xl">
                AI Agents & Real-time Assistants
              </h1>
              <p className="max-w-2xl text-balance text-sm text-muted-foreground md:text-base">
                Design collaborative multi-agent systems and build responsive streaming assistants. Learn orchestration
                patterns, tool use, routing logic, and how to create conversational UX that feels fast and natural.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Multi-Agent System</h3>
              <p className="text-sm text-muted-foreground">
                Design a little AI squad: planner, researcher and coder agents collaborating to solve tasks. Learn how
                to route requests, share context, and coordinate agent actions.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Agent roles</span>
                  <span className="pill-soft text-[11px]">Tool calling</span>
                  <span className="pill-soft text-[11px]">Context sharing</span>
                  <span className="pill-soft text-[11px]">Orchestration</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border bg-card/80 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Real-time Assistants</h3>
              <p className="text-sm text-muted-foreground">
                Prototype live assistants that stream responses token-by-token for chatty, responsive UX. Understand
                SSE, async rendering, and conversation state management.
              </p>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Key Concepts:</div>
                <div className="flex flex-wrap gap-2">
                  <span className="pill-soft text-[11px]">Token streaming</span>
                  <span className="pill-soft text-[11px]">SSE / WebSockets</span>
                  <span className="pill-soft text-[11px]">Latency optimization</span>
                  <span className="pill-soft text-[11px]">Chat UX</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border bg-card/80 p-6 shadow-sm md:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold md:text-2xl">Coming Soon: Interactive Demos</h2>
                <p className="text-sm text-muted-foreground">Agent systems under construction</p>
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 p-6">
              <h3 className="mb-4 font-semibold">Planned Features:</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Multi-agent chat showing planner, researcher, and writer collaborating</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Live streaming assistant with token-by-token rendering</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Tool-calling demo: agents using search, calculator, or APIs</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Conversation state visualization: see agent memory and context</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">→</span>
                  <span>Routing logic editor: configure when to use which agent</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6">
            <h3 className="mb-3 font-semibold">What You'll Learn</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Multi-agent orchestration patterns and coordination strategies</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Tool use and function calling for agents to interact with external systems</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Real-time streaming with SSE and WebSockets for responsive chat UX</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Conversation state management and context window optimization</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Latency reduction techniques and async rendering patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Agents;
