import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LoRAPlayground = () => {
  const [rank, setRank] = useState([8]);
  const [alpha, setAlpha] = useState([16]);
  const [dropout, setDropout] = useState([0.1]);
  const { toast } = useToast();

  const handleApply = () => {
    toast({
      title: "LoRA Config Applied",
      description: `Rank: ${rank[0]}, Alpha: ${alpha[0]}, Dropout: ${dropout[0]}`,
    });
  };

  const estimatedMemory = Math.round((1000 * rank[0]) / 64);
  const trainingSpeed = rank[0] <= 8 ? "Fast" : rank[0] <= 16 ? "Medium" : "Slow";

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 p-6 shadow-lg">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">LoRA Rank (r)</label>
              <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                {rank[0]}
              </span>
            </div>
            <Slider
              value={rank}
              onValueChange={setRank}
              min={4}
              max={64}
              step={4}
              className="cursor-pointer"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Lower rank = faster training, less expressive. Higher rank = more parameters, better quality.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">LoRA Alpha (α)</label>
              <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                {alpha[0]}
              </span>
            </div>
            <Slider
              value={alpha}
              onValueChange={setAlpha}
              min={8}
              max={64}
              step={8}
              className="cursor-pointer"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Scaling factor. Typically set to 2x rank. Higher alpha = stronger adaptation.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold">Dropout</label>
              <span className="rounded-lg bg-primary/10 px-3 py-1 font-mono text-sm font-bold text-primary">
                {dropout[0]}
              </span>
            </div>
            <Slider
              value={dropout}
              onValueChange={setDropout}
              min={0}
              max={0.5}
              step={0.05}
              className="cursor-pointer"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Prevents overfitting. 0.05-0.1 is typical for LoRA.
            </p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6">
        <h3 className="mb-4 font-semibold">Estimated Impact</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="group space-y-2 rounded-xl border border-border/50 bg-background/80 p-4 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
            <p className="text-xs font-medium text-muted-foreground">Memory Usage</p>
            <p className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
              {estimatedMemory} MB
            </p>
          </div>
          <div className="group space-y-2 rounded-xl border border-border/50 bg-background/80 p-4 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
            <p className="text-xs font-medium text-muted-foreground">Training Speed</p>
            <p className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
              {trainingSpeed}
            </p>
          </div>
          <div className="group space-y-2 rounded-xl border border-border/50 bg-background/80 p-4 transition-all duration-300 hover:scale-105 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10">
            <p className="text-xs font-medium text-muted-foreground">Parameters</p>
            <p className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent">
              {(rank[0] * 2 * 1024).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Button 
        onClick={handleApply} 
        size="lg" 
        className="w-full relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <Zap className="h-4 w-4" />
        Apply LoRA Configuration
      </Button>
    </div>
  );
};
