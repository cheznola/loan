import { NextRequest, NextResponse } from "next/server";

// --- Job database by category ---
const JOBS: Record<string, { title: string; description: string }[]> = {
  PRODUCT: [
    { title: "Professional Overthinker (niveau 4)", description: "Passer 80% de ton temps à anticiper des problèmes qui n'arriveront jamais." },
    { title: "Chief Je-Te-L'Avais-Dit Officer", description: "Tu avais raison en 2025. En 2042, on te paie pour ça." },
    { title: "Scope Creep Defender", description: "Ton bouclier repousse les demandes de dernière minute." },
    { title: "Backlog Grief Counselor", description: "Tu accompagnes les tickets abandonnés vers leur dernier sprint. Chaque 'Won't Fix' te brise un peu le cœur." },
    { title: "Roadmap Fiction Editor", description: "Ta roadmap Q3 2042 est un best-seller. Personne ne sait si c'est de la stratégie ou de la science-fiction." },
  ],
  TECH: [
    { title: 'Lead "Ça marchait en local"', description: "La prod, c'est un concept." },
    { title: "VP of Ctrl+Z", description: "Sans toi, tout serait en prod. Tout." },
    { title: "Legacy Code Exorcist", description: "Tu parles aux fantômes du repo." },
    { title: "Stack Overflow Historian", description: "Tu cites des réponses de 2015 comme des textes sacrés. Et elles marchent encore." },
    { title: "Chief YAML Whisperer", description: "Tu comprends l'indentation YAML au toucher. Les espaces te parlent, les tabs te trahissent." },
  ],
  DESIGN: [
    { title: "Chief Pixel Perfectionist (en rémission)", description: "15 ans à déplacer des boutons de 2 pixels." },
    { title: "Figma Archaeologist", description: "Tu fouilles les fichiers Figma de 2025." },
    { title: "Feedback Digest Specialist", description: "Tu traduis 'c'est bizarre' en insights." },
    { title: "Dark Mode Evangelist", description: "Tu as converti 47 apps au dark mode. Ta croisade ne s'arrêtera jamais." },
    { title: "Whitespace Philosopher", description: "Pour toi, le vide n'est pas rien. C'est de l'espace négatif intentionnel à haute valeur ajoutée." },
  ],
  DATA: [
    { title: "Dashboard Poet", description: "Tes dashboards racontent des histoires." },
    { title: "Metric Manipulation Detective", description: "Tu sais quand un KPI ment." },
    { title: "Spreadsheet Archaeologist", description: "Tu fouilles les Excel de 2019." },
    { title: "Correlation Conspiracy Theorist", description: "Tu trouves des corrélations partout. Le café et le churn ? Évident." },
    { title: "Data Lake Lifeguard", description: "Tu sauves les données qui se noient dans le data lake. Personne d'autre n'ose plonger." },
  ],
  SALES: [
    { title: 'Chief "Je reviens vers toi" Officer', description: "Tu reviens toujours. TOUJOURS." },
    { title: "Pipeline Fantasy Writer", description: "Tes forecasts sont de la pure fiction." },
    { title: "Demo Improvisation Artist", description: "Le bug en démo ? Tu en fais une feature." },
    { title: "Objection Aikido Master", description: "Chaque 'non' du client devient un 'oui' grâce à ta technique de redirection verbale." },
    { title: "Commission Architecture Designer", description: "Tu as designé un plan de commission si complexe que même la finance ne le comprend pas. Et c'est le but." },
  ],
  MARKETING: [
    { title: "Corporate Poetry Writer", description: "Tu transformes les licenciements en 'optimisation des synergies'." },
    { title: "Attention Economist", description: "Tu gères la ressource la plus rare : l'attention." },
    { title: "Viral Load Balancer", description: "Tu gères la viralité comme des serveurs." },
    { title: "Hashtag Sommelier", description: "Tu sélectionnes les hashtags avec le nez d'un sommelier. Notes de #growth, finale de #disruption." },
    { title: "Funnel Feng Shui Expert", description: "Tu réallignes l'énergie du funnel pour que le chi du lead flow circule harmonieusement." },
  ],
  HR: [
    { title: "Director of Uncomfortable Conversations", description: "Le feedback difficile, c'est ton cardio." },
    { title: "Chief Vibes Officer", description: "Tu SENS quand l'équipe va mal." },
    { title: "Exit Interview Therapist", description: "Tes exit interviews révèlent tout." },
    { title: "Perks Inflation Specialist", description: "Tu as inventé le 'congé introspection' et le 'budget aura professionnelle'. Les candidats adorent." },
    { title: "Culture Deck Novelist", description: "Ton culture deck fait 200 pages. C'est le Guerre et Paix du RH. Personne ne l'a lu en entier." },
  ],
  MANAGEMENT: [
    { title: "Meeting Escape Artist", description: "Tu as toujours un autre call." },
    { title: "Alignment Illusionist", description: "Tout le monde est d'accord. Sur quoi ? Personne ne sait." },
    { title: "Manager of Managed Chaos", description: "Tout brûle. Mais c'est prévu." },
    { title: "Delegation Recursion Expert", description: "Tu délègues la délégation. Ton org chart est une fractale." },
    { title: "Strategic Ambiguity Officer", description: "Tes memos sont si vagues que chaque équipe y voit ce qu'elle veut. C'est du génie ou du flou. Personne ne sait." },
  ],
  FINANCE: [
    { title: "Budget Fiction Editor", description: "Tes budgets prévisionnels sont des œuvres littéraires. Le chapitre 'imprévus' est toujours le plus long." },
    { title: "ROI Philosopher", description: "Tu questionnes l'existence même du retour sur investissement. 'Et si le vrai ROI, c'était les amis qu'on s'est faits en chemin ?'" },
    { title: "Cash Flow Whisperer", description: "Tu entends le cash flow murmurer. Quand il crie, c'est déjà trop tard." },
    { title: "Expense Report Archaeologist", description: "Tu fouilles les notes de frais de 2025 et tu y trouves des mystères. Qui a commandé 47 pizzas un mardi ?" },
    { title: "Forecast Astrologer", description: "Tes prévisions financières sont basées sur les astres, les marées, et un peu de Excel. Étrangement, ça marche." },
  ],
  OPS: [
    { title: "Process Archaeologist", description: "Tu déterres des processus oubliés depuis 2030. Certains marchent encore. La plupart sont maudits." },
    { title: "Automation Grief Counselor", description: "Tu accompagnes les employés dont le job a été automatisé. 'Ce n'est pas toi, c'est le script.'" },
    { title: "Documentation Evangelist", description: "Tu prêches la bonne parole de la documentation. Tes fidèles sont rares mais dévoués." },
    { title: "Incident Déjà-Vu Analyst", description: "Tu as vu ce bug avant. Tu l'as toujours vu. Le post-mortem est déjà écrit avant l'incident." },
    { title: "SLA Negotiation Poet", description: "Tu rédiges des SLAs qui ressemblent à des haïkus. 99.9% uptime / un rêve fragile / le pager sonne." },
  ],
  CSM: [
    { title: "Onboarding Experience Designer", description: "Tu transformes l'onboarding en parcours initiatique. Le client ressort changé, éclairé, et légèrement confus." },
    { title: "Adoption Choreographer", description: "Tu chorégraphies l'adoption produit comme un ballet. Chaque clic est une pirouette, chaque feature un grand jeté." },
    { title: "NPS Emotion Analyst", description: "Tu lis entre les lignes du NPS. Un 7 cache une douleur profonde. Un 9 cache une demande de feature." },
    { title: "QBR Drama Director", description: "Tes Quarterly Business Reviews ont un arc narratif, un climax, et parfois des larmes. Le client redemande des places." },
    { title: "Client Success Therapist", description: "Tu écoutes, tu valides, tu reformules. Le client se sent compris. Le churn diminue. Tu es le héros silencieux." },
  ],
  DEFAULT: [
    { title: "Bullshit Asymptote Specialist", description: "Tu frôles la vérité. Avec élégance." },
    { title: "Context Switching Champion", description: "47 sujets en parallèle. Aucun problème." },
    { title: "Professional Devil's Advocate", description: "'Oui mais non.' Ta phrase signature." },
    { title: "Synergy Sommelier", description: "Tu identifies les synergies comme un sommelier identifie les cépages. Notes de collaboration, finale de disruption." },
    { title: "Chief 'Per My Last Email' Officer", description: "Tu rappelles ce que tu as déjà dit avec une politesse chirurgicale. Tes emails sont des armes de précision." },
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
  FINANCE: ["finance", "financier", "comptable", "comptabilité", "accounting", "controller", "trésorier", "treasury", "budget", "fiscal", "audit", "auditeur", "daf", "cash", "revenue", "billing", "invoicing", "facturation"],
  OPS: ["operations", "opérations", "ops", "supply chain", "logistique", "logistics", "process", "procurement", "achats", "qualité", "quality", "lean", "six sigma", "continuous improvement", "amélioration continue", "warehouse", "fleet"],
  CSM: ["customer success", "csm", "account management", "client success", "onboarding", "adoption", "retention", "churn", "nps", "qbr", "renewal", "upsell", "customer experience", "cx ", "customer journey"],
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
  "183-225k€ (+ un hologramme de toi pour les réunions du lundi)",
  "77-103k€ (+ un NFT de ton premier commit)",
  "201-247k€ (+ un congé sabbatique dans une simulation quantique)",
  "119-158k€ (+ un robot qui répond 'je suis en vacances' à ta place)",
  "165-198k€ (+ un accès VIP au buffet inter-dimensionnel)",
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
  "le name-dropping inter-galactique",
  "la diplomatie passive-aggressive",
  "le pivot existentiel en réunion",
  "l'art de CC tout le monde",
  "la lecture de sous-texte Slack",
  "le multitasking émotionnel",
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
  "Tu inventeras le 'congé métavers' et ça deviendra un droit universel.",
  "Ton dashboard sera exposé au MoMA comme œuvre d'art contemporain.",
  "Tu négocieras une augmentation avec un chatbot. Et tu gagneras.",
  "Ton email d'adieu deviendra viral et inspirera une série Netflix.",
  "Tu seras élu·e 'Personne la plus calme en post-mortem' 5 ans de suite.",
  "Tu créeras un emoji corporate qui sera utilisé dans 40 pays.",
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
    FINANCE: ["DAF", "Contrôleur de gestion", "Comptable", "Finance Manager", "Trésorier"],
    OPS: ["Operations Manager", "Supply Chain Manager", "Responsable Ops", "Chef de projet", "Process Manager"],
    CSM: ["Customer Success Manager", "CSM", "Account Manager", "Client Partner", "Responsable Client"],
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
      version: "v3-jobbank60",
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de ta prédiction" },
      { status: 500 }
    );
  }
}
