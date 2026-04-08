"use client";

import Link from "next/link";

// ============================================
// TIMELINE DATA
// ============================================

const TIMELINE = [
  {
    step: "Heure 1",
    title: "Cadrer le test",
    description:
      "Loan est un side project construit sur le week-end de Pâques, en environ 6 heures, pour tester rapidement un format de découverte sans paid ni cold outreach. Cette page documente les choix, les arbitrages et les limites du projet.",
    highlight: "Cadre · Scope · Signal recherché",
  },
  {
    step: "Heure 2",
    title: "Choisir une hypothèse assez forte pour mériter un test",
    description:
      "Depuis novembre 2025, Nola se développe de manière organique via des dîners en petit groupe pour Product People à Paris. Le besoin : trouver un format de découverte qui touche les bonnes personnes, facilite la projection, et reste cohérent avec l'esprit de la communauté. L'hypothèse testée : un format personnel, rapide et partageable suscitera plus d'intérêt qu'un contenu carrière classique.",
    highlight: "Problème · Hypothèse · Ciblage",
  },
  {
    step: "Heures 3–4",
    title: "Sortir une V0, puis reprendre la main",
    description:
      "J'ai utilisé NanoCorp.so pour sortir une première V0 rapidement. J'ai ensuite repris le code pour l'itérer avec Claude Code, j'ai testé Dispatch, plusieurs workers et mon propre agent, afin de passer d'un prototype généré à une base plus propre et plus alignée avec le use case réel.",
    highlight: "V0 · Reprise en main · Itération",
  },
  {
    step: "Heure 5",
    title: "Faire le choix produit le plus structurant",
    description:
      "J'ai décidé de ne PAS utiliser de génération IA à la volée pour les résultats. Les raisons : coût récurrent inutile pour ce use case, latence plus élevée, et surtout perte de contrôle sur le ton. À la place, j'ai choisi une logique combinatoire pré-écrite : catégories, métiers et variations. C'est un arbitrage classique de PM : savoir quand l'option \"plus de tech\" n'est pas la bonne réponse au problème.",
    highlight: "Trade-off · Contrôle du ton · Coût & latence",
  },
  {
    step: "Heure 6",
    title: "Confronter le système au réel",
    description:
      "Les tests propres passaient. Les vrais profils LinkedIn, beaucoup moins. Beaucoup de bruit, des sidebars, des formulations ambiguës, et un bug révélateur : des mots comme 'designed' faisaient tomber trop de profils dans DESIGN. Le correctif a consisté à passer d'un matching naïf à un scoring pondéré avec nettoyage du bruit. Rappel utile : les données synthétiques rassurent plus qu'elles n'apprennent.",
    highlight: "Données réelles · Bug révélateur · Correction",
  },
  {
    step: "Go-live",
    title: "Mettre en ligne sans sur-ingénierie",
    description:
      "Nettoyage du code récupéré depuis la V0, suppression de PostgreSQL jugé trop lourd pour ce use case, ajout du terminal \"Transmissions du futur\" pour renforcer la preuve sociale, puis déploiement sur Vercel. Cette version n'est pas une V1 aboutie : c'est une V0 d'apprentissage mise au contact du réel.",
    highlight: "Architecture légère · MVP live",
  },
  {
    step: "Documentation",
    title: "Documenter le raisonnement, pas seulement le livrable",
    description:
      "Cette page existe pour rendre visibles les décisions, les arbitrages et les limites. Un side project peut être amusant à regarder ; ce qui m'intéresse ici, c'est de montrer comment il a été cadré, ce qu'il permet de tester, et ce qu'il ne prouve pas encore.",
    highlight: "Arbitrages · Limites · Documentation",
  },
];

// ============================================
// CHOIX STRUCTURANTS
// ============================================

const DECISIONS = [
  {
    title: "Cadrer volontairement le projet",
    description:
      "Loan a été construit sur un temps très limité : un week-end de Pâques, environ 6 heures, avec du café, beaucoup de chocolat, et un scope volontairement borné. Le but n'était pas de maximiser ce que je pouvais construire, mais de tester vite un format de découverte sans dériver vers un side project infini.",
  },
  {
    title: "Reprendre la main après la V0",
    description:
      "NanoCorp.so m'a permis de sortir une première base rapidement. J'ai ensuite repris le code pour l'itérer, le simplifier et l'aligner avec l'intention produit. L'intérêt n'était pas la vitesse seule, mais ce qu'elle rend possible ensuite : choisir quoi garder, quoi corriger, et quoi enlever.",
  },
  {
    title: "Choisir ses batailles avec l'IA générative",
    description:
      "Il aurait été tentant de laisser l'IA générer les jobs 2042 à la volée. J'ai préféré ne pas le faire : coût par requête, latence, qualité de l'humour trop générique, et perte de contrôle sur le ton. Une logique combinatoire pré-écrite suffisait pour ce test. Le choix \"pas d'API IA\" n'était pas une contrainte technique : c'était un choix produit.",
  },
];

// ============================================
// CE QUE J'AI APPRIS
// ============================================

const LEARNINGS = [
  {
    type: "surprise",
    text: "Les données LinkedIn sont plus sales que prévu : sidebars, endorsements, skills répétés, bruit partout.",
  },
  {
    type: "bug",
    text: "\"Designed\" matchait DESIGN → des PM tombaient dans la mauvaise catégorie. J'ai dû passer au scoring pondéré.",
  },
  {
    type: "insight",
    text: "Le format fun attire, mais ne garantit pas la qualité des profils. Le vrai filtre, c'est ce qu'on demande à l'entrée.",
  },
  {
    type: "limite",
    text: "Sans données réelles suffisantes, impossible de savoir si l'hypothèse tient. La V0 est un pari, pas une preuve.",
  },
];

// ============================================
// METRICS TO WATCH
// ============================================

const METRICS = [
  { label: "Visite → démarrage", description: "Le hook fonctionne-t-il ?" },
  { label: "Démarrage → complétion", description: "Le parcours est-il fluide ?" },
  { label: "Complétion → partage", description: "Le résultat donne-t-il envie de partager ?" },
  { label: "Qualité des profils", description: "Est-ce bien des Product People ?" },
];

// ============================================
// STACK
// ============================================

const STACK_SECTIONS = [
  {
    title: "Développement",
    items: [
      { label: "Framework", value: "Next.js 14 (App Router, Server Components)" },
      { label: "Déploiement", value: "Vercel (CI/CD depuis GitHub)" },
      { label: "Stockage", value: "Airtable" },
    ],
  },
  {
    title: "Prototypage & itération",
    items: [
      {
        label: "Méthode",
        value: "Boucle agentique courte, avec validation produit humaine",
      },
      {
        label: "V0",
        value: "NanoCorp.so + Claude 4.5 Opus",
      },
      {
        label: "Itération",
        value: "Claude Code + Dispatch + workers",
      },
    ],
  },
  {
    title: "Choix produit sur l'IA",
    items: [
      { label: "Génération des résultats", value: "Algorithmique (pas d'API IA) : contrôle du ton, coût nul, latence instantanée" },
      { label: "Détection de catégorie", value: "Scoring pondéré + mots-clés, pas de classification IA" },
    ],
  },
];

// ============================================
// COMPONENT
// ============================================

export default function MakingOfPage() {
  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <Link
            href="/"
            className="text-zinc-500 hover:text-white transition text-sm mb-4 sm:mb-6 inline-flex items-center gap-1"
          >
            ← Retour à Loan
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 mb-3 leading-tight">
            De l'idée au go-live en 6 heures
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            Par{" "}
            <a
              href="https://www.linkedin.com/in/emmanueldimarco/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Manu
            </a>
            {" "}· Product · Socle Business | RH | Entrepreneuriat · Fondateur de{" "}
            <a
              href="https://cheznola.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Nola
            </a>
          </p>

          <p className="text-zinc-500 mt-4 text-sm sm:text-base leading-relaxed">
            Loan est un side project construit sur le week-end de Pâques, en environ 6 heures,
            avec un cadre volontairement contraint : tester rapidement un format de découverte
            sans paid, sans cold outreach, et sans surconstruire. Ce document retrace les choix,
            les arbitrages, les limites, et la manière dont j'ai utilisé les outils IA pour accélérer
            l'exécution sans leur déléguer le jugement produit.
          </p>
        </div>

        {/* Le problème */}
        <section className="mb-10 sm:mb-12 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-[var(--accent)]/5 to-transparent border border-[var(--accent)]/20">
          <h2 className="text-base sm:text-lg font-semibold mb-3 text-[var(--accent-light)]">
            🎯 Le problème
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-3">
            <strong>Nola</strong> est une association à but non lucratif qui organise des dîners mensuels pour les Product People à Paris.
            La communauté grandit par cooptation et le flux reste artisanal.
          </p>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-3">
            L'enjeu : trouver un format de découverte qui <strong>touche les bonnes personnes</strong>,
            <strong> suscite l'intérêt</strong> et permette à chacun de se projeter,
            tout en <strong>restant cohérent avec l'esprit de Nola</strong>, sans paid ni cold outreach.
          </p>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            J'avais envie de tester un format différent : quelque chose de personnel, rapide et partageable,
            qui permette aux gens de découvrir Nola tout en s'amusant. Loan est ce test.
          </p>
        </section>

        {/* Ce que je mesure */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📊</span> Ce que je mesure
          </h2>

          <div className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] mb-4">
            <p className="text-zinc-300 text-sm leading-relaxed mb-2">
              <strong>Signal recherché :</strong> un taux de complétion élevé + une majorité de profils Product People.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Le projet vient d'être mis en ligne. Premiers résultats attendus après distribution sur LinkedIn.
            </p>
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {METRICS.map((metric, i) => (
              <div
                key={i}
                className="p-3 sm:p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <p className="text-white text-sm font-medium">{metric.label}</p>
                <p className="text-zinc-500 text-xs mt-1">{metric.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📅</span> Timeline
          </h2>

          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-800" />

            <div className="space-y-4 sm:space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative pl-6 sm:pl-8">
                  <div
                    className={`absolute left-0 top-1.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 ${
                      i === TIMELINE.length - 1
                        ? "bg-[var(--accent)] border-[var(--accent)]"
                        : "bg-zinc-900 border-zinc-700"
                    }`}
                  />

                  <div className="p-3 sm:p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                      <span className="text-[var(--accent-light)] font-semibold text-xs sm:text-sm">
                        {item.step}
                      </span>
                      <span className="text-zinc-600 text-xs px-2 py-0.5 bg-zinc-800/50 rounded hidden sm:inline">
                        {item.highlight}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Choix structurants */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🎯</span> Choix structurants
          </h2>

          <div className="grid gap-3 sm:gap-4">
            {DECISIONS.map((item, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <h3 className="font-semibold text-white text-sm sm:text-base mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Ce que j'ai appris */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">💡</span> Ce que j'ai appris
          </h2>

          <div className="grid gap-3">
            {LEARNINGS.map((item, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex gap-3 items-start"
              >
                <span className="text-lg shrink-0">
                  {item.type === "surprise" && "😮"}
                  {item.type === "bug" && "🐛"}
                  {item.type === "insight" && "🎯"}
                  {item.type === "limite" && "⚠️"}
                </span>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="text-zinc-600 text-xs mt-4 text-center">
            Ces learnings évolueront avec les données réelles. Last update : 08/04/2026
          </p>
        </section>

        {/* Stack */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
            <span className="text-xl sm:text-2xl">🛠</span> Stack & approche IA
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {STACK_SECTIONS.map((section, i) => (
              <div
                key={i}
                className="p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-2 sm:mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex flex-col gap-0.5">
                      <span className="text-zinc-500 text-xs">{item.label}</span>
                      <span className="text-white text-xs sm:text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-6 sm:py-8 border-t border-zinc-800">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Envie d'échanger ?</h2>
          <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6">
            Je suis actuellement en recherche d'opportunités.<br />
            Socle Business, RH, Entrepreneuriat et Produit<br />
          </p>
          <p className="text-zinc-400 text-sm sm:text-base mb-4 sm:mb-6">
            Je fais aussi dîner des Product People avec Nola.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://www.linkedin.com/in/emmanueldimarco/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-medium transition inline-flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Me contacter
            </a>
            <a
              href="https://cheznola.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 sm:px-6 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent-light)] hover:bg-[var(--accent)]/10 font-medium transition inline-flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              🍽 Découvrir Nola
            </a>
          </div>
        </section>

        {/* Footer signature */}
        <div className="text-center text-zinc-600 text-xs sm:text-sm pt-6 sm:pt-8">
          Side project, cadre volontairement contraint, arbitrages assumés.
        </div>
      </div>
    </div>
  );
}
