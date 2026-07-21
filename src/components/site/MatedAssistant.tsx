import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Bot, Loader2, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { consultancyServiceGroups, trainingServiceGroups } from "@/data/services";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import ceoImg from "@/assets/mated/ceo.png";
import deputyCeoImg from "@/assets/mated/deputy-ceo.png";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const welcomeMessage: ChatMessage = {
  role: "assistant",
  content:
    "Welcome to MATED. I can help you find the right training, consultancy or research service. What would you like to achieve?",
};

const suggestedQuestions = [
  "I need staff training",
  "Help with tax compliance",
  "We need an HR policy manual",
];

const stopWords = new Set([
  "and",
  "for",
  "the",
  "with",
  "our",
  "need",
  "want",
  "help",
  "about",
  "service",
  "services",
]);

function localCatalogReply(question: string) {
  const normalized = question.toLowerCase();

  if (/price|cost|fee|duration|schedule|date|certificate/.test(normalized)) {
    return "Pricing, duration, schedules and certification details are confirmed by the MATED team for each engagement. Please use the quote form so the team can respond to your specific requirements.";
  }

  if (/contact|address|phone|location|office/.test(normalized)) {
    return "MATED is located at Kazanchis, Palace Commercial Center, 3rd Floor, Office #311, Addis Ababa. You can call +251 97 281 8181 or +251 97 724 4434, or send your requirements through the quote form.";
  }

  const words = normalized
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((word) => word.length > 2 && !stopWords.has(word));
  const catalog = [
    ...trainingServiceGroups.flatMap((group) =>
      group.topics.map((topic) => ({ area: "Training", group: group.title, topic })),
    ),
    ...consultancyServiceGroups.flatMap((group) =>
      group.topics.map((topic) => ({ area: "Consultancy", group: group.title, topic })),
    ),
  ];

  const matches = catalog
    .map((item) => {
      const searchable = `${item.group} ${item.topic}`.toLowerCase();
      const score = words.reduce((total, word) => total + (searchable.includes(word) ? 1 : 0), 0);
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (matches.length === 0) {
    return "Is this for individual skill development or an organizational project? Please also share your industry and the main problem you are trying to solve, and I will narrow down the options.";
  }

  const recommendations = matches
    .map((item) => `• ${item.topic} — ${item.area}, ${item.group}`)
    .join("\n");

  return `These offerings are the closest match:\n${recommendations}\n\nWould you like training that builds staff capability, or consultancy that delivers advice and a specific organizational output?`;
}

async function getAssistantReply(messages: ChatMessage[]) {
  try {
    const { data, error } = await supabase.functions.invoke<{ reply?: string }>("mated-assistant", {
      body: { messages: messages.slice(-10) },
    });
    if (error || !data?.reply) throw error ?? new Error("No assistant response");
    return data.reply;
  } catch {
    return localCatalogReply(messages.at(-1)?.content ?? "");
  }
}

export function MatedAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    const reply = await getAssistantReply(nextMessages);
    setMessages((current) => [...current, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="fixed bottom-5 right-5 z-40 flex h-14 items-center gap-2 rounded-full bg-[#F7941D] px-5 font-medium text-[#1C2841] shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl md:bottom-7 md:right-7"
          aria-label="Open MATED Assistant"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Ask MATED</span>
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border bg-primary px-6 py-5 pr-12 text-left text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F7941D] text-[#1C2841]">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-primary-foreground">MATED Assistant</SheetTitle>
              <SheetDescription className="text-primary-foreground/70">
                Training and consultancy guidance
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1 bg-secondary/20">
          <div className="space-y-4 px-5 py-6" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm border border-border bg-background text-foreground",
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-background px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="sr-only">MATED Assistant is responding</span>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void sendMessage(question)}
                    className="rounded-full border border-border bg-background px-3 py-2 text-xs transition hover:border-[#F7941D]"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border bg-background p-4">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={800}
              rows={2}
              placeholder="Describe what you need..."
              aria-label="Message MATED Assistant"
              className="max-h-32 min-h-11 resize-none rounded-xl"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || loading}
              className="h-11 w-11 shrink-0 rounded-full bg-[#F7941D] text-[#1C2841] hover:bg-[#F7941D]/90"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>Answers are limited to MATED services.</span>
            <Link to="/contact" className="shrink-0 font-medium underline underline-offset-4">
              Get a quote
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
