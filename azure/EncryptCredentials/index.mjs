import { createCipheriv, createSecretKey, randomBytes } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from 'url';
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const key = createSecretKey(Buffer.from(readFileSync(path.join(__dirname, "..", "bstarsext.key"), "utf8"), "hex"), "hex");

export default async function (context, req) {
    try {
        context.log('JavaScript HTTP trigger function 2 processed a request.');
        
        const iv = randomBytes(16).toString("hex").slice(0, 16);
        const cipher = createCipheriv("aes-256-cbc", key, iv);
        const encrypted = cipher.update(req.query.email + " | " + req.query.password, "utf8", "hex") + cipher.final("hex");
        
        context.res = {
            body: { credentials: encrypted, iv },
            contentType: "application/json",
        };
    } catch (error) {
        console.error(error);
        context.res = {
            status: 500,
        };
    }
}
