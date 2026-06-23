import usePWA from '../hooks/usePWA';

/**
 * PWABanner
 * Muestra:
 *  - Banner amarillo "Sin conexión" cuando el usuario pierde la red.
 *  - Botón "Instalar app" cuando el navegador tiene un prompt disponible.
 */
export default function PWABanner() {
  const { isOnline, canInstall, installApp } = usePWA();

  return (
    <>
      {/* ── Banner de sin conexión ─────────────────────────── */}
      {!isOnline && (
        <div className="pwa-offline-banner" role="alert" aria-live="assertive">
          <span>📡</span>
          <span>
            Sin conexión a internet. Puedes revisar tours ya visitados, pero las reservas requieren red.
          </span>
        </div>
      )}

      {/* ── Botón de instalación ──────────────────────────── */}
      {canInstall && (
        <div className="pwa-install-banner">
          <span>📲 Instala Destinos Mágicos en tu dispositivo para acceso rápido</span>
          <button onClick={installApp} className="pwa-install-btn">
            Instalar app
          </button>
        </div>
      )}
    </>
  );
}
