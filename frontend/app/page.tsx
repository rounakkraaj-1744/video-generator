"use client";
import { useEffect, useRef, useState } from "react";
import {
  IconArrowLeft,
  IconArrowUp,
  IconBolt,
  IconChevronDown,
  IconCode,
  IconCopy,
  IconDownload,
  IconDots,
  IconLayoutSidebar,
  IconMicrophone,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconPlus,
  IconRotate2,
  IconRotateClockwise2,
  IconSettings,
  IconPencil,
  IconShare,
  IconTrash,
  IconTopologyStar3,
  IconX,
} from "@tabler/icons-react";
import { generateProject } from "../src/lib/api/generation";
import type { GenerationRequest, Scene, VideoProject } from "../src/lib/types/video-project";
import { GenerationLoader } from "../components/generation/GenerationLoader";

const starters = [
  [
    "Composition over inheritance (Java)",
    "Explain composition over inheritance in Java with a practical backend-development example.",
    "Java",
  ],
  [
    "How closures work (TypeScript)",
    "Explain how closures work in TypeScript using a practical event-handler example.",
    "TypeScript",
  ],
  [
    "SQL joins explained visually",
    "Explain SQL joins visually with a real ecommerce reporting example.",
    "SQL",
  ],
  [
    "Python decorators in 60 seconds",
    "Explain Python decorators with a practical logging example.",
    "Python",
  ],
] as const;
const mockProject: VideoProject = {
  version: "1.0",
  title: "Composition over inheritance in Java",
  duration: 60,
  fps: 30,
  width: 1080,
  height: 1920,
  scenes: [
    {
      type: "hook",
      start: 0,
      duration: 7,
      title: "Composition > inheritance",
      narration: "When should you compose instead of inherit?",
    },
    {
      type: "text",
      start: 7,
      duration: 13,
      text: "Prefer assembling small behaviors over building deep class trees.",
      narration: "Composition keeps change local and makes systems easier to test.",
    },
    {
      type: "code",
      start: 20,
      duration: 22,
      language: "java",
      code: "class OrderService {\n  private final PaymentGateway payments;\n\n  OrderService(PaymentGateway payments) {\n    this.payments = payments;\n  }\n}",
      narration: "Inject the behavior you need instead of inheriting from a giant base class.",
    },
    {
      type: "diagram",
      start: 42,
      duration: 18,
      nodes: [
        { id: "service", label: "OrderService" },
        { id: "gateway", label: "PaymentGateway" },
        { id: "stripe", label: "StripeGateway" },
      ],
      edges: [
        { from: "service", to: "gateway" },
        { from: "gateway", to: "stripe" },
      ],
      narration:
        "The service depends on an interface, so the implementation can change independently.",
    },
  ],
};
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "reelforge-project";
const fmt = (s: number) =>
  `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(s % 60)
    .toString()
    .padStart(2, "0")}`;
const sceneName = (s: Scene) => s.type[0].toUpperCase() + s.type.slice(1);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("Java");
  const [duration, setDuration] = useState("60");
  const [audience, setAudience] = useState("Intermediate");
  const [project, setProject] = useState<VideoProject | null>(null);
  const [original, setOriginal] = useState<VideoProject | null>(null);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mockMode, setMockMode] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [safeZones, setSafeZones] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [history, setHistory] = useState<VideoProject[]>([]);
  const [future, setFuture] = useState<VideoProject[]>([]);
  const [chats, setChats] = useState<Array<{ id: string; title: string }>>([]);
  const [openChatMenu, setOpenChatMenu] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const current = project?.scenes[selected];
  const total = project ? project.scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) : 0;
  const edited = !!project && JSON.stringify(project) !== JSON.stringify(original);
  useEffect(() => {
    if (!loading) return;
    const started = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 250);
    return () => window.clearInterval(id);
  }, [loading]);
  useEffect(() => {
    if (!playing || !project) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setPlayhead((t) => {
        const next = t + delta;
        if (next >= total) {
          setPlaying(false);
          return total;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, project, total]);
  useEffect(() => {
    if (project) titleRef.current?.focus();
  }, [project]);
  const submit = async () => {
    if (prompt.trim().length < 12 || loading) return;
    setChats((items) => [{ id: crypto.randomUUID(), title: prompt.trim().slice(0, 42) }, ...items]);
    setLoading(true);
    setError("");
    abortRef.current = new AbortController();
    try {
      const result = mockMode
        ? await new Promise<VideoProject>((resolve, reject) => {
            const timer = window.setTimeout(
              () => resolve({ ...mockProject, title: prompt.trim().slice(0, 58) }),
              1000
            );
            abortRef.current?.signal.addEventListener("abort", () => {
              window.clearTimeout(timer);
              const abortError = new Error("Generation stopped");
              abortError.name = "AbortError";
              reject(abortError);
            });
          })
        : await generateProject(
            {
              prompt: prompt.trim(),
              language,
              duration: Number(duration),
              audience,
            } satisfies GenerationRequest,
            abortRef.current.signal
          );
      setOriginal(result);
      setProject(result);
      setSelected(0);
      setPlayhead(0);
    } catch (e) {
      if ((e as Error).name !== "AbortError")
        setError(
          (e as { message?: string }).message ||
            "Generation failed. Check the backend URL or try again."
        );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };
  const updateScene = (patch: Partial<Scene>) => {
    if (!project || !current) return;
    setHistory((h) => [...h.slice(-19), project]);
    setFuture([]);
    setProject({
      ...project,
      scenes: project.scenes.map((s, i) => (i === selected ? { ...s, ...patch } : s)),
    });
  };
  const reset = () => {
    if (original) {
      setProject(original);
      setHistory([]);
      setFuture([]);
    }
  };
  const undo = () => {
    const previous = history.at(-1);
    if (!project || !previous) return;
    setFuture((f) => [...f, project]);
    setProject(previous);
    setHistory((h) => h.slice(0, -1));
  };
  const redo = () => {
    const next = future.at(-1);
    if (!project || !next) return;
    setHistory((h) => [...h, project]);
    setProject(next);
    setFuture((f) => f.slice(0, -1));
  };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if (e.code === "Space" && project) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
      if (e.key.toLowerCase() === "c") setCaptions((v) => !v);
      if (e.key.toLowerCase() === "s") setSafeZones((v) => !v);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const exportFile = (kind: "json" | "txt" | "srt") => {
    if (!project) return;
    let content = JSON.stringify(project, null, 2);
    let ext = "json";
    if (kind === "txt") {
      content = project.scenes
        .map((s) => s.narration || "")
        .filter(Boolean)
        .join("\n\n");
      ext = "txt";
    }
    if (kind === "srt") {
      let t = 0;
      content = project.scenes
        .map((s, i) => {
          const start = fmt(t);
          t += Number(s.duration) || 0;
          return `${i + 1}\n00:${start},000 --> 00:${fmt(t)},000\n${s.narration || ""}\n`;
        })
        .join("\n");
      ext = "srt";
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    a.download = `${slug(project.title || "reelforge")}.${ext}`;
    a.click();
  };
  const newChat = () => {
    abortRef.current?.abort();
    setLoading(false);
    setProject(null);
    setOriginal(null);
    setPrompt("");
    setError("");
    setElapsed(0);
    setSelected(0);
    setPlayhead(0);
    setPlaying(false);
    setHistory([]);
    setFuture([]);
    setMobileNav(false);
    window.setTimeout(() => document.getElementById("prompt")?.focus(), 0);
  };
  const renameChat = (id: string) => {
    const chat = chats.find((item) => item.id === id);
    const title = window.prompt("Rename chat", chat?.title || "New chat");
    if (title?.trim())
      setChats((items) =>
        items.map((item) => (item.id === id ? { ...item, title: title.trim() } : item))
      );
    setOpenChatMenu(null);
  };
  const deleteChat = (id: string) => {
    setChats((items) => items.filter((item) => item.id !== id));
    setOpenChatMenu(null);
  };
  const shareChat = async (id: string) => {
    const chat = chats.find((item) => item.id === id);
    if (!chat) return;
    if (navigator.share) await navigator.share({ title: chat.title, text: chat.title });
    else await navigator.clipboard?.writeText(chat.title);
    setOpenChatMenu(null);
  };
  return (
    <div className="min-h-dvh bg-[var(--app)] text-[var(--text)]">
      <a href="#main" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-[#171717] px-2 transition-[width,transform] md:translate-x-0 ${sidebarCollapsed ? "w-16" : "w-[260px]"} ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-14 items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded text-[var(--text-secondary)]">
              <IconBolt size={18} stroke={1.5} />
            </span>
            {!sidebarCollapsed && <b className="text-sm font-medium">ReelForge</b>}
          </div>
          <button
            className="hidden text-[var(--text-secondary)] md:block"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconLayoutSidebar size={17} />
          </button>
          <button
            className="md:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close sidebar"
          >
            <IconX size={18} />
          </button>
        </div>
        <button
          onClick={newChat}
          className={`flex h-10 items-center gap-3 rounded-md px-3 text-left text-[13px] hover:bg-[#2a2a2a] ${sidebarCollapsed ? "justify-center" : ""}`}
          title="New chat"
        >
          <IconPlus size={17} />
          {!sidebarCollapsed && "New chat"}
        </button>
        {!sidebarCollapsed && (
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
            <div className="px-3 text-[11px] text-[#8e8e8e]">Today</div>
            {chats.length === 0 ? (
              <p className="mt-3 px-3 text-xs leading-5 text-[#8e8e8e]">No chats yet</p>
            ) : (
              <div className="mt-2 space-y-0.5">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    className="group relative flex items-center rounded-md hover:bg-[#2a2a2a]"
                  >
                    <button
                      onClick={() => {
                        setPrompt(chat.title);
                        setOpenChatMenu(null);
                      }}
                      className="min-w-0 flex-1 truncate px-3 py-2 text-left text-[13px] text-[#d1d1d1]"
                    >
                      {chat.title}
                    </button>
                    <button
                      onClick={() => setOpenChatMenu(openChatMenu === chat.id ? null : chat.id)}
                      className="mr-1 grid h-7 w-7 place-items-center rounded text-[#8e8e8e] opacity-0 group-hover:opacity-100 hover:bg-[#3a3a3a]"
                      aria-label={`Actions for ${chat.title}`}
                    >
                      <IconDots size={16} />
                    </button>
                    {openChatMenu === chat.id && (
                      <div className="absolute right-1 top-9 z-10 w-32 rounded-md border bg-[#242424] p-1 shadow-xl">
                        <button
                          onClick={() => renameChat(chat.id)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#343434]"
                        >
                          <IconPencil size={14} />
                          Rename
                        </button>
                        <button
                          onClick={() => shareChat(chat.id)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#343434]"
                        >
                          <IconShare size={14} />
                          Share
                        </button>
                        <button
                          onClick={() => deleteChat(chat.id)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-[var(--danger)] hover:bg-[#343434]"
                        >
                          <IconTrash size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <button
          className={`mt-auto flex h-10 items-center gap-3 rounded-md px-3 text-[13px] text-[var(--text-secondary)] hover:bg-[#2a2a2a] ${sidebarCollapsed ? "justify-center" : ""}`}
          title="Settings"
        >
          <IconSettings size={18} />
          {!sidebarCollapsed && "Settings"}
        </button>
      </aside>
      <div className={`transition-[padding] ${sidebarCollapsed ? "md:pl-16" : "md:pl-[260px]"}`}>
        <header className="flex h-14 items-center justify-between border-b-0 bg-[var(--bg-app)] px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="min-h-11 md:hidden"
              onClick={() => setMobileNav(true)}
              aria-label="Open sidebar"
            >
              <IconLayoutSidebar size={20} />
            </button>
            <span className="text-sm font-medium">Create video</span>
          </div>
          <span className="hidden text-xs text-[var(--text-tertiary)] sm:block">
            Connection not checked
          </span>
        </header>
        <main id="main" className="mx-auto min-h-[calc(100dvh-56px)] max-w-none px-4 py-2 md:px-6">
          {loading ? (
            <GenerationLoader elapsed={elapsed} stop={() => abortRef.current?.abort()} />
          ) : project ? (
            <Editor
              project={project}
              current={current}
              selected={selected}
              setSelected={setSelected}
              updateScene={updateScene}
              edited={edited}
              reset={reset}
              undo={undo}
              redo={redo}
              canUndo={history.length > 0}
              canRedo={future.length > 0}
              total={total}
              playhead={playhead}
              setPlayhead={setPlayhead}
              playing={playing}
              setPlaying={setPlaying}
              captions={captions}
              setCaptions={setCaptions}
              safeZones={safeZones}
              setSafeZones={setSafeZones}
              exportFile={exportFile}
            />
          ) : (
            <Composer
              prompt={prompt}
              setPrompt={setPrompt}
              language={language}
              setLanguage={setLanguage}
              duration={duration}
              setDuration={setDuration}
              audience={audience}
              setAudience={setAudience}
              submit={submit}
              mockMode={mockMode}
              setMockMode={setMockMode}
              error={error}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function Composer(p: {
  prompt: string;
  setPrompt: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  duration: string;
  setDuration: (v: string) => void;
  audience: string;
  setAudience: (v: string) => void;
  submit: () => void;
  mockMode: boolean;
  setMockMode: (v: boolean) => void;
  error: string;
}) {
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const voiceRef = useRef<{
    start: () => void;
    stop: () => void;
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: { error?: string }) => void) | null;
  } | null>(null);
  const voiceTranscriptRef = useRef("");
  const voiceBaseRef = useRef("");
  const toggleVoice = () => {
    if (listening) {
      voiceRef.current?.stop();
      setListening(false);
      return;
    }
    const speech = window as Window & {
      SpeechRecognition?: new () => typeof voiceRef.current;
      webkitSpeechRecognition?: new () => typeof voiceRef.current;
    };
    const Recognition = speech.SpeechRecognition || speech.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setVoiceError("");
    const recognition = new Recognition() as Exclude<typeof voiceRef.current, null>;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    voiceTranscriptRef.current = "";
    voiceBaseRef.current = p.prompt;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      voiceTranscriptRef.current = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      p.setPrompt(
        `${voiceBaseRef.current}${voiceBaseRef.current ? " " : ""}${voiceTranscriptRef.current}`.slice(
          0,
          1200
        )
      );
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = (event) => {
      setListening(false);
      const reason = event.error;
      setVoiceError(
        reason === "not-allowed" || reason === "service-not-allowed"
          ? "Microphone permission was denied. Allow microphone access and try again."
          : reason === "network"
            ? "The browser speech service is unavailable. Try Chrome or Edge on localhost or HTTPS."
            : `Voice input failed${reason ? ` (${reason})` : ""}. Try again.`
      );
    };
    voiceRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceError("Voice input could not start. Try again.");
    }
  };
  return (
    <section className="mx-auto flex min-h-[calc(100dvh-100px)] max-w-[768px] flex-col justify-center pb-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">What can I help you create?</h1>
        <p className="mt-2 text-[13px] text-[var(--text-secondary)]">
          Describe a programming topic and I&apos;ll turn it into an editable storyboard.
        </p>
      </div>
      <div className="surface relative rounded-3xl bg-[var(--bg-panel)] p-2 shadow-[0_0_0_1px_rgba(255,255,255,.02)] md:p-3">
        <div className="relative">
          <textarea
            id="prompt"
            autoFocus
            value={p.prompt}
            onChange={(e) => p.setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") p.submit();
            }}
            placeholder="Explain composition over inheritance in Java with a practical backend-development example."
            className="min-h-[104px] max-h-[280px] w-full resize-none overflow-y-auto whitespace-pre-wrap break-words bg-transparent px-4 py-3 pb-12 text-sm leading-5 outline-none"
            maxLength={1200}
          />
          <div className="absolute bottom-2 left-4 right-4 flex h-9 items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleVoice}
              className={`relative grid h-9 w-9 place-items-center rounded-full ${listening ? "bg-[var(--accent-muted)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:bg-[var(--raised)]"}`}
              aria-label={listening ? "Stop voice input" : "Start voice input"}
              title={listening ? "Stop voice input" : "Voice input"}
            >
              {listening && (
                <span className="voice-wave" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              )}
              <IconMicrophone size={18} className={listening ? "opacity-0" : ""} />
            </button>
            <button
              disabled={p.prompt.trim().length < 12}
              onClick={p.submit}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-medium text-white disabled:opacity-40"
            >
              <IconArrowUp size={18} />
              <span className="sr-only">Generate</span>
            </button>
          </div>
        </div>
        {voiceError && (
          <p role="status" className="px-4 pb-2 text-[11px] text-[var(--danger)]">
            {voiceError}
          </p>
        )}
        <div className="flex justify-end px-4 pb-2 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className={p.prompt.length > 1080 ? "text-[var(--warning)]" : ""}>
            {p.prompt.length}/1200
          </span>
        </div>
        {p.error && (
          <p
            role="alert"
            className="mt-3 rounded-md bg-[var(--danger-muted)] p-3 text-xs text-[var(--danger)]"
          >
            {p.error}
          </p>
        )}
        <div className="flex w-full flex-wrap items-end justify-between gap-3 border-t px-2 pt-3">
          <Select
            label="Language"
            value={p.language}
            onChange={p.setLanguage}
            options={["Java", "TypeScript", "Python", "SQL"]}
          />
          <Segment
            label="Duration"
            value={p.duration}
            onChange={p.setDuration}
            options={["30", "60", "90"]}
          />
          <Segment
            label="Audience"
            value={p.audience}
            onChange={p.setAudience}
            options={["Beginner", "Intermediate", "Advanced"]}
          />
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs text-[var(--text-tertiary)]">Examples</span>
          <button className="text-xs text-[var(--text-secondary)]">Shuffle</button>
        </div>
        <div className="grid gap-1 lg:grid-cols-2">
          {starters.map(([name, text, lang]) => (
            <button
              key={name}
              onClick={() => {
                p.setPrompt(text);
                p.setLanguage(lang);
              }}
              className="flex h-8 items-center gap-2 rounded-md px-2 text-left text-[13px] text-[var(--text-secondary)] hover:bg-[var(--raised)]"
            >
              <IconCode size={16} />
              {name}
              <span className="ml-auto font-mono text-[11px] text-[var(--text-tertiary)]">
                {lang}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="relative block min-w-[150px] flex-1">
      <span className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 appearance-none rounded-md bg-[var(--raised)] px-3 text-xs outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <IconChevronDown
        size={16}
        className="pointer-events-none absolute right-3 bottom-3 text-[var(--text-tertiary)]"
      />
    </label>
  );
}
function Segment({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <fieldset className="min-w-[150px] flex-1">
      <legend className="mb-1 text-xs font-medium text-[var(--text-secondary)]">{label}</legend>
      <div className="flex h-7 rounded-md bg-[var(--app)] p-0.5">
        {options.map((o) => (
          <button
            type="button"
            key={o}
            onClick={() => onChange(o)}
            className={`flex-1 rounded-md px-1 text-xs ${value.startsWith(o) ? "bg-[var(--accent-muted)] text-[var(--accent-strong)]" : "text-[var(--text-secondary)]"}`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Editor(p: {
  project: VideoProject;
  current?: Scene;
  selected: number;
  setSelected: (n: number) => void;
  updateScene: (patch: Partial<Scene>) => void;
  edited: boolean;
  reset: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  total: number;
  playhead: number;
  setPlayhead: (n: number) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  captions: boolean;
  setCaptions: (v: boolean) => void;
  safeZones: boolean;
  setSafeZones: (v: boolean) => void;
  exportFile: (kind: "json" | "txt" | "srt") => void;
}) {
  const { project, current } = p;
  const checks = project.scenes.filter(
    (s) => !s.narration || (s.type === "code" && (s.code || "").split("\n").length > 12)
  );
  return (
    <section>
      <div className="mb-3 flex min-h-10 flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <button
            onClick={() => window.location.reload()}
            className="mb-1 flex h-7 items-center gap-1 text-xs text-[var(--text-secondary)]"
          >
            <IconArrowLeft size={16} />
            Back to editor
          </button>
          <h1 tabIndex={-1} className="text-lg font-semibold outline-none">
            {project.title || "Untitled storyboard"}
          </h1>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            {project.scenes.length} scenes · <span className="tabular">{p.total}s</span> total ·
            target <span className="tabular">{project.duration || "—"}s</span>{" "}
            {p.edited && (
              <span className="ml-2 rounded bg-[var(--accent-muted)] px-2 py-1 text-[var(--accent-strong)]">
                Edited
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            title="Undo (⌘Z)"
            disabled={!p.canUndo}
            onClick={p.undo}
            className="h-8 rounded-md border px-2 disabled:opacity-30"
          >
            <IconRotate2 size={18} />
          </button>
          <button
            title="Redo (⌘⇧Z)"
            disabled={!p.canRedo}
            onClick={p.redo}
            className="h-8 rounded-md border px-2 disabled:opacity-30"
          >
            <IconRotateClockwise2 size={18} />
          </button>
          {p.edited && (
            <button onClick={p.reset} className="h-8 rounded-md border px-3 text-xs">
              Reset generated
            </button>
          )}
          <button
            onClick={() => p.exportFile("json")}
            className="flex h-8 items-center gap-2 rounded-md bg-[var(--accent)] px-3 text-xs font-medium text-white"
          >
            <IconDownload size={18} />
            Export
          </button>
        </div>
      </div>
      <div className="mb-3 flex h-7 items-center gap-2 text-xs text-[var(--text-secondary)]">
        <span className="rounded bg-[var(--accent-muted)] px-2 py-1 text-[var(--accent-strong)]">
          Storyboard preview
        </span>
        <span>Not a rendered video</span>
        {checks.length > 0 && (
          <span className="ml-auto rounded bg-[var(--warning-muted)] px-2 py-1 text-[var(--warning)]">
            {checks.length} suggestion{checks.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="grid min-h-[560px] gap-3 xl:grid-cols-[260px_minmax(420px,1fr)_300px]">
        <SceneList scenes={project.scenes} selected={p.selected} setSelected={p.setSelected} />
        <Player
          scene={current}
          index={p.selected}
          total={p.total}
          playhead={p.playhead}
          setPlayhead={p.setPlayhead}
          playing={p.playing}
          setPlaying={p.setPlaying}
          captions={p.captions}
          setCaptions={p.setCaptions}
          safeZones={p.safeZones}
          setSafeZones={p.setSafeZones}
        />
        <Inspector scene={current} update={p.updateScene} exportFile={p.exportFile} />
      </div>
      <div className="mt-3 surface overflow-x-auto rounded-lg p-2">
        <div className="mb-2 flex justify-between text-[11px] text-[var(--text-tertiary)]">
          <span>Timeline</span>
          <span className="tabular">
            {fmt(p.playhead)} / {fmt(p.total)}
          </span>
        </div>
        <div className="flex min-w-[420px] gap-1">
          {project.scenes.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                p.setSelected(i);
                p.setPlayhead(
                  project.scenes.slice(0, i).reduce((a, x) => a + (Number(x.duration) || 0), 0)
                );
              }}
              style={{ flex: Math.max(1, Number(s.duration) || 1) }}
              className={`h-8 rounded text-[10px] ${i === p.selected ? "bg-[var(--accent)] text-[#17111f]" : "bg-[var(--raised)] text-[var(--text-secondary)]"}`}
            >
              {sceneName(s)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => p.exportFile("txt")} className="rounded border px-3 py-2 text-xs">
          Narration .txt
        </button>
        <button onClick={() => p.exportFile("srt")} className="rounded border px-3 py-2 text-xs">
          Captions .srt
        </button>
        <button onClick={() => p.exportFile("json")} className="rounded border px-3 py-2 text-xs">
          Project JSON
        </button>
        <span className="ml-auto flex items-center gap-2 rounded bg-[var(--raised)] px-3 py-2 text-xs text-[var(--text-tertiary)]">
          Render video · MP4 rendering is not available yet
        </span>
      </div>
    </section>
  );
}

function SceneList({
  scenes,
  selected,
  setSelected,
}: {
  scenes: Scene[];
  selected: number;
  setSelected: (n: number) => void;
}) {
  return (
    <div className="surface rounded-lg p-2">
      <div className="mb-2 flex h-7 items-center justify-between px-2 text-xs font-medium">
        Scenes <span className="text-[var(--text-tertiary)]">{scenes.length}</span>
      </div>
      <div role="listbox" aria-label="Scenes">
        {scenes.map((s, i) => (
          <button
            role="option"
            aria-selected={i === selected}
            key={i}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected(Math.min(scenes.length - 1, i + 1));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected(Math.max(0, i - 1));
              }
              if (e.key === "Home") setSelected(0);
              if (e.key === "End") setSelected(scenes.length - 1);
            }}
            className={`mb-1 min-h-14 w-full rounded-md border p-2 text-left ${i === selected ? "border-l-2 border-l-[var(--accent)] border-y-transparent border-r-transparent bg-[var(--raised)]" : "border-transparent hover:bg-[var(--raised)]"}`}
          >
            <div className="flex gap-3">
              <span className="text-xs tabular text-[var(--text-tertiary)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium">{sceneName(s)}</span>
                <span className="mt-1 block truncate text-[11px] text-[var(--text-tertiary)]">
                  {s.narration || s.text || s.title || "Missing narration"}
                </span>
                <span className="mt-1 block text-[10px] tabular text-[var(--text-tertiary)]">
                  {fmt(s.start || 0)} · {s.duration || 0}s
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Player(p: {
  scene?: Scene;
  index: number;
  total: number;
  playhead: number;
  setPlayhead: (n: number) => void;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  captions: boolean;
  setCaptions: (v: boolean) => void;
  safeZones: boolean;
  setSafeZones: (v: boolean) => void;
}) {
  const s = p.scene;
  const title =
    s?.type === "code"
      ? "Implementation detail"
      : s?.type === "diagram"
        ? "The dependency graph"
        : s?.type === "text"
          ? s.text
          : s?.title || "A technical idea, made clear.";
  return (
    <div className="surface rounded-lg p-3">
      <div className="mb-2 flex h-7 items-center justify-between text-xs">
        <span>Preview</span>
        <span className="rounded bg-[var(--raised)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
          Storyboard
        </span>
      </div>
      <div className="mx-auto w-full max-w-[320px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[18px] border-4 border-[var(--raised)] bg-[#17151f] p-5">
          <div className="absolute left-5 right-5 top-5 flex justify-between text-[9px] uppercase tracking-widest text-[var(--text-tertiary)]">
            <span>ReelForge</span>
            <span>#{String(p.index + 1).padStart(2, "0")}</span>
          </div>
          <div className="flex h-full flex-col justify-center">
            {s?.type === "code" ? (
              <>
                <IconCode size={22} className="mb-5 text-[var(--accent)]" />
                <pre className="overflow-auto rounded-lg bg-[#101116] p-3 font-mono text-[10px] leading-5 text-[#d7d1f4]">
                  {s.code || "// Empty code scene"}
                </pre>
              </>
            ) : s?.type === "diagram" ? (
              <>
                <IconTopologyStar3 size={25} className="mb-6 text-[var(--accent)]" />
                <div className="space-y-4">
                  {(s.nodes || [{ label: "Concept" }, { label: "Implementation" }])
                    .slice(0, 5)
                    .map((n, i) => (
                      <div
                        key={i}
                        className="relative rounded border border-[#7464a7] bg-[#28213b] px-3 py-2 text-center text-[10px]"
                      >
                        {n.label || "Node"}
                        {i < 2 && <span className="absolute -bottom-4 left-1/2">↓</span>}
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="mb-5 h-1 w-8 rounded bg-[var(--accent)]" />
                <h2 className="text-balance text-2xl font-semibold leading-tight">{title}</h2>
                {p.captions && (
                  <p className="mt-5 rounded bg-black/60 p-2 text-center text-xs leading-4">
                    {s?.narration || "Narration preview"}
                  </p>
                )}
              </>
            )}
          </div>
          {p.safeZones && (
            <>
              <div className="pointer-events-none absolute inset-x-0 top-10 border-t border-dashed border-[var(--warning)]/70" />
              <div className="pointer-events-none absolute inset-x-0 bottom-20 border-t border-dashed border-[var(--warning)]/70" />
              <div className="pointer-events-none bottom-10 right-3 top-20 border-r border-dashed border-[var(--warning)]/70" />
            </>
          )}
          <div className="absolute bottom-3 left-5 right-5 flex justify-between text-[9px] text-[var(--text-tertiary)]">
            <span>{s?.duration || 0}s</span>
            <span>Approximate safe zones</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            aria-label="Previous scene"
            title="Previous scene"
            onClick={() => p.setPlayhead(Math.max(0, p.playhead - (s?.duration || 0)))}
            className="min-h-11 min-w-11 rounded border"
          >
            <IconPlayerTrackPrev size={18} />
          </button>
          <button
            aria-label={p.playing ? "Pause storyboard" : "Play storyboard"}
            title="Space to play/pause"
            onClick={() => p.setPlaying(!p.playing)}
            className="grid min-h-11 min-w-11 place-items-center rounded-full bg-[var(--accent)] text-[#17111f]"
          >
            {p.playing ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          </button>
          <button
            aria-label="Next scene"
            title="Next scene"
            onClick={() => p.setPlayhead(Math.min(p.total, p.playhead + (s?.duration || 0)))}
            className="min-h-11 min-w-11 rounded border"
          >
            <IconPlayerTrackNext size={18} />
          </button>
          <input
            aria-label="Storyboard timeline"
            type="range"
            min="0"
            max={p.total || 1}
            step="0.1"
            value={Math.min(p.playhead, p.total)}
            onChange={(e) => p.setPlayhead(Number(e.target.value))}
            className="min-w-0 flex-1 accent-[var(--accent)]"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] tabular text-[var(--text-secondary)]">
          <span>
            {fmt(p.playhead)} / {fmt(p.total)}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => p.setCaptions(!p.captions)}
              className={p.captions ? "text-[var(--accent-strong)]" : ""}
            >
              Captions
            </button>
            <button
              onClick={() => p.setSafeZones(!p.safeZones)}
              className={p.safeZones ? "text-[var(--accent-strong)]" : ""}
            >
              Safe zones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Inspector({
  scene,
  update,
  exportFile,
}: {
  scene?: Scene;
  update: (p: Partial<Scene>) => void;
  exportFile: (k: "json" | "txt" | "srt") => void;
}) {
  if (!scene)
    return (
      <div className="surface rounded-xl p-5 text-sm text-[var(--text-secondary)]">
        Select a scene to inspect it.
      </div>
    );
  return (
    <div className="surface rounded-xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium">Inspector</span>
        <span className="rounded bg-[var(--raised)] px-2 py-1 text-[10px] text-[var(--text-secondary)]">
          {sceneName(scene)}
        </span>
      </div>
      <label className="mb-4 block text-xs text-[var(--text-secondary)]">
        Duration
        <input
          type="number"
          min="1"
          value={scene.duration || 1}
          onChange={(e) => update({ duration: Number(e.target.value) })}
          className="mt-2 min-h-11 w-full rounded-lg bg-[var(--app)] px-3 outline-none"
        />
      </label>
      {scene.type === "hook" && (
        <Field label="Title" value={scene.title || ""} onChange={(v) => update({ title: v })} />
      )}{" "}
      {scene.type === "text" && (
        <Field label="Text" value={scene.text || ""} onChange={(v) => update({ text: v })} />
      )}{" "}
      {scene.type === "code" && (
        <label className="mb-4 block text-xs text-[var(--text-secondary)]">
          Code
          <textarea
            value={scene.code || ""}
            onChange={(e) => update({ code: e.target.value })}
            className="mt-2 min-h-48 w-full rounded-lg bg-[var(--app)] p-3 font-mono text-xs leading-5 outline-none"
          />
        </label>
      )}
      <Field
        label="Narration"
        value={scene.narration || ""}
        onChange={(v) => update({ narration: v })}
      />
      <button
        onClick={() => exportFile("txt")}
        className="mt-2 flex min-h-11 items-center gap-2 text-xs text-[var(--text-secondary)]"
      >
        <IconCopy size={16} />
        Copy narration via export
      </button>
    </div>
  );
}
function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="mb-4 block text-xs text-[var(--text-secondary)]">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-20 w-full rounded-lg bg-[var(--app)] p-3 text-sm leading-5 outline-none"
      />
    </label>
  );
}
