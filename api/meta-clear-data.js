const { neon } = require('@neondatabase/serverless');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sql = neon(process.env.DATABASE_URL);
  const { passcode, scope } = req.body;

  if (!process.env.INSTRUCTOR_PASSCODE || passcode !== process.env.INSTRUCTOR_PASSCODE) {
    return res.status(403).json({ error: 'Invalid passcode' });
  }

  try {
    if (scope === 'all') {
      await sql`DELETE FROM meta_ratings`;
      await sql`DELETE FROM meta_sessions`;
      return res.status(200).json({ ok: true, message: 'All metaphoric data cleared.' });
    }

    res.status(400).json({ error: 'Invalid scope. Use: all.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
