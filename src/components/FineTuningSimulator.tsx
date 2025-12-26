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
      >
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
        <Card className="animate-fade-in p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Training Progress</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          {steps.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Training Metrics</h4>
              <div className="space-y-1">
                {steps.map((step) => (
                  <div key={step.epoch} className="flex items-center justify-between text-xs border-b border-border py-2">
                    <span className="font-medium">Epoch {step.epoch}</span>
                    <div className="flex gap-4">
                      <span>Loss: {step.loss.toFixed(3)}</span>
                      <span>Accuracy: {(step.accuracy * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completed && (
            <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-700 dark:text-green-300">
              ✓ Model fine-tuned successfully! Final accuracy: {((steps[steps.length - 1]?.accuracy || 0) * 100).toFixed(1)}%
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
