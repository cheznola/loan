"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TransmissionFeed from "./components/TransmissionFeed";
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

// Short inline error messages (displayed as placeholder inside the field)
const INLINE_ERRORS: Record<string, Record<string, string>> = {
  prenom: {
    required: "Loan a besoin de ton prénom !",
  },
  email: {
    invalid_format: "Hmm, ça ne ressemble pas à un email...",
    blacklisted: "Pas de fausse adresse, Loan te voit !",
    disposable: "Les emails jetables n'existent plus en 2042",
    too_short: "Email trop court pour être réel",
    gibberish: "Ton futur mérite un vrai email !",
  },
  ville: {
    required: "Dans quelle ville bosses-tu ?",
    too_short: "Nom de ville trop court",
    too_long: "Nom de ville trop long",
    zip_code: "Le nom de la ville, pas le code postal !",
    invalid: "Ça ne ressemble pas à une ville...",
  },
  linkedinUrl: {
    required: "Loan a besoin de ton profil LinkedIn",
    company_page: "Ton profil perso, pas une page entreprise !",
    invalid: "Ça ne ressemble pas à un profil LinkedIn",
  },
  jobTitle: {
    required: "Sans titre, Loan ne peut pas prédire !",
  },
};

export default function Home() {
  const router = useRouter();
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

  // Field-level errors (now displayed INSIDE the input as placeholder)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Validate a single field on blur
  const validateField = (field: string, value: string) => {
    let result: { valid: boolean; error?: string; cleaned?: string } = { valid: true };

    switch (field) {
      case "email":
        result = validateEmail(value);
        break;
      case "linkedinUrl":
        result = validateLinkedInUrl(value);
        break;
      case "ville":
        result = validateVille(value);
        break;
    }

    setFieldErrors((prev) => {
      const next = { ...prev };
      if (result.valid) {
        delete next[field];
      } else {
        next[field] = result.error || "Champ invalide";
      }
      return next;
    });

    return result;
  };

  // Map validation lib errors to short inline messages
  const toInlineError = (field: string, errorMsg: string): string => {
    const lower = errorMsg.toLowerCase();

    if (field === "email") {
      if (lower.includes("format")) return INLINE_ERRORS.email.invalid_format;
      if (lower.includes("fausse") || lower.includes("blacklist")) return INLINE_ERRORS.email.blacklisted;
      if (lower.includes("jetable")) return INLINE_ERRORS.email.disposable;
      if (lower.includes("court")) return INLINE_ERRORS.email.too_short;
      if (lower.includes("ressemble")) return INLINE_ERRORS.email.gibberish;
      return INLINE_ERRORS.email.gibberish;
    }
    if (field === "ville") {
      if (!errorMsg || lower.includes("requis")) return INLINE_ERRORS.ville.required;
      if (lower.includes("courte")) return INLINE_ERRORS.ville.too_short;
      if (lower.includes("longue")) return INLINE_ERRORS.ville.too_long;
      if (lower.includes("postal")) return INLINE_ERRORS.ville.zip_code;
      return INLINE_ERRORS.ville.invalid;
    }
    if (field === "linkedinUrl") {
      if (lower.includes("requis")) return INLINE_ERRORS.linkedinUrl.required;
      if (lower.includes("entreprise")) return INLINE_ERRORS.linkedinUrl.company_page;
      return INLINE_ERRORS.linkedinUrl.invalid;
    }
    return errorMsg;
  };

  // Validate all fields before submit
  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) errors.email = toInlineError("email", emailResult.error || "");

    const linkedinResult = validateLinkedInUrl(formData.linkedinUrl);
    if (!linkedinResult.valid) errors.linkedinUrl = toInlineError("linkedinUrl", linkedinResult.error || "");

    const villeResult = validateVille(formData.ville);
    if (!villeResult.valid) errors.ville = toInlineError("ville", villeResult.error || "");

    if (!formData.prenom.trim()) {
      errors.prenom = INLINE_ERRORS.prenom.required;
    }

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = INLINE_ERRORS.jobTitle.required;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear error when user starts typing
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

    const theatrePromise = new Promise((resolve) =>
      setTimeout(resolve, totalDuration)
    );

    try {
      const combinedProfile =
        formData.jobTitle + "\n\n" + (formData.profileText || "");

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
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Réessaie !"
      );
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  // Helper: get input classes based on error state
  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
      fieldErrors[field]
        ? "border-amber-400/60 placeholder-amber-400/80"
        : "border-[var(--card-border)] placeholder-zinc-600"
    } text-white focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`;

  // Helper: get placeholder (error message or default)
  const getPlaceholder = (field: string, defaultPlaceholder: string) =>
    fieldErrors[field] ? `⚠ ${fieldErrors[field]}` : defaultPlaceholder;

  // Helper: get value (hide value when error is showing so placeholder is visible)
  const getDisplayValue = (field: string) =>
    fieldErrors[field] ? "" : formData[field as keyof typeof formData];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-8 animate-float">🔮</div>
          <h2 className="text-2xl font-bold mb-4 shimmer-text">
            {loadingMsg}
          </h2>
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
                style={{
                  animation: `pulse-glow 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <p className="text-sm text-zinc-500 mt-6">
            Loan analyse ton profil depuis 2042...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-2xl mb-10">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="shimmer-text">2042</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed">
          Loan revient de 2042 et a vu ton futur job.
          <br />
          <span className="text-zinc-500">
            30 secondes pour découvrir ce qui t&apos;attend.
          </span>
        </p>
      </div>

      {/* TRANSMISSION FEED - LIVE TERMINAL */}
      <TransmissionFeed />

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5 mt-10">
        {/* Row 1: Prénom + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Prénom *
            </label>
            <input
              type="text"
              required
              value={getDisplayValue("prenom")}
              onChange={(e) => handleChange("prenom", e.target.value)}
              onFocus={() => {
                // Restore value when user focuses back
                if (fieldErrors.prenom) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.prenom;
                    return next;
                  });
                }
              }}
              onBlur={() => {
                if (!formData.prenom.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    prenom: INLINE_ERRORS.prenom.required,
                  }));
                }
              }}
              className={inputClass("prenom")}
              placeholder={getPlaceholder("prenom", "Ton prénom")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={getDisplayValue("email")}
              onChange={(e) => handleChange("email", e.target.value)}
              onFocus={() => {
                if (fieldErrors.email) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }
              }}
              onBlur={() => {
                if (formData.email) {
                  const result = validateField("email", formData.email);
                  if (!result.valid) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      email: toInlineError("email", result.error || ""),
                    }));
                  }
                }
              }}
              className={inputClass("email")}
              placeholder={getPlaceholder("email", "ton@email.com")}
            />
          </div>
        </div>

        {/* Ville */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ville *
          </label>
          <input
            type="text"
            required
            value={getDisplayValue("ville")}
            onChange={(e) => handleChange("ville", e.target.value)}
            onFocus={() => {
              if (fieldErrors.ville) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.ville;
                  return next;
                });
              }
            }}
            onBlur={() => {
              if (formData.ville) {
                const result = validateField("ville", formData.ville);
                if (!result.valid) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    ville: toInlineError("ville", result.error || ""),
                  }));
                }
              }
            }}
            className={inputClass("ville")}
            placeholder={getPlaceholder("ville", "Paris, Lyon, Remote...")}
          />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ton profil LinkedIn *
          </label>
          <input
            type="text"
            required
            value={getDisplayValue("linkedinUrl")}
            onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            onFocus={() => {
              if (fieldErrors.linkedinUrl) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.linkedinUrl;
                  return next;
                });
              }
            }}
            onBlur={() => {
              if (formData.linkedinUrl) {
                const result = validateField("linkedinUrl", formData.linkedinUrl);
                if (result.valid && result.cleaned) {
                  setFormData((prev) => ({ ...prev, linkedinUrl: result.cleaned! }));
                } else if (!result.valid) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    linkedinUrl: toInlineError("linkedinUrl", result.error || ""),
                  }));
                }
              }
            }}
            className={inputClass("linkedinUrl")}
            placeholder={getPlaceholder("linkedinUrl", "linkedin.com/in/ton-profil")}
          />
          {!fieldErrors.linkedinUrl && (
            <p className="text-xs text-zinc-600 mt-1">
              Loan a besoin de ton profil pour voyager dans le temps.
            </p>
          )}
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ton titre de poste LinkedIn *
          </label>
          <input
            type="text"
            required
            value={getDisplayValue("jobTitle")}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            onFocus={() => {
              if (fieldErrors.jobTitle) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.jobTitle;
                  return next;
                });
              }
            }}
            onBlur={() => {
              if (!formData.jobTitle.trim()) {
                setFieldErrors((prev) => ({
                  ...prev,
                  jobTitle: INLINE_ERRORS.jobTitle.required,
                }));
              }
            }}
            className={inputClass("jobTitle")}
            placeholder={getPlaceholder("jobTitle", "Ex: Product Manager @ MerciYanis | B2B SaaS")}
          />
          {!fieldErrors.jobTitle && (
            <p className="text-xs text-zinc-600 mt-1">Copie-le telle quelle !</p>
          )}
        </div>

        {/* Optional: Full profile */}
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
            <label className="block text-sm font-medium text-zinc-400">
              Ton profil complet (facultatif)
            </label>
            <textarea
              rows={5}
              value={formData.profileText}
              onChange={(e) =>
                setFormData({ ...formData, profileText: e.target.value })
              }
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
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
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
    </div>
  );
}
