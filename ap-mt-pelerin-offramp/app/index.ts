// OFF-RAMP minimal : SELL (USDC -> EUR) sur Polygon, sans paramètres cosmétiques
// ni "addr/code/hash" pour éviter les écrans blancs et crashes du widget.

function buildOfframpUrl(): string {
  const p = new URLSearchParams();

  // Token : on accepte MT_PELERIN_TOKEN (préféré) ou MTP_TOKEN
  const token =
    (process.env as any)?.MT_PELERIN_TOKEN ||
    (process.env as any)?.MTP_TOKEN ||
    "";

  if (!token) console.warn("[MTP] _ctkn manquant. Définis MT_PELERIN_TOKEN (ou MTP_TOKEN) au build.");
  p.set("_ctkn", token);

  // Forcer la vue Off-ramp
  p.set("tab", "sell");
  p.set("tabs", "sell");

  // Langue / Devises
  p.set("lang", "auto");
  p.set("ssc", "USDC");           // crypto source
  p.set("sdc", "EUR");            // fiat cible
  p.set("net", "matic_mainnet");  // USDC sur Polygon
  p.set("ssa", "100");            // montant par défaut (modifiable dans l’UI)

  // Base URL du widget (optionnelle, par défaut officielle)
  const base =
    ((process.env as any)?.MT_PELERIN_URL as string) ||
    "https://widget.mtpelerin.com";

  return `${base}/?${p.toString()}`;
}

function mountWidget(iframeId = "mtpel-iframe") {
  const iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn(`[MTP] Iframe #${iframeId} introuvable`);
    return;
  }

  const url = buildOfframpUrl();
  console.log("[MTP] URL:", url);
  iframe.src = url;

  // Watchdog (reload une fois si le widget reste vide)
  const watchdog = setTimeout(() => {
    try {
      const u = new URL(iframe.src);
      u.searchParams.set("ts", String(Date.now()));
      iframe.src = u.toString();
      console.debug("[MTP] Reload iframe (watchdog)");
    } catch {}
  }, 15000);

  iframe.addEventListener("load", () => clearTimeout(watchdog));
}

function initApp() {
  console.log("🚀 Initialisation Off-ramp...");
  mountWidget();
}

(function bootstrap() {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
