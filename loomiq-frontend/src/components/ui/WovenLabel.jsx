export default function WovenLabel({ children, tone = "neutral" }) {
  const toneStyles = {
    neutral: "text-ink outline-ink/40",
    denim: "text-denim outline-denim/50",
    sage: "text-sage outline-sage/50",
    thread: "text-thread outline-thread/50",
    rust: "text-rust outline-rust/50",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide outline outline-1 outline-dashed outline-offset-[-3px] rounded-sm ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
}