const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { groupId, presenter, targetProduct, numIdeas, idea1, idea2, idea3 } = req.body;

  if (!groupId || !presenter || !targetProduct || !idea1) {
    return res.status(400).json({ error: 'groupId, presenter, targetProduct, and idea1 are required' });
  }

  try {
    const group = await sql`SELECT id, name, class_size FROM groups WHERE id = ${groupId}`;
    if (group.length === 0) return res.status(404).json({ error: 'Group not found' });

    const g = group[0];
    const id = crypto.randomBytes(4).toString('hex');
    const n = Math.min(Math.max(parseInt(numIdeas) || 1, 1), 3);

    await sql`
      INSERT INTO meta_sessions (id, group_id, group_name, presenter, target_product, num_ideas, idea1, idea2, idea3, class_size)
      VALUES (${id}, ${groupId}, ${g.name}, ${presenter}, ${targetProduct}, ${n}, ${idea1}, ${idea2 || null}, ${idea3 || null}, ${g.class_size})
    `;

    res.status(201).json({
      id, groupId, groupName: g.name, presenter,
      targetProduct, numIdeas: n,
      idea1, idea2: idea2 || null, idea3: idea3 || null,
      classSize: g.class_size
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
