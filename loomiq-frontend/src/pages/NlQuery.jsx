import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { postNlQuery } from "../lib/api";
import WovenLabel from "../components/ui/WovenLabel";
import ResultTable from "../components/ui/ResultTable";

export default function NlQuery() {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [exchanges, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setQuestion("");
    setLoading(true);

    try {
      const response = await postNlQuery(trimmed);
      setExchanges((prev) => [...prev, { question: trimmed, response, error: null }]);
    } catch (err) {
      setExchanges((prev) => [...prev, { question: trimmed, response: null, error: err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-ink/50 font-display">AI Feature</p>
        <h1 className="text-3xl font-display text-ink mt-1">Ask the ERP</h1>
        <p className="text-ink/50 text-sm mt-2">
          Ask a business question in plain English — it's translated into SQL, run against the live
          database, and answered.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {exchanges.length === 0 && !loading && (
          <div className="border border-dashed border-ink/15 rounded-md px-6 py-10 text-center text-ink/40 text-sm">
            Try: "Which supplier has the highest average order value?"
          </div>
        )}

        {exchanges.map((exchange, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-end">
              <div className="bg-denim text-canvas rounded-md px-4 py-2.5 max-w-xl text-sm">
                {exchange.question}
              </div>
            </div>

            {exchange.error && (
              <div className="border border-rust/40 bg-rust/5 text-rust text-sm rounded-md px-4 py-3">
                {exchange.error}
              </div>
            )}

            {exchange.response && (
              <div className="bg-white/60 border border-ink/10 rounded-md p-5 space-y-4">
                {exchange.response.sql && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <WovenLabel tone="denim">Generated SQL</WovenLabel>
                    </div>
                    <pre className="font-mono text-xs bg-ink text-canvas rounded-md p-3 overflow-x-auto">
                      {exchange.response.sql}
                    </pre>
                  </div>
                )}

                {exchange.response.result && exchange.response.result.length > 0 && (
                  <div>
                    <div className="mb-2">
                      <WovenLabel tone="sage">Query result</WovenLabel>
                    </div>
                    <ResultTable columns={exchange.response.columns} rows={exchange.response.result} />
                  </div>
                )}

                {exchange.response.answer && (
                  <div>
                    <div className="mb-2">
                      <WovenLabel tone="thread">AI generated</WovenLabel>
                    </div>
                    <p className="text-ink text-sm leading-relaxed">{exchange.response.answer}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-ink/40 text-sm">
            <Loader2 size={15} className="animate-spin" />
            Thinking…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about suppliers, orders, or invoices…"
          className="flex-1 border border-ink/15 bg-white/70 rounded-md px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-denim/40"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-thread text-ink rounded-md px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-thread/90 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}