"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    linkedinUrl: "",
    jobTitle: "",
    profileText: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  // Validate LinkedIn URL format
  const isValidLinkedInUrl = (url: string) => {
    if (!url) return true; // Empty is handled by required
    return /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate LinkedIn URL
    if (!isValidLinkedInUrl(formData.linkedinUrl)) {
      setError("L'URL LinkedIn n'est pas valide. Elle doit ressembler à : linkedin.com/in/ton-profil");
      return;
    }

    setLoading(true);
    setError("");
    setLoadingProgress(0);

    // Theatrical loader: cycle messages + progress bar
    let msgIndex = 0;
    const totalDuration = 4000; // 4 seconds of theatre
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

    // Wait for theatrical minimum before showing result
    const theatrePromise = new Promise(resolve => setTimeout(resolve, totalDuration));

    try {
      // Combine jobTitle + profileText for the API
      // The title goes first (will be weighted x5 by the algo)
      const combinedProfile = formData.jobTitle + "\n\n" + (formData.profileText || "");

      const [res] = await Promise.all([
        fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prenom: formData.prenom,
            email: formData.email,
            linkedinUrl: formData.linkedinUrl,
            profileText: combinedProfile,
          }),
        }),
        theatrePromise, // Wait for theatre to complete
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-8 animate-float">🔮</div>
          <h2 className="text-2xl font-bold mb-4 shimmer-text">
            {loadingMsg}
          </h2>
          
          {/* Progress bar */}
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
          <span className="text-zinc-500">30 secondes pour découvrir ce qui t&apos;attend.</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-5">
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
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
              placeholder="Ton prénom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
              placeholder="ton@email.com"
            />
          </div>
        </div>

        {/* LinkedIn URL */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ton profil LinkedIn *
          </label>
          <input
            type="url"
            required
            value={formData.linkedinUrl}
            onChange={(e) =>
              setFormData({ ...formData, linkedinUrl: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
            placeholder="linkedin.com/in/ton-profil"
          />
          <p className="text-xs text-zinc-600 mt-1">
            Loan a besoin de ton profil pour voyager dans le temps.
          </p>
        </div>

        {/* Job Title - THE KEY INPUT */}
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
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
            placeholder="Ex: Product Manager @ MerciYanis | B2B SaaS"
          />
          <p className="text-xs text-zinc-600 mt-1">
            C&apos;est la ligne juste en dessous de ton nom sur LinkedIn. Copie-la telle quelle !
          </p>
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
              💡 Astuce : Sur ta page LinkedIn, fais <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Cmd</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">A</kbd> puis <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Cmd</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">C</kbd> pour tout copier.
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
          🔮 Découvrir mon job en 2042
        </button>

        <p className="text-xs text-zinc-600 text-center">
          Loan ne stocke rien de méchant. Juste ce qu&apos;il faut pour voyager dans le temps.
        </p>
      </form>
    </div>
  );
}
