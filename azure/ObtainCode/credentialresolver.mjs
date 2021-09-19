import { createDecipheriv, createSecretKey } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const key = createSecretKey(Buffer.from(readFileSync(path.join(__dirname, "..", "bstarsext.key"), "utf8"), "hex"), "hex");

export async function decryptCredentials(encrypted, iv) {
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    const decrypted = decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    
    const breakIdx = decrypted.indexOf(" | ");
    const email = decrypted.slice(0, breakIdx);
    const password = decrypted.slice(breakIdx + 3);
    
    return { email, password };
}
