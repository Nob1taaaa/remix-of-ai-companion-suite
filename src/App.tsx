import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import NLPFoundations from "./pages/NLPFoundations";
import FineTuning from "./pages/FineTuning";
import Agents from "./pages/Agents";
import { AuthProvider } from "@/hooks/useAuth";
import AuthPage from "./pages/Auth";
import MyLab from "./pages/MyLab";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/my-lab" element={<MyLab />} />
            <Route path="/nlp-foundations" element={<NLPFoundations />} />
            <Route path="/fine-tuning" element={<FineTuning />} />
            <Route path="/agents" element={<Agents />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;