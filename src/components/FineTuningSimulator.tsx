import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrainingStep {
  epoch: number;
  loss: number;
  accuracy: number;
}

export const FineTuningSimulator = () => {
  const [dataset, setDataset] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<TrainingStep[]>([]);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  const simulateTraining = async () => {
    if (!dataset.trim()) {
      toast({
        title: "No dataset provided",
        description: "Please paste sample training data",
        variant: "destructive",
      });
      return;
    }

    setIsTraining(true);
    setProgress(0);
    setSteps([]);
    setCompleted(false);

    // Simulate 5 epochs
    for (let epoch = 1; epoch <= 5; epoch++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const loss = 2.5 - (epoch * 0.4) + (Math.random() * 0.2);
      const accuracy = 0.4 + (epoch * 0.11) + (Math.random() * 0.03);
      
      setSteps(prev => [...prev, { epoch, loss, accuracy }]);
      setProgress((epoch / 5) * 100);
    }

    setIsTraining(false);
    setCompleted(true);
    toast({
      title: "Training complete!",
      description: "Your model has been fine-tuned successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Training Dataset (JSON/CSV format)</label>
        <Textarea
          placeholder='Example: [{"input": "Hello", "output": "Hi there!"}, ...]'
          value={dataset}
          onChange={(e) => setDataset(e.target.value)}
          className="min-h-[120px] font-mono text-xs"
          disabled={isTraining}
        />
      </div>

      <Button
        onClick={simulateTraining}
        disabled={isTraining || !dataset.trim()}
        size="lg"
        className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        {isTraining ? (
          <>
            <Brain className="h-4 w-4 animate-pulse" />
            Training Model...
          </>
        ) : completed ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            Trained Successfully
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            Start Fine-Tuning
          </>
        )}
      </Button>

      {(isTraining || steps.length > 0) && (
        <Card className="animate-scale-in overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 p-6 shadow-xl shadow-primary/10">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">Training Progress</span>
                <span className="font-mono text-lg text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/60 transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 animate-pulse bg-white/20" />
                </div>
              </div>
            </div>

            {steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Training Metrics</h4>
                <div className="space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={step.epoch}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 px-4 py-3 text-xs transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="font-semibold">Epoch {step.epoch}</span>
                      <div className="flex gap-6">
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">Loss</p>
                          <p className="font-mono font-semibold">{step.loss.toFixed(3)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">Accuracy</p>
                          <p className="font-mono font-semibold text-primary">{(step.accuracy * 100).toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completed && (
              <div className="animate-fade-in rounded-xl border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-300">Training Complete!</p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Final accuracy: {((steps[steps.length - 1]?.accuracy || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
