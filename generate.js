export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { bilan } = req.body;
  if (!bilan) return res.status(400).json({ error: 'Bilan manquant' });

  const PROMPT = `Tu es un assistant de la Racing Mutest Académie (RCSA U17). Analyse ce bilan de match et structure-le en JSON.

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni backticks.

Format JSON exact:
{
  "journee": "J4",
  "competition": "U17 National",
  "home": "RCSA",
  "away": "Nom adversaire",
  "score": "5–3",
  "result": "Victoire",
  "mi_temps": "Mi-temps 1–1",
  "buteurs": ["Nom1", "Nom2"],
  "saison": "2025 – 2026",
  "periode1_label": "1ère période",
  "periode1": "Analyse 2-3 phrases, style coach direct.",
  "periode2_label": "2ème période",
  "periode2": "Analyse 2-3 phrases.",
  "positifs": [
    {"titre": "Titre court", "texte": "1-2 phrases."}
  ],
  "axes": [
    {"titre": "Titre court", "texte": "1-2 phrases."}
  ],
  "synthese": "1-2 phrases de synthèse, ton coach direct."
}

Règles: max 3 positifs, max 3 axes. Style direct et professionnel. Respecte les noms propres. Si info manquante mets "—".

Bilan à analyser:
${bilan}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: PROMPT }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    let text = data.content?.[0]?.text || '';
    text = text.replace(/```json|```/g, '').trim();

    let parsed;
    try { parsed = JSON.parse(text); }
    catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) return res.status(500).json({ error: 'JSON invalide reçu' });
      parsed = JSON.parse(m[0]);
    }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
