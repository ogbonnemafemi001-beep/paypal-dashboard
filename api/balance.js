import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const result = await sql`SELECT balance FROM users WHERE id = 1`;
      return res.status(200).json({ balance: result[0]?.balance || 0 });
    }

    if (req.method === 'POST') {
      const { amount } = req.body;
      await sql`UPDATE users SET balance = balance + ${amount} WHERE id = 1`;
      const result = await sql`SELECT balance FROM users WHERE id = 1`;
      return res.status(200).json({ balance: result[0].balance });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
