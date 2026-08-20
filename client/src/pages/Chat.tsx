/**
 * Chat — AI knowledge base suhbat.
 * Conversation list + message area + input.
 * RAG: savol yuboriladi, AI javob manbalar bilan keladi.
 */
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  MessageSquare,
  Plus,
  Sparkles,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { useConversations, useMessages, useSendMessage } from "../hooks/useChat";
import SourceCitation from "../components/layout/SourceCitation";
// import { useWorkspace } from "../store/workspaceContext";
import { ROUTES } from "../lib/constants";

export const Chat: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { activeWorkspace } = useWorkspace();
  const { data: conversations } = useConversations();
  const { data: messages } = useMessages(id);
  const sendMessage = useSendMessage();

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sendMessage.isPending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sendMessage.isPending) return;
    setInput("");
    try {
      const response = await sendMessage.mutateAsync({ conversationId: id, content: text });
      if (!id) navigate(ROUTES.CHAT_DETAIL(response.conversationId), { replace: true });
    } catch {
    }
  };

  const startNewChat = () => {
    navigate(ROUTES.CHAT);
  };

  const sortedConvs = [...(conversations?.items ?? [])].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  return (
    <div className="flex h-full">
      {/* Conversation list */}
      <div className="hidden w-72 shrink-0 flex-col border-r border-zinc-800/60 lg:flex">
        <div className="p-3">
          <button
            onClick={startNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-700"
          >
            <Plus className="h-4 w-4 text-amber-500" /> Yangi suhbat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Suhbatlar
          </p>
          {sortedConvs.map((c) => (
            <Link
              key={c.id}
              to={ROUTES.CHAT_DETAIL(c.id)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${id === c.id
                  ? "bg-amber-500/10 text-amber-400"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{c.title}</span>
            </Link>
          ))}
          {sortedConvs.length === 0 && (
            <p className="px-2 py-4 text-xs text-zinc-600">
              Suhbatlar yo'q.
            </p>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!id || (messages?.length ?? 0) === 0 ? (
            <div className="flex h-full items-center justify-center px-6">
              <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900">
                  <Sparkles className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="font-display text-xl font-semibold text-zinc-100">
                  Knowledge base ga savol bering
                </h2>
                <p className="mt-2 text-sm text-zinc-500">
                  KnowFlow yuklangan hujjatlarni qidiradi va manbalar bilan javob beradi.
                </p>
                <div className="mt-6 grid gap-2.5">
                  {[
                    "Vacation policy qanday?",
                    "Onboarding uchun nima kerak?",
                    "P0 incident nima?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-left text-sm text-zinc-300 hover:border-amber-500/40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-2xl space-y-5 px-5 py-8">
              {messages!.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] ${m.role === "user" ? "" : "w-full"
                      }`}
                  >
                    {m.role === "assistant" && (
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/15">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                        </div>
                        <span className="text-xs font-medium text-zinc-400">
                          KnowFlow AI
                        </span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user"
                          ? "rounded-br-sm bg-amber-500 text-zinc-950 font-medium"
                          : "rounded-bl-sm border border-zinc-800 bg-zinc-900/70 text-zinc-200"
                        }`}
                    >
                      {m.content}
                    </div>
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2 space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                          Manbalar
                        </p>
                        {m.sources.map((s:any, i:any) => (
                          <SourceCitation key={i} source={s} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-zinc-800 bg-zinc-900/70 px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    <span className="text-sm text-zinc-400">
                      Knowledge base qidirilmoqda...
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800/60 bg-zinc-950/40 p-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-end gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2 focus-within:border-amber-500/40">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Hujjatlaringiz haqida savol bering..."
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
              />
              <button
                onClick={send}
                disabled={!input.trim() || sendMessage.isPending}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 disabled:cursor-not-allowed disabled:opacity-30 hover:bg-amber-400"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-zinc-600">
              KnowFlow faqat yuklangan hujjatlardan javob beradi · manbalarni tekshiring
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
