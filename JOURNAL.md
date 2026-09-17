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

### Pièges rencontrés
- **`generate.js` à la racine du projet** : Vercel ne le détectait pas comme fonction
  serveur → erreur "not valid JSON" (l'appel tombait sur la page 404 HTML au lieu du
  code). Solution : les fonctions serverless Vercel doivent être dans un dossier `api/`
  (`api/generate.js`). Le `vercel.json` d'origine (rewrite `/api/(.*)` → `/api/$1`)
  était un no-op inutile, supprimé.
- **Clé Anthropic à portée "Organisation"** : erreur "API key is not scoped to a
  workspace". Sur console.anthropic.com, une clé peut être créée à portée Organisation
  (tous les workspaces, réservé aux comptes Owner/Admin) ou à portée d'un Workspace
  précis. Seule la 2ème fonctionne avec un appel API simple sans header
  `anthropic-workspace-id`. Toujours créer la clé en sélectionnant un Workspace précis
  (ex. "Default").
- Test de génération validé dans le navigateur avec un bilan exemple (score, buteurs,
  analyse par période, points positifs/axes) → rendu correct.
