import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').slice(-2)[0];
  const direction = url.searchParams.get('direction');

  if (!['up', 'down'].includes(direction)) {
    return new Response(JSON.stringify({ error: 'Невірний напрямок' }), { status: 400 });
  }

  const client = await pool.connect();
  try {
    const resCurrent = await client.query('SELECT id, position FROM prices WHERE id = $1', [id]);
    if (resCurrent.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Позиція не знайдена' }), { status: 404 });
    }

    const current = resCurrent.rows[0];
    const operator = direction === 'up' ? '<' : '>';
    const order = direction === 'up' ? 'DESC' : 'ASC';

    const resAdjacent = await client.query(
      `SELECT id, position FROM prices
             WHERE position ${operator} $1
             ORDER BY position ${order}
                 LIMIT 1`,
      [current.position]
    );

    if (resAdjacent.rows.length === 0) {
      return new Response(JSON.stringify({ warning: 'Більше нема куди рухати' }), { status: 200 });
    }

    const adjacent = resAdjacent.rows[0];

    await client.query('BEGIN');
    await client.query('UPDATE prices SET position = $1 WHERE id = $2', [
      adjacent.position,
      current.id,
    ]);
    await client.query('UPDATE prices SET position = $1 WHERE id = $2', [
      current.position,
      adjacent.id,
    ]);
    await client.query('COMMIT');

    await revalidatePath('/prices');

    return new Response(JSON.stringify({ message: 'Позицію переміщено' }), { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('PUT /api/prices/:id/move error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  } finally {
    client.release();
  }
}
