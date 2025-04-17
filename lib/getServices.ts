import fs from 'fs';
import path from 'path';

/** Метаданные, которые описывает каждая услуга */
export interface ServiceMetadata {
  slug: string;
  title: string;
  description: string;
  image?: string;
  order?: number;
}

/** Возвращает массив slug‑ов (имён файлов без расширения) */
export function getServiceSlugs(): string[] {
  const servicesDir = path.join(process.cwd(), 'app', 'services-data');
  return fs
    .readdirSync(servicesDir)
    .filter(file => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js'))
    .map(file => file.replace(/\.(js|ts|tsx)$/, ''));
}
