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

  // Field-level errors
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

  // Validate all fields before submit
  const validateAll = (): boolean => {
    const errors: Record<string, string> = {};

    const emailResult = validateEmail(formData.email);
    if (!emailResult.valid) errors.email = emailResult.error || "";

    const linkedinResult = validateLinkedInUrl(formData.linkedinUrl);
    if (!linkedinResult.valid) errors.linkedinUrl = linkedinResult.error || "";

    const villeResult = validateVille(formData.ville);
    if (!villeResult.valid) errors.ville = villeResult.error || "";

    if (!formData.prenom.trim()) {
      errors.prenom = "🔮 Loan a besoin de ton prénom pour personnaliser ta prédiction.";
    }

    if (!formData.jobTitle.trim()) {
      errors.jobTitle = "🔮 Sans titre de poste, Loan ne peut pas calculer ta trajectoire de carrière.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Run all validations
    if (!validateAll()) {
      setError("");
      return;
    }

    // Clean LinkedIn URL before sending
    const linkedinResult = validateLinkedInUrl(formData.linkedinUrl);
    const cleanedLinkedinUrl = linkedinResult.cleaned || formData.linkedinUrl;

    setLoading(true);
    setError("");
    setLoadingProgress(0);

    // Theatrical loader
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

  // Helper: render field error
  const FieldError = ({ field }: { field: string }) => {
    const msg = fieldErrors[field];
    if (!msg) return null;
    return (
      <p className="text-sm text-amber-400 mt-1.5" style={{ animation: "fadeIn 0.2s ease-out" }}>
        {msg}
      </p>
    );
  };

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
              value={formData.prenom}
              onChange={(e) =>
                setFormData({ ...formData, prenom: e.target.value })
              }
              onBlur={() => {
                if (!formData.prenom.trim()) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    prenom: "🔮 Loan a besoin de ton prénom pour personnaliser ta prédiction.",
                  }));
                } else {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.prenom;
                    return next;
                  });
                }
              }}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
                fieldErrors.prenom ? "border-amber-400/60" : "border-[var(--card-border)]"
              } text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
              placeholder="Ton prénom"
            />
            <FieldError field="prenom" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (fieldErrors.email) {
                  setFieldErrors((prev) => {
                    const next = { ...prev };
                    delete next.email;
                    return next;
                  });
                }
              }}
              onBlur={() => validateField("email", formData.email)}
              className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
                fieldErrors.email ? "border-amber-400/60" : "border-[var(--card-border)]"
              } text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
              placeholder="ton@email.com"
            />
            <FieldError field="email" />
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
            value={formData.ville}
            onChange={(e) => {
              setFormData({ ...formData, ville: e.target.value });
              if (fieldErrors.ville) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.ville;
                  return next;
                });
              }
            }}
            onBlur={() => validateField("ville", formData.ville)}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
              fieldErrors.ville ? "border-amber-400/60" : "border-[var(--card-border)]"
            } text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
            placeholder="Paris, Lyon, Remote..."
          />
          <FieldError field="ville" />
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ton profil LinkedIn *
          </label>
          <input
            type="text"
            required
            value={formData.linkedinUrl}
            onChange={(e) => {
              setFormData({ ...formData, linkedinUrl: e.target.value });
              if (fieldErrors.linkedinUrl) {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.linkedinUrl;
                  return next;
                });
              }
            }}
            onBlur={() => {
              const result = validateField("linkedinUrl", formData.linkedinUrl);
              if (result.valid && result.cleaned) {
                setFormData((prev) => ({ ...prev, linkedinUrl: result.cleaned! }));
              }
            }}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
              fieldErrors.linkedinUrl ? "border-amber-400/60" : "border-[var(--card-border)]"
            } text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
            placeholder="linkedin.com/in/ton-profil"
          />
          <FieldError field="linkedinUrl" />
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
            value={formData.jobTitle}
            onChange={(e) =>
              setFormData({ ...formData, jobTitle: e.target.value })
            }
            onBlur={() => {
              if (!formData.jobTitle.trim()) {
                setFieldErrors((prev) => ({
                  ...prev,
                  jobTitle: "🔮 Sans titre de poste, Loan ne peut pas calculer ta trajectoire de carrière.",
                }));
              } else {
                setFieldErrors((prev) => {
                  const next = { ...prev };
                  delete next.jobTitle;
                  return next;
                });
              }
            }}
            className={`w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border ${
              fieldErrors.jobTitle ? "border-amber-400/60" : "border-[var(--card-border)]"
            } text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition`}
            placeholder="Ex: Product Manager @ MerciYanis | B2B SaaS"
          />
          <FieldError field="jobTitle" />
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
