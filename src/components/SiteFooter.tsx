import { Sparkles } from "lucide-react";

export const SiteFooter = () => {
  return (
    <footer className="border-t bg-background/80 px-4 py-4 text-xs text-muted-foreground backdrop-blur-sm md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <span className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          <span>Built with care by Harshit Shah</span>
        </span>
        <span className="hidden text-[11px] md:inline">
          NLP lab • JSON &amp; TOON studio • AI agents
        </span>
      </div>
    </footer>
  );
};
