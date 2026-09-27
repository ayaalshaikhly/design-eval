const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Session id is required' });

  try {
    const rows = await sql`
      SELECT id, group_name, presenter, target_product, num_ideas, idea1, idea2, idea3, class_size, created_at
      FROM meta_sessions WHERE id = ${id}
    `;

    if (rows.length === 0) return res.status(404).json({ error: 'Session not found' });

    const s = rows[0];
    res.status(200).json({
      id: s.id, groupName: s.group_name, presenter: s.presenter,
      targetProduct: s.target_product, numIdeas: s.num_ideas,
      idea1: s.idea1, idea2: s.idea2, idea3: s.idea3,
      classSize: s.class_size, createdAt: s.created_at
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
