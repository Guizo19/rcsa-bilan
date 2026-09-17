# Journal — RCSA Bilan Match

## 2026-09-17
- Création du projet : générateur de bilan de match (RCSA U17).
- Fonctionnement : l'utilisateur colle un bilan brut (score, buteurs, observations)
  dans le formulaire, une fonction serverless Vercel (`generate.js`) envoie ce texte
  à l'API Anthropic (Claude Haiku) qui renvoie un JSON structuré, affiché ensuite
  sous forme de fiche visuelle (`index.html`), imprimable en PDF (A4 paysage).
- La clé `ANTHROPIC_API_KEY` reste côté serveur (variable d'environnement Vercel),
  jamais exposée au navigateur.
- Repo GitHub **public** `rcsa-bilan` (compte Guizo19) — choix explicite de
  l'utilisateur, différent du défaut privé habituel pour ce dossier.
- Déployé sur Vercel (compte guizo19).
