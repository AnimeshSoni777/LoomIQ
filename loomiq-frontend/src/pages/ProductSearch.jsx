import { useState, useEffect } from "react";
import { searchFinishedGoods } from "../lib/api";
import { Search, SlidersHorizontal, PackageX, X, Package } from "lucide-react";

const PILL_TONES = {
  gray: "bg-gray-100 text-gray-700",
  purple: "bg-purple-50 text-purple-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  emerald: "bg-emerald-50 text-emerald-700",
};

function Pill({ children, tone = "gray" }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ${PILL_TONES[tone]}`}>
      {children}
    </span>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[12.5px] font-medium text-slate-400">{label}</span>
      <span className="text-right text-[13.5px] text-slate-800">{children}</span>
    </div>
  );
}

export default function ProductSearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formInputs, setFormInputs] = useState({
    q: "", category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: ""
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

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e) => e.key === "Escape" && setSelectedProduct(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProduct]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">Multi-Criteria Retrieval</p>
        <h1 className="text-[22px] font-semibold tracking-tight text-slate-900 mt-1">Product Search Engine</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">
          Combine natural language text matching with explicit structural parameters to find specific assets.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <SlidersHorizontal size={14} className="text-[#6B21A8]" />
          <span className="text-[13px] uppercase tracking-wider font-semibold text-slate-700">Search Criteria</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="sm:col-span-2 md:col-span-4">
            <label className="block text-[12px] font-medium text-slate-600 mb-1">Natural Language Query</label>
            <div className="relative">
              <input
                type="text"
                name="q"
                value={formInputs.q}
                onChange={handleInputChange}
                placeholder="e.g. Blue cotton shirts supplied by ABC Textiles"
                className="w-full rounded-lg border border-slate-200 bg-white p-3 pl-10 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
              />
              <Search className="absolute left-3 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={formInputs.category}
              onChange={handleInputChange}
              placeholder="e.g. Shirt"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">Fabric</label>
            <input
              type="text"
              name="fabric"
              value={formInputs.fabric}
              onChange={handleInputChange}
              placeholder="e.g. Denim"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">Color</label>
            <input
              type="text"
              name="color"
              value={formInputs.color}
              onChange={handleInputChange}
              placeholder="e.g. Blue"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
            />
          </div>

          <div>
            <label className="block text-[12px] font-medium text-slate-600 mb-1">Season</label>
            <input
              type="text"
              name="season"
              value={formInputs.season}
              onChange={handleInputChange}
              placeholder="e.g. Summer 2026"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
            />
          </div>

          <div className="md:col-start-4 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#6B21A8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#581C87] cursor-pointer disabled:opacity-50"
            >
              {loading ? "Searching..." : "Execute Search"}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="text-red-600 text-sm border border-red-200 bg-red-50 p-3 rounded-lg">{error}</div>}

      <div className="space-y-4">
        {items.length === 0 && !loading && hasSearched && (
          <div className="grid place-items-center rounded-xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-slate-300">
              <PackageX size={20} />
            </span>
            <p className="text-[14px] font-medium text-slate-700">No garments matched</p>
            <p className="mt-1 text-[13px] text-slate-400">Try adjusting your search combinations.</p>
          </div>
        )}

        {items.length === 0 && !hasSearched && (
          <div className="grid place-items-center rounded-xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-[13px] text-slate-400">Configure terms above and click 'Execute Search' to pull indexing rows.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.style_number}
              onClick={() => setSelectedProduct(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelectedProduct(item)}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:ring-2 hover:ring-purple-500 hover:border-transparent hover:shadow-md cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.style_name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                ) : (
                  <div className="grid h-full w-full place-items-center"><Package size={24} className="text-slate-200" /></div>
                )}
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[10.5px] font-medium text-[#6B21A8] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  View details
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="truncate text-[13.5px] font-medium text-slate-900 transition-colors group-hover:text-[#6B21A8]">{item.style_name}</h3>
                  <p className="mt-0.5 font-mono text-[11.5px] text-slate-400">{item.style_number}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Pill tone="purple">{item.category}</Pill>
                  <Pill tone="blue">{item.fabric}</Pill>
                  <Pill tone="amber">{item.season}</Pill>
                </div>
                <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                  <div className="text-[11.5px] leading-relaxed text-slate-400">
                    <p>{item.gsm} GSM</p>
                    <p className="max-w-28 truncate">{item.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold tabular-nums text-slate-900">₹{parseFloat(item.selling_price).toFixed(2)}</p>
                    <p className="text-[11px] tabular-nums text-slate-400">cost ₹{parseFloat(item.cost).toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)} role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedProduct(null)} className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer">
              <X size={17} />
            </button>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-gray-50">
                <div className="aspect-[3/4] w-full">
                  {selectedProduct.image_url ? (
                    <img src={selectedProduct.image_url} alt={selectedProduct.style_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center"><Package size={36} className="text-slate-200" /></div>
                  )}
                </div>
              </div>
              <div className="flex min-w-0 flex-col">
                <div className="pr-8">
                  <h2 className="text-[18px] font-semibold leading-snug tracking-tight text-slate-900">{selectedProduct.style_name}</h2>
                  <p className="mt-1 font-mono text-[12px] text-slate-400">{selectedProduct.style_number}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone="purple">{selectedProduct.category}</Pill>
                  <Pill tone="blue">{selectedProduct.fabric}</Pill>
                  <Pill tone="amber">{selectedProduct.season}</Pill>
                </div>
                <div className="mt-4 flex-1 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow label="Category">{selectedProduct.category}</DetailRow>
                  <DetailRow label="Fabric">{selectedProduct.fabric}</DetailRow>
                  <DetailRow label="GSM"><span className="tabular-nums">{selectedProduct.gsm}</span></DetailRow>
                  <DetailRow label="Season">{selectedProduct.season}</DetailRow>
                  <DetailRow label="Supplier"><span className="break-words">{selectedProduct.supplier}</span></DetailRow>
                  <DetailRow label="Cost"><span className="tabular-nums">₹{parseFloat(selectedProduct.cost).toFixed(2)}</span></DetailRow>
                </div>
                <div className="mt-4 flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
                  <span className="text-[12.5px] font-medium text-[#6B21A8]">Selling price</span>
                  <span className="text-[18px] font-semibold tabular-nums text-[#6B21A8]">₹{parseFloat(selectedProduct.selling_price).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}