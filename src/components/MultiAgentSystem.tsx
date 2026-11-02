import { errorMessage } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bot, Loader2, Sparkles, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Agent {
  name: string;
  output: string;
}

interface MultiAgentResult {
  agents: Agent[];
  final: string;
}

export const MultiAgentSystem = () => {
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MultiAgentResult | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRun = async () => {
    if (!task.trim()) {
      toast({
        title: "Enter a task",
        description: "Please describe what you want the agents to do",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('multi-agent', {
        body: { task }
      });

      if (error) throw error;
      setResult(data);
      toast({
        title: "Agents completed!",
        description: "All 3 agents have finished their work",
      });

      // Save to history for logged-in users
      if (user) {
        await supabase.from("agent_task_history").insert({
          task,
          planner_output: data?.planner,
          researcher_output: data?.researcher,
          writer_output: data?.writer,
          final_response: data?.finalResponse,
          raw_result: data,
          user_id: user.id,
        });
      }
    } catch (error: unknown) {
      console.error('Multi-agent error:', error);
      toast({
        title: "Agent system failed",
        description: errorMessage(error) || "Failed to run agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Task for Agents</label>
        <Textarea
          placeholder="Example: Create a marketing plan for a new product launch"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <Button 
        onClick={handleRun} 
        disabled={loading} 
        size="lg"
        className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Agents Working...
          </>
        ) : (
          <>
            <Users className="h-4 w-4" />
            Run Multi-Agent System
          </>
        )}
      </Button>

      {result && (
        <div className="animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Agent Collaboration</h3>
          </div>
          
          {result.agents.map((agent, i) => (
            <Card 
              key={i} 
              className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 p-5 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 hover:shadow-xl"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{agent.name}</h4>
                    <p className="text-xs text-muted-foreground">Agent {i + 1} of 3</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
                  <p className="relative rounded-lg bg-background/50 p-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {agent.output}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          <Card className="animate-scale-in overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-xl shadow-primary/20">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Final Result</h4>
                  <p className="text-xs text-muted-foreground">Synthesized by Writer Agent</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10" />
                <p className="relative rounded-lg bg-background/50 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {result.final}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
