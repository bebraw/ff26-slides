import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function ensureGeneratedStylesheet(): void {
  mkdirSync(".generated", { recursive: true });
  writeFileSync(join(".generated", "styles.css"), ":root{--color-app-canvas:#f3eee6;}", "utf8");
}

export function ensureGeneratedClientScript(): void {
  mkdirSync(join(".generated", "client"), { recursive: true });
  writeFileSync(join(".generated", "client", "slides.client.txt"), "document.querySelectorAll('[data-break-slide]');", "utf8");
}
