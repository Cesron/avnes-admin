"use client";

import { createContext, useContext, useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type PwaContextValue = {
  available: boolean;
  isIOS: boolean;
  install: () => Promise<"accepted" | "dismissed" | "manual">;
};

const PwaContext = createContext<PwaContextValue | null>(null);

// Mounted above the authenticated layout so we also capture prompts on login.
export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const modes = window.matchMedia(
      "(display-mode: standalone), (display-mode: fullscreen), (display-mode: minimal-ui)",
    );
    const syncDisplayMode = () => {
      const iosStandalone = (navigator as Navigator & { standalone?: boolean })
        .standalone;
      setInstalled(modes.matches || iosStandalone === true);
    };
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setPrompt(null);
      setInstalled(true);
    };

    syncDisplayMode();
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    );
    modes.addEventListener("change", syncDisplayMode);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      modes.removeEventListener("change", syncDisplayMode);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install(): Promise<"accepted" | "dismissed" | "manual"> {
    if (!prompt) return "manual";
    // A beforeinstallprompt event may only be used once.
    setPrompt(null);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") setInstalled(true);
      return outcome;
    } catch {
      return "manual";
    }
  }

  return (
    <PwaContext.Provider value={{ available: !installed, isIOS, install }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) throw new Error("usePwa requiere PwaProvider");
  return context;
}
