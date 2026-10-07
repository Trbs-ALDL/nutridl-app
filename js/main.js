// nutriDL · Arranque, instalación como app y modo sin conexión
'use strict';

function init() {
    if ($('app-version')) $('app-version').textContent = 'v' + APP_VERSION;
    // Teclado del asistente
    document.addEventListener('keydown', e => {
        if ($('wizard').classList.contains('hidden')) return;
        if (e.key === 'Escape') closeWizard();
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type === 'number') wzNext();
    });
    load();
    state.gym = { level: 'beginner', days: 3, ...(state.gym || {}), eq: 'gym' };
    state.workouts = state.workouts || [];
    syncInputsFromState();
    update();
    renderTracker();
    renderMeasures();
    updateSticky();
    // Los enlaces internos (#seccion) abren la pestaña correcta
    document.addEventListener('click', e => {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href').slice(1);
        if (!id || !$(id)) return;
        e.preventDefault();
        goTo(id);
    });
    renderProfileChip(); renderDiary(); renderDashboard();
    document.addEventListener('click', e => { if (!e.target.closest('#profile-chip')) closeProfileMenu(); });
    showTab(['calc', 'food', 'gym'].includes(state.tab) ? state.tab : 'calc', false);
    // Accesos directos del icono de la app (mantener pulsado): ?accion=comida / ?accion=gym
    const accion = new URLSearchParams(location.search).get('accion');
    if (accion === 'comida') { showTab('food'); openFoodSheet(); }
    else if (accion === 'gym') showTab('gym');
    renderInstall();
}

// =====================================================================
//  INSTALAR COMO APP Y FUNCIONAR SIN CONEXIÓN
// =====================================================================
const isInstalled = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
let installEvt = null;
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && (!/^(localhost|127\.)/.test(location.hostname) || new URLSearchParams(location.search).has('sw'))) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
            // Al volver a la app (desde otra app o la pantalla de inicio) se busca versión nueva
            document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => { }); });
        }).catch(e => logErr('Service worker: ' + e.message));
    });
    // Cuando se instala una versión nueva con la app abierta, se recarga sola una vez (lo apuntado ya está guardado)
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController || sessionStorage.getItem('nd-reloaded') === APP_VERSION) return;
        try { sessionStorage.setItem('nd-reloaded', APP_VERSION); } catch (e) { }
        save();
        location.reload();
    });
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; renderInstall(); });
window.addEventListener('appinstalled', () => { installEvt = null; renderInstall(); track('installed'); toast('nutriDL instalada en tu dispositivo'); });
function renderInstall() {
    document.querySelectorAll('[data-install]').forEach(b => b.classList.toggle('hidden', isInstalled()));
}
async function installApp() {
    closeProfileMenu();
    if (installEvt) {
        installEvt.prompt();
        try { await installEvt.userChoice; } catch (e) { }
        installEvt = null; renderInstall();
        return;
    }
    // iPhone/iPad y navegadores sin botón de instalar: instrucciones
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    openSheet('<i class="fa-solid fa-mobile-screen-button text-mint-400"></i> Instalar nutriDL', `
        <ol class="space-y-3 text-sm text-neutral-200 list-decimal pl-5">
            ${ios ? `<li>Abre esta página en <b>Safari</b>.</li><li>Pulsa el botón <b>Compartir</b> <i class="fa-solid fa-arrow-up-from-bracket text-mint-400"></i>.</li><li>Elige <b>«Añadir a pantalla de inicio»</b> y pulsa <b>Añadir</b>.</li>`
                : `<li>Abre el menú del navegador <i class="fa-solid fa-ellipsis-vertical text-mint-400"></i>.</li><li>Elige <b>«Instalar aplicación»</b> o <b>«Añadir a pantalla de inicio»</b>.</li>`}
        </ol>
        <p class="mt-4 text-xs text-neutral-400">Así se abre como una app, a pantalla completa, y funciona sin conexión.</p>`);
}

init();
