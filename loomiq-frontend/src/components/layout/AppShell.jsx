import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-ink font-sans">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-8 py-8 relative">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
