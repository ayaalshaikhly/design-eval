const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { sessionId, ratings } = req.body;

  if (!sessionId || !Array.isArray(ratings) || ratings.length === 0) {
    return res.status(400).json({ error: 'sessionId and ratings array are required' });
  }

  // Validate all ratings
  for (const r of ratings) {
    if (!r.idea || r.abstraction == null || r.relevance == null) {
      return res.status(400).json({ error: 'Each rating needs idea, abstraction, and relevance' });
    }
    if (r.abstraction < 1 || r.abstraction > 5 || r.relevance < 1 || r.relevance > 5) {
      return res.status(400).json({ error: 'Ratings must be between 1 and 5' });
    }
  }

  try {
    const session = await sql`SELECT id FROM meta_sessions WHERE id = ${sessionId}`;
    if (session.length === 0) return res.status(404).json({ error: 'Session not found' });

    // Insert each idea's rating
    for (const r of ratings) {
      await sql`
        INSERT INTO meta_ratings (session_id, idea_number, abstraction, relevance)
        VALUES (${sessionId}, ${r.idea}, ${r.abstraction}, ${r.relevance})
      `;
    }

    const count = await sql`SELECT COUNT(DISTINCT id) / ${ratings.length} as c FROM meta_ratings WHERE session_id = ${sessionId}`;
    res.status(200).json({ ok: true, count: parseInt(count[0].c) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
