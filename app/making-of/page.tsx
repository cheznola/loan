"use client";

import Link from "next/link";

// ============================================
// TIMELINE DATA - À compléter au fur et à mesure
// ============================================

const TIMELINE = [
  {
    day: "Jour 1",
    date: "31 mars 2026",
    title: "L'idée",
    description: "Un lead magnet viral pour Nola. Concept : Loan, un personnage qui revient de 2042 pour annoncer ton futur job.",
    tags: ["Idéation", "Product Thinking"],
  },
  {
    day: "Jour 2",
    date: "1 avril 2026",
    title: "Premier prototype",
    description: "Mise en place du stack (Next.js, Tailwind, Vercel). Premier algo de détection métier avec mots-clés.",
    tags: ["Next.js", "Tailwind", "Agent IA"],
  },
  {
    day: "Jour 3",
    date: "2 avril 2026",
    title: "L'algo sans API IA",
    description: "Choix de ne pas utiliser d'API IA (coût, latence). 800+ mots-clés, scoring par catégorie, poids x5 sur le titre de poste.",
    tags: ["Arbitrage", "Performance"],
  },
  {
    day: "Jour 4",
    date: "3 avril 2026",
    title: "Debug & itération",
    description: "Problème : tous les profils tombaient en DESIGN. Root cause : 'designed' dans les descriptions LinkedIn. Fix : occurrence counting + nettoyage du bruit.",
    tags: ["Debug", "Itération"],
  },
  {
    day: "Jour 5",
    date: "4 avril 2026",
    title: "Airtable & polish",
    description: "Intégration Airtable pour capturer les leads. TransmissionFeed (terminal LIVE). Suppression du code PostgreSQL hérité.",
    tags: ["Lead Capture", "UX"],
  },
  {
    day: "Jour 6",
    date: "5 avril 2026",
    title: "Making-of",
    description: "Cette page. Parce que le process compte autant que le résultat.",
    tags: ["Documentation", "Personal Branding"],
  },
];

// ============================================
// LEARNINGS
// ============================================

const LEARNINGS = [
  {
    title: "Shipper vite > shipper parfait",
    description: "Loan est sorti en 5 jours. Pas parfait, mais live. Les bugs se corrigent en prod, les idées meurent dans les docs.",
  },
  {
    title: "L'IA comme accélérateur",
    description: "J'ai construit Loan avec un agent IA (Claude). Pas pour remplacer le raisonnement, mais pour accélérer l'exécution. Le 'quoi' et le 'pourquoi' restent humains.",
  },
  {
    title: "Pas d'API IA = contrôle total",
    description: "Le contenu est pré-écrit, pas généré. Résultat : latence nulle, coût nul, humour maîtrisé. 2160 combinaisons possibles, ça suffit pour que chaque résultat semble unique.",
  },
  {
    title: "Les vrais tests cassent les faux tests",
    description: "Mes tests unitaires passaient. Les vrais profils LinkedIn plantaient. Leçon : tester avec des données réelles, pas des strings de 10 mots.",
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
            Comment j'ai construit Loan en 5 jours
          </h1>
          
          <p className="text-zinc-400 text-lg leading-relaxed">
            Un side project de{" "}
            <a 
              href="https://linkedin.com/in/music-all" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Manu Di Marco
            </a>
            , PM & fondateur de{" "}
            <a 
              href="https://cheznola.fr" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--accent-light)] hover:underline"
            >
              Nola
            </a>
            .
          </p>
          
          <p className="text-zinc-500 mt-4">
            Loan prédit ton job en 2042. Cette page raconte comment je l'ai créé, 
            les choix que j'ai faits, et ce que ça dit de ma façon de travailler.
          </p>
        </div>

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
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[var(--accent-light)] font-semibold text-sm">
                        {item.day}
                      </span>
                      <span className="text-zinc-600 text-xs">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag, j) => (
                        <span 
                          key={j}
                          className="px-2 py-0.5 text-xs rounded-full bg-zinc-800 text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learnings */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">💡</span> Ce que j'ai appris
          </h2>
          
          <div className="grid gap-4">
            {LEARNINGS.map((item, i) => (
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

        {/* Stack */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-2xl">🛠</span> Stack technique
          </h2>
          
          <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-zinc-500 mb-1">Frontend</div>
                <div className="text-white">Next.js 14</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Styling</div>
                <div className="text-white">Tailwind CSS</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Déploiement</div>
                <div className="text-white">Vercel</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Base de données</div>
                <div className="text-white">Airtable</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">Agent IA</div>
                <div className="text-white">Claude (Anthropic)</div>
              </div>
              <div>
                <div className="text-zinc-500 mb-1">API IA pour génération</div>
                <div className="text-white">Aucune (algorithmique)</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-zinc-800">
          <h2 className="text-xl font-semibold mb-3">Tu veux discuter Product ?</h2>
          <p className="text-zinc-400 mb-6">
            Je suis PM en recherche d'opportunités. Et je fais dîner des Product People avec Nola.
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
              Me contacter sur LinkedIn
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
          Construit avec un agent IA, beaucoup de café, et zéro framework de priorisation.
        </div>
      </div>
    </div>
  );
}
