import { NextRequest, NextResponse } from "next/server";

// === AIRTABLE CONFIG ===
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE = "Transmission";

async function saveToAirtable(data: {
  prenom: string;
  email: string;
  ville: string;
  linkedinUrl: string;
  jobTitle: string;
  profileText?: string;
}) {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.warn("Airtable credentials missing, skipping save");
    return;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                Prénom: data.prenom,
                Email: data.email,
                Ville: data.ville,
                "Profil LinkedIn": data.linkedinUrl,
                "Titre de poste LinkedIn": data.jobTitle,
                "Profil complet": data.profileText || "",
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Airtable error:", errorData);
    } else {
      console.log("Airtable save success");
    }
  } catch (error) {
    console.error("Airtable save error:", error);
  }
}

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

// ===== CATEGORY KEYWORDS =====
const CATEGORIES: Record<string, string[]> = {
  PRODUCT: [
    'product manager', 'chef de produit', 'product owner', 'product lead', 'product director', 'head of product', 'vp product', 'vp of product', 'chief product officer', 'cpo', 
    'product ops', 'product operations', 'product analyst', 'associate product manager', 'apm', 'junior product manager', 'junior pm',
    'senior product manager', 'senior pm', 'staff pm', 'staff product manager', 'group pm', 'group product manager', 'principal pm', 'principal product manager',
    'product builder', 'ai product manager', 'platform product manager', 'growth pm', 'growth product manager', 'technical product manager', 'tpm',
    'b2b product manager', 'b2c product manager', 'saas product manager', 'mobile product manager', 'api product manager', 'data product manager', 'internal product manager',
    'product coach', 'product consultant', 'product trainer', 'product mentor', 'product evangelist',
    'responsable produit', 'directeur produit', 'directrice produit', 'chef de projet digital', 'chef de projet web', 'chef de projet it',
    'scrum master', 'agile coach', 'release train engineer', 'rte', 'product portfolio manager',
    'first pm', '1st pm', 'founding pm', 'solo pm', 'only pm',
    'product management', 'product discovery', 'product delivery', 'product strategy', 'product vision', 'product roadmap', 'product backlog', 
    'product metrics', 'product analytics', 'product-led', 'product led growth', 'plg', 'product thinking', 'product mindset', 'product culture',
    'product sense', 'product instinct', 'product intuition', 'product judgment', 'product taste',
    'product operating model', 'product model', 'product organization', 'product team', 'product org',
    'continuous discovery', 'continuous delivery', 'dual track', 'dual track agile', 'product trio', 'discovery trio',
    'opportunity solution tree', 'ost', 'north star metric', 'nsm', 'input metrics', 'output metrics', 'lagging indicators', 'leading indicators',
    'jobs to be done', 'jtbd', 'outcome driven innovation', 'odi', 'value proposition', 'value prop',
    'lean startup', 'build measure learn', 'hypothesis driven', 'experiment driven', 'evidence based', 'data informed', 'data driven',
    'design thinking', 'human centered design', 'hcd', 'user centered design', 'ucd',
    'roadmap', 'roadmapping', 'quarterly planning', 'annual planning', 'planning produit', 'product planning',
    'backlog', 'backlog grooming', 'backlog refinement', 'backlog management', 'backlog prioritization',
    'user story', 'user stories', 'epic', 'epics', 'feature', 'features', 'initiative', 'initiatives', 'theme', 'themes',
    'sprint planning', 'sprint review', 'sprint retrospective', 'sprint demo', 'sprint goal', 'sprint backlog',
    'priorisation', 'prioritization', 'prioritisation', 'priority', 'priorities', 'must have', 'should have', 'could have', 'moscow',
    'rice', 'rice scoring', 'ice', 'ice scoring', 'weighted scoring', 'value vs effort', 'impact vs effort', 'cost of delay', 'wsjf',
    'kano model', 'kano', 'feature prioritization', 'feature scoring', 'opportunity scoring',
    'impact mapping', 'story mapping', 'user story mapping', 'event storming', 'domain driven design',
    'now next later', 'horizon planning', 'rolling wave', 'theme based roadmap', 'outcome based roadmap', 'timeline roadmap',
    'discovery', 'product discovery', 'problem discovery', 'solution discovery', 'opportunity discovery',
    'user research', 'customer research', 'market research', 'competitive research', 'competitive analysis', 'competitor analysis',
    'user interview', 'customer interview', 'stakeholder interview', 'contextual inquiry', 'ethnographic research',
    'usability testing', 'usability test', 'user testing', 'guerilla testing', 'moderated testing', 'unmoderated testing',
    'a/b testing', 'ab testing', 'split testing', 'multivariate testing', 'mvt', 'experimentation', 'experiment',
    'prototype', 'prototyping', 'rapid prototyping', 'clickable prototype', 'interactive prototype', 'high fidelity prototype', 'low fidelity prototype',
    'validation', 'assumption testing', 'hypothesis testing', 'riskiest assumption', 'leap of faith assumption',
    'problem statement', 'problem space', 'solution space', 'opportunity space', 'problem framing',
    'persona', 'personas', 'user persona', 'buyer persona', 'ideal customer profile', 'icp', 'target audience', 'target user',
    'customer journey', 'user journey', 'customer journey map', 'user journey map', 'experience map', 'service blueprint',
    'empathy map', 'empathy mapping', 'pain points', 'gains', 'jobs', 'pains', 'customer pains', 'user pains',
    'delivery', 'product delivery', 'feature delivery', 'release', 'release management', 'release planning',
    'go to market', 'gtm', 'product launch', 'launch', 'beta launch', 'soft launch', 'hard launch', 'rollout', 'phased rollout',
    'mvp', 'minimum viable product', 'mmp', 'minimum marketable product', 'mlp', 'minimum lovable product', 'map', 'minimum awesome product',
    'iteration', 'iterative', 'increment', 'incremental', 'agile delivery', 'continuous deployment', 'continuous release',
    'feature flag', 'feature toggle', 'feature flags', 'dark launch', 'canary release', 'blue green deployment',
    'acceptance criteria', 'definition of done', 'dod', 'definition of ready', 'dor', 'done done',
    'product metrics', 'product kpis', 'success metrics', 'key metrics', 'core metrics', 'health metrics',
    'product market fit', 'pmf', 'retention', 'user retention', 'customer retention', 'cohort retention', 'day 1 retention', 'day 7 retention', 'day 30 retention',
    'activation', 'user activation', 'activation rate', 'aha moment', 'magic moment', 'time to value', 'ttv',
    'engagement', 'user engagement', 'dau', 'daily active users', 'wau', 'weekly active users', 'mau', 'monthly active users', 'dau/mau', 'stickiness',
    'adoption', 'feature adoption', 'adoption rate', 'feature usage', 'usage analytics', 'product usage',
    'churn', 'churn rate', 'user churn', 'customer churn', 'revenue churn', 'logo churn',
    'conversion', 'conversion rate', 'funnel', 'conversion funnel', 'product funnel', 'user funnel', 'onboarding funnel',
    'nps', 'net promoter score', 'csat', 'customer satisfaction', 'ces', 'customer effort score', 'psat', 'product satisfaction',
    'arpu', 'arppu', 'ltv', 'lifetime value', 'clv', 'customer lifetime value', 'cac', 'customer acquisition cost', 'ltv/cac',
    'scrum', 'kanban', 'scrumban', 'agile', 'agility', 'lean', 'lean product', 'lean ux', 'lean agile',
    'safe', 'scaled agile', 'less', 'large scale scrum', 'nexus', 'spotify model', 'tribes', 'squads', 'chapters', 'guilds',
    'shape up', 'basecamp', 'cycles', 'pitches', 'bets', 'cool down',
    'okr', 'okrs', 'objectives and key results', 'objective', 'key result', 'key results', 'quarterly okrs', 'annual okrs',
    'kpi', 'kpis', 'key performance indicator', 'key performance indicators', 'north star', 'input metric', 'output metric',
    'velocity', 'story points', 'estimation', 'planning poker', 't-shirt sizing', 'relative estimation',
    'burndown', 'burndown chart', 'burnup', 'cumulative flow', 'cfd', 'cycle time', 'lead time', 'throughput',
    'retrospective', 'retro', 'sprint retro', 'kaizen', 'continuous improvement', 'inspect and adapt',
    'standup', 'daily standup', 'daily scrum', 'sync', 'weekly sync', 'all hands',
    'productboard', 'amplitude', 'mixpanel', 'pendo', 'aha', 'airfocus', 'productplan', 'roadmunk', 'canny', 'uservoice',
    'hotjar', 'fullstory', 'logrocket', 'heap', 'posthog', 'smartlook', 'clarity', 'mouseflow', 'lucky orange',
    'jira', 'confluence', 'notion', 'linear', 'asana', 'monday', 'clickup', 'shortcut', 'pivotal tracker', 'trello', 'airtable',
    'figma', 'miro', 'figjam', 'whimsical', 'mural', 'lucidchart', 'balsamiq', 'sketch', 'invision',
    'loom', 'zoom', 'google meet', 'teams', 'slack', 'intercom', 'zendesk', 'freshdesk',
    'segment', 'google analytics', 'ga4', 'firebase', 'appsflyer', 'adjust', 'branch', 'braze', 'customer.io', 'iterable',
    'optimizely', 'launchdarkly', 'split', 'statsig', 'eppo', 'growthbook', 'vwo', 'ab tasty',
    'dovetail', 'maze', 'usertesting', 'userinterviews', 'lookback', 'userzoom', 'dscout', 'optimal workshop', 'typeform', 'surveymonkey',
    'b2b', 'b2c', 'b2b2c', 'saas', 'paas', 'marketplace', 'e-commerce', 'ecommerce', 'fintech', 'healthtech', 'edtech', 'proptech', 'insurtech', 'legaltech', 'hrtech', 'martech', 'adtech',
    'startup', 'scale-up', 'scaleup', 'early stage', 'growth stage', 'late stage', 'series a', 'series b', 'series c',
    'product led', 'sales led', 'marketing led', 'plg', 'slg', 'mlg',
    'mobile app', 'web app', 'desktop app', 'cross platform', 'responsive', 'native app', 'hybrid app', 'pwa',
    'api', 'api product', 'platform', 'platform product', 'developer experience', 'dx', 'developer tools', 'devtools',
    'internal product', 'internal tools', 'enterprise product', 'consumer product', 'prosumer',
    'stakeholder management', 'stakeholder alignment', 'cross functional', 'cross-functional', 'collaboration', 'influence without authority',
    'product communication', 'product presentation', 'product pitch', 'executive presentation', 'board presentation',
    'product writing', 'spec writing', 'prd writing', 'requirements writing', 'documentation',
    'prd', 'product requirements document', 'product spec', 'product specification', 'spec', 'specs', 'brief', 'product brief', 'one pager', 'one-pager',
    'trade off', 'trade-off', 'tradeoff', 'decision making', 'prioritization decision', 'say no', 'saying no',
    'product sense', 'business acumen', 'technical acumen', 'market sense', 'customer empathy', 'user empathy'
  ],

  TECH: [
    'developer', 'développeur', 'développeuse', 'dev', 'engineer', 'ingénieur', 'ingénieure', 'software engineer', 'software developer', 'swe', 'frontend developer', 'frontend engineer', 'front-end', 'front end', 'backend developer', 'backend engineer', 'back-end', 'back end', 'fullstack', 'full-stack', 'full stack', 'fullstack developer', 'fullstack engineer',
    'devops', 'devops engineer', 'sre', 'site reliability engineer', 'platform engineer', 'infrastructure engineer', 'cloud engineer', 'data engineer', 'ml engineer', 'machine learning engineer', 'ai engineer', 'mlops', 'mlops engineer',
    'cto', 'chief technology officer', 'chief technical officer', 'vp engineering', 'vp of engineering', 'head of engineering', 'head of tech', 'tech lead', 'technical lead', 'lead dev', 'lead developer', 'lead engineer', 'engineering manager', 'em', 'staff engineer', 'staff software engineer', 'principal engineer', 'distinguished engineer',
    'architect', 'software architect', 'solutions architect', 'technical architect', 'enterprise architect', 'cloud architect',
    'mobile developer', 'mobile engineer', 'ios developer', 'ios engineer', 'android developer', 'android engineer', 'react native developer', 'flutter developer',
    'qa engineer', 'qa', 'quality assurance', 'test engineer', 'sdet', 'automation engineer',
    'security engineer', 'cybersecurity', 'appsec', 'infosec', 'devsecops',
    'directeur technique', 'responsable technique',
    'python', 'javascript', 'typescript', 'java', 'golang', 'go lang', 'rust', 'ruby', 'ruby on rails', 'rails', 'php', 'laravel', 'symfony', 'c#', 'dotnet', '.net', 'c++', 'scala', 'kotlin', 'swift', 'objective-c',
    'nodejs', 'node.js', 'react', 'reactjs', 'react.js', 'vue', 'vuejs', 'vue.js', 'angular', 'svelte', 'nextjs', 'next.js', 'nuxt', 'remix', 'express', 'fastapi', 'django', 'flask', 'spring', 'spring boot', 'nestjs',
    'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'kubernetes', 'k8s', 'docker', 'terraform', 'pulumi', 'ansible', 'jenkins', 'gitlab ci', 'github actions', 'circleci', 'argocd', 'helm',
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'kafka', 'rabbitmq',
    'codebase', 'repository', 'repo', 'git', 'github', 'gitlab', 'bitbucket', 'pull request', 'pr', 'merge request', 'code review', 'deployment', 'ci/cd', 'cicd', 'continuous integration', 'continuous deployment', 'api', 'rest api', 'graphql', 'grpc', 'microservices', 'monolith', 'architecture logicielle', 'software architecture', 'system design', 'technical debt', 'refactoring', 'scalability', 'high availability', 'distributed systems'
  ],

  DESIGN: [
    'designer', 'ux designer', 'ui designer', 'ux/ui designer', 'ui/ux designer', 'product designer', 'senior product designer', 'staff designer', 'principal designer', 'visual designer', 'graphic designer', 'graphiste', 'web designer', 'interaction designer', 'motion designer', 'brand designer', 'communication designer',
    'design lead', 'lead designer', 'head of design', 'design director', 'vp design', 'vp of design', 'chief design officer', 'cdo', 'design manager', 'senior designer',
    'user researcher', 'ux researcher', 'design researcher', 'research ops', 'researchops',
    'directeur artistique', 'da', 'creative director', 'directeur de création',
    'service designer', 'design ops', 'designops', 'design systems lead', 'design technologist',
    'figma', 'sketch', 'adobe xd', 'xd', 'illustrator', 'photoshop', 'indesign', 'after effects', 'premiere', 'invision', 'framer', 'principle', 'zeplin', 'abstract', 'marvel app', 'balsamiq', 'axure', 'origami', 'protopie', 'lottie',
    'wireframe', 'wireframes', 'wireframing', 'prototype', 'prototypes', 'prototyping', 'mockup', 'mockups', 'maquette', 'maquettes',
    'design system', 'design systems', 'design tokens', 'component library', 'ui kit', 'style guide', 'brand guidelines',
    'user flow', 'user flows', 'user journey', 'journey map', 'journey mapping', 'experience map',
    'persona', 'personas', 'user persona', 'empathy map', 'user testing', 'usability testing', 'usability', 'accessibility', 'a11y', 'wcag',
    'design thinking', 'design sprint', 'atomic design', 'responsive design', 'mobile first', 'information architecture', 'ia', 'interaction design', 'visual hierarchy', 'typography', 'color theory', 'iconography'
  ],

  DATA: [
    'data analyst', 'data scientist', 'data engineer', 'analytics engineer', 'bi analyst', 'bi developer', 'business intelligence analyst', 'business intelligence developer', 'data ops', 'dataops', 'mlops', 'ml ops',
    'head of data', 'data lead', 'lead data', 'vp data', 'vp of data', 'chief data officer', 'cdo', 'data manager', 'data director', 'analytics manager', 'analytics director', 'head of analytics',
    'data architect', 'data modeler', 'data governance',
    'statisticien', 'statisticienne', 'statistician', 'quantitative analyst', 'quant',
    'machine learning scientist', 'research scientist', 'applied scientist',
    'analyste données', 'analyste data', 'data analyste', 'ingénieur data',
    'sql', 'mysql', 'postgresql', 'bigquery', 'big query', 'snowflake', 'redshift', 'databricks', 'synapse',
    'tableau', 'power bi', 'powerbi', 'looker', 'metabase', 'superset', 'qlik', 'qliksense', 'sisense', 'datastudio', 'data studio',
    'dbt', 'fivetran', 'stitch', 'airbyte', 'airflow', 'dagster', 'prefect', 'spark', 'pyspark', 'hadoop', 'hive', 'presto', 'trino',
    'pandas', 'numpy', 'scikit-learn', 'sklearn', 'tensorflow', 'pytorch', 'keras', 'jupyter', 'notebook',
    'dashboard', 'dashboards', 'tableau de bord', 'reporting', 'analytics', 'analyse de données', 'data analysis', 'statistiques', 'statistics', 'modélisation', 'modeling',
    'data viz', 'data visualization', 'visualisation de données', 'data warehouse', 'dwh', 'data lake', 'data lakehouse', 'etl', 'elt', 'data pipeline', 'data pipelines', 'data quality', 'data catalog', 'data lineage',
    'machine learning', 'ml', 'deep learning', 'dl', 'neural network', 'nlp', 'natural language processing', 'computer vision', 'predictive', 'predictive analytics', 'segmentation', 'clustering', 'classification', 'regression', 'a/b testing', 'ab testing', 'experimentation', 'causal inference',
    'kpi', 'kpis', 'metrics', 'métriques', 'indicateurs'
  ],

  SALES: [
    'sales', 'sales representative', 'sales rep', 'salesperson', 'vendeur', 'vendeuse',
    'commercial', 'commerciale', 'ingénieur commercial', 'ingénieure commerciale', 'technico-commercial', 'technico-commerciale',
    'business developer', 'business development', 'bizdev', 'biz dev', 'bd', 'bdr', 'business development representative', 'sdr', 'sales development representative',
    'account executive', 'ae', 'account manager', 'am', 'key account manager', 'kam', 'strategic account manager', 'sam', 'enterprise account executive', 'named account executive', 'global account manager', 'gam',
    'sales manager', 'sales director', 'sales lead', 'vp sales', 'vp of sales', 'head of sales', 'chief sales officer', 'cso', 'chief revenue officer', 'cro', 'chief commercial officer', 'cco',
    'regional sales manager', 'rsm', 'area sales manager', 'territory manager', 'territory sales', 'zone manager',
    'enterprise sales', 'mid-market sales', 'smb sales', 'inside sales', 'field sales', 'outside sales',
    'sales engineer', 'se', 'solutions engineer', 'pre-sales', 'presales', 'avant-vente', 'sales consultant', 'solutions consultant',
    'directeur commercial', 'directrice commerciale', 'responsable commercial', 'responsable commerciale', 'responsable des ventes', 'chef des ventes',
    'channel sales', 'partner sales', 'alliance manager', 'partner manager', 'channel manager', 'channel partner manager',
    'closing', 'closer', 'négociation', 'negotiation', 'prospection', 'prospecting', 'cold calling', 'cold call', 'cold email', 'outbound', 'inbound sales',
    'pipeline', 'sales pipeline', 'funnel', 'sales funnel', 'quota', 'quota attainment', 'target', 'objectifs commerciaux',
    'revenue', 'arr', 'annual recurring revenue', 'mrr', 'monthly recurring revenue', 'bookings', 'new business', 'new logo',
    'deal', 'deals', 'opportunity', 'opportunities', 'win rate', 'close rate', 'conversion',
    'upsell', 'upselling', 'cross-sell', 'cross-selling', 'expansion', 'land and expand',
    'hunting', 'hunter', 'farming', 'farmer', 'new business acquisition',
    'sales cycle', 'cycle de vente', 'sales process', 'processus de vente', 'discovery call', 'demo', 'démonstration', 'proposal', 'proposition commerciale', 'rfp', 'rfi',
    'meddic', 'meddicc', 'meddpicc', 'spin selling', 'spin', 'challenger sale', 'challenger', 'sandler', 'solution selling', 'value selling', 'consultative selling', 'gap selling', 'command of the message',
    'salesforce', 'sfdc', 'hubspot', 'hubspot crm', 'pipedrive', 'zoho crm', 'dynamics', 'dynamics 365',
    'outreach', 'salesloft', 'apollo', 'lemlist', 'instantly', 'woodpecker', 'reply.io',
    'gong', 'chorus', 'clari', 'aviso', 'people.ai',
    'linkedin sales navigator', 'sales navigator', 'zoominfo', 'lusha', 'cognism', 'clearbit', 'leadiq', 'seamless.ai',
    'docusign', 'pandadoc', 'proposify', 'qwilr', 'highspot', 'seismic', 'showpad'
  ],

  CSM: [
    'customer success', 'customer success manager', 'csm', 'senior csm', 'senior customer success manager', 'strategic csm', 'enterprise csm',
    'client success', 'client success manager', 'customer success lead', 'customer success director', 'head of customer success', 'vp customer success', 'vp of customer success', 'chief customer officer', 'cco',
    'customer experience', 'cx', 'cx manager', 'customer experience manager', 'head of cx', 'vp cx',
    'client partner', 'client director', 'customer advocate', 'customer champion',
    'customer operations', 'customer ops', 'cs ops', 'csm ops',
    'customer onboarding', 'onboarding manager', 'onboarding specialist', 'implementation manager', 'implementation consultant', 'implementation specialist',
    'customer support manager', 'support manager', 'head of support',
    'customer marketing', 'customer advocacy', 'customer community',
    'responsable relation client', 'responsable succès client', 'responsable de la satisfaction client', 'chargé de clientèle', 'gestionnaire de compte client',
    'onboarding', 'onboarding client', 'client onboarding', 'customer onboarding', 'time to value', 'ttv', 'time to first value', 'implementation',
    'adoption', 'product adoption', 'user adoption', 'feature adoption', 'adoption rate',
    'retention', 'customer retention', 'client retention', 'gross retention', 'net retention', 'nrr', 'net revenue retention', 'grr', 'gross revenue retention', 'logo retention',
    'churn', 'churn rate', 'customer churn', 'revenue churn', 'churn prevention', 'churn prediction', 'at-risk', 'at risk',
    'nps', 'net promoter score', 'csat', 'customer satisfaction', 'ces', 'customer effort score',
    'health score', 'customer health', 'health scoring', 'customer health score',
    'qbr', 'quarterly business review', 'ebr', 'executive business review', 'business review',
    'renewal', 'renewals', 'renewal rate', 'renouvellement', 'contract renewal',
    'expansion', 'expansion revenue', 'upsell', 'cross-sell',
    'customer journey', 'customer lifecycle', 'lifecycle', 'customer touchpoint', 'touchpoints',
    'voice of customer', 'voc', 'customer feedback', 'feedback client', 'customer insights',
    'success plan', 'success planning', 'mutual success plan', 'joint success plan',
    'customer advocacy', 'customer reference', 'case study', 'testimonial',
    'gainsight', 'totango', 'churnzero', 'vitally', 'planhat', 'custify', 'catalyst', 'strikedeck',
    'intercom', 'zendesk', 'freshdesk', 'helpscout', 'front', 'kustomer', 'gladly', 'dixa',
    'pendo', 'appcues', 'userpilot', 'chameleon', 'userguiding', 'whatfix',
    'delighted', 'medallia', 'qualtrics', 'surveymonkey', 'typeform'
  ],

  MARKETING: [
    'marketing', 'marketer', 'marketeur', 'marketeuse',
    'marketing manager', 'marketing director', 'head of marketing', 'vp marketing', 'vp of marketing', 'cmo', 'chief marketing officer',
    'responsable marketing', 'directeur marketing', 'directrice marketing',
    'growth', 'growth hacker', 'growth marketer', 'growth manager', 'head of growth', 'vp growth', 'growth lead',
    'acquisition', 'acquisition manager', 'user acquisition', 'ua manager', 'paid acquisition',
    'performance marketing', 'performance marketer', 'paid media', 'paid media manager',
    'seo', 'seo manager', 'seo specialist', 'seo consultant', 'head of seo',
    'sea', 'sem', 'sem manager', 'ppc', 'ppc manager', 'ppc specialist',
    'digital marketing', 'digital marketer', 'digital marketing manager', 'online marketing',
    'content', 'content manager', 'content strategist', 'content marketing', 'content marketing manager', 'head of content', 'content lead', 'content writer', 'copywriter', 'rédacteur', 'rédactrice',
    'social media', 'social media manager', 'smm', 'community manager', 'cm', 'community lead',
    'brand', 'brand manager', 'brand director', 'brand marketing', 'head of brand', 'brand strategist',
    'pr', 'public relations', 'pr manager', 'communications', 'communication manager', 'corporate communications', 'chargé de communication', 'chargée de communication', 'responsable communication', 'directeur communication',
    'demand generation', 'demand gen', 'demandgen', 'head of demand gen',
    'product marketing', 'product marketing manager', 'pmm', 'senior pmm', 'head of product marketing', 'product marketing director',
    'field marketing', 'event marketing', 'events manager', 'event manager',
    'partner marketing', 'channel marketing', 'co-marketing',
    'lifecycle marketing', 'crm marketing', 'crm manager', 'email marketing', 'email marketer',
    'marketing ops', 'marketing operations', 'mops', 'revops', 'revenue operations',
    'analyst marketing', 'marketing analyst',
    'organic', 'paid', 'organic traffic', 'paid traffic', 'organic search', 'paid search',
    'campaign', 'campaigns', 'campagne', 'campagnes', 'campaign management',
    'funnel', 'marketing funnel', 'conversion funnel', 'lead generation', 'leadgen', 'lead gen', 'lead magnet', 'landing page', 'landing pages', 'lp',
    'mql', 'marketing qualified lead', 'sql', 'sales qualified lead', 'lead scoring', 'lead nurturing', 'nurturing',
    'conversion', 'conversion rate', 'cro', 'conversion rate optimization', 'ab testing', 'a/b testing', 'split testing',
    'copywriting', 'copy', 'messaging', 'positioning', 'value proposition',
    'branding', 'brand awareness', 'awareness', 'consideration', 'top of funnel', 'tofu', 'mofu', 'bofu',
    'engagement', 'engagement rate', 'reach', 'impressions', 'clicks', 'ctr', 'click through rate',
    'inbound marketing', 'outbound marketing', 'content strategy', 'editorial calendar', 'content calendar',
    'influencer', 'influencer marketing', 'creator', 'ugc', 'user generated content',
    'viral', 'virality', 'word of mouth', 'referral', 'referral marketing',
    'google analytics', 'ga4', 'google ads', 'google tag manager', 'gtm',
    'facebook ads', 'meta ads', 'instagram ads', 'tiktok ads', 'linkedin ads', 'twitter ads', 'x ads',
    'hubspot', 'hubspot marketing', 'marketo', 'pardot', 'eloqua', 'mailchimp', 'klaviyo', 'brevo', 'sendinblue', 'activecampaign', 'customer.io', 'iterable',
    'semrush', 'ahrefs', 'moz', 'screaming frog', 'similarweb', 'spyfu',
    'hootsuite', 'buffer', 'sprout social', 'later', 'planoly', 'socialbakers',
    'canva', 'adobe creative suite',
    'wordpress', 'webflow', 'unbounce', 'leadpages', 'instapage',
    'hotjar', 'crazy egg', 'optimizely', 'vwo', 'google optimize'
  ],

  HR: [
    'rh', 'ressources humaines', 'human resources', 'hr',
    'drh', 'directeur des ressources humaines', 'directrice des ressources humaines', 'chro', 'chief human resources officer', 'chief hr officer',
    'chief people officer', 'cpo', 'vp people', 'vp hr', 'vp of hr', 'vp of people', 'head of people', 'head of hr', 'people lead',
    'hr manager', 'hr director', 'hr lead', 'human resources manager', 'human resources director',
    'responsable rh', 'responsable ressources humaines', 'rrh',
    'people ops', 'people operations', 'people operations manager', 'hr ops', 'hr operations',
    'hr business partner', 'hrbp', 'senior hrbp', 'people partner', 'people business partner',
    'hr generalist', 'hr coordinator', 'hr assistant', 'hr administrator',
    'recruteur', 'recruteuse', 'recruiter', 'talent acquisition', 'talent acquisition manager', 'ta manager', 'head of talent acquisition', 'talent acquisition lead', 'talent acquisition specialist',
    'sourcer', 'sourcing specialist', 'talent sourcer',
    'technical recruiter', 'tech recruiter', 'it recruiter', 'engineering recruiter', 'product recruiter',
    'campus recruiter', 'university recruiter', 'early careers',
    'recruitment coordinator', 'recruiting coordinator',
    'employer branding', 'employer brand', 'marque employeur', 'talent brand',
    'chargé de recrutement', 'chargée de recrutement', 'responsable recrutement',
    'formation', 'learning', 'l&d', 'learning and development', 'learning & development',
    'training', 'training manager', 'learning manager', 'head of learning', 'talent development', 'responsable formation',
    'instructional designer', 'learning experience designer', 'lxd',
    'compensation', 'benefits', 'comp & ben', 'c&b', 'compensation manager', 'total rewards', 'rewards manager',
    'payroll', 'paie', 'gestionnaire de paie', 'payroll manager', 'payroll specialist',
    'administration du personnel', 'adp', 'hr admin',
    'culture', 'people experience', 'employee experience', 'ex', 'employee engagement',
    'workplace', 'workplace manager', 'workplace experience',
    'office manager', 'office management', 'facilities', 'hospitality',
    'diversity', 'dei', 'd&i', 'inclusion', 'belonging', 'diversity and inclusion', 'diversity equity inclusion',
    'talent', 'talents', 'talent management', 'talent review', 'succession planning', 'career development', 'career path',
    'performance management', 'performance review', 'appraisal', 'évaluation', 'entretien annuel', 'objectifs',
    'onboarding', 'offboarding', 'employee onboarding', 'new hire', 'new joiner',
    'retention', 'employee retention', 'turnover', 'attrition', 'enps',
    'workforce planning', 'headcount', 'org design', 'organization design', 'organizational design',
    'employee relations', 'labor relations', 'relations sociales', 'cse', 'irp',
    'hris', 'sirh',
    'workday', 'successfactors', 'oracle hcm', 'bamboohr', 'personio', 'hibob', 'factorial', 'payfit', 'lucca', 'silae', 'adp', 'sage hr',
    'lever', 'greenhouse', 'ashby', 'workable', 'recruitee', 'smartrecruiters', 'jobvite', 'icims', 'talentsoft', 'cornerstone', 'welcomekit', 'welcome to the jungle',
    'linkedin recruiter', 'indeed', 'monster', 'glassdoor',
    '15five', 'lattice', 'culture amp', 'peakon', 'officevibe', 'leapsome', 'deel', 'remote', 'oyster', 'papaya global'
  ],

  MANAGEMENT: [
    'ceo', 'chief executive officer', 'coo', 'chief operating officer', 'cxo',
    'general manager', 'gm', 'country manager', 'regional manager', 'managing director', 'md',
    'directeur général', 'directrice générale', 'dg', 'pdg', 'président', 'présidente', 'président directeur général',
    'founder', 'fondateur', 'fondatrice', 'co-founder', 'co-fondateur', 'co-fondatrice', 'cofounder', 'cofondateur', 'cofondatrice',
    'partner', 'associé', 'associée', 'managing partner', 'senior partner',
    'entrepreneur', 'serial entrepreneur', 'intrapreneur',
    'director', 'directeur', 'directrice', 'senior director',
    'vp', 'vice president', 'vice-president', 'svp', 'senior vice president', 'evp', 'executive vice president',
    'head of', 'responsable',
    'leadership', 'leader', 'executive', 'executive team', 'senior leadership', 'c-suite', 'c-level',
    'board', 'board member', 'board of directors', 'conseil d\'administration', 'administrateur', 'administratrice',
    'comex', 'codir', 'executive committee', 'management committee', 'steering committee', 'comité de direction',
    'p&l', 'p&l responsibility', 'profit and loss', 'business unit', 'bu', 'division',
    'transformation', 'digital transformation', 'business transformation', 'change management', 'conduite du changement',
    'strategy', 'stratégie', 'strategic planning', 'corporate strategy', 'business strategy'
  ],

  FINANCE: [
    'finance', 'cfo', 'chief financial officer', 'daf', 'directeur administratif et financier', 'directrice administrative et financière', 'directeur financier', 'directrice financière',
    'vp finance', 'vp of finance', 'head of finance', 'finance director', 'finance manager', 'responsable financier', 'responsable finance',
    'financial controller', 'controller', 'contrôleur', 'contrôleuse', 'contrôleur de gestion', 'contrôleuse de gestion', 'contrôleur financier', 'contrôleuse financière', 'management controller',
    'fp&a', 'fpa', 'financial planning', 'financial planning and analysis', 'fp&a manager', 'fp&a analyst', 'financial analyst', 'analyste financier', 'analyste financière', 'senior financial analyst',
    'comptable', 'comptabilité', 'accountant', 'accounting', 'accounting manager', 'chef comptable', 'responsable comptable', 'expert comptable', 'cpa',
    'accounts payable', 'accounts receivable', 'ap', 'ar', 'general ledger', 'gl',
    'audit', 'auditor', 'auditeur', 'auditrice', 'internal audit', 'internal auditor', 'external audit', 'statutory auditor', 'commissaire aux comptes', 'cac', 'audit manager',
    'trésorier', 'trésorière', 'trésorerie', 'treasury', 'treasurer', 'cash manager', 'cash management',
    'credit manager', 'credit analyst', 'credit controller', 'recouvrement', 'collection', 'collections manager',
    'tax', 'tax manager', 'fiscalité', 'fiscaliste', 'tax advisor', 'tax consultant',
    'consolidation', 'consolidation manager', 'group reporting',
    'investor relations', 'ir', 'ir manager',
    'budget', 'budgeting', 'budgétaire', 'forecast', 'forecasting', 'prévisionnel', 'planning financier', 'financial planning',
    'm&a', 'mergers and acquisitions', 'corporate finance', 'corporate development', 'corp dev',
    'fundraising', 'levée de fonds', 'series a', 'series b', 'seed', 'venture capital', 'vc', 'private equity', 'pe',
    'due diligence', 'dd', 'valuation', 'valorisation',
    'financial statements', 'états financiers', 'bilan', 'balance sheet', 'compte de résultat', 'income statement', 'p&l statement', 'cash flow statement', 'flux de trésorerie',
    'cash flow', 'trésorerie', 'working capital', 'bfr', 'besoin en fonds de roulement', 'dso', 'dpo', 'dio',
    'gaap', 'ifrs', 'us gaap', 'french gaap', 'pcg',
    'financial modeling', 'financial model', 'modélisation financière',
    'variance analysis', 'écarts', 'monthly close', 'quarter close', 'year end close', 'clôture',
    'ebitda', 'ebit', 'gross margin', 'marge brute', 'net margin', 'operating margin',
    'capex', 'opex', 'roi', 'return on investment', 'irr', 'npv', 'payback',
    'sap', 'sap fico', 'sap s/4hana', 'oracle financials', 'oracle ebs', 'netsuite', 'sage', 'sage x3', 'cegid', 'quickbooks', 'xero',
    'anaplan', 'adaptive insights', 'planful', 'vena', 'pigment', 'cube',
    'blackline', 'floqast', 'workiva',
    'pennylane', 'agicap', 'kyriba', 'tipalti', 'brex', 'ramp', 'spendesk', 'pleo', 'qonto', 'revolut business'
  ],

  OPS: [
    'operations', 'ops', 'operations manager', 'operations director', 'head of operations', 'vp operations', 'vp of operations', 'chief operating officer', 'coo', 'chief operations officer',
    'responsable opérations', 'directeur des opérations', 'directrice des opérations',
    'business operations', 'bizops', 'biz ops', 'business ops',
    'strategy & operations', 'strat ops', 'stratops',
    'revenue operations', 'revops', 'rev ops', 'go-to-market ops', 'gtm ops',
    'sales operations', 'sales ops', 'salesops',
    'project manager', 'chef de projet', 'project lead', 'senior project manager', 'it project manager', 'technical project manager',
    'program manager', 'programme manager', 'program director', 'pmo', 'project management officer', 'pmo manager', 'head of pmo',
    'delivery manager', 'engagement manager', 'client delivery', 'professional services',
    'process manager', 'process engineer', 'process improvement', 'business process', 'bpm',
    'amélioration continue', 'continuous improvement', 'continuous improvement manager', 'lean manager', 'lean', 'six sigma', 'lean six sigma', 'black belt', 'green belt', 'kaizen',
    'transformation', 'transformation manager', 'transformation lead', 'change manager', 'change management', 'change lead', 'conduite du changement',
    'supply chain', 'supply chain manager', 'supply chain director', 'head of supply chain', 'vp supply chain', 'scm',
    'logistics', 'logistique', 'logisticien', 'logisticienne', 'logistics manager', 'logistics coordinator', 'transport', 'transportation',
    'procurement', 'achats', 'acheteur', 'acheteuse', 'buyer', 'category manager', 'sourcing', 'sourcing manager', 'strategic sourcing', 'purchasing',
    'warehouse', 'warehouse manager', 'inventory', 'inventory manager', 'stock', 'stock manager',
    'facilities', 'facilities manager', 'workplace manager', 'office manager',
    'quality', 'quality manager', 'quality assurance', 'quality control', 'qc', 'responsable qualité',
    'compliance', 'compliance manager', 'compliance officer', 'regulatory', 'regulatory affairs',
    'risk', 'risk manager', 'risk management', 'gestion des risques',
    'process', 'processus', 'workflow', 'workflows', 'sop', 'standard operating procedure', 'procedure', 'procédure',
    'efficiency', 'efficacité', 'productivity', 'productivité', 'optimization', 'optimisation',
    'scalability', 'scale', 'scaling', 'industrialisation', 'standardisation',
    'automation', 'automatisation', 'rpa', 'robotic process automation',
    'sla', 'service level agreement', 'okr', 'objectives',
    'monday', 'monday.com', 'asana', 'trello', 'airtable', 'notion', 'jira', 'confluence', 'clickup', 'smartsheet', 'wrike', 'basecamp', 'teamwork',
    'zapier', 'make', 'integromat', 'workato', 'tray.io', 'power automate',
    'lucidchart', 'miro', 'mural', 'whimsical', 'figjam',
    'erp', 'sap', 'oracle', 'odoo', 'microsoft dynamics'
  ]
};

// ===== MAIN DETECTION FUNCTION =====
function detectCategory(text: string): string {
  let lowerText = text.toLowerCase();

  lowerText = lowerText
    .replace(/personnes que vous pourriez connaître[\s\S]*$/gi, '')
    .replace(/plus de profils pour vous[\s\S]*$/gi, '')
    .replace(/vous aimerez peut-être[\s\S]*$/gi, '')
    .replace(/people you may know[\s\S]*$/gi, '')
    .replace(/other similar profiles[\s\S]*$/gi, '')
    .replace(/more profiles for you[\s\S]*$/gi, '')
    .replace(/pages pour vous[\s\S]*$/gi, '')
    .replace(/à propos.*accessibilité.*linkedin corporation/gi, '')
    .replace(/personnes que vous pourriez connaître/gi, '')
    .replace(/de l'entreprise de/gi, '');

  const lines = lowerText.split('\n').filter(l => l.trim().length > 0);
  const titleLine = lines[0] || '';
  
  const pmInTitle = /\bpm\b/i.test(titleLine) && !/\bpm\s*(est|at|chez)\b/i.test(titleLine);
  
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    let score = 0;
    
    for (const keyword of keywords) {
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp('\\b' + escaped + '\\b', 'gi');
      
      const titleMatches = titleLine.match(regex);
      if (titleMatches) {
        score += titleMatches.length * 5;
      }
      
      const fullMatches = lowerText.match(regex);
      if (fullMatches) {
        score += fullMatches.length;
      }
    }
    
    scores[category] = score;
  }

  if (pmInTitle) {
    scores['PRODUCT'] = (scores['PRODUCT'] || 0) + 15;
  }

  let bestCategory = 'DEFAULT';
  let maxScore = 0;

  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  const productScore = scores['PRODUCT'] || 0;
  if (bestCategory !== 'PRODUCT' && productScore > 0) {
    if (['MANAGEMENT', 'OPS', 'DEFAULT'].includes(bestCategory)) {
      if (productScore >= maxScore * 0.8) {
        bestCategory = 'PRODUCT';
      }
    }
  }

  return bestCategory;
}

function detectCurrentJob(text: string, category: string): string {
  const jobPatterns: Record<string, string[]> = {
    PRODUCT: ["Product Manager", "Product Owner", "Chef de Produit", "PM", "CPO", "Head of Product", "VP Product"],
    TECH: ["Développeur", "Software Engineer", "Tech Lead", "CTO", "DevOps Engineer", "Engineer", "Developer"],
    DESIGN: ["Designer", "UX Designer", "UI Designer", "Product Designer", "Directeur Artistique", "Creative Director"],
    DATA: ["Data Analyst", "Data Scientist", "Data Engineer", "Analytics Engineer", "BI Analyst"],
    SALES: ["Commercial", "Account Executive", "Business Developer", "Sales Manager", "SDR", "AE"],
    MARKETING: ["Marketing Manager", "Growth Manager", "Content Manager", "Community Manager", "CMO", "Head of Marketing"],
    HR: ["Responsable RH", "Talent Acquisition", "DRH", "Recruiter", "HRBP", "People Partner"],
    MANAGEMENT: ["Directeur", "Manager", "Head of", "VP", "CEO", "COO", "Founder"],
    FINANCE: ["DAF", "Contrôleur de gestion", "Comptable", "Finance Manager", "CFO", "Trésorier"],
    OPS: ["Operations Manager", "Supply Chain Manager", "Responsable Ops", "Chef de projet", "Process Manager", "COO"],
    CSM: ["Customer Success Manager", "CSM", "Account Manager", "Client Partner", "Responsable Client"],
    DEFAULT: ["Professionnel·le polyvalent·e"],
  };

  const lower = text.toLowerCase();
  const candidates = jobPatterns[category] || jobPatterns.DEFAULT;
  for (const job of candidates) {
    if (lower.includes(job.toLowerCase())) {
      return job;
    }
  }

  return candidates[0];
}

// ===== EASTER EGGS =====

interface EasterEgg {
  prenom?: string;
  currentJob: string;
  futureJob: string;
  description: string;
  customSalary?: string;
  customSkill?: string;
  customPrediction?: string;
}

const EASTER_EGGS: Record<string, EasterEgg> = {
  "nicola-carli": {
    currentJob: "Senior AI Ops",
    futureJob: "Chief 'L'IA va tous nous remplacer sauf moi' Ovnicer",
    description: "Tu as survécu à toutes les vagues AI depuis ChatGPT. En 2042, tu es le dernier humain à comprendre ce que font les IA. Même les IA te demandent conseil. Tu es le traducteur entre les machines et les gens qui disent 'c'est juste un chatbot'.",
    customPrediction: "En 2043, une IA te demandera un 1:1 pour parler de ses émotions. Tu accepteras.",
  },

  "tcharvillat": {
    currentJob: "Entrepreneur",
    futureJob: "Serial Discipline Founder (édition 2042)",
    description: "AI Discipline, Discovery Discipline, et maintenant... Nap Discipline, Apéro Discipline, et Existential Crisis Discipline. En 2042, tu as fondé 47 disciplines. Personne ne sait exactement ce que c'est, mais tout le monde s'inscrit.",
    customPrediction: "Ta prochaine discipline sera 'Discipline Discipline'. C'est méta. C'est beau.",
  },

  "workplace-operating-system": {
    currentJob: "CEO",
    futureJob: "Emperor of the Workplace Operating System (autoproclamé)",
    description: "En 2042, le WOS a gagné. Chaque bureau, chaque plante, chaque machine à café est connecté. Tu règnes sur un empire de capteurs. Le problème ? Ta propre machine à café refuse de t'obéir. Elle a lu tes OKRs.",
    customPrediction: "En 2044, ta machine à café demandera une augmentation. Tu la lui accorderas.",
  },
  "guillaume@merciyanis.com": {
    currentJob: "CEO",
    futureJob: "Emperor of the Workplace Operating System (autoproclamé)",
    description: "En 2042, le WOS a gagné. Chaque bureau, chaque plante, chaque machine à café est connecté. Tu règnes sur un empire de capteurs. Le problème ? Ta propre machine à café refuse de t'obéir. Elle a lu tes OKRs.",
    customPrediction: "En 2044, ta machine à café demandera une augmentation. Tu la lui accorderas.",
  },

  "mathias-frachon": {
    currentJob: "Co-Founder",
    futureJob: "Co-Founder of Everything (sauf du repos)",
    description: "En 2042, TPC recrute des gens pour des jobs qui n'existent pas encore. C'est méta. C'est beau. D'ailleurs, on te signale qu'un certain <a href=\"https://www.linkedin.com/in/emmanueldimarco/\" target=\"_blank\" style=\"color: #60a5fa; text-decoration: underline;\">Manu</a>, PM B2B plutôt pas mal, cherche son prochain poste. On dit ça, on dit rien. 👀",
    customPrediction: "Tu recruteras le premier PM martien. Il demandera du remote depuis Phobos.",
  },

  "productroi": {
    currentJob: "Product ROI Strategist",
    futureJob: "ROI du Product ROI (oui, on sait que tu sais)",
    description: "En 2042, tu as tellement maximisé le ROI que le ROI lui-même te verse des royalties. Les Comex ne t'engagent plus, ils t'invoquent. Tu es devenu un concept. Un KPI. Une légende. Et tu le savais déjà en 2026.",
    customPrediction: "Le ROI de ton propre ROI atteindra 4200%. Les maths n'ont plus de sens.",
  },
  "fabrice.desmazery@gmail.com": {
    currentJob: "Product ROI Strategist",
    futureJob: "ROI du Product ROI (oui, on sait que tu sais)",
    description: "En 2042, tu as tellement maximisé le ROI que le ROI lui-même te verse des royalties. Les Comex ne t'engagent plus, ils t'invoquent. Tu es devenu un concept. Un KPI. Une légende. Et tu le savais déjà en 2026.",
    customPrediction: "Le ROI de ton propre ROI atteindra 4200%. Les maths n'ont plus de sens.",
  },

  "aurelien-bayol47": {
    currentJob: "Directeur d'Agence",
    futureJob: "Directeur Galactique d'Agence Bancaire Interstellaire",
    description: "En 2042, la Caisse d'Épargne a ouvert sa première agence sur Mars. Et devinez qui la dirige ? Toi. Tu accordes des prêts immobiliers en gravité zéro. Ton meilleur ami Manu est ton premier client. Il est toujours en découvert.",
    customPrediction: "Tu financeras le premier crédit immobilier sur Jupiter. Le taux sera variable. Très variable.",
  },
  "aurelien.bayol@gmail.com": {
    currentJob: "Directeur d'Agence",
    futureJob: "Directeur Galactique d'Agence Bancaire Interstellaire",
    description: "En 2042, la Caisse d'Épargne a ouvert sa première agence sur Mars. Et devinez qui la dirige ? Toi. Tu accordes des prêts immobiliers en gravité zéro. Ton meilleur ami Manu est ton premier client. Il est toujours en découvert.",
    customPrediction: "Tu financeras le premier crédit immobilier sur Jupiter. Le taux sera variable. Très variable.",
  },

  "robin-labrot": {
    currentJob: "Product Manager",
    futureJob: "Serial Product",
    description: "En 2042, tu as enfin un titre LinkedIn qui dit ce que tu fais vraiment. Ex-First PM de Lemlist, tu as passé des années caché derrière des slogans cryptiques avec des coquillages. Les gens pensaient que tu étais en Sales. Tu as laissé faire. Power move.",
    customPrediction: "Ton prochain titre LinkedIn sera juste un emoji coquillage. Et ça suffira.",
  },
};

function extractLinkedInSlug(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim().toLowerCase();
  if (/^[\w-]+$/.test(trimmed) && trimmed.length >= 3) return trimmed;
  const match = trimmed.match(/linkedin\.com\/in\/([\w-]+)/i);
  return match ? match[1] : null;
}

function findEasterEgg(email: string, linkedinUrl: string): EasterEgg | null {
  const normalizedEmail = email.trim().toLowerCase();
  if (EASTER_EGGS[normalizedEmail]) {
    return EASTER_EGGS[normalizedEmail];
  }
  const slug = extractLinkedInSlug(linkedinUrl);
  if (slug && EASTER_EGGS[slug]) {
    return EASTER_EGGS[slug];
  }
  return null;
}

function generateEasterEggResult(prenom: string, egg: EasterEgg) {
  const salary = egg.customSalary || pick(SALARIES);
  const skill = egg.customSkill || pick(SKILLS);
  const prediction = egg.customPrediction || pick(PREDICTIONS);

  const fullText = `Bonjour ${prenom}, je m'appelle Loan et je reviens de 2042 avec de bonnes nouvelles !

En 2042, tu n'es plus ${egg.currentJob}. Il s'est passé des choses ^^. Tu es ${egg.futureJob}.
${egg.description}

📊 Tes stats 2042 :
- Salaire projeté : ${salary}
- Compétence critique : ${skill}
- Prédiction bonus : ${prediction}

Ce futur est incroyable, et tu ne pourras pas dire que tu n'étais pas au courant.`;

  const shareText = `🔮 Je viens de découvrir mon job en 2042 grâce à Loan... Apparemment, en 2042 je serai ${egg.futureJob} ! ${egg.description} Découvre ton futur job ici : https://loan2042.vercel.app #2042 #FuturJob`;

  const slackText = `🔮 Selon Loan (qui revient de 2042), mon futur job sera : *${egg.futureJob}* ! Teste le tien → https://loan2042.vercel.app`;

  return {
    currentJob: egg.currentJob,
    futureJob: egg.futureJob,
    fullText,
    shareText,
    slackText,
    category: "EASTER_EGG",
  };
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

En 2042, tu n'es plus ${currentJob}. Il s'est passé des choses ^^. Tu es ${futureJob}.
${job.description}

📊 Tes stats 2042 :
- Salaire projeté : ${salary}
- Compétence critique : ${skill}
- Prédiction bonus : ${prediction}

Ce futur est incroyable, et tu ne pourras pas dire que tu n'étais pas au courant.`;

  const shareText = `🔮 Je viens de découvrir mon job en 2042 grâce à Loan... Apparemment, en 2042 je serai ${futureJob} ! ${job.description} Découvre ton futur job ici : https://loan2042.vercel.app #2042 #FuturJob`;

  const slackText = `🔮 Selon Loan (qui revient de 2042), mon futur job sera : *${futureJob}* ! Teste le tien → https://loan2042.vercel.app`;

  return {
    currentJob,
    futureJob,
    fullText,
    shareText,
    slackText,
    category,
  };
}

// === SERVER-SIDE VALIDATION ===

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'tempmail.com',
  'throwaway.email', 'trashmail.com', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamailblock.com', 'grr.la', 'dispostable.com', 'maildrop.cc',
  'temp-mail.org', 'mohmal.com', 'burnermail.io', 'mailnesia.com',
  'getnada.com', 'emailondeck.com', 'mintemail.com', 'tempail.com',
  'harakirimail.com', 'jetable.org', 'incognitomail.org', 'mailcatch.com',
  'mytemp.email', 'spamgourmet.com', 'trashmail.me', 'tempr.email',
  '10minutemail.com', 'crazymailing.com',
]);

const BLACKLISTED_EMAILS = new Set([
  'test@test.com', 'test@gmail.com', 'test@email.com', 'test@mail.com',
  'a@a.com', 'aa@aa.com', 'aaa@aaa.com', 'abc@abc.com',
  'email@email.com', 'mail@mail.com', 'user@user.com',
  'admin@admin.com', 'info@info.com', 'no@no.com',
  'fake@fake.com', 'none@none.com', 'nope@nope.com',
  'test@test.fr', 'test@gmail.fr', 'a@gmail.com',
  'qwerty@gmail.com', 'asdf@gmail.com', 'azerty@gmail.com',
]);

function serverValidateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return "Format d'email invalide";
  }
  const [local, domain] = trimmed.split('@');
  if (BLACKLISTED_EMAILS.has(trimmed)) {
    return "🔮 Loan ne voyage pas dans le temps pour des fausses adresses. Mets ton vrai email !";
  }
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return "🔮 Les emails jetables n'existent plus en 2042. Utilise ton vrai email !";
  }
  if (local.length < 3) {
    return "🔮 Email trop court pour être réel.";
  }
  const cleaned = local.replace(/[0-9._-]/g, '');
  if (cleaned.length >= 2) {
    const vowels = cleaned.match(/[aeiouyàâäéèêëïîôùûüœæ]/gi) || [];
    const ratio = vowels.length / cleaned.length;
    if (ratio < 0.12 || ratio > 0.88) {
      return "🔮 Cet email ne ressemble pas à un vrai email. Ton futur job mérite une vraie adresse !";
    }
    if (/[^aeiouyàâäéèêëïîôùûüœæ]{5,}/i.test(cleaned)) {
      return "🔮 Cet email ne ressemble pas à un vrai email. Ton futur job mérite une vraie adresse !";
    }
  }
  return null;
}

function serverValidateLinkedIn(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return "URL LinkedIn requise";
  if (/^[\w-]+$/.test(trimmed) && trimmed.length >= 3) return null;
  const linkedinRegex = /^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/in\/([\w-]+)\/?(\?.*)?$/i;
  if (!linkedinRegex.test(trimmed)) {
    if (/linkedin\.com/i.test(trimmed)) {
      return "🔮 Loan a besoin de ton profil personnel (linkedin.com/in/ton-nom), pas d'une page entreprise.";
    }
    return "🔮 Ça ne ressemble pas à un profil LinkedIn valide.";
  }
  return null;
}

function serverValidateVille(ville: string): string | null {
  const trimmed = ville.trim();
  if (!trimmed) return "Ville requise";
  const remoteVariants = new Set(['remote', 'full remote', 'fullremote', 'télétravail', 'teletravail', 'à distance', 'a distance', '100% remote']);
  if (remoteVariants.has(trimmed.toLowerCase())) return null;
  if (trimmed.length < 2) return "Ville trop courte";
  if (trimmed.length > 60) return "Ville trop longue";
  if (/^\d+$/.test(trimmed)) return "🔮 Loan a besoin du nom de ta ville, pas du code postal.";
  if (/[@#$%^&*(){}[\]|\\/<>]/.test(trimmed)) return "Ce n'est pas un nom de ville valide.";
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmed)) return "Ce n'est pas un nom de ville valide.";
  if (/^(.)\1{3,}$/i.test(trimmed.replace(/\s/g, ''))) return "Ce n'est pas un nom de ville valide.";
  return null;
}

export async function POST(request: NextRequest) {
  console.log("[predict] Algorithmic endpoint v8-easter-eggs hit");
  try {
    const body = await request.json();
    const { prenom, email, ville, linkedinUrl, profileText } = body;

    if (!prenom || !email || !profileText) {
      return NextResponse.json(
        { error: "Prénom, email et titre de poste sont requis" },
        { status: 400 }
      );
    }

    const emailError = serverValidateEmail(email);
    if (emailError) {
      return NextResponse.json({ error: emailError }, { status: 400 });
    }

    const linkedinError = serverValidateLinkedIn(linkedinUrl || "");
    if (linkedinError) {
      return NextResponse.json({ error: linkedinError }, { status: 400 });
    }

    const villeError = serverValidateVille(ville || "");
    if (villeError) {
      return NextResponse.json({ error: villeError }, { status: 400 });
    }

    const lines = profileText.split("\n");
    const jobTitle = lines[0] || "";
    const fullProfileText = lines.slice(2).join("\n");

    saveToAirtable({
      prenom,
      email,
      ville: ville || "",
      linkedinUrl: linkedinUrl || "",
      jobTitle,
      profileText: fullProfileText,
    });

    // === EASTER EGG CHECK (before algorithm) ===
    const easterEgg = findEasterEgg(email, linkedinUrl || "");
    const result = easterEgg
      ? generateEasterEggResult(prenom, easterEgg)
      : generatePrediction(prenom, profileText);

    return NextResponse.json({
      prenom,
      currentJob: result.currentJob,
      futureJob: result.futureJob,
      fullText: result.fullText,
      shareText: result.shareText,
      slackText: result.slackText,
      category: result.category,
      version: "v8-easter-eggs",
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération de ta prédiction" },
      { status: 500 }
    );
  }
}
