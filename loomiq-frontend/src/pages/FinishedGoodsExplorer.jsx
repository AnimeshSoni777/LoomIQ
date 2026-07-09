import { useState, useEffect } from "react";
import { searchFinishedGoods } from "../lib/api";
import WovenLabel from "../components/ui/WovenLabel";
import { ChevronLeft, ChevronRight, ArrowUpDown, LayoutGrid, Filter, X } from "lucide-react";

export default function FinishedGoodsExplorer() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: "", gsm_min: "", gsm_max: ""
  });

  const [pagination, setPagination] = useState({
    sort_by: "style_number",
    sort_dir: "asc",
    page: 1,
    page_size: 12,
  });

  const fetchProducts = () => {
    setLoading(true);
    setError(null);

    const payload = {
      ...pagination,
      category: filters.category,
      fabric: filters.fabric,
      color: filters.color,
      print: filters.print_,
      season: filters.season,
      supplier: filters.supplier,
      buyer: filters.buyer,
      gsm_min: filters.gsm_min,
      gsm_max: filters.gsm_max,
    };

    searchFinishedGoods(payload)
      .then((data) => {
        setItems(data.items);
        setTotalCount(data.total_count);
        setTotalPages(data.total_pages);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.sort_by, pagination.sort_dir, pagination.page_size]);

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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchProducts(); 
  };

  const clearFilters = () => {
    setFilters({ category: "", fabric: "", color: "", print_: "", season: "", supplier: "", buyer: "", gsm_min: "", gsm_max: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setTimeout(() => {
      fetchProducts();
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/50 font-display">System Vault</p>
          <h1 className="text-3xl font-display text-ink mt-1">Finished Goods Explorer</h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`flex items-center gap-1.5 border px-3 py-1.5 rounded transition-colors cursor-pointer ${isFilterOpen ? "bg-denim text-canvas border-denim" : "bg-white/60 border-ink/10 hover:text-denim"}`}>
            {isFilterOpen ? <X size={14} /> : <Filter size={14} />} 
            {isFilterOpen ? "Close Filters" : "Filters"}
          </button>
          <div className="w-px h-4 bg-ink/20 mx-1"></div>
          <button onClick={() => handleSort("selling_price")} className="flex items-center gap-1 border border-ink/10 bg-white/60 px-3 py-1.5 rounded hover:text-thread transition-colors cursor-pointer">
            Price <ArrowUpDown size={12} />
          </button>
          <button onClick={() => handleSort("gsm")} className="flex items-center gap-1 border border-ink/10 bg-white/60 px-3 py-1.5 rounded hover:text-thread transition-colors cursor-pointer">
            GSM <ArrowUpDown size={12} />
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <form onSubmit={applyFilters} className="bg-white/60 border border-ink/10 rounded-md p-5 shadow-sm font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-ink/60 mb-1">Category</label>
              <input type="text" name="category" value={filters.category} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="e.g. Hoodie"/>
            </div>
            <div>
              <label className="block text-ink/60 mb-1">Fabric</label>
              <input type="text" name="fabric" value={filters.fabric} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="e.g. Cotton"/>
            </div>
            <div>
              <label className="block text-ink/60 mb-1">Season</label>
              <input type="text" name="season" value={filters.season} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="e.g. Fall"/>
            </div>
            <div>
              <label className="block text-ink/60 mb-1">Supplier</label>
              <input type="text" name="supplier" value={filters.supplier} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="Company Name"/>
            </div>
            <div>
              <label className="block text-ink/60 mb-1">Min GSM</label>
              <input type="number" name="gsm_min" value={filters.gsm_min} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="100"/>
            </div>
            <div>
              <label className="block text-ink/60 mb-1">Max GSM</label>
              <input type="number" name="gsm_max" value={filters.gsm_max} onChange={handleFilterChange} className="w-full border border-ink/15 bg-white rounded p-2 focus:outline-none focus:ring-1 focus:ring-denim" placeholder="400"/>
            </div>
            <div className="col-span-2 flex items-end gap-2">
              <button type="button" onClick={clearFilters} className="w-1/3 bg-ink/5 hover:bg-ink/10 text-ink font-medium rounded p-2 transition-colors cursor-pointer text-center">
                Clear
              </button>
              <button type="submit" className="w-2/3 bg-thread hover:bg-thread/90 text-ink font-medium rounded p-2 transition-colors cursor-pointer text-center">
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      )}

      {error && <div className="text-rust font-mono text-xs border border-rust/20 bg-rust/5 p-3 rounded">{error}</div>}

      {loading ? (
        <p className="text-ink/50 text-sm font-mono">Loading core product repository rows…</p>
      ) : (
        <>
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

          {/* Pagination Toolbar */}
          <div className="flex items-center justify-between border-t border-ink/10 pt-4 font-mono text-xs text-ink/50">
            <span>Total: {totalCount} records</span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                className="p-1.5 border border-ink/10 bg-white rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-ink font-medium text-xs">Page {pagination.page} of {totalPages}</span>
              <button
                disabled={pagination.page >= totalPages}
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="p-1.5 border border-ink/10 bg-white rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}