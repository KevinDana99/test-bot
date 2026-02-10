import { chromium } from "playwright";
import type { QueryConfigType, ResultsListType } from "./types";

const LIMIT_RESULTS = 5;

const searchService = async (query: string, config?: QueryConfigType) => {
  const limit = config?.limit ?? LIMIT_RESULTS;

  // 1. Lanzamos el navegador
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();

    // 2. BLOQUEO DE RECURSOS (Optimizaciones previas + extras)
    // Bloqueamos CSS, imágenes, fuentes y scripts de terceros/analytics
    await page.route(
      "**/*.{png,jpg,jpeg,gif,svg,css,woff,woff2,otf,ico}",
      (route) => route.abort()
    );

    // Opcional: Bloquear dominios de analytics si Hardstyle.com los usa
    await page.route(/.*googletagmanager|.*google-analytics/, (route) =>
      route.abort()
    );

    // 3. NAVEGACIÓN RÁPIDA
    // "domcontentloaded" es más rápido que esperar a que cargue todo el JS
    await page.goto(`https://hardstyle.com/en/search?search=${query}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // 4. EXTRACCIÓN EN UN SOLO VIAJE (Evaluate)
    // Esto evita los 35-40 'awaits' que tenías antes
    const results = await page.evaluate((maxResults) => {
      const items = Array.from(
        document.querySelectorAll(".itemWrapper .track.listView")
      );

      return items.slice(0, maxResults).map((track) => {
        const titleEl = track.querySelector("a.trackTitle .innerLink");
        const artistEl = track.querySelector(".artists");
        const labelEl = track.querySelector(".label a.label");
        const imgEl = track.querySelector(".trackPoster img");
        const linkEl = track.querySelector("a.trackTitle");
        const descEl = track.querySelectorAll(".trackContent .linkTitle")[1];

        return {
          id: track.getAttribute("data-track-id") ?? null,
          title: titleEl?.textContent?.trim() ?? null,
          artist: artistEl?.textContent?.replace(/\n/g, "").trim() ?? null,
          label: labelEl?.textContent?.trim() ?? null,
          image: imgEl?.getAttribute("src")
            ? `https://hardstyle.com${imgEl.getAttribute("src")}`
            : null,
          description: descEl?.textContent?.trim() ?? null,
          trackUrl: linkEl?.getAttribute("href")
            ? `https://hardstyle.com${linkEl.getAttribute("href")}`
            : null,
        };
      });
    }, limit);

    return results;
  } catch (err) {
    console.error("Scraping error:", err);
    throw err;
  } finally {
    // 5. CIERRE SEGURO
    await browser.close();
  }
};

export default searchService;
