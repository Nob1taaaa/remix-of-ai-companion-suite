import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    } catch (error: any) {
      console.error('Multi-agent error:', error);
      toast({
        title: "Agent system failed",
        description: error.message || "Failed to run agents",
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
          className="min-h-[100px]"
        />
      </div>

      <Button onClick={handleRun} disabled={loading} size="lg">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Agents Working...
          </>
        ) : (
          <>
            <Bot className="h-4 w-4" />
            Run Multi-Agent System
          </>
        )}
      </Button>

      {result && (
        <div className="animate-fade-in space-y-4">
          <h3 className="text-lg font-semibold">Agent Outputs</h3>
          
          {result.agents.map((agent, i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">{agent.name}</h4>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {agent.output}
              </p>
            </Card>
          ))}

          <Card className="border-primary/50 bg-primary/5 p-4 space-y-2">
            <h4 className="font-semibold">Final Result</h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {result.final}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};
