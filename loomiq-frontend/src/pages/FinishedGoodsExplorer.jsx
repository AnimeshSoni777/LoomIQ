import { useState, useEffect } from "react";
import { searchFinishedGoods } from "../lib/api";
import {
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown,
  SlidersHorizontal, X, Package, Plus, AlertTriangle, ArrowUpDown,
} from "lucide-react";

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

function SortButton({ label, field, sortBy, sortDir, onSort }) {
  const isActive = sortBy === field;
  let IconComponent;

  if (isActive) {
    if (sortDir === "asc") {
      IconComponent = <ChevronUp size={13} />;
    } else {
      IconComponent = <ChevronDown size={13} />;
    }
  } else {
    IconComponent = <ChevronsUpDown size={13} className="text-slate-400" />;
  }

  let titleText = `Sort by ${label}`;
  if (isActive) {
    titleText += sortDir === "asc" ? " (ascending)" : " (descending)";
  }

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      title={titleText}
      className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium transition-colors cursor-pointer ${
        isActive ? "bg-white text-[#6B21A8] shadow-sm" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {label}
      {IconComponent}
    </button>
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

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm animate-pulse">
      <div className="aspect-[3/4] bg-gray-50" />
      <div className="space-y-3 p-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 rounded bg-slate-100" />
          <div className="h-2.5 w-1/2 rounded bg-slate-100" />
        </div>
        <div className="flex gap-1.5">
          <div className="h-5 w-16 rounded-md bg-slate-100" />
          <div className="h-5 w-14 rounded-md bg-slate-100" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-2.5 w-14 rounded bg-slate-100" />
          <div className="h-4 w-16 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

const FILTER_FIELDS = [
  { name: "category", label: "Category", placeholder: "e.g. Hoodie", type: "text" },
  { name: "fabric", label: "Fabric", placeholder: "e.g. Cotton", type: "text" },
  { name: "season", label: "Season", placeholder: "e.g. Fall", type: "text" },
  { name: "supplier", label: "Supplier", placeholder: "Company name", type: "text" },
  { name: "gsm_min", label: "Min GSM", placeholder: "100", type: "number" },
  { name: "gsm_max", label: "Max GSM", placeholder: "400", type: "number" },
];

export default function FinishedGoodsExplorer() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [draftFilters, setDraftFilters] = useState({
    category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: "", gsm_min: "", gsm_max: ""
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: "", gsm_min: "", gsm_max: ""
  });

  const [pagination, setPagination] = useState({
    sort_by: "selling_price",
    sort_dir: "asc",
    page: 1,
    page_size: 12,
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    const payload = { ...pagination, ...appliedFilters };

    searchFinishedGoods(payload)
      .then((data) => {
        setItems(data.items);
        setTotalCount(data.total_count);
        setTotalPages(data.total_pages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [pagination.page, pagination.sort_by, pagination.sort_dir, pagination.page_size, appliedFilters]);

  const handleSort = (field) => {
    setPagination((prev) => ({
      ...prev,
      sort_by: field,
      sort_dir: prev.sort_by === field && prev.sort_dir === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };
  

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setDraftFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setAppliedFilters(draftFilters); // Push draft state to live state
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    const emptyFilters = { category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: "", gsm_min: "", gsm_max: "" };
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPagination((prev) => ({ 
      ...prev, 
      sort_by: "selling_price", 
      sort_dir: "desc", 
      page: 1 
    }));
  };

  useEffect(() => {
    if (!selectedProduct) return;
    const onKey = (e) => e.key === "Escape" && setSelectedProduct(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProduct]);

  const activeFilterCount = Object.values(appliedFilters).filter((v) => v !== "").length;
  const rangeStart = totalCount === 0 ? 0 : (pagination.page - 1) * pagination.page_size + 1;
  const rangeEnd = Math.min(pagination.page * pagination.page_size, totalCount);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-slate-900">Finished Goods</h1>
          <p className="mt-0.5 text-[13px] text-slate-500 border-b border-transparent">
            {totalCount.toLocaleString()} styles in your production catalog
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <span className="flex items-center gap-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              <ArrowUpDown size={11} />
              Sort
            </span>
            <SortButton label="Price" field="selling_price" sortBy={pagination.sort_by} sortDir={pagination.sort_dir} onSort={handleSort} />
            <SortButton label="GSM" field="gsm" sortBy={pagination.sort_by} sortDir={pagination.sort_dir} onSort={handleSort} />
          </div>

          <div className="mx-1 h-5 w-px bg-slate-200" />

          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors cursor-pointer ${
              isFilterOpen || activeFilterCount > 0
                ? "border-[#6B21A8]/30 bg-purple-50 text-[#6B21A8]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {isFilterOpen ? <X size={14} /> : <SlidersHorizontal size={14} />}
            Filters
            {activeFilterCount > 0 && (
              <span className="grid h-4.5 min-w-4.5 place-items-center rounded-full bg-[#6B21A8] px-1 text-[10px] font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button className="flex items-center gap-1.5 rounded-lg bg-[#6B21A8] px-3.5 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#581C87] cursor-pointer">
            <Plus size={14} />
            New Style
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <form onSubmit={applyFilters} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {FILTER_FIELDS.map(({ name, label, placeholder, type }) => (
              <div key={name}>
                <label className="mb-1.5 block text-[12px] font-medium text-slate-600">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={draftFilters[name]}
                  onChange={handleFilterChange}
                  placeholder={placeholder}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-800 placeholder:text-slate-300 focus:border-[#6B21A8] focus:outline-none focus:ring-2 focus:ring-[#6B21A8]/15"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg px-3.5 py-2 text-[13px] font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#6B21A8] px-4 py-2 text-[13px] font-medium text-white shadow-sm transition-colors hover:bg-[#581C87] cursor-pointer"
            >
              Apply filters
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-white p-4 shadow-sm">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500">
            <AlertTriangle size={15} />
          </span>
          <div>
            <p className="text-[13px] font-medium text-slate-800">Couldn't load the catalog</p>
            <p className="mt-0.5 text-[12.5px] text-slate-500">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: pagination.page_size }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
          <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-slate-50 text-slate-300">
            <Package size={20} />
          </span>
          <p className="text-[14px] font-medium text-slate-700">No styles found</p>
          <p className="mt-1 text-[13px] text-slate-400">Try adjusting or resetting your filters.</p>
        </div>
      ) : (
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
                  <img
                    src={item.image_url}
                    alt={item.style_name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center">
                    <Package size={24} className="text-slate-200" />
                  </div>
                )}
                <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-[10.5px] font-medium text-[#6B21A8] opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                  View details
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="truncate text-[13.5px] font-medium text-slate-900 transition-colors group-hover:text-[#6B21A8]">
                    {item.style_name}
                  </h3>
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
                    <p className="text-[14px] font-semibold tabular-nums text-slate-900">
                      ₹{parseFloat(item.selling_price).toFixed(2)}
                    </p>
                    <p className="text-[11px] tabular-nums text-slate-400">
                      cost ₹{parseFloat(item.cost).toFixed(0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-6 py-3 shadow-sm">
          <p className="text-[12.5px] text-slate-500">
            Showing <span className="font-medium text-slate-700">{rangeStart}–{rangeEnd}</span> of{" "}
            <span className="font-medium text-slate-700">{totalCount.toLocaleString()}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="px-2 text-[12.5px] tabular-nums text-slate-600">
              Page <span className="font-medium text-slate-800">{pagination.page}</span> of {totalPages}
            </span>
            <button
              disabled={pagination.page >= totalPages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X size={17} />
            </button>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-gray-50">
                <div className="aspect-[3/4] w-full">
                  {selectedProduct.image_url ? (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.style_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center">
                      <Package size={36} className="text-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex min-w-0 flex-col">
                <div className="pr-8">
                  <h2 className="text-[18px] font-semibold leading-snug tracking-tight text-slate-900">
                    {selectedProduct.style_name}
                  </h2>
                  <p className="mt-1 font-mono text-[12px] text-slate-400">
                    {selectedProduct.style_number}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Pill tone="purple">{selectedProduct.category}</Pill>
                  <Pill tone="blue">{selectedProduct.fabric}</Pill>
                  <Pill tone="amber">{selectedProduct.season}</Pill>
                </div>

                <div className="mt-4 flex-1 divide-y divide-gray-100 border-t border-gray-100">
                  <DetailRow label="Category">{selectedProduct.category}</DetailRow>
                  <DetailRow label="Fabric">{selectedProduct.fabric}</DetailRow>
                  <DetailRow label="GSM">
                    <span className="tabular-nums">{selectedProduct.gsm}</span>
                  </DetailRow>
                  <DetailRow label="Season">{selectedProduct.season}</DetailRow>
                  <DetailRow label="Supplier">
                    <span className="break-words">{selectedProduct.supplier}</span>
                  </DetailRow>
                  <DetailRow label="Buyer">
                    <span className="break-words">{selectedProduct.buyer ?? "—"}</span>
                  </DetailRow>
                  <DetailRow label="Cost">
                    <span className="tabular-nums">₹{parseFloat(selectedProduct.cost).toFixed(2)}</span>
                  </DetailRow>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-purple-50 px-4 py-3">
                  <span className="text-[12.5px] font-medium text-[#6B21A8]">Selling price</span>
                  <span className="text-[18px] font-semibold tabular-nums text-[#6B21A8]">
                    ₹{parseFloat(selectedProduct.selling_price).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}