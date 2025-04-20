import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT * FROM prices ORDER BY position');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET /api/prices error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    client.release();
  }
}

export async function POST(request) {
  try {
    const { service, duration, price } = await request.json();

    const client = await pool.connect();
    try {
      const resMax = await client.query('SELECT COALESCE(MAX(position), 0) AS maxPos FROM prices');
      const maxPos = resMax.rows[0].maxpos || 0;
      const newPosition = maxPos + 1;

      const { rows } = await client.query(
        `INSERT INTO prices (service, duration, price, position)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [service, JSON.stringify(duration), JSON.stringify(price), newPosition]
      );

      await revalidatePath('/prices');

      return new Response(JSON.stringify(rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('POST /api/prices error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
