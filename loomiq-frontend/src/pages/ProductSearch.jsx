import { useState } from "react";
import { searchFinishedGoods } from "../lib/api";
import WovenLabel from "../components/ui/WovenLabel";
import { Search, SlidersHorizontal, PackageX, LayoutGrid } from "lucide-react";

export default function ProductSearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [formInputs, setFormInputs] = useState({
    q: "",
    category: "",
    fabric: "",
    color: "",
    print_: "",
    season: "",
    supplier: "",
    buyer: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setHasSearched(true);

    const queryParams = {
      q: formInputs.q,
      category: formInputs.category,
      fabric: formInputs.fabric,
      color: formInputs.color,
      print: formInputs.print_,
      season: formInputs.season,
      supplier: formInputs.supplier,
      buyer: formInputs.buyer,
      page_size: 50,
    };

    searchFinishedGoods(queryParams)
      .then((data) => setItems(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-ink/50 font-display">Multi-Criteria Retrieval</p>
        <h1 className="text-3xl font-display text-ink mt-1">Product Search Engine</h1>
        <p className="text-xs text-ink/50 mt-1">
          Combine natural language text matching with explicit structural parameters to find specific assets.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="bg-white/60 border border-ink/10 rounded-md p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 pb-2 border-b border-ink/5">
          <SlidersHorizontal size={14} className="text-thread" />
          <span className="font-display text-xs uppercase tracking-wider font-semibold">Search Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-ink/60 mb-1 font-semibold">Natural Language Query</label>
            <div className="relative">
              <input
                type="text"
                name="q"
                value={formInputs.q}
                onChange={handleInputChange}
                placeholder="e.g. Blue cotton shirts supplied by ABC Textiles"
                className="w-full border border-ink/15 bg-white rounded p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-denim"
              />
              <Search className="absolute left-3 top-3.5 text-ink/30" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formInputs.category}
              onChange={handleInputChange}
              placeholder="e.g. Shirt"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Fabric</label>
            <input
              type="text"
              name="fabric"
              value={formInputs.fabric}
              onChange={handleInputChange}
              placeholder="e.g. Denim"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={formInputs.color}
              onChange={handleInputChange}
              placeholder="e.g. Blue"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Print</label>
            <input
              type="text"
              name="print_"
              value={formInputs.print_}
              onChange={handleInputChange}
              placeholder="e.g. Striped"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Season</label>
            <input
              type="text"
              name="season"
              value={formInputs.season}
              onChange={handleInputChange}
              placeholder="e.g. Summer 2026"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Supplier</label>
            <input
              type="text"
              name="supplier"
              value={formInputs.supplier}
              onChange={handleInputChange}
              placeholder="e.g. ABC Textiles"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div>
            <label className="block text-ink/60 mb-1">Buyer</label>
            <input
              type="text"
              name="buyer"
              value={formInputs.buyer}
              onChange={handleInputChange}
              placeholder="e.g. Thames & Co"
              className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-denim hover:bg-denim/90 text-canvas font-medium rounded p-2 transition-colors cursor-pointer text-center"
            >
              {loading ? "Searching..." : "Execute Search"}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="text-rust font-mono text-xs border border-rust/20 bg-rust/5 p-3 rounded">{error}</div>}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <WovenLabel tone="denim">Search Index Hits</WovenLabel>
        </div>

        {items.length === 0 && !loading && hasSearched && (
          <div className="border border-dashed border-ink/15 rounded-md py-12 text-center text-ink/40 text-xs font-mono bg-white/20">
            <PackageX size={20} className="mx-auto mb-2 text-ink/20" />
            No garments matched the specified search combinations.
          </div>
        )}

        {items.length === 0 && !hasSearched && (
          <div className="border border-dashed border-ink/15 rounded-md py-16 text-center text-ink/40 text-xs font-mono bg-white/10">
            Configure terms above and click 'Execute Search' to pull indexing rows.
          </div>
        )}

        {/* Detailed Cards (Same as Screen 5) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.style_number} className="bg-white border border-ink/10 rounded overflow-hidden flex flex-col justify-between shadow-xs group hover:border-ink/20 transition-all">
              <div className="aspect-[3/4] bg-ink/5 relative overflow-hidden flex items-center justify-center">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.style_name} className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-300" />
                ) : (
                  <LayoutGrid size={24} className="text-ink/10 stroke-[1.25]" />
                )}
                <div className="absolute top-2 left-2">
                  <WovenLabel tone="neutral">{item.style_number}</WovenLabel>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-display text-sm font-semibold text-ink line-clamp-1">{item.style_name}</h3>
                  <p className="font-mono text-[10px] text-ink/40 uppercase mt-0.5">{item.category} · {item.season}</p>
                </div>

                <div className="border-t border-dashed border-ink/5 pt-2 font-mono text-[11px] text-ink/70 space-y-0.5">
                  <div>Fabric: <span className="text-ink font-medium">{item.fabric}</span></div>
                  <div>GSM: <span className="text-ink font-medium">{item.gsm}</span></div>
                  <div className="truncate">Supplier: <span className="text-ink font-medium">{item.supplier}</span></div>
                </div>

                <div className="border-t border-ink/5 pt-2.5 flex justify-between items-center -mx-4 -mb-4 p-4 mt-auto bg-canvas/10">
                  <span className="font-mono text-[10px] text-ink/40">Cost: ₹{parseFloat(item.cost).toFixed(0)}</span>
                  <span className="font-mono text-sm font-semibold text-denim">₹{parseFloat(item.selling_price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}