"use client";

import { useState, useEffect } from "react";

const LOADING_MESSAGES = [
  "Loan consulte les archives de 2042...",
  "Analyse de ton profil en cours...",
  "Connexion aux bases de données du futur...",
  "Calcul de ta trajectoire professionnelle...",
  "Vérification de ton salaire en 2042...",
  "Loan négocie avec ton futur manager...",
  "Synchronisation temporelle en cours...",
  "Résultat imminent...",
];

const JOB_SUGGESTIONS = [
  "Product Manager",
  "Senior PM",
  "HoP",
  "Product Leader",
  "Developer",
  "Tech Lead",
  "CTO",
  "Product Designer",
  "Data Analyst",
  "Data Scientist",
  "AI Product",
  "CPO",
  "Engineering Manager",
  "DevOps",
  "Full Stack Dev",
  "Consultant",
];

const SHORT_ERRORS: Record<string, Record<string, string>> = {
  prenom: { required: "🔮 Loan a besoin de ton prénom." },
  email: { required: "🔮 Loan a besoin de ton email.", invalid: "🔮 Format d'email invalide." },
  jobTitle: { required: "🔮 Sans titre, Loan ne peut pas prédire.", gibberish: "Ça ne ressemble pas à un titre de poste." },
};

interface MobileFormProps {
  onResult: (result: Record<string, unknown>) => void;
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function MobileForm({ onResult, onLoadingChange }: MobileFormProps) {
  const [formData, setFormData] = useState({ prenom: "", email: "", jobTitle: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Notify parent when loading state changes
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const filteredSuggestions = formData.jobTitle.trim().length > 0
    ? JOB_SUGGESTIONS.filter((s) => s.toLowerCase().includes(formData.jobTitle.toLowerCase()))
    : JOB_SUGGESTIONS;

  const visibleSuggestions = showAllSuggestions ? filteredSuggestions : filteredSuggestions.slice(0, 6);

  const isGibberish = (text: string): boolean => {
    const cleaned = text.trim().replace(/[\s\-'.]/g, "");
    if (cleaned.length < 4) return false;
    const lower = cleaned.toLowerCase();
    const vowels = lower.match(/[aeiouyàâäéèêëïîôùûüœæ]/gi) || [];
    const ratio = vowels.length / lower.length;
    if (ratio < 0.15) return true;
    if (/[^aeiouyàâäéèêëïîôùûüœæ]{5,}/i.test(lower)) return true;
    if (/^(.{1,3})\1{2,}$/i.test(lower)) return true;
    if (/(.)\1{2,}/i.test(lower)) return true;
    return false;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  const selectSuggestion = (title: string) => {
    setFormData((prev) => ({ ...prev, jobTitle: title }));
    if (fieldErrors.jobTitle) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next.jobTitle; return next; });
    }
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.prenom.trim()) errors.prenom = SHORT_ERRORS.prenom.required;
    if (!formData.email.trim()) {
      errors.email = SHORT_ERRORS.email.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = SHORT_ERRORS.email.invalid;
    }
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = SHORT_ERRORS.jobTitle.required;
    } else if (isGibberish(formData.jobTitle.trim())) {
      errors.jobTitle = SHORT_ERRORS.jobTitle.gibberish;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) return;

    setLoading(true);
    setError("");
    setLoadingProgress(0);

    let msgIndex = 0;
    const totalDuration = 5000;
    const intervalTime = 500;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += intervalTime;
      setLoadingProgress(Math.min((elapsed / totalDuration) * 100, 95));
      if (elapsed % 1000 === 0) {
        msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMsg(LOADING_MESSAGES[msgIndex]);
      }
    }, intervalTime);

    const theatrePromise = new Promise((resolve) => setTimeout(resolve, totalDuration));

    try {
      const [res] = await Promise.all([
        fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: formData.prenom,
            email: formData.email,
            ville: "",
            linkedinUrl: "",
            profileText: formData.jobTitle,
            source: "mobile",
          }),
        }),
        theatrePromise,
      ]);

      setLoadingProgress(100);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const result = await res.json();
      // Save form data for enrichment on result page
      sessionStorage.setItem("mobileFormData", JSON.stringify(formData));
      onResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Réessaie !");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const FieldError = ({ field }: { field: string }) => {
    const msg = fieldErrors[field];
    if (!msg) return null;
    return <p className="text-sm text-amber-400 mt-1.5" style={{ animation: "fadeIn 0.2s ease-out" }}>{msg}</p>;
  };

  const borderClass = (field: string) =>
    fieldErrors[field] ? "border-amber-400/60" : "border-[var(--card-border)]";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-8 animate-float">🔮</div>
          <h2 className="text-2xl font-bold mb-4 shimmer-text">{loadingMsg}</h2>
          <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-6 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] transition-all duration-300 ease-out" style={{ width: `${loadingProgress}%` }} />
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[var(--accent)]" style={{ animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <p className="text-sm text-zinc-500 mt-6">Loan analyse ton profil depuis 2042...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 mt-10">
      {/* Prénom */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Prénom *</label>
        <input type="text" required value={formData.prenom} onChange={(e) => handleChange("prenom", e.target.value)}
          onBlur={() => { if (!formData.prenom.trim()) setFieldErrors((prev) => ({ ...prev, prenom: SHORT_ERRORS.prenom.required })); }}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("prenom")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
          placeholder="Ton prénom" />
        <FieldError field="prenom" />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email *</label>
        <input type="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => { if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) setFieldErrors((prev) => ({ ...prev, email: SHORT_ERRORS.email.invalid })); }}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("email")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
          placeholder="ton@email.com" />
        <FieldError field="email" />
      </div>

      {/* Titre de poste + Suggestions */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ton titre de poste LinkedIn *</label>
        <input type="text" required value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)}
          onBlur={() => {
            if (!formData.jobTitle.trim()) setFieldErrors((prev) => ({ ...prev, jobTitle: SHORT_ERRORS.jobTitle.required }));
            else if (isGibberish(formData.jobTitle.trim())) setFieldErrors((prev) => ({ ...prev, jobTitle: SHORT_ERRORS.jobTitle.gibberish }));
          }}
          className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("jobTitle")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
          placeholder="Ex: Product Manager, Dev Frontend..." />
        <FieldError field="jobTitle" />

        {/* Suggestion pills */}
        <div className="flex flex-wrap gap-2 mt-3">
          {visibleSuggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => selectSuggestion(suggestion)}
              className={`text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
                formData.jobTitle === suggestion
                  ? "bg-[var(--accent)]/20 border-[var(--accent)] text-[var(--accent-light)]"
                  : "bg-[var(--card-bg)] border-[var(--card-border)] text-zinc-400 hover:border-[var(--accent)] hover:text-zinc-300"
              }`}>
              {suggestion}
            </button>
          ))}
          {!showAllSuggestions && filteredSuggestions.length > 6 && (
            <button type="button" onClick={() => setShowAllSuggestions(true)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--card-border)] text-zinc-500 hover:text-zinc-300 transition cursor-pointer">
              + {filteredSuggestions.length - 6} autres
            </button>
          )}
        </div>
        <p className="text-xs text-zinc-600 mt-2">Tape ton titre ou choisis un raccourci ci-dessus.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <button type="submit"
        className="w-full py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-semibold text-lg transition-all hover:shadow-[0_0_30px_var(--accent-glow)] cursor-pointer">
        Découvrir mon job en 2042
      </button>

      <p className="text-xs text-zinc-600 text-center">
        Loan revient de 2042. Marge d&apos;erreur : le futur. Vos données restent en 2026.
      </p>
    </form>
  );
}
