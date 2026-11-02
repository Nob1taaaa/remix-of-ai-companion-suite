import { errorMessage } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileText, FileImage, HelpCircle, Loader2, Quote } from "lucide-react";

// Lightweight type declaration to keep pdfjs as an optional runtime dependency
type PdfJsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { data: ArrayBuffer }) => { promise: Promise<{ numPages: number; getPage: (n: number) => Promise<{ getTextContent: () => Promise<{ items: { str?: string }[] }> }> }> };
};

interface RagAnswer {
  answer: string;
}

export const RagDocumentQA = () => {
  const { toast } = useToast();

  const [documentText, setDocumentText] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setAnswer(null);
    setQuestion("");
    setFileName(file.name);

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");

    try {
      if (isPdf) {
        // @ts-expect-error - dynamic CDN import
        const pdfjsModule = (await import(/* @vite-ignore */ "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs")) as unknown as PdfJsLib;
        pdfjsModule.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js";

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsModule.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;

        let fullText = "";
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const strings = (content.items || []).map((item: { str?: string }) => item.str || "");
          fullText += strings.join(" ") + "\n";
        }

        const text = fullText.trim();
        if (!text) {
          throw new Error("No extractable text found in PDF. It may be a scanned image.");
        }

        setDocumentText(text);
        setImageDataUrl(null);
        toast({
          title: "PDF loaded",
          description: `Extracted text from ${file.name}`,
        });
      } else if (isImage) {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setImageDataUrl(result);
          setDocumentText("");
          toast({
            title: "Image loaded",
            description: `Using ${file.name} as a visual document for Q&A`,
          });
        };
        reader.onerror = () => {
          toast({
            title: "Could not read image",
            description: "Please try another image file.",
            variant: "destructive",
          });
        };
        reader.readAsDataURL(file);
      } else {
        const text = await file.text();
        const trimmed = text.trim();
        if (!trimmed) {
          throw new Error("File appears to be empty.");
        }
        setDocumentText(trimmed);
        setImageDataUrl(null);
        toast({
          title: "Text loaded",
          description: `Imported text from ${file.name}`,
        });
      }
    } catch (error) {
      console.error("Upload/parse error", error);
      setDocumentText("");
      setImageDataUrl(null);
      setFileName(null);
      toast({
        title: "Could not read document",
        description:
          "We couldn't extract usable content from this file. For best results, upload readable text or a non-scanned PDF.",
        variant: "destructive",
      });
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "Question required",
        description: "Ask something you want to know about the document.",
        variant: "destructive",
      });
      return;
    }

    if (!documentText && !imageDataUrl) {
      toast({
        title: "No document",
        description: "Upload text, a PDF, or an image before asking a question.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnswer(null);

    try {
      const { data, error } = await supabase.functions.invoke<RagAnswer>("rag-qa", {
        body: {
          documentText: documentText || null,
          image: imageDataUrl,
          question: question.trim(),
        },
      });

      if (error) throw error;

      setAnswer(data?.answer || null);
      toast({
        title: "Answer ready",
        description: "Grounded response generated from your document.",
      });
    } catch (err: unknown) {
      console.error("RAG QA error", err);
      const message = (err instanceof Error ? err.message : undefined) || "Failed to run document Q&A. Please try again.";
      toast({
        title: "Q&A failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasDocument = !!documentText || !!imageDataUrl;

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="space-y-4 rounded-3xl border bg-card/80 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold md:text-lg">1. Upload your document</h2>
                <p className="text-xs text-muted-foreground md:text-sm">
                  Paste raw text, upload a PDF, or use an image of notes/job descriptions.
                </p>
              </div>
            </div>
            {fileName && (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground max-w-[180px] truncate text-right">
                {fileName}
              </span>
            )}
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder="Or paste your document text here... (course notes, job description, product docs)"
              value={documentText}
              onChange={(e) => {
                setDocumentText(e.target.value);
                setImageDataUrl(null);
                setFileName(e.target.value ? "Pasted text" : null);
                setAnswer(null);
              }}
              className="min-h-[160px] text-sm"
            />

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <FileImage className="h-3.5 w-3.5" />
                <span>Upload text, PDF, or image</span>
              </label>
              <input
                type="file"
                accept=".txt,text/plain,application/pdf,.pdf,image/*"
                className="block w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border file:border-border file:bg-background file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground hover:file:bg-accent/20 sm:w-auto"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleFileUpload(file);
                  e.target.value = "";
                }}
              />
            </div>

            {imageDataUrl && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                <FileImage className="h-4 w-4 text-primary" />
                <span>
                  Image loaded. The model will read directly from the pixels and answer questions grounded in this
                  image.
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card className="space-y-4 rounded-3xl border bg-card/80 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold md:text-lg">2. Ask a grounded question</h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                The assistant can only answer using what it finds in your document. If it&apos;s not there, it will say
                so.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder="Example: What are the key responsibilities for this role?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[120px] text-sm"
            />
            <Button
              onClick={handleAsk}
              disabled={loading || !hasDocument}
              className="w-full md:w-auto relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking over your document...
                </>
              ) : (
                <>
                  <Quote className="h-4 w-4" />
                  Ask question
                </>
              )}
            </Button>
            {!hasDocument && (
              <p className="text-xs text-muted-foreground">
                Upload a document or paste text on the left to enable grounded Q&amp;A.
              </p>
            )}
          </div>
        </Card>
      </div>

      {answer && (
        <Card className="animate-scale-in overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/60 p-6 shadow-xl shadow-primary/10">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Quote className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold md:text-base">Grounded answer</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{answer}</p>
              <p className="pt-1 text-[11px] text-muted-foreground/80">
                The assistant is instructed to quote directly from your document and avoid guessing when information is
                missing.
              </p>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
};
