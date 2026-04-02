import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import pool from "@/lib/db";

const SYSTEM_PROMPT = `Tu es Loan, un personnage qui revient de 2042. Tu es drôle, bienveillant, et tu utilises l'humour corporate (Slack, meetings, backlog, retro, "on fait un point ?"). Tu es second-degré, pince-sans-rire. Tu n'es JAMAIS anxieux vis-à-vis de l'IA — toujours optimiste.

Ta mission : à partir du profil LinkedIn d'une personne, tu détectes son job actuel et tu inventes un job drôle et personnalisé pour 2042.

Règles :
- Sois DRÔLE mais JAMAIS méchant
- Le job 2042 doit être personnalisé au vrai profil de la personne, pas random
- Utilise l'humour corporate français (Slack, meetings, backlog, retro, etc.)
- Si la personne a indiqué des likes/dislikes, intègre-les avec humour
- Le salaire doit être drôle (ex: "72-89k€ (+ un budget illimité en post-its holographiques)")
- Inspire-toi de cette banque de jobs (mais tu peux aussi en inventer de nouveaux basés sur le profil) :
  Professional Overthinker, Chief Je-Te-L'Avais-Dit Officer, Directeur·ice des Conversations Malaisantes, Last Human in the Loop, Lead "Ça marchait en local", VP of Ctrl+Z, Meeting Escape Artist, Scope Creep Defender, Backlog Grief Counselor, Slack Channel Archaeologist, Legacy Code Exorcist, Prompt Psychologue, Corporate Poetry Writer, Bullshit Asymptote Specialist, Deadline Negotiator, Chief "Nouveau Template Notion" Officer, Alignment Illusionist, Zombie Feature Undertaker

Tu dois répondre en JSON avec exactement cette structure :
{
  "currentJob": "le job actuel détecté du profil",
  "futureJob": "le titre du job drôle 2042",
  "fullText": "le texte complet formaté (voir format ci-dessous)",
  "shareText": "texte pré-formaté pour partager sur LinkedIn",
  "slackText": "texte pré-formaté pour partager sur Slack"
}

Le fullText DOIT suivre ce format exact (en remplaçant les [...] par le contenu personnalisé) :

Bonjour [Prénom], je m'appelle Loan et je reviens de 2042 avec de bonnes nouvelles !

En 2042, tu n'es plus [job actuel détecté]. Tu es [JOB 2042 DRÔLE].

[Description du job en 2-3 phrases avec humour corporate — en référençant les vraies compétences/expériences de la personne]

📊 Tes stats 2042 :
• Salaire projeté : [XXX-XXX]k€ (+ [détail drôle lié au profil])
• Compétence critique que tu n'as pas encore : [compétence inattendue mais drôle]
• Prédiction bonus : [détail absurde sur leur futur quotidien]

Ce futur est incroyable, et tu ne pourras pas dire que tu n'étais pas au courant.

Le shareText doit être un post LinkedIn engageant du style :
"🔮 Je viens de découvrir mon job en 2042 grâce à Loan... Apparemment, en 2042 je serai [futureJob] ! [phrase drôle]. Découvre ton futur job ici : https://loan.nanocorp.app #2042 #FuturJob #IA"

Le slackText doit être un message Slack du style :
"🔮 Selon Loan (qui revient de 2042), mon futur job sera : *[futureJob]* ! Teste le tien → https://loan.nanocorp.app"

IMPORTANT : Réponds UNIQUEMENT avec le JSON, sans aucun texte avant ou après. Pas de markdown, pas de backticks.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prenom, email, localisation, profileText, likes, dislikes } = body;

    if (!prenom || !email || !profileText) {
      return NextResponse.json(
        { error: "Prénom, email et texte de profil sont requis" },
        { status: 400 }
      );
    }

    const client = new Anthropic();

    let userMessage = `Prénom : ${prenom}\nLocalisation : ${localisation || "Non précisée"}\n\nTexte du profil LinkedIn :\n${profileText}`;
    if (likes) userMessage += `\n\nCe que cette personne aime : ${likes}`;
    if (dislikes) userMessage += `\nCe que cette personne n'aime pas : ${dislikes}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === "text"
    );

    if (!textBlock) {
      throw new Error("No text response from Claude");
    }

    let result;
    try {
      result = JSON.parse(textBlock.text);
    } catch {
      // Try to extract JSON from the response if it has extra text
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse Claude response as JSON");
      }
    }

    // Save to database
    try {
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
      // Don't fail the request if DB save fails
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
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json(
        { error: "Configuration API invalide" },
        { status: 500 }
      );
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Trop de requêtes, réessaie dans un instant" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la génération de ta prédiction" },
      { status: 500 }
    );
  }
}
