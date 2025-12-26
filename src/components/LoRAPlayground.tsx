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
      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">LoRA Rank (r)</label>
              <span className="text-sm font-mono text-muted-foreground">{rank[0]}</span>
            </div>
            <Slider
              value={rank}
              onValueChange={setRank}
              min={4}
              max={64}
              step={4}
            />
            <p className="text-xs text-muted-foreground">
              Lower rank = faster training, less expressive. Higher rank = more parameters, better quality.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">LoRA Alpha (α)</label>
              <span className="text-sm font-mono text-muted-foreground">{alpha[0]}</span>
            </div>
            <Slider
              value={alpha}
              onValueChange={setAlpha}
              min={8}
              max={64}
              step={8}
            />
            <p className="text-xs text-muted-foreground">
              Scaling factor. Typically set to 2x rank. Higher alpha = stronger adaptation.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Dropout</label>
              <span className="text-sm font-mono text-muted-foreground">{dropout[0]}</span>
            </div>
            <Slider
              value={dropout}
              onValueChange={setDropout}
              min={0}
              max={0.5}
              step={0.05}
            />
            <p className="text-xs text-muted-foreground">
              Prevents overfitting. 0.05-0.1 is typical for LoRA.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="font-semibold">Estimated Impact</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Memory Usage</p>
            <p className="text-2xl font-bold text-primary">{estimatedMemory} MB</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Training Speed</p>
            <p className="text-2xl font-bold text-primary">{trainingSpeed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Parameters</p>
            <p className="text-2xl font-bold text-primary">{(rank[0] * 2 * 1024).toLocaleString()}</p>
          </div>
        </div>
      </Card>

      <Button onClick={handleApply} size="lg" className="w-full">
        <Zap className="h-4 w-4" />
        Apply LoRA Configuration
      </Button>
    </div>
  );
};
