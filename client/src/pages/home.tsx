import { useState } from "react";
import { Moon, ClipboardList } from "lucide-react";
import ClientManager from "@/components/client-manager";
import ProviderManager from "@/components/provider-manager";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <ClipboardList className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Gestão de Procedimentos
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="p-2 rounded-md hover:bg-accent transition-colors"
                onClick={toggleDarkMode}
                data-testid="button-toggle-dark-mode"
              >
                <Moon className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClientManager />
          <ProviderManager />
        </div>
      </main>
    </div>
  );
}
