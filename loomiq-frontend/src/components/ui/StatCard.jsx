export default function StatCard({ label, value, accent = "denim" }) {
  const accentBorder = {
    denim: "border-t-denim",
    thread: "border-t-thread",
    sage: "border-t-sage",
    rust: "border-t-rust",
  };

  return (
    <div className={`bg-white/60 border border-ink/10 border-t-4 ${accentBorder[accent]} rounded-md p-5 shadow-sm`}>
      <p className="font-display text-xs uppercase tracking-widest text-ink/50 mb-2">{label}</p>
      <p className="font-mono text-3xl text-ink">{value}</p>
    </div>
  );
}