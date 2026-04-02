"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOADING_MESSAGES = [
  "Loan consulte les archives de 2042...",
  "Analyse de ton profil en cours...",
  "Calcul de ton salaire futur...",
  "Vérification dans la base de données du futur...",
  "Loan négocie avec ton futur manager...",
];

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    prenom: "",
    email: "",
    localisation: "",
    profileText: "",
    likes: "",
    dislikes: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState("");
  const [showOptional, setShowOptional] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Cycle loading messages
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 3000);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur serveur");
      }

      const result = await res.json();
      // Store result in sessionStorage for the result page
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
          <div className="flex justify-center gap-1.5 mt-6">
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
          <p className="text-sm text-zinc-500 mt-8">
            Ça prend environ 15 secondes...
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
          Colle ton profil LinkedIn et découvre ce qui t&apos;attend.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-5"
      >
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

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Localisation
          </label>
          <input
            type="text"
            value={formData.localisation}
            onChange={(e) =>
              setFormData({ ...formData, localisation: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
            placeholder="Paris, Lyon, Remote..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-1.5">
            Ton profil LinkedIn *
          </label>
          <textarea
            required
            rows={6}
            value={formData.profileText}
            onChange={(e) =>
              setFormData({ ...formData, profileText: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition resize-y"
            placeholder="Copie-colle le texte de ton profil LinkedIn ici (à propos, expérience, compétences...)"
          />
          <p className="text-xs text-zinc-600 mt-1">
            Va sur ton profil LinkedIn, sélectionne tout le texte, et colle-le ici.
          </p>
        </div>

        {/* Optional section toggle */}
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="text-sm text-[var(--accent-light)] hover:underline"
        >
          {showOptional ? "− Masquer" : "+ Ajouter"} tes likes / dislikes
          (optionnel)
        </button>

        {showOptional && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Ce que tu aimes
              </label>
              <input
                type="text"
                value={formData.likes}
                onChange={(e) =>
                  setFormData({ ...formData, likes: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
                placeholder="Le café, les retros..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                Ce que tu n&apos;aimes pas
              </label>
              <input
                type="text"
                value={formData.dislikes}
                onChange={(e) =>
                  setFormData({ ...formData, dislikes: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition"
                placeholder="Les meetings sans agenda..."
              />
            </div>
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
          Loan ne stocke rien de méchant. Promis.
        </p>
      </form>
    </div>
  );
}
