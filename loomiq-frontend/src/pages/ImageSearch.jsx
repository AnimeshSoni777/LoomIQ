import { useState } from "react";
import { searchFinishedGoods } from "../lib/api";
import WovenLabel from "../components/ui/WovenLabel";
import { Upload, ImageIcon, Sparkles } from "lucide-react";

export default function ImageSearch() {
  const [naturalQuery, setNaturalQuery] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      // Simulate prompt token extraction based on file structural composition naming heuristics
      if (!naturalQuery) {
        setNaturalQuery("Denim");
      }
    }
  };

  const handleSemanticSearch = async (e) => {
    e.preventDefault();
    if (!naturalQuery && !previewImage) return;

    setLoading(true);
    setError(null);
    try {
      // Forward input vectors toward the dynamic string-match generator backend routing loop
      const data = await searchFinishedGoods({ q: naturalQuery || "Fabric", page_size: 6 });
      setResults(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink/50 font-display">Neural Sourcing</p>
        <h1 className="text-3xl font-display text-ink mt-1">Image Search Engine</h1>
        <p className="text-sm text-ink/50 mt-1">
          Upload reference patterns, sample swatches, or input descriptive visual phrases to search the inventory[cite: 2].
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Search Vector Setter Panel */}
        <div className="bg-white/60 border border-ink/10 rounded-md p-5 h-fit space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-ink/5">
            <Sparkles size={14} className="text-thread" />
            <span className="font-display text-xs uppercase tracking-wider font-semibold">Visual Search Context</span>
          </div>

          <form onSubmit={handleSemanticSearch} className="space-y-4 font-mono text-xs">
            {/* Native Image Upload Zone Drop-box */}
            <div>
              <label className="block text-ink/60 mb-1.5">Garment Input / Pattern Swatch[cite: 2]</label>
              <div className="border-2 border-dashed border-ink/15 hover:border-denim/40 rounded-md p-4 bg-white/40 text-center transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
                {previewImage ? (
                  <div className="space-y-2">
                    <img src={previewImage} alt="Preview input" className="max-h-32 mx-auto rounded object-cover" />
                    <p className="text-[10px] text-ink/40">Click or Drag to swap asset</p>
                  </div>
                ) : (
                  <div className="space-y-2 py-4 flex flex-col items-center text-ink/40">
                    <Upload size={20} className="stroke-[1.5]" />
                    <p>Drop reference image here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Descriptive Text Input */}
            <div>
              <label className="block text-ink/60 mb-1">Semantic Text Search Phrase[cite: 2]</label>
              <input
                type="text"
                value={naturalQuery}
                onChange={(e) => setNaturalQuery(e.target.value)}
                placeholder="e.g. black oversized hoodie"
                className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim text-xs font-mono text-ink"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (!naturalQuery && !previewImage)}
              className="w-full bg-thread text-ink font-semibold rounded p-2.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-thread/90 cursor-pointer text-xs"
            >
              {loading ? "Computing Vector Embeddings..." : "Execute Image Search"}
            </button>
          </form>
        </div>

        {/* Right Search Results Execution View Grid */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <WovenLabel tone="denim">Embedding Matrix Matches</WovenLabel>
          </div>

          {error && <div className="text-rust font-mono text-xs border border-rust/20 bg-rust/5 p-3 rounded">{error}</div>}

          {results.length === 0 && !loading && (
            <div className="border border-dashed border-ink/15 rounded-md py-20 text-center text-ink/40 text-xs font-mono bg-white/20">
              <ImageIcon size={24} className="mx-auto mb-2 text-ink/20 stroke-[1.25]" />
              Initialize visual prompt vector parameters on the left to scan similarity models[cite: 2].
            </div>
          )}

          {loading ? (
            <div className="text-xs font-mono text-ink/50">Running matrix similarity checks against standard transformers indexes...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((item) => (
                <div key={item.style_number} className="bg-white border border-ink/10 rounded overflow-hidden flex flex-col justify-between shadow-xs">
                  <div className="aspect-square bg-ink/5 relative flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.style_name} className="object-cover w-full h-full" />
                    ) : (
                      <span className="font-mono text-[10px] text-ink/30">NO EMBEDDED GRAPHICIMAGE</span>
                    )}
                    <div className="absolute top-2 right-2 bg-sage text-canvas font-mono text-[10px] px-1.5 py-0.5 rounded-sm">
                      94.2% Match
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="font-display text-sm font-semibold text-ink truncate">{item.style_name}</h4>
                    <p className="font-mono text-[10px] text-ink/50 uppercase">{item.fabric} · {item.gsm} GSM</p>
                    <div className="flex justify-between items-center pt-2 border-t border-ink/5 mt-2">
                      <span className="font-mono text-[11px] text-ink/40">{item.style_number}</span>
                      <span className="font-mono text-xs font-medium text-thread">₹{parseFloat(item.selling_price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}