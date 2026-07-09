/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Terminal, X, Copy, Check, Braces } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   DEVELOPER MODE — Split-Pane Terminal Drawer (GitHub-Dark)
   Global context lets any page `publish()` its live API payload,
   and a floating FAB slides open a bottom terminal pane rendering
   the raw JSON with syntax highlighting + line numbers.
   ═══════════════════════════════════════════════════════════════ */

const DevConsoleContext = createContext({
  publish: () => {},
  open: false,
  setOpen: () => {},
  feed: null,
});

export const useDevConsole = () => useContext(DevConsoleContext);

export function DevConsoleProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [feed, setFeed] = useState(() => ({
    endpoint: "system://boot",
    method: "INIT",
    data: { status: "idle", message: "Awaiting first payload from the active route…" },
    ts: Date.now(),
  }));

  const publish = useCallback((method, endpoint, data) => {
    setFeed({ method, endpoint, data, ts: Date.now() });
  }, []);

  const value = useMemo(() => ({ publish, open, setOpen, feed }), [publish, open, feed]);

  return (
    <DevConsoleContext.Provider value={value}>
      {children}
      <TerminalFab />
      {open && <TerminalDrawer />}
    </DevConsoleContext.Provider>
  );
}

/* ── Floating Action Button ───────────────────────────────────── */
function TerminalFab() {
  const { open, setOpen } = useDevConsole();
  return (
    <button
      onClick={() => setOpen(!open)}
      title="Developer Mode — inspect raw response"
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg font-mono text-[11px] uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-ink/25 border ${
        open
          ? "bg-vector text-void border-vector"
          : "bg-void text-vector border-voidline hover:border-vector/60 hover:shadow-vector/20"
      }`}
    >
      <Terminal size={15} strokeWidth={2} />
      {open ? "Exit Dev Mode" : "Dev Mode"}
      <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-void" : "bg-vector animate-pulse"}`} />
    </button>
  );
}

/* ── Lightweight JSON syntax highlighter (GitHub-Dark tokens) ─── */
function highlightLine(line, key) {
  const tokens = [];
  const regex = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)/g;
  const push = (cls, text) =>
    tokens.push(<span key={`${key}-${tokens.length}`} className={cls}>{text}</span>);
  let last = 0;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) push("text-[#8b949e]", line.slice(last, match.index));
    if (match[1] !== undefined) {
      const isKey = match[2] !== undefined;
      push(isKey ? "text-[#7ee787]" : "text-[#a5d6ff]", match[1]);
      if (isKey) push("text-[#8b949e]", match[2]);
    } else if (match[3] !== undefined) {
      push("text-[#79c0ff]", match[3]);
    } else if (match[4] !== undefined) {
      push("text-[#ff7b72]", match[4]);
    }
    last = regex.lastIndex;
  }
  if (last < line.length) push("text-[#8b949e]", line.slice(last));
  return tokens;
}

/* ── Bottom Drawer, styled like a dark-mode code editor ───────── */
function TerminalDrawer() {
  const { setOpen, feed } = useDevConsole();
  const [copied, setCopied] = useState(false);

  const raw = useMemo(() => JSON.stringify(feed?.data ?? {}, null, 2), [feed]);
  const lines = useMemo(() => raw.split("\n"), [raw]);
  const bytes = useMemo(() => new Blob([raw]).size, [raw]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(raw).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="terminal-drawer fixed inset-x-0 bottom-0 z-50 h-[46vh] min-h-[300px] bg-void border-t border-voidline flex flex-col font-mono">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-voidline bg-[#161B22] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[11px] text-[#8b949e] tracking-wide truncate">
          loomiq — devtools · response_inspector
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded border border-dashed border-vector/40 text-vector text-[10px] uppercase tracking-widest">
            <Braces size={11} />
            {feed?.method} {feed?.endpoint}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-voidline text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#8b949e] text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
          >
            {copied ? <Check size={11} className="text-[#28c840]" /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy JSON"}
          </button>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded text-[#8b949e] hover:text-[#c9d1d9] hover:bg-voidline transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Tab strip */}
      <div className="flex items-center px-4 border-b border-voidline bg-[#0D1117] text-[10px] uppercase tracking-widest shrink-0">
        <span className="px-3 py-2 border-b-2 border-vector text-[#c9d1d9]">Response Body</span>
        <span className="px-3 py-2 text-[#484f58]">Headers</span>
        <span className="px-3 py-2 text-[#484f58]">Timing</span>
      </div>

      {/* Editor viewport with line gutter */}
      <div className="terminal-scroll flex-1 overflow-auto text-[11.5px] leading-[1.65]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#161B22]">
                <td className="select-none text-right pr-4 pl-4 w-12 text-[#3d444d] align-top sticky left-0 bg-void">
                  {idx + 1}
                </td>
                <td className="whitespace-pre pr-6 align-top">{highlightLine(line, idx)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-4 py-1.5 border-t border-voidline bg-[#161B22] text-[10px] text-[#8b949e] uppercase tracking-widest shrink-0">
        <span className="text-vector">● live buffer</span>
        <span>{lines.length} lines</span>
        <span>{(bytes / 1024).toFixed(2)} KB</span>
        <span className="hidden sm:inline">UTF-8 · JSON</span>
        <span className="ml-auto flex items-center gap-2">
          synced {new Date(feed.ts).toLocaleTimeString()}
          <span className="terminal-caret" />
        </span>
      </div>
    </div>
  );
}
