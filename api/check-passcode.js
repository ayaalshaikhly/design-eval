// Checks the instructor passcode on the server, so it never appears in the page code.
// The passcode is set in Vercel as the INSTRUCTOR_PASSCODE environment variable.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const expected = process.env.INSTRUCTOR_PASSCODE;
  const { passcode } = req.body || {};
  if (!expected || passcode !== expected) return res.status(403).json({ ok: false });
  res.status(200).json({ ok: true });
};
