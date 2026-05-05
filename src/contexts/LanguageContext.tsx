import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "pt" | "en";

type LanguageContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: <T,>(dict: Record<Lang, T>) => T;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    return (saved === "en" || saved === "pt" ? saved : "pt") as Lang;
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = <T,>(dict: Record<Lang, T>): T => dict[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
