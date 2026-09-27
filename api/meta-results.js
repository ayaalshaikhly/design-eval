const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Session id is required' });

  try {
    const session = await sql`
      SELECT id, group_name, presenter, target_product, num_ideas, idea1, idea2, idea3, class_size, created_at
      FROM meta_sessions WHERE id = ${id}
    `;
    if (session.length === 0) return res.status(404).json({ error: 'Session not found' });

    const ratings = await sql`
      SELECT idea_number, abstraction, relevance, created_at
      FROM meta_ratings WHERE session_id = ${id}
      ORDER BY created_at ASC
    `;

    const s = session[0];
    res.status(200).json({
      session: s.id,
      groupName: s.group_name,
      presenter: s.presenter,
      targetProduct: s.target_product,
      numIdeas: s.num_ideas,
      idea1: s.idea1, idea2: s.idea2, idea3: s.idea3,
      classSize: s.class_size,
      createdAt: s.created_at,
      ratings: ratings.map(r => ({
        idea_number: r.idea_number,
        abstraction: r.abstraction,
        relevance: r.relevance
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
