/** sessionStorage key: set once the intro has played, so it runs on the first visit of a session only. */
export const INTRO_KEY = 'ka-intro-seen';

/**
 * Runs in <head> before the first paint (see app/(en)/layout.tsx). On a first visit with
 * motion allowed it marks <html data-intro="play">, which reveals the loader and holds the
 * hero entrance. The timeout is a failsafe: if the app's JavaScript never arrives, the
 * intro still gets out of the way. Without JavaScript nothing happens and the page shows
 * normally.
 */
export const INTRO_SCRIPT = `(function(){try{var h=document.documentElement;if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)return;h.setAttribute("data-intro","play");window.__kaIntro=1;setTimeout(function(){if(h.getAttribute("data-intro")!=="done")h.setAttribute("data-intro","done")},9000)}catch(e){}})()`;
