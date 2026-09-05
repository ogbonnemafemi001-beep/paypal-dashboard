import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  try {
    if (req.method === 'GET') {
      const result = await sql`
        SELECT * FROM transactions 
        WHERE user_id = 1 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const { name, type, amount, currency, is_positive, avatar, initial } = req.body;

      await sql`
        INSERT INTO transactions (user_id, name, type, amount, currency, is_positive, avatar, initial)
        VALUES (1, ${name}, ${type}, ${amount}, ${currency || '€'}, ${is_positive}, ${avatar || 'default'}, ${initial})
      `;

      // Update balance
      await sql`UPDATE users SET balance = balance + ${amount} WHERE id = 1`;

      return res.status(200).json({ success: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
