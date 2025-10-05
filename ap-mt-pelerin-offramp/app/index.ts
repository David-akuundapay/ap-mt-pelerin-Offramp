// OFF-RAMP minimal : SELL (USDC -> EUR) sur Polygon
// Variante SANS _ctkn pour éviter que le widget charge le module "personal/payment"
// (qui provoquait l'erreur .map sur p[k] === undefined).

function buildOfframpUrl(): string {
  const p = new URLSearchParams();

  // ❌ Pas de token (_ctkn) ici pour rester en mode public/quote
  // p.set("_ctkn", token);

  // Forcer l'off-ramp
  p.set("tab", "sell");
  p.set("tabs", "sell");

  // Langue / Devises / Réseau / Montant par défaut
  p.set("lang", "auto");
  p.set("ssc", "USDC");           // crypto source
  p.set("sdc", "EUR");            // fiat cible
  p.set("net", "matic_mainnet");  // USDC sur Polygon
  p.set("ssa", "100");            // montant par défaut (modifiable dans l’UI)

  // Base URL du widget (env optionnelle, sinon valeur officielle)
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

  // Watchdog : si le widget reste vide, on recharge une fois (cache-bust)
  const watchdog = setTimeout(() => {
    try {
      const u = new URL(iframe.src);
      u.searchParams.set("ts", String(Date.now()));
      iframe.src = u.toString();
      console.debug("[MTP] Reload iframe (watchdog)");
    } catch { /* noop */ }
  }, 15000);

  iframe.addEventListener("load", () => clearTimeout(watchdog));
}

function initApp() {
  console.log("🚀 Initialisation Off-ramp (sans _ctkn)...");
  mountWidget();
}

(function bootstrap() {
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
