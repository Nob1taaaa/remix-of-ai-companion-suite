import { Suspense, lazy } from "react";
import { ArrowLeft, Bot, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const MultiAgentSystemLazy = lazy(() =>
  import("@/components/MultiAgentSystem").then((m) => ({ default: m.MultiAgentSystem }))
);

const StreamingAssistantLazy = lazy(() =>
  import("@/components/StreamingAssistant").then((m) => ({ default: m.StreamingAssistant }))
);

const Agents = () => {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-10 pt-6 md:space-y-12 md:px-8 md:pb-16 md:pt-16">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Lab
              </Button>
            </Link>
          </div>

          <header className="space-y-3 animate-enter md:space-y-6">
            <span className="pill-soft inline-flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Agents • Systems
              </span>
            </span>

            <div className="space-y-2 md:space-y-4">
              <h1 className="text-balance text-2xl font-semibold leading-tight md:text-5xl">
                AI Agents & Real-time Assistants
              </h1>
              <p className="max-w-2xl text-balance text-xs text-muted-foreground md:text-base">
                Design collaborative multi-agent systems and build responsive streaming assistants.
              </p>
            </div>
          </header>

          <div className="hidden gap-8 md:grid md:grid-cols-2">
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

          <div className="rounded-2xl border bg-card/80 p-4 shadow-sm md:rounded-3xl md:p-8">
            <div className="mb-4 flex items-center gap-3 md:mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-10 md:w-10 md:rounded-2xl">
                <Bot className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold md:text-2xl">Multi-Agent System</h2>
                <p className="text-xs text-muted-foreground md:text-sm">Planner, Researcher, and Writer collaborate</p>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              }
            >
              <MultiAgentSystemLazy />
            </Suspense>
          </div>

          <div className="rounded-2xl border bg-card/80 p-4 shadow-sm md:rounded-3xl md:p-8">
            <div className="mb-4 flex items-center gap-3 md:mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary md:h-10 md:w-10 md:rounded-2xl">
                <Radio className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold md:text-2xl">Streaming Assistant</h2>
                <p className="text-xs text-muted-foreground md:text-sm">Live chat with token-by-token responses</p>
              </div>
            </div>
            <Suspense
              fallback={
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-40 w-full" />
                </div>
              }
            >
              <StreamingAssistantLazy />
            </Suspense>
          </div>

          <div className="hidden rounded-2xl border-l-4 border-primary/50 bg-primary/5 p-6 md:block">
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
