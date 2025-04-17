import fs from 'fs';
import path from 'path';

export async function GET() {
  const certsDirectory = path.join(process.cwd(), 'public', 'certificates');

  try {
    if (!fs.existsSync(certsDirectory)) {
      return new Response(JSON.stringify({ error: 'Папка certificates не знайдена' }), {
        status: 404,
      });
    }

    const files = fs
      .readdirSync(certsDirectory)
      .filter(file => /\.(jpg|jpeg|png|gif|pdf)$/i.test(file));
    return new Response(JSON.stringify(files), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Не вдалося завантажити сертифікати' }), {
      status: 500,
    });
  }
}
