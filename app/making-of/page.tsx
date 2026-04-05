"use client";

import Link from "next/link";

// ============================================
// TIMELINE DATA - Contexte NanoCorp + raisonnement PM senior
// ============================================

const TIMELINE = [
  {
    day: "Jour 0",
    title: "Le problème d'acquisition",
    description: "Nola grandit par le bouche-à-oreille depuis 18 mois. Ça fonctionne, mais ça ne scale pas. Je cherche un levier d'acquisition qui touche des Product People qualifiés — sans paid, sans cold outreach LinkedIn. La contrainte : un flux qui génère des leads exploitables (email + profil), pas juste de la visibilité.",
    highlight: "Acquisition · Lead generation · Ciblage",
  },
  {
    day: "Jour 1",
    title: "L'hypothèse : lead magnet viral",
    description: "En testant une nouveauté de NanoCorp.so (plateforme d'agents IA), je réalise que je peux prototyper un outil complet en quelques jours. L'idée : un générateur humoristique de 'job en 2042' basé sur le profil LinkedIn. Viral par nature (ego + humour + partage), ciblé (les PMs se reconnaissent), et collecte naturellement les données dont j'ai besoin.",
    highlight: "Hypothèse · Viralité · NanoCorp",
  },
  {
    day: "Jour 2",
    title: "Arbitrage structurant : pas d'API IA",
    description: "Premier choix produit : ne PAS utiliser de génération IA pour les résultats. Les raisons : coût par requête (chaque prédiction coûterait ~0.01€), latence (2-3s vs instantané), et surtout qualité de l'humour — l'IA génère du 'drôle générique', pas du 'drôle métier'. J'opte pour un système combinatoire : 12 catégories × 5 jobs × variations = 2160 combinaisons, pré-écrites avec le bon ton.",
    highlight: "Trade-off · Coût vs qualité · Architecture",
  },
  {
    day: "Jour 3",
    title: "L'algo de détection",
    description: "Travail en itération sur GitHub avec Claude : 800+ mots-clés par catégorie métier, scoring pondéré (titre LinkedIn = x5), nettoyage du bruit de sidebar. Mon rôle : donner le contexte métier, challenger les edge cases, valider que 'PM' matche bien PRODUCT et pas autre chose. L'agent IA exécute vite — le jugement produit reste humain.",
    highlight: "Prompt engineering · Itération · GitHub",
  },
  {
    day: "Jour 4",
    title: "Le bug que les tests ne voyaient pas",
    description: "Tests unitaires : OK. Vrais profils LinkedIn (3000+ mots de bruit) : tous tombent en DESIGN. Root cause : le mot 'designed' apparaît dans 80% des descriptions d'expérience ('I designed a process...'). Le fix : passer d'un first-match à un occurrence counting, et filtrer le bruit LinkedIn. Rappel classique : les données synthétiques mentent.",
    highlight: "Debug · Données réelles · Itération",
  },
  {
    day: "Jour 5",
    title: "Intégration et go-live",
    description: "Connexion Airtable pour la capture des leads. Le code initial de NanoCorp incluait PostgreSQL — supprimé, trop lourd pour ce use case. Ajout du terminal 'Transmissions du futur' (social proof temps réel). Déploiement Vercel. Premiers tests avec de vrais utilisateurs.",
    highlight: "Lead capture · Déploiement · MVP live",
  },
  {
    day: "Jour 6",
    title: "Documentation du process",
    description: "Cette page. Un side project non documenté est un side project invisible. L'objectif : montrer le raisonnement, pas juste le livrable.",
    highlight: "Storytelling · Personal branding",
  },
];

// ============================================
// CONVICTIONS APPLIQUÉES (pas "learnings")
// ============================================

const CONVICTIONS = [
  {
    title: "Ship fast, learn faster",
    description: "Loan est sorti en 5 jours, avec des bugs connus et des features manquantes. Ce n'est pas de l'improvisation — c'est un choix : une V1 live génère du feedback réel, une V1 dans un doc ne génère rien. J'applique ce principe depuis mes débuts en Product.",
  },
  {
    title: "L'IA est un accélérateur, pas un décideur",
    description: "J'utilise des agents IA quotidiennement dans mon travail. Leur force : exécuter vite, explorer plus de pistes, réduire le coût cognitif des tâches répétitives. Leur limite : ils n'ont pas le contexte métier, le jugement produit, le 'pourquoi'. Sur Loan, l'IA a écrit 90% du code — mais les arbitrages (pas de génération IA, scoring pondéré, gestion du bruit) sont des décisions humaines.",
  },
  {
    title: "Les données synthétiques mentent",
    description: "Mes tests avec des profils de 50 mots passaient. Les vrais profils LinkedIn (3000+ mots, sidebar, bruit) plantaient. Ce n'est pas nouveau, mais c'est un rappel : valider avec du réel le plus tôt possible.",
  },
  {
    title: "Choisir ses batailles avec l'IA générative",
    description: "Il était tentant de laisser l'IA générer les jobs 2042 à la volée — plus de variété, moins d'effort de rédaction. Mais : latence, coût récurrent, et surtout perte de contrôle sur le ton. 2160 combinaisons pré-écrites suffisent pour que chaque résultat semble unique. Le choix 'pas d'IA' était un choix produit, pas une contrainte technique.",
  },
];

// ============================================
// STACK - Orientée maîtrise IA
// ============================================

const STACK_SECTIONS = [
  {
    title: "Développement",
    items: [
      { label: "Framework", value: "Next.js 14 (App Router, Server Components)" },
      { label: "Déploiement", value: "Vercel (CI/CD depuis GitHub)" },
      { label: "Base de données", value: "Airtable (leads) — PostgreSQL retiré" },
    ],
  },
  {
    title: "IA & Agents",
    items: [
      { label: "Agent principal", value: "Claude 3.5 Sonnet (Anthropic)" },
      { label: "Plateforme d'orchestration", value: "NanoCorp.so — agents IA pour le prototypage" },
      { label: "Méthode de travail", value: "Prompting itératif, context engineering, validation humaine systématique" },
    ],
  },
  {
    title: "Choix produit sur l'IA",
    items: [
      { label: "Génération des résultats", value: "Algorithmique (pas d'API IA) — contrôle du ton, coût nul, latence zéro" },
      { label: "Détection de catégorie", value: "Scoring pondéré + 800 mots-clés — pas de classification IA" },
    ],
  },
];

// ============================================
// COMPONENT
// ============================================

export default function MakingOfPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/"
            className="text-zinc-500 hover:text-white transition text-sm mb-6 inline-flex items-center gap-1"
          >
            ← Retour à Loan
          </Link>
          
          <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-3">
            De l'idée au go-live en 5 jours
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            Par{" "}
            <a 
              href="https://linkedin.com/in/music-all" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Manu Di Marco
            </a>
            {" "}— Product Manager, fondateur de{" "}
            <a 
              href="https://cheznola.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Nola
            </a>
          </p>
          
          <p className="text-zinc-500 mt-4 leading-relaxed">
            Loan est un side project construit en une semaine pour résoudre un problème 
            concret : générer des leads qualifiés pour une communauté de Product People. 
            Ce document retrace les choix, les arbitrages, et le travail avec des agents IA.
          </p>
        </div>

        {/* Le problème - Section mise en valeur */}
        <section className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-[var(--accent)]/5 to-transparent border border-[var(--accent)]/20">
          <h2 className="text-lg font-semibold mb-3 text-[var(--accent-light)]">
            🎯 Le problème
          </h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            <strong>Nola</strong> organise des dîners mensuels pour les Product People à Paris. 
            La communauté grandit par cooptation, mais le flux reste artisanal. 
          </p>
          <p className="text-zinc-400 leading-relaxed">
            L'enjeu : trouver un levier d'acquisition qui <strong>cible les bons profils</strong> (PM, PO, CPO...), 
            <strong> génère des leads exploitables</strong> (email + profil LinkedIn), 
            et <strong>scale sans budget pub</strong>. Un lead magnet viral était une piste à tester.
          </p>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">📅</span> Timeline
          </h2>
          
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-zinc-800" />
            
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={i} className="relative pl-8">
                  {/* Dot */}
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                    i === TIMELINE.length - 1 
                      ? 'bg-[var(--accent)] border-[var(--accent)]' 
                      : 'bg-zinc-900 border-zinc-700'
                  }`} />
                  
                  <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[var(--accent-light)] font-semibold text-sm">
                        {item.day}
                      </span>
                      <span className="text-zinc-600 text-xs px-2 py-0.5 bg-zinc-800/50 rounded">
                        {item.highlight}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Convictions appliquées */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Convictions appliquées
          </h2>
          
          <div className="grid gap-4">
            {CONVICTIONS.map((item, i) => (
              <div 
                key={i}
                className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stack - Réorganisée par sections */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">🛠</span> Stack & approche IA
          </h2>
          
          <div className="space-y-4">
            {STACK_SECTIONS.map((section, i) => (
              <div 
                key={i}
                className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]"
              >
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <div key={j} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <span className="text-zinc-500 text-sm shrink-0">{item.label}</span>
                      <span className="text-white text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-zinc-800">
          <h2 className="text-xl font-semibold mb-3">Envie d'échanger ?</h2>
          <p className="text-zinc-400 mb-6">
            Product Manager, actuellement en recherche d'opportunités.<br/>
            Je fais aussi dîner des Product People avec Nola.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://linkedin.com/in/music-all"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#0077B5] hover:bg-[#006097] text-white font-medium transition inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Me contacter
            </a>
            <a
              href="https://cheznola.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-[var(--accent)] text-[var(--accent-light)] hover:bg-[var(--accent)]/10 font-medium transition inline-flex items-center justify-center gap-2"
            >
              🍽 Découvrir Nola
            </a>
          </div>
        </section>

        {/* Footer signature */}
        <div className="text-center text-zinc-600 text-sm pt-8">
          Side project, shipping réel, arbitrages assumés.
        </div>
      </div>
    </div>
  );
}
