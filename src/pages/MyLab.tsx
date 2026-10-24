import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, FileText, Tag, Bot } from "lucide-react";

const MyLab = () => {
  const { user, loading } = useAuth();

  const userId = user?.id ?? null;

  const {
    data: resumeHistory,
    isLoading: loadingResumes,
  } = useQuery({
    queryKey: ["resume-history", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_scan_history")
        .select("id, created_at, job_description, match_score")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Pick<
        Tables<"resume_scan_history">,
        "id" | "created_at" | "job_description" | "match_score"
      >[];
    },
  });

  const {
    data: classificationHistory,
    isLoading: loadingClassifications,
  } = useQuery({
    queryKey: ["classification-history", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("text_classification_history")
        .select("id, created_at, input_text, category, label, confidence")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Pick<
        Tables<"text_classification_history">,
        "id" | "created_at" | "input_text" | "category" | "label" | "confidence"
      >[];
    },
  });

  const {
    data: agentHistory,
    isLoading: loadingAgents,
  } = useQuery({
    queryKey: ["agent-history", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_task_history")
        .select("id, created_at, task, final_response")
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data as Pick<
        Tables<"agent_task_history">,
        "id" | "created_at" | "task" | "final_response"
      >[];
    },
  });

  const isAnyLoading = useMemo(
    () => loading || loadingResumes || loadingClassifications || loadingAgents,
    [loading, loadingResumes, loadingClassifications, loadingAgents]
  );

  if (!loading && !user) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border bg-card/80 backdrop-blur-md p-8 text-center space-y-4 shadow-xl">
          <h1 className="text-2xl font-semibold">My Lab Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Every lab tool works without an account. Sign in only if you want to save and revisit your scans, classifications, and agent runs.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Lab
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">
                Sign in
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
          <div className="absolute -left-40 top-10 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl space-y-10 px-6 pb-16 pt-12 md:px-8 md:pt-16">
          <div className="flex items-center justify-between gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Lab
              </Button>
            </Link>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Your recent experiments
            </span>
          </div>

          <header className="space-y-3">
            <h1 className="text-balance text-3xl font-semibold leading-tight md:text-4xl">
              My Lab Dashboard
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Review your latest scans, classifications, and multi-agent runs in one place.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Resume scans</h2>
                </div>
                <Link to="/nlp-foundations">
                  <Button variant="outline" size="sm">
                    Open lab
                  </Button>
                </Link>
              </div>
              <Card className="p-4 space-y-3">
                {isAnyLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : resumeHistory && resumeHistory.length > 0 ? (
                  <ul className="space-y-3 text-xs">
                    {resumeHistory.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-lg border bg-background/60 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">
                            Match score: {item.match_score ?? "-"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground">
                          {item.job_description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No scans yet. Run your first resume scan in the NLP Foundations lab.
                  </p>
                )}
              </Card>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Text classifications</h2>
                </div>
                <Link to="/nlp-foundations">
                  <Button variant="outline" size="sm">
                    Open lab
                  </Button>
                </Link>
              </div>
              <Card className="p-4 space-y-3">
                {isAnyLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : classificationHistory && classificationHistory.length > 0 ? (
                  <ul className="space-y-3 text-xs">
                    {classificationHistory.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-lg border bg-background/60 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium capitalize">
                            {item.category} → {item.label ?? "-"}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {item.confidence != null
                              ? `${Math.round(Number(item.confidence) * 100)}%`
                              : ""}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground">
                          {item.input_text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No classifications yet. Try classifying some text in the NLP Foundations lab.
                  </p>
                )}
              </Card>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold">Agent tasks</h2>
                </div>
                <Link to="/agents">
                  <Button variant="outline" size="sm">
                    Open lab
                  </Button>
                </Link>
              </div>
              <Card className="p-4 space-y-3">
                {isAnyLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : agentHistory && agentHistory.length > 0 ? (
                  <ul className="space-y-3 text-xs">
                    {agentHistory.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-lg border bg-background/60 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">
                            {item.task}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground">
                          {item.final_response}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No multi-agent runs yet. Run your first agent squad in the Agents lab.
                  </p>
                )}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MyLab;
