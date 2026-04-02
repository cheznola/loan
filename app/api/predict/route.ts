import { NextRequest, NextResponse } from "next/server";

// --- Job database by category ---
const JOBS: Record<string, { title: string; description: string }[]> = {
  PRODUCT: [
    { title: "Professional Overthinker (niveau 4)", description: "Passer 80% de ton temps à anticiper des problèmes qui n'arriveront jamais." },
    { title: "Chief Je-Te-L'Avais-Dit Officer", description: "Tu avais raison en 2025. En 2042, on te paie pour ça." },
    { title: "Scope Creep Defender", description: "Ton bouclier repousse les demandes de dernière minute." },
  ],
  TECH: [
    { title: 'Lead "Ça marchait en local"', description: "La prod, c'est un concept." },
    { title: "VP of Ctrl+Z", description: "Sans toi, tout serait en prod. Tout." },
    { title: "Legacy Code Exorcist", description: "Tu parles aux fantômes du repo." },
  ],
  DESIGN: [
    { title: "Chief Pixel Perfectionist (en rémission)", description: "15 ans à déplacer des boutons de 2 pixels." },
    { title: "Figma Archaeologist", description: "Tu fouilles les fichiers Figma de 2025." },
    { title: "Feedback Digest Specialist", description: "Tu traduis 'c'est bizarre' en insights." },
  ],
  DATA: [
    { title: "Dashboard Poet", description: "Tes dashboards racontent des histoires." },
    { title: "Metric Manipulation Detective", description: "Tu sais quand un KPI ment." },
    { title: "Spreadsheet Archaeologist", description: "Tu fouilles les Excel de 2019." },
  ],
  SALES: [
    { title: 'Chief "Je reviens vers toi" Officer', description: "Tu reviens toujours. TOUJOURS." },
    { title: "Pipeline Fantasy Writer", description: "Tes forecasts sont de la pure fiction." },
    { title: "Demo Improvisation Artist", description: "Le bug en démo ? Tu en fais une feature." },
  ],
  MARKETING: [
    { title: "Corporate Poetry Writer", description: "Tu transformes les licenciements en 'optimisation des synergies'." },
    { title: "Attention Economist", description: "Tu gères la ressource la plus rare : l'attention." },
    { title: "Viral Load Balancer", description: "Tu gères la viralité comme des serveurs." },
  ],
  HR: [
    { title: "Director of Uncomfortable Conversations", description: "Le feedback difficile, c'est ton cardio." },
    { title: "Chief Vibes Officer", description: "Tu SENS quand l'équipe va mal." },
    { title: "Exit Interview Therapist", description: "Tes exit interviews révèlent tout." },
  ],
  MANAGEMENT: [
    { title: "Meeting Escape Artist", description: "Tu as toujours un autre call." },
    { title: "Alignment Illusionist", description: "Tout le monde est d'accord. Sur quoi ? Personne ne sait." },
    { title: "Manager of Managed Chaos", description: "Tout brûle. Mais c'est prévu." },
  ],
  DEFAULT: [
    { title: "Bullshit Asymptote Specialist", description: "Tu frôles la vérité. Avec élégance." },
    { title: "Context Switching Champion", description: "47 sujets en parallèle. Aucun problème." },
    { title: "Professional Devil's Advocate", description: "'Oui mais non.' Ta phrase signature." },
  ],
};

// --- Category detection keywords ---
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  PRODUCT: ["product", "produit", "product manager", "product owner", "po ", "pm ", "backlog", "roadmap", "scrum master", "agile", "user story", "stakeholder"],
  TECH: ["developer", "développeur", "engineer", "ingénieur", "software", "frontend", "backend", "fullstack", "devops", "sre", "cloud", "code", "programming", "react", "python", "java", "typescript", "infrastructure", "cto", "tech lead", "architecte"],
  DESIGN: ["design", "designer", "ux", "ui", "figma", "sketch", "user experience", "user interface", "directeur artistique", "graphique", "créatif", "creative"],
  DATA: ["data", "analyst", "analyste", "scientist", "machine learning", "ml ", "ai ", "intelligence artificielle", "big data", "dashboard", "analytics", "bi ", "business intelligence", "statistique"],
  SALES: ["sales", "commercial", "business development", "bdr", "sdr", "account executive", "account manager", "vente", "prospection", "closing", "pipeline", "crm"],
  MARKETING: ["marketing", "growth", "seo", "sem", "content", "brand", "marque", "communication", "social media", "community manager", "acquisition", "cmо", "copywriter"],
  HR: ["rh", "ressources humaines", "human resources", "recrutement", "recruiter", "talent", "people", "culture", "onboarding", "formation", "training", "drh"],
  MANAGEMENT: ["manager", "management", "directeur", "director", "head of", "vp ", "vice president", "chief", "ceo", "coo", "cfo", "lead", "responsable", "chef de projet"],
};

// --- Random data pools ---
const SALARIES = [
  "142-168k€ (+ bonus en RTT)",
  "98-127k€ (+ un budget illimité en post-its holographiques)",
  "156-189k€ (+ 1 semaine de congé par epiphanie existentielle)",
  "112-145k€ (+ une place de parking sur Mars)",
  "167-203k€ (+ un abonnement à vie à ChatGPT 47)",
  "88-115k€ (+ des stock options sur la Lune)",
  "134-172k€ (+ un assistant IA personnel qui fait tes retros)",
  "175-210k€ (+ un bureau dans le métavers avec vue sur mer)",
  "95-128k€ (+ un drone livreur de café)",
  "148-186k€ (+ 3 jours de télétravail depuis 2042)",
];

const SKILLS = [
  "le lâcher-prise",
  "dire non sans culpabiliser",
  "l'art du silence en réunion",
  "le ghosting professionnel bienveillant",
  "la méditation entre deux sprints",
  "la négociation avec les IA",
  "le PowerPoint quantique",
  "l'empathie algorithmique",
  "le small talk avec les robots",
  "la procrastination stratégique",
  "l'intuition data-driven",
  "le feedback sandwich en 4D",
];

const PREDICTIONS = [
  "Tu créeras un framework que personne n'utilisera.",
  "Ton Slack aura 2 847 channels. Tu en liras 3.",
  "Tu inventeras un nouveau mot corporate qui finira dans le Larousse.",
  "Tu recevras un award pour le meilleur mème interne de 2039.",
  "Tu automatiseras ton propre job. Et tu seras promu.",
  "Ton post LinkedIn de 2038 fera 12 millions de vues. Par accident.",
  "Tu seras invité·e à TEDx pour un talk sur 'le burnout positif'.",
  "Tu écriras un livre : 'Comment survivre à 10 000 réunions'.",
  "Ton bot Slack deviendra plus populaire que toi dans l'équipe.",
  "Tu lanceras une startup. Elle pivotera 7 fois. La 8ème sera la bonne.",
  "Un stagiaire reprendra ton side project et en fera une licorne.",
  "Tu seras le premier humain à recevoir un 360° feedback d'une IA.",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectCategory(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    scores[category] = 0;
    for (const kw of keywords) {
      // Count occurrences
      let idx = 0;
      while ((idx = lower.indexOf(kw, idx)) !== -1) {
        scores[category]++;
        idx += kw.length;
      }
    }
  }

  // Find the category with highest score
  let best = "DEFAULT";
  let bestScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = category;
    }
  }

  return bestScore > 0 ? best : "DEFAULT";
}

function detectCurrentJob(text: string, category: string): string {
  const jobPatterns: Record<string, string[]> = {
    PRODUCT: ["Product Manager", "Product Owner", "Chef de Produit", "Scrum Master"],
    TECH: ["Développeur", "Software Engineer", "Tech Lead", "CTO", "DevOps Engineer"],
    DESIGN: ["Designer", "UX Designer", "UI Designer", "Directeur Artistique", "Creative Director"],
    DATA: ["Data Analyst", "Data Scientist", "Data Engineer", "Business Analyst"],
    SALES: ["Commercial", "Account Executive", "Business Developer", "Sales Manager"],
    MARKETING: ["Marketing Manager", "Growth Hacker", "Content Manager", "Community Manager"],
    HR: ["Responsable RH", "Talent Acquisition", "DRH", "Recruiter"],
    MANAGEMENT: ["Directeur", "Manager", "Head of", "VP", "CEO"],
    DEFAULT: ["Professionnel·le polyvalent·e"],
  };

  // Try to find an actual job title in the text
  const lower = text.toLowerCase();
  const candidates = jobPatterns[category] || jobPatterns.DEFAULT;
  for (const job of candidates) {
    if (lower.includes(job.toLowerCase())) {
      return job;
    }
  }

  return candidates[0];
}

function generatePrediction(prenom: string, profileText: string) {
  const category = detectCategory(profileText);
  const currentJob = detectCurrentJob(profileText, category);
  const job = pick(JOBS[category]);
  const salary = pick(SALARIES);
  const skill = pick(SKILLS);
  const prediction = pick(PREDICTIONS);

  const futureJob = job.title;

  const fullText = `Bonjour ${prenom}, je m'appelle Loan et je reviens de 2042 avec de bonnes nouvelles !

En 2042, tu n'es plus ${currentJob}. Tu es ${futureJob}.
${job.description}

📊 Tes stats 2042 :
- Salaire projeté : ${salary}
- Compétence critique : ${skill}
- Prédiction bonus : ${prediction}

Ce futur est incroyable, et tu ne pourras pas dire que tu n'étais pas au courant.`;

  const shareText = `🔮 Je viens de découvrir mon job en 2042 grâce à Loan... Apparemment, en 2042 je serai ${futureJob} ! ${job.description} Découvre ton futur job ici : https://loan.nanocorp.app #2042 #FuturJob #IA`;

  const slackText = `🔮 Selon Loan (qui revient de 2042), mon futur job sera : *${futureJob}* ! Teste le tien → https://loan.nanocorp.app`;

  return {
    currentJob,
    futureJob,
    fullText,
    shareText,
    slackText,
  };
}

export async function POST(request: NextRequest) {
  console.log("[predict] Algorithmic endpoint v2 hit");
  try {
    const body = await request.json();
    const { prenom, email, localisation, profileText, likes, dislikes } = body;

    if (!prenom || !email || !profileText) {
      return NextResponse.json(
        { error: "Prénom, email et texte de profil sont requis" },
        { status: 400 }
      );
    }

    const result = generatePrediction(prenom, profileText);

    // Save to database (non-blocking, dynamic import to avoid module-level failures)
    try {
      const { default: pool } = await import("@/lib/db");
      await pool.query(
        `INSERT INTO submissions (prenom, email, localisation, profile_text, likes, dislikes, current_job, future_job, generated_result)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          prenom,
          email,
          localisation || null,
          profileText,
          likes || null,
          dislikes || null,
          result.currentJob,
          result.futureJob,
          JSON.stringify(result),
        ]
      );
    } catch (dbError) {
      console.error("Failed to save submission:", dbError);
    }

    return NextResponse.json({
      prenom,
      currentJob: result.currentJob,
      futureJob: result.futureJob,
      fullText: result.fullText,
      shareText: result.shareText,
      slackText: result.slackText,
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de ta prédiction" },
      { status: 500 }
    );
  }
}
