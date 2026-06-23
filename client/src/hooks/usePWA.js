import { useEffect, useState } from 'react';

/**
 * usePWA
 * Registra el service worker y expone:
 *   - isOnline:      boolean — estado de la conexión en tiempo real
 *   - canInstall:    boolean — hay un prompt de instalación disponible
 *   - installApp:    función — dispara el prompt de instalación nativo
 *   - swRegistered:  boolean — el SW quedó registrado correctamente
 */
export default function usePWA() {
  const [isOnline,     setIsOnline]     = useState(navigator.onLine);
  const [canInstall,   setCanInstall]   = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [deferredPrompt, setDeferred]   = useState(null);

  useEffect(() => {
    // ── 1. Registrar Service Worker ───────────────────────────
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(reg => {
          console.log('[PWA] Service Worker registrado. Scope:', reg.scope);
          setSwRegistered(true);

          // Escuchar actualizaciones disponibles
          reg.addEventListener('updatefound', () => {
            const newSW = reg.installing;
            if (newSW) {
              newSW.addEventListener('statechange', () => {
                if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('[PWA] Nueva versión disponible — recarga para actualizar.');
                }
              });
            }
          });
        })
        .catch(err => console.error('[PWA] Error al registrar SW:', err));
    }

    // ── 2. Detectar prompt de instalación (beforeinstallprompt) ──
    const handleInstallPrompt = (e) => {
      e.preventDefault();           // evitar el banner automático del navegador
      setDeferred(e);
      setCanInstall(true);
      console.log('[PWA] Prompt de instalación capturado.');
    };

    // ── 3. Detectar cuando ya fue instalada ───────────────────
    const handleInstalled = () => {
      setCanInstall(false);
      setDeferred(null);
      console.log('[PWA] App instalada correctamente.');
    };

    // ── 4. Monitorear estado de red ───────────────────────────
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled',        handleInstalled);
    window.addEventListener('online',              goOnline);
    window.addEventListener('offline',             goOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled',        handleInstalled);
      window.removeEventListener('online',              goOnline);
      window.removeEventListener('offline',             goOffline);
    };
  }, []);

  async function installApp() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[PWA] Respuesta del usuario al prompt:', outcome);
    setDeferred(null);
    setCanInstall(false);
  }

  return { isOnline, canInstall, installApp, swRegistered };
}
