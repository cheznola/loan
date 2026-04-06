// === VALIDATION UTILS FOR LOAN 2042 ===
// Messages d'erreur dans le ton de Loan (humour corporate, second degré)

// --- EMAIL VALIDATION ---

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'yopmail.com', 'guerrillamail.com', 'tempmail.com',
  'throwaway.email', 'trashmail.com', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamailblock.com', 'grr.la', 'dispostable.com', 'maildrop.cc',
  'temp-mail.org', 'mohmal.com', 'burnermail.io', 'mailnesia.com',
  'getnada.com', 'emailondeck.com', 'mintemail.com', 'tempail.com',
  'harakirimail.com', 'jetable.org', 'incognitomail.org', 'mailcatch.com',
  'mytemp.email', 'spamgourmet.com', 'trashmail.me', 'tempr.email',
  'tmail.com', '10minutemail.com', 'crazymailing.com',
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

function hasGibberishLocalPart(local: string): boolean {
  // Remove numbers and dots to analyze the "name" part
  const cleaned = local.replace(/[0-9._-]/g, '');
  if (cleaned.length < 2) return true;

  // Count vowels
  const vowels = cleaned.match(/[aeiouyàâäéèêëïîôùûüœæ]/gi) || [];
  const ratio = vowels.length / cleaned.length;

  // Real names/words have vowel ratio between 0.15 and 0.85
  // "fdjfdkjf" = 0 vowels → gibberish
  // "aaaaaa" = all vowels → also suspicious
  if (ratio < 0.12 || ratio > 0.88) return true;

  // Check for too many consecutive consonants (4+)
  if (/[^aeiouyàâäéèêëïîôùûüœæ]{5,}/i.test(cleaned)) return true;

  return false;
}

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim().toLowerCase();

  // Basic format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return {
      valid: false,
      error: "🔮 Loan a beau venir du futur, il ne reconnaît pas cette adresse email. Vérifie le format !",
    };
  }

  const [local, domain] = trimmed.split('@');

  // Blacklisted
  if (BLACKLISTED_EMAILS.has(trimmed)) {
    return {
      valid: false,
      error: "🔮 test@test.com ne marchera pas. Loan voyage dans le temps, pas dans les fausses adresses. Mets ton vrai email, promis on ne spamme pas (on vient du futur, on a mieux à faire).",
    };
  }

  // Disposable domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: "🔮 Loan a détecté un email jetable. En 2042, ces services n'existent plus (RIP). Utilise ton vrai email pour recevoir ta prédiction !",
    };
  }

  // Local part too short
  if (local.length < 3) {
    return {
      valid: false,
      error: "🔮 Un email de 2 lettres ? Même en 2042, c'est trop court. Loan a besoin de ton vrai email.",
    };
  }

  // Gibberish detection
  if (hasGibberishLocalPart(local)) {
    return {
      valid: false,
      error: "🔮 Loan a analysé cet email depuis 2042... et il ne ressemble pas à un vrai email. Ton futur job mérite une vraie adresse !",
    };
  }

  return { valid: true };
}


// --- LINKEDIN URL VALIDATION ---

export function validateLinkedInUrl(raw: string): ValidationResult & { cleaned?: string } {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { valid: false, error: "🔮 Loan a besoin de ton profil LinkedIn pour voyager dans le temps. Sans ça, il reste bloqué en 2042." };
  }

  // If user just pasted a slug like "emmanueldimarco", try to build the URL
  if (/^[\w-]+$/.test(trimmed) && trimmed.length >= 3) {
    return {
      valid: true,
      cleaned: `https://www.linkedin.com/in/${trimmed}`,
    };
  }

  // Normalize: accept various formats
  // linkedin.com/in/slug, www.linkedin.com/in/slug, https://linkedin.com/in/slug
  // Also handle trailing slashes, query params, locale paths
  const linkedinRegex = /^(https?:\/\/)?([\w-]+\.)?linkedin\.com\/in\/([\w-]+)\/?(\?.*)?$/i;
  const match = trimmed.match(linkedinRegex);

  if (!match) {
    // Check if it's a LinkedIn URL but wrong format (e.g. /company/ or /pub/)
    if (/linkedin\.com/i.test(trimmed)) {
      return {
        valid: false,
        error: "🔮 Loan reconnaît LinkedIn, mais il lui faut ton profil personnel (linkedin.com/in/ton-nom). Les pages entreprise ne voyagent pas dans le temps.",
      };
    }

    return {
      valid: false,
      error: "🔮 Ça ne ressemble pas à un profil LinkedIn. Loan a besoin d'un lien type linkedin.com/in/ton-nom pour calibrer le voyage temporel.",
    };
  }

  const slug = match[3];

  // Slug too short
  if (slug.length < 3) {
    return {
      valid: false,
      error: "🔮 Ce profil LinkedIn semble trop court. Vérifie l'URL et réessaie !",
    };
  }

  // Clean the URL (remove query params, normalize)
  const cleaned = `https://www.linkedin.com/in/${slug}`;

  return { valid: true, cleaned };
}


// --- VILLE VALIDATION ---

const REMOTE_VARIANTS = new Set([
  'remote', 'full remote', 'fullremote', 'télétravail', 'teletravail',
  'à distance', 'a distance', '100% remote', '100% télétravail',
]);

export function validateVille(ville: string): ValidationResult {
  const trimmed = ville.trim();

  if (!trimmed) {
    return { valid: false, error: "🔮 Loan a besoin de savoir d'où tu viens pour calculer ta trajectoire." };
  }

  // Accept Remote variants
  if (REMOTE_VARIANTS.has(trimmed.toLowerCase())) {
    return { valid: true };
  }

  // Too short (except 2-letter codes like "Eu" or "Ay" which are real French cities)
  if (trimmed.length < 2) {
    return {
      valid: false,
      error: "🔮 Une ville d'une lettre ? Même en 2042, ça n'existe pas encore.",
    };
  }

  // Too long
  if (trimmed.length > 60) {
    return {
      valid: false,
      error: "🔮 C'est une ville ou une dissertation ? Loan demande juste ta ville, pas ton code postal ni ton arrondissement.",
    };
  }

  // Only numbers
  if (/^\d+$/.test(trimmed)) {
    return {
      valid: false,
      error: "🔮 Loan a besoin du nom de ta ville, pas du code postal. En 2042, les codes postaux ont été remplacés par des coordonnées quantiques.",
    };
  }

  // Contains suspicious patterns (URLs, emails, code)
  if (/[@#$%^&*(){}[\]|\\/<>]/.test(trimmed)) {
    return {
      valid: false,
      error: "🔮 Ce n'est pas un nom de ville, ça. Loan a vérifié dans les archives de 2042 : aucune ville ne contient de caractères spéciaux.",
    };
  }

  // Only special chars / gibberish (no letters at all)
  if (!/[a-zA-ZÀ-ÿ]/.test(trimmed)) {
    return {
      valid: false,
      error: "🔮 Loan ne trouve aucune ville avec ce nom. Essaie quelque chose de plus... réel.",
    };
  }

  // Repeated single char like "aaaa" or "xxxxx"
  if (/^(.)\1{3,}$/i.test(trimmed.replace(/\s/g, ''))) {
    return {
      valid: false,
      error: "🔮 Loan apprécie la créativité, mais 'aaaaaa' n'est pas une ville. Pas encore.",
    };
  }

  return { valid: true };
}
