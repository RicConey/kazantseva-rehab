// lib/getServices.js
import fs from "fs";
import path from "path";

export function getServiceSlugs() {
    const servicesDir = path.join(process.cwd(), "app", "services-data");
    // Отримуємо тільки файли з розширенням .js
    const files = fs.readdirSync(servicesDir).filter((file) => file.endsWith(".js"));
    // Повертаємо масив slug (ім’я файлу без розширення)
    return files.map((file) => file.replace(".js", ""));
}
