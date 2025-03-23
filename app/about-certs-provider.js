// app/about-certs-provider.js
import fs from 'fs';
import path from 'path';

export async function getCertificates() {
    const certDir = path.join(process.cwd(), 'public', 'certificates');
    try {
        const files = fs.readdirSync(certDir);
        return files.filter((file) =>
            ['.jpg', '.jpeg', '.png'].some((ext) => file.toLowerCase().endsWith(ext))
        );
    } catch (err) {
        console.error('Error reading certificates directory:', err);
        return [];
    }
}
