"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TransmissionFeed from "./components/TransmissionFeed";
import MobileForm from "./components/MobileForm";
import { useIsMobile } from "./hooks/useIsMobile";
import { validateEmail, validateLinkedInUrl, validateVille } from "../lib/validation";

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

const SHORT_ERRORS: Record<string, Record<string, string>> = {
  prenom: {
    required: "🔮 Loan a besoin de ton prénom.",
  },
  email: {
    invalid_format: "🔮 Format d'email invalide.",
    blacklisted: "Pas de fausse adresse, Loan te voit !",
    disposable: "🔮 Les emails jetables n'existent plus en 2042.",
    too_short: "Email trop court pour être réel.",
    gibberish: "🔮 Ton futur en mérite un vrai.",
  },
  ville: {
    required: "🔮 Dans quelle ville bosses-tu ?",
    too_short: "🔮 Nom de ville trop court.",
    too_long: "🔮 Nom de ville trop long.",
    zip_code: "Le nom de la ville, pas le code postal !",
    invalid: "🔮 Ça ne ressemble pas à une ville.",
    gibberish: "🔮 Ça ne ressemble pas à une ville.",
  },
  linkedinUrl: {
    required: "🔮 Loan a besoin de ton profil LinkedIn.",
    company_page: "Ton profil perso, pas une page entreprise !",
    invalid: "Ça ne ressemble pas à un profil LinkedIn.",
    gibberish: "🔮 Ce profil LinkedIn n'a pas l'air réel.",
  },
  jobTitle: {
    required: "🔮 Sans titre, Loan ne peut pas prédire.",
    gibberish: "Ça ne ressemble pas à un titre de poste.",
  },
};

export default function Home() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    prenom: "",
    email: "",
    ville: "",
    linkedinUrl: "",
    jobTitle: "",
    profileText: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isGibberish = (text: string): boolean => {
    const cleaned = text.trim();
    if (cleaned.length < 3) return false;
    const words = cleaned.match(/[a-zA-ZÀ-ÿ]{3,}/g);
    if (!words || words.length === 0) return false;
    for (const word of words) {
      const lower = word.toLowerCase();
      if (/[^aeiouyàâäéèêëïîôùûüœæ]{5,}/i.test(lower)) return true;
      if (/(.)\1{2,}/i.test(lower)) return true;
    }
    const alphaOnly = cleaned.replace(/[^a-zA-ZÀ-ÿ]/g, '').toLowerCase();
    if (alphaOnly.length >= 4) {
      if (/^(.{1,3})\1{2,}$/i.test(alphaOnly)) return true;
      if (alphaOnly.length >= 8) {
        const uniqueChars = new Set(alphaOnly.split('')).size;
        if (uniqueChars <= 2) return true;
      }
    }
    return false;
  };

  const toShortError = (field: string, errorMsg: string): string => {
    const lower = errorMsg.toLowerCase();
    if (field === "email") {
      if (lower.includes("format")) return SHORT_ERRORS.email.invalid_format;
      if (lower.includes("fausse") || lower.includes("blacklist")) return SHORT_ERRORS.email.blacklisted;
      if (lower.includes("jetable")) return SHORT_ERRORS.email.disposable;
      if (lower.includes("court")) return SHORT_ERRORS.email.too_short;
      return SHORT_ERRORS.email.gibberish;
    }
    if (field === "ville") {
      if (!errorMsg || lower.includes("requis")) return SHORT_ERRORS.ville.required;
      if (lower.includes("courte")) return SHORT_ERRORS.ville.too_short;
      if (lower.includes("longue")) return SHORT_ERRORS.ville.too_long;
      if (lower.includes("postal")) return SHORT_ERRORS.ville.zip_code;
      if (lower.includes("gibberish")) return SHORT_ERRORS.ville.gibberish;
      return SHORT_ERRORS.ville.invalid;
    }
    if (field === "linkedinUrl") {
      if (lower.includes("requis")) return SHORT_ERRORS.linkedinUrl.required;
      if (lower.includes("entreprise")) return SHORT_ERRORS.linkedinUrl.company_page;
      if (lower.includes("gibberish")) return SHORT_ERRORS.linkedinUrl.gibberish;
      return SHORT_ERRORS.linkedinUrl.invalid;
    }
    return errorMsg;
  };

  const validateField = (field: string, value: string) => {
    let result: { valid: boolean; error?: string; cleaned?: string } = { valid: true };
    switch (field) {
      case "email":
        result = validateEmail(value);
        break;
      case "linkedinUrl":
        result = validateLinkedInUrl(value);
        if (result.valid && value.trim()) {
          const slugMatch = value.trim().toLowerCase().match(/linkedin\.com\/in\/([\w-]+)/i);
          const rawSlug = slugMatch ? slugMatch[1] : (/^[\w-]+$/.test(value.trim()) ? value.trim().toLowerCase() : null);
          if (rawSlug && isGibberish(rawSlug.replace(/-/g, ''))) {
            result = { valid: false, error: "gibberish" };
          }
        }
        break;
      case "ville":
        result = validateVille(value);
        if (result.valid && value.trim().length >= 3 && isGibberish(value.trim())) {
          result = { valid: false, error: "gibberish" };
        }
        break;
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      if (result.valid) {
        delete next[field];
      } else {
        next[field] = toShortError(field, result.error || "");
      }
      return next;
    });
    return result;
  };

  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};
    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) errors.email = toShortError("email", emailResult.error || "");
    const linkedinResult = validateLinkedInUrl(formData.linkedinUrl);
    if (!linkedinResult.valid) {
      errors.linkedinUrl = toShortError("linkedinUrl", linkedinResult.error || "");
    } else if (formData.linkedinUrl.trim()) {
      const slugMatch = formData.linkedinUrl.trim().toLowerCase().match(/linkedin\.com\/in\/([\w-]+)/i);
      const rawSlug = slugMatch ? slugMatch[1] : (/^[\w-]+$/.test(formData.linkedinUrl.trim()) ? formData.linkedinUrl.trim().toLowerCase() : null);
      if (rawSlug && isGibberish(rawSlug.replace(/-/g, ''))) {
        errors.linkedinUrl = SHORT_ERRORS.linkedinUrl.gibberish;
      }
    }
    const villeResult = validateVille(formData.ville);
    if (!villeResult.valid) {
      errors.ville = toShortError("ville", villeResult.error || "");
    } else if (formData.ville.trim().length >= 3 && isGibberish(formData.ville.trim())) {
      errors.ville = SHORT_ERRORS.ville.gibberish;
    }
    if (!formData.prenom.trim()) errors.prenom = SHORT_ERRORS.prenom.required;
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = SHORT_ERRORS.jobTitle.required;
    } else if (isGibberish(formData.jobTitle.trim())) {
      errors.jobTitle = SHORT_ERRORS.jobTitle.gibberish;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAll()) {
      setError("");
      return;
    }
    const linkedinResult = validateLinkedInUrl(formData.linkedinUrl);
    const cleanedLinkedinUrl = linkedinResult.cleaned || formData.linkedinUrl;
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
      const combinedProfile = formData.jobTitle + "\n\n" + (formData.profileText || "");
      const [res] = await Promise.all([
        fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: formData.prenom,
            email: formData.email,
            ville: formData.ville,
            linkedinUrl: cleanedLinkedinUrl,
            profileText: combinedProfile,
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
      sessionStorage.setItem("prediction", JSON.stringify(result));
      router.push("/resultat");
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
    return (
      <p className="text-sm text-amber-400 mt-1.5" style={{ animation: "fadeIn 0.2s ease-out" }}>
        {msg}
      </p>
    );
  };

  const borderClass = (field: string) =>
    fieldErrors[field] ? "border-amber-400/60" : "border-[var(--card-border)]";

  // ✅ FIX: handleMobileResult reste, mais plus de mobileLoading
  const handleMobileResult = useCallback((result: Record<string, unknown>) => {
    sessionStorage.setItem("prediction", JSON.stringify(result));
    router.push("/resultat");
  }, [router]);

  // Pendant la détection du device
  if (isMobile === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-6xl animate-float">🔮</div>
      </div>
    );
  }

  // ✅ FIX: Supprimé le guard `if (isMobile && mobileLoading)` qui causait le re-render
  // MobileForm gère son propre loader en interne — ne pas interférer ici

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-8 animate-float">🔮</div>
          <h2 className="text-2xl font-bold mb-4 shimmer-text">{loadingMsg}</h2>
          <div className="w-full bg-[var(--card-bg)] rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[var(--accent)]"
                style={{ animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-500 mt-6">Loan analyse ton profil depuis 2042...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      <div className="text-center max-w-2xl mb-10">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="shimmer-text">2042</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Loan revient de 2042 et a vu ton futur job.
          <br />
          <span className="text-zinc-500">30 secondes pour découvrir ce qui t&apos;attend.</span>
        </p>
      </div>

      <TransmissionFeed />

      {/* ✅ MOBILE : MobileForm gère son loader seul, page.tsx ne s'en mêle pas */}
      {isMobile && (
        <MobileForm
          onResult={handleMobileResult}
          // ✅ FIX: onLoadingChange supprimé — MobileForm gère le loader en interne
        />
      )}

      {!isMobile && (
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Prénom *</label>
              <input
                type="text"
                required
                value={formData.prenom}
                onChange={(e) => handleChange("prenom", e.target.value)}
                onBlur={() => {
                  if (!formData.prenom.trim()) setFieldErrors((prev) => ({ ...prev, prenom: SHORT_ERRORS.prenom.required }));
                }}
                className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("prenom")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
                placeholder="Ton prénom"
              />
              <FieldError field="prenom" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => { if (formData.email) validateField("email", formData.email); }}
                className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("email")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
                placeholder="ton@email.com"
              />
              <FieldError field="email" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ville *</label>
            <input
              type="text"
              required
              value={formData.ville}
              onChange={(e) => handleChange("ville", e.target.value)}
              onBlur={() => { if (formData.ville) validateField("ville", formData.ville); }}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("ville")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
              placeholder="Paris, Lyon, Remote..."
            />
            <FieldError field="ville" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ton profil LinkedIn *</label>
            <input
              type="text"
              required
              value={formData.linkedinUrl}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              onBlur={() => {
                if (formData.linkedinUrl) {
                  const result = validateField("linkedinUrl", formData.linkedinUrl);
                  if (result.valid && result.cleaned) setFormData((prev) => ({ ...prev, linkedinUrl: result.cleaned! }));
                }
              }}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("linkedinUrl")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
              placeholder="linkedin.com/in/ton-profil"
            />
            <FieldError field="linkedinUrl" />
            {!fieldErrors.linkedinUrl && (
              <p className="text-xs text-zinc-600 mt-1">Loan a besoin de ton profil pour voyager dans le temps.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Ton titre de poste LinkedIn *</label>
            <input
              type="text"
              required
              value={formData.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
              onBlur={() => {
                if (!formData.jobTitle.trim()) {
                  setFieldErrors((prev) => ({ ...prev, jobTitle: SHORT_ERRORS.jobTitle.required }));
                } else if (isGibberish(formData.jobTitle.trim())) {
                  setFieldErrors((prev) => ({ ...prev, jobTitle: SHORT_ERRORS.jobTitle.gibberish }));
                }
              }}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${borderClass("jobTitle")} text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
              placeholder="Ex: First Product Manager @MerciYanis"
            />
            <FieldError field="jobTitle" />
            {!fieldErrors.jobTitle && (
              <p className="text-xs text-zinc-600 mt-1">Copie-le tel quel !</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="text-sm text-[var(--accent-light)] hover:underline flex items-center gap-1"
            >
              <span>{showOptional ? "−" : "+"}</span>
              <span>Ajouter plus d&apos;infos pour un résultat encore plus précis</span>
            </button>
          </div>

          {showOptional && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <label className="block text-sm font-medium text-zinc-400">Ton profil complet (facultatif)</label>
              <textarea
                rows={5}
                value={formData.profileText}
                onChange={(e) => setFormData({ ...formData, profileText: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition resize-y"
                placeholder="Pour un résultat ultra-personnalisé : va sur ton profil LinkedIn, fais Cmd+A (ou Ctrl+A) pour tout sélectionner, puis colle ici."
              />
              <p className="text-xs text-zinc-600">
                💡 Astuce : Sur ta page LinkedIn, fais{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Cmd</kbd> +{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">A</kbd> puis{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Cmd</kbd> +{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">C</kbd> pour tout copier.
              </p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-light)] text-white font-semibold text-lg transition-all hover:shadow-[0_0_30px_var(--accent-glow)] cursor-pointer"
          >
            Découvrir mon job en 2042
          </button>

          <p className="text-xs text-zinc-600 text-center">
            Loan revient de 2042. Marge d&apos;erreur : le futur. Vos données restent en 2026.
          </p>
        </form>
      )}
    </div>
  );
}
