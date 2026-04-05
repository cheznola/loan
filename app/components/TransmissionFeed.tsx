'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

// ============================================
// CONFIGURATION
// ============================================

// Date de lancement - à ajuster quand tu lances vraiment
const LAUNCH_DATE = new Date('2026-04-03T14:00:00+02:00');

// Logs pré-écrits par catégorie - DRÔLES et CIBLÉS
const FAKE_TRANSMISSIONS: Array<{
  prenom: string;
  job: string;
  comment: string;
  isMeta?: boolean;
}> = [
  // === META - MAKING OF (apparaît de temps en temps) ===
  { prenom: 'Manu', job: 'Créateur de Loan', comment: 'a documenté tout le process →', isMeta: true },

  // === PRODUCT (TA CIBLE PRINCIPALE) ===
  { prenom: 'Sophie', job: 'Professional Overthinker (lvl 4)', comment: 'Elle analyse encore si elle devait analyser.' },
  { prenom: 'Antoine', job: 'Chief Je-Te-L\'Avais-Dit Officer', comment: 'On lui a dit. Il a dit "je le savais".' },
  { prenom: 'Camille', job: 'Backlog Grief Counselor', comment: 'RIP ticket #4521. Tu méritais mieux.' },
  { prenom: 'Julien', job: 'Scope Creep Defender', comment: 'Il a dit non en 47 langues. Ça a marché.' },
  { prenom: 'Marie', job: 'Roadmap Fiction Writer', comment: 'Sa roadmap Q3 est optionnée par Netflix.' },
  { prenom: 'Lucas', job: 'Discovery Procrastinator', comment: 'Il fera les interviews utilisateurs. Un jour.' },
  { prenom: 'Emma', job: 'Stakeholder Whisperer', comment: 'Le CEO a dit oui. Elle ne sait pas comment.' },
  { prenom: 'Hugo', job: 'OKR Archaeologist', comment: 'Il a retrouvé les OKRs de 2019. Personne ne les avait atteints.' },
  { prenom: 'Léa', job: 'Sprint Retro Therapist', comment: 'Elle soigne les équipes une retro à la fois.' },
  { prenom: 'Mathis', job: 'Feature Request Diplomat', comment: 'Il dit non avec tant d\'amour qu\'on le remercie.' },

  // === TECH ===
  { prenom: 'Thomas', job: 'Lead "Ça marchait en local"', comment: 'La prod, c\'est un concept philosophique.' },
  { prenom: 'Maxime', job: 'VP of Ctrl+Z', comment: 'Sans lui, tout serait en prod. Tout.' },
  { prenom: 'Chloé', job: 'Legacy Code Exorcist', comment: 'Ce PHP de 2008 lui parle encore la nuit.' },
  { prenom: 'Nicolas', job: 'Merge Conflict Therapist', comment: 'Develop et main se reparlent enfin.' },
  { prenom: 'Sarah', job: 'Prod Incident Narrator', comment: 'Son post-mortem du 15 mars a été nominé aux Oscars.' },
  { prenom: 'Romain', job: 'Stack Overflow Historian', comment: 'Il cite des réponses de 2015 comme des textes sacrés.' },
  { prenom: 'Pauline', job: 'Console.log Sommelier', comment: 'Elle debug au feeling. Et ça marche.' },
  { prenom: 'Adrien', job: 'Git Blame Detective', comment: 'Il sait qui a écrit cette ligne. Toujours.' },

  // === DESIGN ===
  { prenom: 'Manon', job: 'Chief Pixel Perfectionist (en rémission)', comment: 'Le padding l\'appelle encore la nuit.' },
  { prenom: 'Alexandre', job: 'Figma Archaeologist', comment: 'Frame 427 (copy) (copy) final FINAL (2).' },
  { prenom: 'Julie', job: 'User Empathy Method Actor', comment: 'Elle a vécu 3 semaines comme comptable à Limoges.' },
  { prenom: 'Théo', job: 'Design System Librarian', comment: 'Il a banni quelqu\'un pour un bouton custom.' },
  { prenom: 'Laura', job: 'Feedback Digest Specialist', comment: 'Elle traduit "c\'est bizarre" en insights.' },
  { prenom: 'Clément', job: 'Whitespace Philosopher', comment: 'Le vide a du sens. Beaucoup de sens.' },
  { prenom: 'Inès', job: 'Dark Mode Evangelist', comment: 'Elle a converti 47 apps. Sa croisade continue.' },
  { prenom: 'Pierre', job: 'Auto-Layout Evangelist', comment: 'Il prêche la contrainte. Figma est son temple.' },

  // === DATA ===
  { prenom: 'Clara', job: 'Dashboard Poet', comment: 'Son KPI Q4 a fait pleurer le board.' },
  { prenom: 'Mathieu', job: 'Metric Manipulation Detective', comment: 'Il sait quand un NPS ment.' },
  { prenom: 'Anaïs', job: 'Spreadsheet Archaeologist', comment: 'Ce VLOOKUP de 2019 est son Graal.' },
  { prenom: 'Bastien', job: 'Data Storytelling Bard', comment: 'Son reporting sera adapté en comédie musicale.' },
  { prenom: 'Margot', job: 'SQL Whisperer', comment: 'Les requêtes lui parlent. Il répond.' },
  { prenom: 'Florian', job: 'Correlation Skeptic', comment: 'Corrélation n\'est pas causalité. Jamais.' },
  { prenom: 'Océane', job: 'Data Lake Lifeguard', comment: 'Elle sauve les données qui se noient.' },

  // === SALES ===
  { prenom: 'Alexis', job: 'Chief "Je reviens vers toi" Officer', comment: 'Il relance depuis 17 ans. Le prospect a signé.' },
  { prenom: 'Mélanie', job: 'Pipeline Fantasy Writer', comment: 'Ses forecasts sont optionnés par Disney+.' },
  { prenom: 'Quentin', job: 'Demo Improvisation Artist', comment: 'Le bug en démo ? C\'est une feature.' },
  { prenom: 'Amandine', job: 'Churn Whisperer', comment: 'Elle entend les clients partir avant eux.' },
  { prenom: 'Kévin', job: 'Cold Email Poet', comment: 'Son objet de mail a 47% d\'open rate.' },
  { prenom: 'Charlotte', job: 'Objection Aikido Master', comment: '"C\'est trop cher" devient "parlons valeur".' },
  { prenom: 'Dylan', job: 'LinkedIn Stalker Pro', comment: 'Il sait tout de toi avant le call.' },

  // === CSM ===
  { prenom: 'Céline', job: 'Onboarding Experience Designer', comment: 'Ses clients pleurent de joie au jour 7.' },
  { prenom: 'Guillaume', job: 'NPS Emotion Analyst', comment: 'Un 7 n\'est pas un 7. Il sait.' },
  { prenom: 'Aurélie', job: 'QBR Drama Director', comment: 'Le CFO a pleuré au Q2. De joie.' },
  { prenom: 'Fabien', job: 'Client Success Therapist', comment: 'Le support devient développement personnel.' },
  { prenom: 'Lucie', job: 'Adoption Choreographer', comment: 'L\'adoption produit est un ballet.' },
  { prenom: 'Thibault', job: 'Health Score Astrologer', comment: 'Mercure rétrograde = churn incoming.' },

  // === MANAGEMENT ===
  { prenom: 'Stéphane', job: 'Meeting Escape Artist', comment: 'Il a toujours un autre call. TOUJOURS.' },
  { prenom: 'Virginie', job: 'Alignment Illusionist', comment: 'Tout le monde est d\'accord. Sur quoi ? Mystère.' },
  { prenom: 'François', job: 'Delegation Architect', comment: 'Il ne fait rien. Et c\'est un art.' },
  { prenom: 'Sandrine', job: 'One-on-One Sommelier', comment: 'Ses 1:1 sont des accords parfaits.' },
  { prenom: 'Patrick', job: 'Manager of Managed Chaos', comment: 'Tout brûle. Mais c\'est prévu.' },
  { prenom: 'Isabelle', job: 'Calendar Tetris Champion', comment: 'Elle a casé 47 meetings en 8 heures.' },
  { prenom: 'Olivier', job: 'Strategic Ambiguity Officer', comment: 'Ses memos sont si vagues que chacun y voit ce qu\'il veut.' },

  // === HR ===
  { prenom: 'Élise', job: 'Director of Uncomfortable Conversations', comment: 'Le feedback difficile ? Son cardio.' },
  { prenom: 'Benoît', job: 'Chief Vibes Officer', comment: 'Il SENT quand l\'équipe va mal.' },
  { prenom: 'Marion', job: 'Exit Interview Therapist', comment: 'Les gens lui parlent. Vraiment.' },
  { prenom: 'Jérôme', job: 'Culture Compiler', comment: 'Il traduit "bienveillance" en actions.' },
  { prenom: 'Audrey', job: 'Offboarding Experience Designer', comment: 'Ses pots de départ sont légendaires.' },
  { prenom: 'Damien', job: 'Perks Inflation Specialist', comment: 'Il a inventé le "congé introspection".' },

  // === MARKETING ===
  { prenom: 'Ophélie', job: 'Corporate Poetry Writer', comment: 'Elle transforme les licenciements en "synergies".' },
  { prenom: 'Raphaël', job: 'Attention Economist', comment: 'Chaque scroll est optimisé. Chaque.' },
  { prenom: 'Justine', job: 'Viral Load Balancer', comment: 'Elle gère le buzz comme des serveurs.' },
  { prenom: 'Valentin', job: 'Growth Mythology Creator', comment: 'Son case study est un récit héroïque.' },
  { prenom: 'Émilie', job: 'Hashtag Sommelier', comment: 'Notes de #growth, finale de #disruption.' },
  { prenom: 'Aurélien', job: 'Funnel Feng Shui Expert', comment: 'Il réaligne l\'énergie du funnel.' },

  // === FINANCE ===
  { prenom: 'Christophe', job: 'Budget Fiction Editor', comment: 'Ses projections sont du Tolkien.' },
  { prenom: 'Delphine', job: 'ROI Philosopher', comment: 'Qu\'est-ce que le "retour" ? Bonne question.' },
  { prenom: 'Grégory', job: 'Cash Flow Whisperer', comment: 'Il entend l\'argent couler.' },
  { prenom: 'Agathe', job: 'Expense Report Detective', comment: 'Ce restaurant n\'est pas un client.' },
  { prenom: 'Sylvain', job: 'Forecast Astrologer', comment: 'Ses prévisions sont basées sur les astres et Excel.' },

  // === OPS ===
  { prenom: 'Matthieu', job: 'Process Archaeologist', comment: '"Pourquoi on fait ça déjà ?" - Lui, toujours.' },
  { prenom: 'Caroline', job: 'Automation Grief Counselor', comment: 'Elle accompagne les jobs automatisés.' },
  { prenom: 'Jérémy', job: 'Documentation Evangelist', comment: 'Sans doc, pas de salut.' },
  { prenom: 'Morgane', job: 'Notion Architecture Lead', comment: 'Son workspace a 847 pages.' },
  { prenom: 'Anthony', job: 'Slack Channel Archivist', comment: 'Il sait quel channel est mort.' },
  { prenom: 'Vincent', job: 'JIRA Workflow Survivor', comment: 'Il a vu des statuts. Trop de statuts.' },

  // === FOUNDERS ===
  { prenom: 'Benjamin', job: 'Pivot Storyteller', comment: 'Ce n\'est pas un échec, c\'est une itération.' },
  { prenom: 'Marine', job: 'Runway Extension Artist', comment: '6 mois deviennent 18. Magie.' },
  { prenom: 'Solène', job: 'Investor Deck Novelist', comment: 'Son pitch deck fait 47 slides. Toutes essentielles.' },
  { prenom: 'Geoffrey', job: 'Vision Keeper', comment: 'La vision n\'a pas changé. Juste... évolué.' },
  { prenom: 'Nicolas', job: 'Board Meeting Actor', comment: 'Tout va bien. Vraiment. Vraiment.' },

  // === BONUS - EXTRA DRÔLES ===
  { prenom: 'Jean-Michel', job: 'Chief "Per My Last Email" Officer', comment: 'Il rappelle ce qu\'il a déjà dit. Avec précision.' },
  { prenom: 'Marie-Claire', job: 'Synergy Sommelier', comment: 'Notes de collaboration, finale de disruption.' },
  { prenom: 'Pierre-Antoine', job: 'Meeting About Meeting Scheduler', comment: 'Il prépare les meetings qui préparent les meetings.' },
  { prenom: 'Anne-Sophie', job: 'Deadline Fiction Writer', comment: 'Ses deadlines sont des suggestions créatives.' },
];

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export default function TransmissionFeed() {
  const [visibleLogs, setVisibleLogs] = useState<typeof FAKE_TRANSMISSIONS>([]);
  const [stats, setStats] = useState({ futurs: 0, overthinking: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const feedRef = useRef<HTMLDivElement>(null);

  // Calcul des stats basé sur le temps écoulé depuis le lancement
  useEffect(() => {
    const updateStats = () => {
      const now = new Date();
      setCurrentTime(now);
      const elapsed = Math.max(0, now.getTime() - LAUNCH_DATE.getTime());
      const hours = elapsed / (1000 * 60 * 60);
      
      // Progression réaliste mais impressionnante
      // Base : ~50 premiers utilisateurs les premières heures, puis accélération
      const baseFuturs = Math.floor(hours * 15 + Math.random() * 8);
      const overthinkingHours = Math.floor(hours * 4.2 + Math.random() * 3);
      
      setStats({
        futurs: Math.max(baseFuturs, 47), // Minimum 47 pour crédibilité
        overthinking: Math.max(overthinkingHours, 142), // En heures
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 15000); // Update toutes les 15s
    return () => clearInterval(interval);
  }, []);

  // Animation des logs
  useEffect(() => {
    // Shuffle les transmissions au démarrage, mais garde les meta moins fréquentes
    const regularLogs = FAKE_TRANSMISSIONS.filter(t => !t.isMeta);
    const metaLogs = FAKE_TRANSMISSIONS.filter(t => t.isMeta);
    
    // Insérer un meta log toutes les ~15 transmissions
    const shuffled: typeof FAKE_TRANSMISSIONS = [];
    const shuffledRegular = [...regularLogs].sort(() => Math.random() - 0.5);
    
    shuffledRegular.forEach((log, i) => {
      shuffled.push(log);
      // Insérer un meta log après chaque 15 transmissions
      if ((i + 1) % 3 === 0 && metaLogs.length > 0) {
        shuffled.push(metaLogs[Math.floor(Math.random() * metaLogs.length)]);
      }
    });
    
    let index = 0;
    const addLog = () => {
      const log = shuffled[index % shuffled.length];
      setVisibleLogs(prev => [log, ...prev].slice(0, 6)); // Garde les 6 derniers
      index++;
    };

    // Premier log immédiat
    addLog();
    
    // Nouveaux logs toutes les 3-5 secondes (aléatoire pour effet réaliste)
    const interval = setInterval(() => {
      addLog();
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll quand nouveau log
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [visibleLogs]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 mb-6 font-mono">
      {/* Header avec LIVE badge et stats */}
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 border border-red-500/20">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-red-500 text-xs font-semibold uppercase tracking-wider">Live</span>
        </div>
        <div className="flex gap-4 sm:gap-6">
          <div className="text-right">
            <div className="text-emerald-400 text-base sm:text-lg font-bold">{stats.futurs.toLocaleString()}</div>
            <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-wide">Futurs révélés</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-base sm:text-lg font-bold">{stats.overthinking.toLocaleString()}h</div>
            <div className="text-zinc-500 text-[9px] sm:text-[10px] uppercase tracking-wide">Overthinking évité</div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
        {/* Terminal header */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
          <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">
            Transmissions du futur
          </span>
          <span className="text-zinc-600 text-xs">
            {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
        
        {/* Terminal body */}
        <div ref={feedRef} className="p-4 max-h-[240px] overflow-y-auto">
          {visibleLogs.map((log, i) => (
            <div 
              key={`${log.prenom}-${i}`}
              className={`flex gap-2 py-2 border-b border-zinc-800/50 last:border-0 text-sm leading-relaxed transition-opacity duration-300 ${i === 0 ? 'opacity-100' : 'opacity-60'}`}
              style={{
                animation: i === 0 ? 'fadeSlideIn 0.4s ease-out' : 'none'
              }}
            >
              <span className="text-emerald-500 flex-shrink-0">&gt;</span>
              {log.isMeta ? (
                // Meta log - lien vers making-of
                <span className="text-emerald-300/90">
                  <span className="text-cyan-400">{log.prenom}</span>
                  {' '}({log.job}){' '}
                  <Link 
                    href="/making-of" 
                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                  >
                    {log.comment}
                  </Link>
                </span>
              ) : (
                // Log normal
                <span className="text-emerald-300/90">
                  <span className="text-amber-400">{log.prenom}</span>
                  {' '}sera{' '}
                  <span className="text-pink-400 italic">{log.job}</span>
                  .{' '}
                  <span className="text-emerald-300/60">{log.comment}</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
