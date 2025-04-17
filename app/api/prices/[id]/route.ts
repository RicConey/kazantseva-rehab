import { Pool } from 'pg';
import { revalidatePath } from 'next/cache';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function PUT(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    const { service, duration, price } = await request.json();

    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `UPDATE prices
                 SET service = $1, duration = $2, price = $3
                 WHERE id = $4
                     RETURNING *`,
        [
          service,
          JSON.stringify(duration), // <-- сериализация
          JSON.stringify(price), // <-- сериализация
          id,
        ]
      );

      await revalidatePath('/prices');

      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Позиція не знайдена' }), { status: 404 });
      }

      return new Response(JSON.stringify(rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('PUT /api/prices/:id error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`DELETE FROM prices WHERE id = $1 RETURNING *`, [id]);

      await revalidatePath('/prices');

      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'Позиція не знайдена' }), { status: 404 });
      }

      return new Response(JSON.stringify({ message: 'Позиція видалена' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('DELETE /api/prices/:id error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
