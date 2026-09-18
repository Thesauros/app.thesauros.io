import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const STORAGE_KEY = 'thesauros-locale';
const LOCALES = new Set(['en', 'es']);

const EXACT_TRANSLATIONS: Record<string, string> = {
  Dashboard: 'Panel',
  Statistics: 'Estadísticas',
  Deposits: 'Depósitos',
  'Points Program': 'Programa de puntos',
  Settings: 'Ajustes',
  'Connect wallet': 'Conectar wallet',
  'Connect wallet and get': 'Conecta wallet y recibe',
  '100 points': '100 puntos',
  'Potential earnings': 'Ganancias potenciales',
  Deposit: 'Depositar',
  Withdraw: 'Retirar',
  'Add to deposit': 'Añadir al depósito',
  'Withdraw anytime — no lock period': 'Retira cuando quieras, sin periodo de bloqueo',
  'Deposit now and get': 'Deposita ahora y recibe',
  '500 points': '500 puntos',
  'Convert any crypto to USDC during Deposit':
    'Convierte cualquier crypto a USDC durante el depósito',
  'Net APY': 'APY neto',
  'Base APY': 'APY base',
  'Amount to Deposit': 'Importe a depositar',
  'Amount to Withdraw': 'Importe a retirar',
  'Balance:': 'Saldo:',
  'Available:': 'Disponible:',
  'Total points per year': 'Puntos totales por año',
  'Performance fee': 'Comisión de rendimiento',
  'Performance fee:': 'Comisión de rendimiento:',
  'No fee on your principal': 'Sin comisión sobre tu capital',
  'Projected Earnings': 'Ganancias proyectadas',
  'Monthly profit': 'Beneficio mensual',
  'Yearly profit': 'Beneficio anual',
  'Low on USDC? Swap from any token': '¿Poco USDC? Cambia desde cualquier token',
  Swap: 'Swap',
  Approve: 'Aprobar',
  'Switch network': 'Cambiar red',
  Confirm: 'Confirmar',
  Cancel: 'Cancelar',
  'Withdraw Funds': 'Retirar fondos',
  'Withdrawing will reduce your potential earnings per year:':
    'Retirar reducirá tus ganancias potenciales por año:',
  'Points bonus for your first deposit': 'Bono de puntos por tu primer depósito',
  Points: 'Puntos',
  'Your funds': 'Tus fondos',
  APY: 'APY',
  'Base Rate': 'Tasa base',
  INSTANT: 'INSTANTÁNEO',
  About: 'Acerca de',
  Protocols: 'Protocolos',
  'Funds are diversified across leading DeFi protocols (may vary)':
    'Los fondos se diversifican entre protocolos DeFi líderes (puede variar)',
  'Audited by Hexens': 'Auditado por Hexens',
  'Smart contracts reviewed and verified for safety and reliability':
    'Smart contracts revisados y verificados por seguridad y fiabilidad',
  'My deposit': 'Mi depósito',
  Amount: 'Importe',
  '24h average APY': 'APY promedio 24h',
  In: 'En',
  'you could have': 'podrías tener',
  'Projected growth': 'Crecimiento proyectado',
  'Projected points': 'Puntos proyectados',
  'Current APY': 'APY actual',
  'Potential return': 'Retorno potencial',
  'Thesauros Performance APY, %': 'APY de rendimiento Thesauros, %',
  'Market value': 'Valor de mercado',
  'Earn points for early participation and get ready for the biggest airdrop in DeFi history':
    'Gana puntos por participar temprano y prepárate para el mayor airdrop de la historia DeFi',
  'Your Points Balance': 'Tu saldo de puntos',
  'Leaderboard Rank': 'Posición en leaderboard',
  'Earn Points': 'Gana puntos',
  'Copy Link': 'Copiar enlace',
  Copied: 'Copiado',
  Season: 'Temporada',
  '% Complete': '% completado',
  'days remaining': 'días restantes',
  // Values below come from the API (users/:address, global/current-season)
  // and must be kept in sync with the backend copy.
  'Early Adopter': 'Adoptante temprano',
  'Bootstrap the protocol with early liquidity. First 500 users get exclusive Early Adopter status and 2x point multiplier for the entire season.':
    'Impulsa el protocolo con liquidez temprana. Los primeros 500 usuarios obtienen el estatus exclusivo de Adoptante temprano y un multiplicador de puntos 2x durante toda la temporada.',
  'Invite Friends': 'Invita amigos',
  'Earn 500 points per active invite and 10% of their daily points, or 20% when 100+ invited users keep an active deposit.':
    'Gana 500 puntos por cada invitado activo y el 10% de sus puntos diarios, o el 20% cuando más de 100 usuarios invitados mantienen un depósito activo.',
  'Connect Wallet': 'Conecta wallet',
  'Connect your Web3 wallet to get started': 'Conecta tu wallet Web3 para empezar',
  'First Deposit $100+': 'Primer depósito de $100+',
  'Make your first deposit of at least $100': 'Haz tu primer depósito de al menos $100',
  'Daily Deposit Points': 'Puntos diarios por depósito',
  'Earn 2 points for every dollar you hold daily (automatically tracked)':
    'Gana 2 puntos por cada dólar que mantienes cada día (seguimiento automático)',
  'About Thesauros Points': 'Acerca de los puntos Thesauros',
  'Points reflect your activity inside Thesauros. You earn them by holding funds, completing actions, and inviting friends.The more you hold, the more you earn.':
    'Los puntos reflejan tu actividad dentro de Thesauros. Los ganas manteniendo fondos, completando acciones e invitando amigos. Cuanto más mantienes, más ganas.',
  'Promo season 1 started!': '¡La temporada promo 1 ha comenzado!',
  'Earn points daily by holding your stablecoins.':
    'Gana puntos diariamente manteniendo tus stablecoins.',
  Documents: 'Documentos',
  FAQ: 'FAQ',
  'Terms & Conditions': 'Términos y condiciones',
  'Privacy Policy': 'Política de privacidad',
  'Terms of use': 'Términos de uso',
  'All Rights Reserved': 'Todos los derechos reservados',
  'Comming soon...': 'Próximamente...',
  Copy: 'Copiar',
  'Log out': 'Cerrar sesión',
  Close: 'Cerrar',
  'Early access unlocked!': '¡Acceso temprano desbloqueado!',
  'You`re lucky!': '¡Tienes suerte!',
  'You’re close to securing one of 500 whitelist spots. Join our community to confirm your place and unlock boosted rewards.':
    'Estás cerca de asegurar uno de los 500 cupos whitelist. Únete a nuestra comunidad para confirmar tu lugar y desbloquear recompensas potenciadas.',
  'Your address is under review — a spot is reserved for you. Join Telegram, Discord or X to complete your whitelist entry ⭐':
    'Tu dirección está en revisión: tienes un cupo reservado. Únete a Telegram, Discord o X para completar tu entrada whitelist.',
  'Your address is verified and approved.': 'Tu dirección está verificada y aprobada.',
  'You can deposit immediately — rewards for early users are boosted':
    'Puedes depositar de inmediato: las recompensas para usuarios tempranos están potenciadas',
  'Got it': 'Entendido',
  'Terms of use Agreement': 'Acuerdo de términos de uso',
  'Connected wallet': 'Wallet conectada',
  'Please review and accept our': 'Revisa y acepta nuestros',
  'to continue using our platform with your connected wallet.':
    'para seguir usando nuestra plataforma con tu wallet conectada.',
  'I have read and agree to the': 'He leído y acepto los',
  Decline: 'Rechazar',
  'Signing...': 'Firmando...',
  'Accept and Sign': 'Aceptar y firmar',
  Successful: 'Exitosa',
  Unsuccessful: 'Fallida',
  'Date & time': 'Fecha y hora',
  Txid: 'Txid',
  Done: 'Listo',
  Shield: 'Escudo',
  'Point program banner': 'Banner del programa de puntos',
  '6 month': '6 meses',
  '1 year': '1 año',
  '3 years': '3 años',
  '6 years': '6 años',
};

const PHRASE_TRANSLATIONS: Array<[string, string]> = [
  ['Minimum amount is', 'El importe mínimo es'],
  ['Deposit ', 'Depositar '],
  ['Successful', 'exitosa'],
  ['Unsuccessful', 'fallida'],
  ['Earned in ', 'Ganado en '],
  ['Av. ', 'APY prom. '],
  [' APY', ' APY'],
  ['/day', '/día'],
  ['% of yield', '% del rendimiento'],
  [
    'Shows the current average yield the strategy generates from connected DeFi protocols. The percentage can move up or down depending on market conditions.',
    'Muestra el rendimiento promedio actual que genera la estrategia desde protocolos DeFi conectados. El porcentaje puede subir o bajar según las condiciones de mercado.',
  ],
  [
    'Net APY is the yield the DeFi strategies generate after the performance fee. The fee is taken from generated yield only, never from your principal. Points are tracked separately and will be converted into tokens once the points program ends and the token launches.',
    'El APY neto es el rendimiento que generan las estrategias DeFi después de la comisión de rendimiento. La comisión se aplica solo sobre el rendimiento generado, nunca sobre tu capital. Los puntos se registran por separado y se convertirán en tokens cuando termine el programa de puntos y se lance el token.',
  ],
  [
    'Your stablecoins are automatically allocated across top and safest DeFi providers. When yields shift, the system reallocates funds to maintain the best available return.',
    'Tus stablecoins se asignan automáticamente entre los proveedores DeFi principales y más seguros. Cuando cambian los rendimientos, el sistema reasigna fondos para mantener el mejor retorno disponible.',
  ],
  [
    'There are no fixed terms or lockups. You can withdraw your funds whenever you choose.',
    'No hay plazos fijos ni bloqueos. Puedes retirar tus fondos cuando quieras.',
  ],
  [
    'TVL (Total Value Locked) means the total amount of money currently deposited by all users in this strategy. It works like Assets Under Management (AUM) in traditional finance, showing how much capital is being managed right now.',
    'TVL (Total Value Locked) es la cantidad total de dinero depositada actualmente por todos los usuarios en esta estrategia. Funciona como los Activos Bajo Gestión (AUM) en las finanzas tradicionales y muestra cuánto capital se está gestionando ahora mismo.',
  ],
  [
    'Charged on generated yield only. No fee on your principal, and no management fee.',
    'Se cobra solo sobre el rendimiento generado. Sin comisión sobre tu capital y sin comisión de gestión.',
  ],
  [
    'The system constantly monitors yield across DeFi protocols and rebalances positions when conditions change — keeping your returns optimized in real time.',
    'El sistema monitorea constantemente el rendimiento entre protocolos DeFi y rebalancea posiciones cuando cambian las condiciones, manteniendo tus retornos optimizados en tiempo real.',
  ],
  [
    'Under the hood, the underlying protocols generate yield through over-collateralized lending.',
    'Bajo el capó, los protocolos subyacentes generan rendimiento mediante préstamos sobrecolateralizados.',
  ],
  [
    "Borrowers must lock more collateral than they borrow, and if they fail to repay, their collateral is liquidated to cover lenders' funds.",
    'Los prestatarios deben bloquear más colateral del que piden prestado y, si no repagan, su colateral se liquida para cubrir los fondos de los lenders.',
  ],
  [
    'This model keeps each market solvent while enabling returns on deposited assets.',
    'Este modelo mantiene cada mercado solvente y permite retornos sobre los activos depositados.',
  ],
  [
    'By aggregating these markets, the strategy diversifies exposure and smooths out fluctuations between platforms.',
    'Al agregar estos mercados, la estrategia diversifica exposición y suaviza fluctuaciones entre plataformas.',
  ],
  [
    'It automatically shifts capital toward higher-yield, balanced-risk opportunities — without any manual action required from the user.',
    'Mueve automáticamente el capital hacia oportunidades de mayor rendimiento y riesgo equilibrado, sin requerir acciones manuales del usuario.',
  ],
  [
    'Annual Percentage Yield shows how much your money could earn in one year if profits are reinvested. In DeFi the rate changes over time depending on market activity.',
    'El APY muestra cuánto podría generar tu dinero en un año si los beneficios se reinvierten. En DeFi la tasa cambia con el tiempo según la actividad del mercado.',
  ],
  [
    'Shows how much your balance could grow, including your deposit and potential income for the selected period. The amount is based on the current APY and can change as the rate updates.',
    'Muestra cuánto podría crecer tu saldo, incluyendo tu depósito y el ingreso potencial del periodo seleccionado. El importe se basa en el APY actual y puede cambiar cuando la tasa se actualice.',
  ],
  [
    'Displays your projected total profit if you keep funds for the full selected period. Earnings are added back to your deposit, so your balance can grow faster over time.',
    'Muestra tu beneficio total proyectado si mantienes los fondos durante todo el periodo seleccionado. Las ganancias se suman a tu depósito, por lo que tu saldo puede crecer más rápido con el tiempo.',
  ],
  [
    'You receive 2 points for every $1 you hold each day.',
    'Recibes 2 puntos por cada $1 que mantienes cada día.',
  ],
  [
    'For example, holding 1,000 USDC for one year gives you about 730,000 points.',
    'Por ejemplo, mantener 1.000 USDC durante un año te da aproximadamente 730.000 puntos.',
  ],
  [
    'Here you can see how your deposit grows over time and what average return the strategy is generating for you. The chart shows both your earned amount for the selected period and the average APY the strategy maintained during that time.',
    'Aquí puedes ver cómo crece tu depósito con el tiempo y qué retorno promedio genera la estrategia para ti. El gráfico muestra tanto el importe ganado en el periodo seleccionado como el APY promedio que mantuvo la estrategia.',
  ],
  [
    'Shows the total points you have earned in the program from all eligible activities.',
    'Muestra el total de puntos que has ganado en el programa por todas las actividades elegibles.',
  ],
  [
    'Your current position among all participants. Top users may be eligible for end-of-season rewards; exact terms and rewards are subject to change and will be announced separately.',
    'Tu posición actual entre todos los participantes. Los usuarios top pueden ser elegibles para recompensas de fin de temporada; los términos y recompensas exactos pueden cambiar y se anunciarán por separado.',
  ],
  ['Season ', 'Temporada '],
  [' PTS', ' PTS'],
  ['You’re ', 'Estás '],
  [' on the whitelist.', ' en la whitelist.'],
  [
    'Deposit now to activate increased rewards while early slots are still active.',
    'Deposita ahora para activar recompensas aumentadas mientras los cupos tempranos sigan activos.',
  ],
  ['deposit', 'depósito'],
  ['withdraw', 'retiro'],
];

const originalText = new WeakMap<Node, string>();
const translatedText = new WeakMap<Node, string>();
const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA', 'NOSCRIPT']);
const ATTRIBUTE_NAMES = ['placeholder', 'title', 'aria-label', 'alt'];

function translateSource(value: string) {
  const leading = value.match(/^\s*/)?.[0] || '';
  const trailing = value.match(/\s*$/)?.[0] || '';
  const trimmed = value.trim().replace(/\s+/g, ' ');

  if (!trimmed) return value;

  const exact = EXACT_TRANSLATIONS[trimmed];
  let translated = exact ?? trimmed;

  if (exact === undefined) {
    for (const [source, target] of PHRASE_TRANSLATIONS) {
      translated = translated.split(source).join(target);
    }
  }

  return translated === trimmed ? value : `${leading}${translated}${trailing}`;
}

function shouldSkipNode(node: Node) {
  const parent = node.parentElement;
  return !parent || Boolean(parent.closest('[data-no-translate]')) || SKIP_TAGS.has(parent.tagName);
}

function translateTextNode(node: Node, locale: string) {
  if (shouldSkipNode(node)) return;

  if (locale === 'en') {
    const source = originalText.get(node);
    if (source !== undefined && node.nodeValue !== source) node.nodeValue = source;
    return;
  }

  const current = node.nodeValue || '';
  let source = originalText.get(node);
  const previousTranslation = translatedText.get(node);

  if (source === undefined || (current !== source && current !== previousTranslation)) {
    source = current;
    originalText.set(node, source);
  }

  const translated = translateSource(source);
  translatedText.set(node, translated);
  if (translated !== current) node.nodeValue = translated;
}

function translateAttributes(element: Element, locale: string) {
  for (const name of ATTRIBUTE_NAMES) {
    if (!element.hasAttribute(name)) continue;

    const dataName = `data-i18n-original-${name}`;
    const saved = element.getAttribute(dataName);
    const current = element.getAttribute(name) || '';

    if (locale === 'en') {
      if (saved !== null) element.setAttribute(name, saved);
      continue;
    }

    const source = saved ?? current;
    if (saved === null) element.setAttribute(dataName, source);
    element.setAttribute(name, translateSource(source));
  }
}

function applyTranslations(root: Node, locale: string) {
  if (!root) return;

  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root, locale);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

  const element = root.nodeType === Node.ELEMENT_NODE ? (root as Element) : null;
  if (element) {
    if (element.closest('[data-no-translate]') || SKIP_TAGS.has(element.tagName)) return;
    translateAttributes(element, locale);
  }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const nodeElement = node as Element;
        if (nodeElement.closest('[data-no-translate]') || SKIP_TAGS.has(nodeElement.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }

      return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    },
  });

  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      translateTextNode(node, locale);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      translateAttributes(node as Element, locale);
    }
    node = walker.nextNode();
  }
}

type LanguageContextValue = {
  locale: string;
  setLocale: (locale: string) => void;
};

const LanguageContext = createContext<LanguageContextValue>({ locale: 'en', setLocale: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState('en');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LOCALES.has(saved || '')) setLocaleState(saved as string);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'es' ? 'es' : 'en';
    window.localStorage.setItem(STORAGE_KEY, locale);
    applyTranslations(document.body, locale);

    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach(node => applyTranslations(node, locale));
        if (mutation.type === 'characterData') applyTranslations(mutation.target, locale);
      }
    });

    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  const setLocale = useCallback((nextLocale: string) => {
    if (LOCALES.has(nextLocale)) setLocaleState(nextLocale);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <LanguageSwitcher />
    </LanguageContext.Provider>
  );
}

function useLanguage() {
  return useContext(LanguageContext);
}

function luminanceOf(cssColor: string) {
  const m = cssColor.match(/\d+(\.\d+)?/g);
  if (!m) return 1;
  if (m.length >= 4 && parseFloat(m[3]) === 0) return -1;
  return (0.2126 * Number(m[0]) + 0.7152 * Number(m[1]) + 0.0722 * Number(m[2])) / 255;
}

function darkAtPoint(el: HTMLElement, x: number, y: number) {
  const els = document.elementsFromPoint(x, y);
  for (let i = 0; i < els.length; i += 1) {
    if (el.contains(els[i])) continue;
    const L = luminanceOf(getComputedStyle(els[i]).backgroundColor);
    if (L < 0) continue;
    return L < 0.45;
  }
  return false;
}

function isBehindDark(el: HTMLElement | null) {
  if (!el) return false;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  const x = Math.min(window.innerWidth - 4, Math.max(4, r.left + r.width / 2));
  const y = Math.min(window.innerHeight - 4, Math.max(4, r.top + r.height / 2));
  return darkAtPoint(el, x, y);
}

function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const rootRef = useRef<HTMLDivElement>(null);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const THEME_INTERVAL = 32;
    let lastRun = 0;
    let lastY = NaN;
    let trailingT = 0;

    const updateTheme = () => {
      lastRun = performance.now();
      setOnDark(isBehindDark(rootRef.current));
    };

    const onScroll = () => {
      const y = (window as Window & { __smoothY?: number }).__smoothY ?? window.scrollY;
      if (y === lastY) return;
      lastY = y;

      window.clearTimeout(trailingT);
      if (performance.now() - lastRun >= THEME_INTERVAL) updateTheme();
      else trailingT = window.setTimeout(updateTheme, THEME_INTERVAL);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    let resizeT = 0;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(updateTheme, 120);
    };
    window.addEventListener('resize', onResize);
    updateTheme();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(trailingT);
      window.clearTimeout(resizeT);
    };
  }, []);

  // Hover expands the pill on pointer devices; touch needs an explicit tap on
  // the active language, so it also has to close on an outside tap.
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (next: string) => {
    if (next === locale) {
      setOpen(value => !value);
      return;
    }
    setLocale(next);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`thesauros-language-switcher${onDark ? ' switcher-on-dark' : ''}${open ? ' is-open' : ''}`}
      role="group"
      aria-label="Language selection"
      data-no-translate
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`lang-option lang-en ${locale === 'en' ? 'active' : ''}`}
        onClick={() => pick('en')}
        aria-label="English"
        aria-pressed={locale === 'en'}
      >
        <span className="lang-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="60" height="40" fill="#012169" />
            <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
            <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="5" />
            <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
            <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="8" />
          </svg>
        </span>
        <span>En</span>
      </button>
      <span aria-hidden="true">/</span>
      <button
        type="button"
        className={`lang-option lang-es ${locale === 'es' ? 'active' : ''}`}
        onClick={() => pick('es')}
        aria-label="Español"
        aria-pressed={locale === 'es'}
      >
        <span className="lang-flag" aria-hidden="true">
          <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="60" height="40" fill="#AA151B" />
            <rect y="10" width="60" height="20" fill="#F1BF00" />
          </svg>
        </span>
        <span>Sp</span>
      </button>
      <style>{`
        .thesauros-language-switcher {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 2147483647;
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 5px;
          border: 1px solid rgba(255, 255, 255, 0.28);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.35);
          box-shadow: 0 14px 34px rgba(10, 20, 32, 0.16);
          backdrop-filter: blur(14px) saturate(1.4);
          -webkit-backdrop-filter: blur(14px) saturate(1.4);
          color: #08111f;
          font-family: inherit;
          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            color 0.25s ease;
        }

        /* Rim light + diagonal sheen, same treatment as the nav glass pill */
        .thesauros-language-switcher::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          border-radius: 999px;
          background: linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.42) 0%,
            rgba(255, 255, 255, 0.1) 20%,
            rgba(255, 255, 255, 0) 42%,
            rgba(255, 255, 255, 0) 62%,
            rgba(56, 107, 184, 0.08) 100%
          );
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.45),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          opacity: 0.8;
        }

        .thesauros-language-switcher > * {
          position: relative;
          z-index: 1;
        }

        .thesauros-language-switcher button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-width: 44px;
          border: 0;
          border-radius: 999px;
          padding: 5px 9px 5px 5px;
          background: rgba(8, 17, 31, 0.06);
          color: #08111f;
          cursor: pointer;
          font-family: inherit;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.15;
          letter-spacing: 0;
          box-shadow: inset 0 0 0 1px rgba(8, 17, 31, 0.1);
        }

        .thesauros-language-switcher .lang-flag {
          display: block;
          width: 22px;
          height: 15px;
          border-radius: 3px;
          overflow: hidden;
          box-shadow: inset 0 0 0 1px rgba(8, 17, 31, 0.18);
          flex-shrink: 0;
        }

        .thesauros-language-switcher .lang-flag svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .thesauros-language-switcher button.active {
          box-shadow:
            inset 0 0 0 2px rgba(255, 255, 255, 0.95),
            0 0 0 2px rgba(8, 17, 31, 0.78);
        }

        .thesauros-language-switcher > span {
          color: rgba(8, 17, 31, 0.36);
          font-size: 12px;
        }

        /* Adaptive contrast over dark sections, mirrors the nav */
        .thesauros-language-switcher.switcher-on-dark {
          background: rgba(8, 17, 31, 0.55);
          border-color: rgba(255, 255, 255, 0.28);
          color: #fff;
        }

        .thesauros-language-switcher.switcher-on-dark button {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
        }

        .thesauros-language-switcher.switcher-on-dark button.active {
          box-shadow:
            inset 0 0 0 2px rgba(8, 17, 31, 0.6),
            0 0 0 2px rgba(255, 255, 255, 0.85);
        }

        .thesauros-language-switcher.switcher-on-dark > span {
          color: rgba(255, 255, 255, 0.45);
        }

        /* Collapsed to the active language only; expands on hover / focus / tap */
        .thesauros-language-switcher button:not(.active),
        .thesauros-language-switcher > span {
          max-width: 0;
          min-width: 0;
          opacity: 0;
          padding-left: 0;
          padding-right: 0;
          margin: 0;
          border-width: 0;
          box-shadow: none;
          overflow: hidden;
          white-space: nowrap;
          pointer-events: none;
          transition:
            max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            opacity 0.25s ease 0.05s,
            padding 0.35s cubic-bezier(0.4, 0, 0.2, 1),
            margin 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .thesauros-language-switcher button.active {
          transition: margin 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .thesauros-language-switcher:hover button:not(.active),
        .thesauros-language-switcher:focus-within button:not(.active),
        .thesauros-language-switcher.is-open button:not(.active) {
          max-width: 80px;
          min-width: 44px;
          opacity: 1;
          padding: 5px 9px 5px 5px;
          pointer-events: auto;
          box-shadow: inset 0 0 0 1px rgba(8, 17, 31, 0.1);
        }

        .thesauros-language-switcher.switcher-on-dark:hover button:not(.active),
        .thesauros-language-switcher.switcher-on-dark:focus-within button:not(.active),
        .thesauros-language-switcher.switcher-on-dark.is-open button:not(.active) {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
        }

        .thesauros-language-switcher:hover > span,
        .thesauros-language-switcher:focus-within > span,
        .thesauros-language-switcher.is-open > span {
          max-width: 12px;
          opacity: 1;
          margin: 0 5px;
          pointer-events: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .thesauros-language-switcher,
          .thesauros-language-switcher button,
          .thesauros-language-switcher > span {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
