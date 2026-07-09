import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import NlQuery from "./pages/NlQuery";
import ProductSearch from "./pages/ProductSearch";
import ImageSearch from "./pages/ImageSearch";
import FinishedGoodsExplorer from "./pages/FinishedGoodsExplorer";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nl-query" element={<NlQuery />} />
          <Route path="/search" element={<ProductSearch />} />
          <Route path="/image-search" element={<ImageSearch />} />
          <Route path="/catalog" element={<FinishedGoodsExplorer />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}