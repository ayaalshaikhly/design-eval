const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);

  try {
    const rows = await sql`
      SELECT
        s.id,
        s.group_name,
        s.presenter,
        s.target_product,
        s.num_ideas,
        s.class_size,
        s.created_at,
        COUNT(DISTINCT r.id)::int AS rating_count
      FROM meta_sessions s
      LEFT JOIN meta_ratings r ON r.session_id = s.id
      GROUP BY s.id
      ORDER BY s.group_name ASC, s.created_at DESC
    `;

    const groups = {};
    for (const row of rows) {
      const g = row.group_name || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push({
        id: row.id,
        presenter: row.presenter,
        targetProduct: row.target_product,
        numIdeas: row.num_ideas,
        classSize: row.class_size,
        ratingCount: row.rating_count,
        createdAt: row.created_at
      });
    }

    res.status(200).json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
