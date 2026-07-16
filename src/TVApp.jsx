import React, { useState, useMemo, useEffect } from "react";
import {
  Home, Tv, Film, Layers, Heart, Settings, Search, Bell, User,
  Wifi, Phone, Play, Megaphone, Lock, Eye, EyeOff, X, Radio, MessageCircle,
  LogOut, ChevronRight, ChevronUp, ChevronDown, Globe, Moon, Volume2, Info, Check, CalendarClock
} from "lucide-react";
import { api, resource } from "./api.js";
import { useTVNavigation, TV_FOCUS_STYLES } from "./useTVNavigation";

/* ----------------------------- Design tokens ----------------------------- */
const C = {
  bg: "#050B1A",
  bgRaised: "#0A1830",
  bgCard: "#0F2140",
  bgCardHover: "#15305C",
  line: "#1E3560",
  primary: "#1868E0",
  cyan: "#3FA9F5",
  ember: "#E8293D",
  green: "#22C55E",
  amber: "#F5A623",
  purple: "#5B6FE0",
  text: "#F3F7FF",
  textDim: "#8FA3C7",
  textFaint: "#526287",
};

function cx(...a) { return a.filter(Boolean).join(" "); }

/* ----------------------------- Language / translations ----------------------------- */

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "French" },
  { code: "ht", label: "Kreyòl" },
  { code: "es", label: "Español" },
];

const TRANSLATIONS = {
  nav_home: { en: "Home", fr: "Accueil", ht: "Akèy", es: "Inicio" },
  nav_live: { en: "Live TV", fr: "TV en direct", ht: "Live TV", es: "TV en vivo" },
  nav_movies: { en: "Movies", fr: "Films", ht: "Fim", es: "Películas" },
  nav_series: { en: "Series", fr: "Séries", ht: "Seri", es: "Series" },
  nav_favorites: { en: "Favorites", fr: "Favoris", ht: "Favori", es: "Favoritos" },
  nav_settings: { en: "Settings", fr: "Paramètres", ht: "Paramèt", es: "Ajustes" },
  greeting_home: { en: "Good morning", fr: "Bonjour", ht: "Bonjou", es: "Buenos días" },

  hero_title1: { en: "ULTRA FAST INTERNET", fr: "INTERNET ULTRA RAPIDE", ht: "ENTÈNÈT ULTRA RAPID", es: "INTERNET ULTRA RÁPIDO" },
  hero_title2: { en: "FOR YOUR HOME", fr: "POUR VOTRE MAISON", ht: "POU KAY OU", es: "PARA TU HOGAR" },
  hero_feature1: { en: "Stable Connection", fr: "Connexion stable", ht: "Koneksyon estab", es: "Conexión estable" },
  hero_feature2: { en: "High Speed", fr: "Haut débit", ht: "Wo vitès", es: "Alta velocidad" },
  hero_feature3: { en: "24/7 Support", fr: "Support 24/7", ht: "Sipò 24/7", es: "Soporte 24/7" },
  hero_subscribe: { en: "SUBSCRIBE NOW", fr: "ABONNEZ-VOUS", ht: "ABÒNE KOUNYE A", es: "SUSCRÍBETE" },

  tile_live_label: { en: "LIVE TV", fr: "TV EN DIRECT", ht: "LIVE TV", es: "TV EN VIVO" },
  tile_live_sub: { en: "Watch live channels", fr: "Regarder les chaînes en direct", ht: "Gade chanèl an dirèk", es: "Ver canales en vivo" },
  tile_live_badge: { en: "LIVE", fr: "DIRECT", ht: "LIVE", es: "VIVO" },
  tile_movies_label: { en: "MOVIES", fr: "FILMS", ht: "FIM", es: "PELÍCULAS" },
  tile_movies_sub: { en: "Thousands of movies", fr: "Des milliers de films", ht: "Plizyè milye fim", es: "Miles de películas" },
  tile_series_label: { en: "SERIES", fr: "SÉRIES", ht: "SERI", es: "SERIES" },
  tile_series_sub: { en: "Popular TV shows", fr: "Séries populaires", ht: "Seri popilè", es: "Series populares" },
  tile_fav_label: { en: "FAVORITES", fr: "FAVORIS", ht: "FAVORI", es: "FAVORITOS" },
  tile_fav_sub: { en: "Your favorite content", fr: "Votre contenu préféré", ht: "Kontni ou pi renmen", es: "Tu contenido favorito" },

  section_continue: { en: "CONTINUE WATCHING", fr: "CONTINUER À REGARDER", ht: "KONTINYE GADE", es: "SEGUIR VIENDO" },
  section_trending: { en: "TRENDING NOW", fr: "TENDANCES", ht: "KI POPILÈ KOUNYE A", es: "TENDENCIAS" },
  section_live_events: { en: "LIVE & UPCOMING EVENTS", fr: "ÉVÉNEMENTS EN DIRECT ET À VENIR", ht: "EVÈNMAN AN DIRÈK AK K AP VINI", es: "EVENTOS EN VIVO Y PRÓXIMOS" },

  live_tv_title: { en: "Live TV", fr: "TV en direct", ht: "Live TV", es: "TV en vivo" },
  live_tv_subtitle: { en: "Channels with a connected stream are playable; others are listed but offline.", fr: "Les chaînes avec un flux connecté sont lisibles ; les autres sont listées mais hors ligne.", ht: "Chanèl ki gen yon stream konekte yo jwabl; lòt yo parèt men yo offline.", es: "Los canales con transmisión conectada son reproducibles; los demás aparecen pero están desconectados." },
  live_tv_loading: { en: "Loading channels…", fr: "Chargement des chaînes…", ht: "Ap chaje chanèl yo…", es: "Cargando canales…" },
  live_tv_empty: { en: "No channels available yet.", fr: "Aucune chaîne disponible pour le moment.", ht: "Poko gen chanèl disponib.", es: "Aún no hay canales disponibles." },
  category_all: { en: "All", fr: "Tout", ht: "Tout", es: "Todos" },
  guide_view_channels: { en: "Channels", fr: "Chaînes", ht: "Chanèl", es: "Canales" },
  guide_view_guide: { en: "Guide", fr: "Guide", ht: "Gid", es: "Guía" },
  guide_now: { en: "NOW", fr: "MAINT.", ht: "KOUNYE A", es: "AHORA" },
  guide_on_now: { en: "ON NOW", fr: "EN COURS", ht: "K ap pase", es: "AL AIRE" },
  go_to_guide: { en: "Go to Guide", fr: "Aller au Guide", ht: "Ale nan Gid la", es: "Ir a la Guía" },

  movies_title: { en: "Movies", fr: "Films", ht: "Fim", es: "Películas" },
  movies_subtitle: { en: "Thousands of movies to explore", fr: "Des milliers de films à découvrir", ht: "Plizyè milye fim pou eksplore", es: "Miles de películas para explorar" },
  series_title: { en: "Series", fr: "Séries", ht: "Seri", es: "Series" },
  series_subtitle: { en: "Popular TV shows", fr: "Séries populaires", ht: "Seri popilè", es: "Series populares" },
  favorites_title: { en: "Favorites", fr: "Favoris", ht: "Favori", es: "Favoritos" },
  favorites_subtitle: { en: "Your saved movies and series", fr: "Vos films et séries enregistrés", ht: "Fim ak seri ou anrejistre", es: "Tus películas y series guardadas" },
  favorites_empty_title: { en: "Nothing here yet.", fr: "Rien ici pour le moment.", ht: "Poko gen anyen isit la.", es: "Aún no hay nada aquí." },
  favorites_empty_sub: { en: "Tap the heart icon on any title to add it to your favorites.", fr: "Appuyez sur l'icône cœur d'un titre pour l'ajouter à vos favoris.", ht: "Peze icon kè a sou nenpòt tit pou ajoute l nan favori ou.", es: "Toca el ícono de corazón en cualquier título para añadirlo a tus favoritos." },

  settings_title: { en: "Settings", fr: "Paramètres", ht: "Paramèt", es: "Ajustes" },
  settings_push_label: { en: "Push Notifications", fr: "Notifications push", ht: "Notifikasyon Push", es: "Notificaciones push" },
  settings_push_sub: { en: "Get notified about new episodes and billing", fr: "Soyez informé des nouveaux épisodes et de la facturation", ht: "Resevwa notifikasyon pou nouvo epizòd ak fakti", es: "Recibe avisos sobre nuevos episodios y facturación" },
  settings_autoplay_label: { en: "Autoplay Next Episode", fr: "Lecture automatique", ht: "Otomatikman Jwe Pwochen Epizòd", es: "Reproducción automática" },
  settings_autoplay_sub: { en: "Automatically continue to the next episode", fr: "Continue automatiquement vers l'épisode suivant", ht: "Kontinye otomatikman ak pwochen epizòd la", es: "Continúa automáticamente al siguiente episodio" },
  settings_datasaver_label: { en: "Data Saver Mode", fr: "Économie de données", ht: "Mòd Ekonomize Done", es: "Modo ahorro de datos" },
  settings_datasaver_sub: { en: "Reduce streaming quality on mobile data", fr: "Réduit la qualité en streaming sur les données mobiles", ht: "Diminye kalite streaming sou done mobil", es: "Reduce la calidad en datos móviles" },
  settings_parental_label: { en: "Parental Controls", fr: "Contrôle parental", ht: "Kontwòl Paran", es: "Control parental" },
  settings_parental_sub: { en: "Restrict mature content", fr: "Restreindre le contenu pour adultes", ht: "Restrenn kontni pou granmoun", es: "Restringir contenido para adultos" },
  settings_language_label: { en: "App Language", fr: "Langue de l'application", ht: "Lang Aplikasyon an", es: "Idioma de la app" },
  settings_version: { en: "BenTech TV Stick — App version 1.0.0", fr: "BenTech TV Stick — Version 1.0.0", ht: "BenTech TV Stick — Vèsyon 1.0.0", es: "BenTech TV Stick — Versión 1.0.0" },
  settings_logout: { en: "Log Out", fr: "Déconnexion", ht: "Dekonekte", es: "Cerrar sesión" },

  notif_title: { en: "Notifications", fr: "Notifications", ht: "Notifikasyon", es: "Notificaciones" },
  notif_mark_all: { en: "Mark all read", fr: "Tout marquer comme lu", ht: "Make tout li", es: "Marcar todo como leído" },

  profile_my_account: { en: "My Account", fr: "Mon compte", ht: "Kont Mwen", es: "Mi cuenta" },
  profile_customer: { en: "Customer", fr: "Client", ht: "Kliyan", es: "Cliente" },
  profile_settings: { en: "Settings", fr: "Paramètres", ht: "Paramèt", es: "Ajustes" },
  profile_logout: { en: "Log Out", fr: "Déconnexion", ht: "Dekonekte", es: "Cerrar sesión" },

  login_title: { en: "Activate Your Account", fr: "Activez votre compte", ht: "Aktive Kont Ou", es: "Activa tu cuenta" },
  login_subtitle: { en: "Enter your activation code to continue", fr: "Entrez votre code d'activation pour continuer", ht: "Antre kòd aktivasyon ou pou kontinye", es: "Ingresa tu código de activación para continuar" },
  login_error: { en: "Enter at least 6 digits", fr: "Entrez au moins 6 chiffres", ht: "Antre omwen 6 chif", es: "Ingresa al menos 6 dígitos" },
  login_activate: { en: "ACTIVATE", fr: "ACTIVER", ht: "AKTIVE", es: "ACTIVAR" },
  login_activating: { en: "ACTIVATING...", fr: "ACTIVATION...", ht: "AP AKTIVE...", es: "ACTIVANDO..." },
  login_no_code: { en: "Don't have a code?", fr: "Vous n'avez pas de code ?", ht: "Ou pa gen kòd?", es: "¿No tienes un código?" },
  login_contact_provider: { en: "Contact your provider", fr: "Contactez votre fournisseur", ht: "Kontakte founisè ou", es: "Contacta a tu proveedor" },
  login_need_help: { en: "Need help?", fr: "Besoin d'aide ?", ht: "Ou bezwen èd?", es: "¿Necesitas ayuda?" },
  login_whatsapp: { en: "Contact us on WhatsApp", fr: "Contactez-nous sur WhatsApp", ht: "Kontakte nou sou WhatsApp", es: "Contáctanos por WhatsApp" },

  search_placeholder: { en: "Search movies, series, channels...", fr: "Rechercher films, séries, chaînes...", ht: "Chèche fim, seri, chanèl...", es: "Buscar películas, series, canales..." },
  search_cancel: { en: "Cancel", fr: "Annuler", ht: "Anile", es: "Cancelar" },
  search_no_matches: { en: "No matches found.", fr: "Aucun résultat trouvé.", ht: "Pa gen rezilta jwenn.", es: "No se encontraron resultados." },
};

const LanguageContext = React.createContext({ lang: "en", setLang: () => {}, t: (k) => k });

function useTranslation() {
  return React.useContext(LanguageContext);
}

function t(lang, key) {
  return TRANSLATIONS[key]?.[lang] || TRANSLATIONS[key]?.en || key;
}

/* ----------------------------- Shared bits ----------------------------- */

/* ⚠️ IMPORTANT: paste YOUR original LOGO_SRC base64 string here — this
   placeholder is intentionally short so the file stays manageable. Copy
   the long `data:image/png;base64,...` value from your current TVApp.jsx
   and replace the line below with it before committing. */
const LOGO_SRC = "REPLACE_WITH_YOUR_ORIGINAL_LOGO_BASE64_STRING";

function Logo({ size = 40 }) {
  return (
    <img
      src={LOGO_SRC}
      alt="BenTech TV Stick"
      style={{ height: size, width: "auto", objectFit: "contain" }}
      className="select-none"
    />
  );
}

function SignalRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute rounded-full border animate-pulse"
          style={{
            width: 180 + i * 140,
            height: 180 + i * 140,
            borderColor: `${C.cyan}${i === 0 ? "40" : i === 1 ? "26" : "14"}`,
            animationDuration: `${3 + i}s`,
          }}
        />
      ))}
    </div>
  );
}

function NavShell({ items, activeId, onSelect, footer }) {
  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-full"
      style={{ width: 236, background: C.bgRaised, borderRight: `1px solid ${C.line}` }}
    >
      <div className="px-5 py-6">
        <Logo size={38} />
      </div>
      <nav className="flex-1 px-3 space-y-1 mt-2">
        {items.map((it) => {
          const active = it.id === activeId;
          return (
            <button
              key={it.id}
              onClick={() => onSelect(it.id)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? C.primary : "transparent",
                color: active ? "#fff" : C.textDim,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = C.bgCard; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <it.icon size={17} />
              {it.label}
            </button>
          );
        })}
      </nav>
      {footer}
    </aside>
  );
}

/* ----------------------------- Content data ----------------------------- */

const movies = [
  { t: "Fast X", tag: "ACTION", grad: [C.ember, "#8B1424"] },
  { t: "John Wick", tag: "THRILLER", grad: ["#1a1a2e", "#0f0f1a"] },
  { t: "Spider-Man", tag: "ADVENTURE", grad: [C.ember, "#7A1128"] },
  { t: "Steel Horizon", tag: "SCI-FI", grad: ["#0f2a3d", "#081826"] },
  { t: "Midnight Runner", tag: "THRILLER", grad: ["#2a1a3d", "#150c1f"] },
  { t: "Neon Pulse", tag: "ACTION", grad: ["#3d0f2a", "#1f0817"] },
  { t: "Silver Comet", tag: "ADVENTURE", grad: ["#0f3d33", "#081f1a"] },
  { t: "Crimson Tide City", tag: "DRAMA", grad: ["#3d1a0f", "#1f0d08"] },
];
const series = [
  { t: "Vikings", tag: "DRAMA", grad: ["#2b2b2b", "#111"] },
  { t: "Lupin", tag: "CRIME", grad: ["#1f2a3d", "#0b1220"] },
  { t: "The Last of Us", tag: "DRAMA", grad: ["#233327", "#0e1a12"] },
  { t: "Shadow Harbor", tag: "MYSTERY", grad: ["#1a2233", "#0c1119"] },
  { t: "North Station", tag: "CRIME", grad: ["#22201a", "#11100d"] },
  { t: "Echo Valley", tag: "DRAMA", grad: ["#1a2b2b", "#0d1616"] },
  { t: "Glass City", tag: "SCI-FI", grad: ["#231a33", "#120d1a"] },
  { t: "Wildfire Point", tag: "ACTION", grad: ["#332215", "#19110a"] },
];
const continueWatching = [
  { t: "The Last of Us", sub: "S1 • E5", pct: 62, grad: ["#233327", "#0e1a12"] },
  { t: "John Wick", sub: "Movie", pct: 34, grad: ["#1a1a2e", "#0f0f1a"] },
  { t: "Lupin", sub: "S2 • E3", pct: 80, grad: ["#1f2a3d", "#0b1220"] },
  { t: "Vikings", sub: "S6 • E10", pct: 20, grad: ["#2b2b2b", "#111"] },
  { t: "Spider-Man", sub: "Movie", pct: 48, grad: [C.ember, "#7A1128"] },
];

const notifications = [
  { id: 1, title: "Subscription renews in 3 days", time: "1 hour ago", read: false },
  { id: 2, title: "New episode of Vikings is available", time: "5 hours ago", read: false },
  { id: 3, title: "Payment of $59.99 received", time: "1 day ago", read: false },
  { id: 4, title: "New device connected to your account", time: "2 days ago", read: true },
];

const DEMO_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

/* ----------------------------- Video player ----------------------------- */

function VideoPlayer({ src }) {
  const videoRef = React.useRef(null);
  const [status, setStatus] = useState("loading");

  React.useEffect(() => {
    let hls;
    const video = videoRef.current;
    if (!video || !src) return;

    async function setup() {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        video.addEventListener("loadedmetadata", () => setStatus("ready"));
        video.addEventListener("error", () => setStatus("error"));
        return;
      }
      try {
        const mod = await import("https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js");
        const Hls = mod.default || window.Hls;
        if (Hls && Hls.isSupported()) {
          hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => setStatus("ready"));
          hls.on(Hls.Events.ERROR, (_e, data) => { if (data.fatal) setStatus("error"); });
        } else {
          setStatus("error");
        }
      } catch (e) {
        setStatus("error");
      }
    }
    setup();
    return () => { if (hls) hls.destroy(); };
  }, [src]);

  return (
    <div className="relative w-full h-full bg-black">
      <video ref={videoRef} controls autoPlay playsInline className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs" style={{ color: C.textDim }}>
          Loading stream…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs px-6 text-center" style={{ color: C.ember }}>
          Could not load this stream. Check the URL or your connection.
        </div>
      )}
    </div>
  );
}

function PlayModal({ item, onClose }) {
  if (!item) return null;
  const label = item.t || item.name || item.title;
  const usingDemoStream = !item.streamUrl;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,.75)" }} onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl overflow-hidden" style={{ background: C.bgCard, border: `1px solid ${C.line}` }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
          <div className="text-sm font-semibold text-white">{label}</div>
          <button onClick={onClose}><X size={18} color={C.textDim} /></button>
        </div>
        <div className="aspect-video">
          <VideoPlayer src={item.streamUrl || DEMO_HLS_URL} />
        </div>
        {usingDemoStream && (
          <div className="px-4 py-2 text-[11px]" style={{ color: C.textFaint, borderTop: `1px solid ${C.line}` }}>
            Demo stream. Connect your own licensed source for {label}.
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Cards ----------------------------- */

function PosterCard({ title, tag, grad, onPlay, favorited, onToggleFav }) {
  return (
    <button
      className="relative rounded-xl overflow-hidden shrink-0 group w-40 text-left"
      style={{ aspectRatio: "2/3", background: `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` }}
      onClick={onPlay}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
        <Film size={48} color="#fff" />
      </div>
      {onToggleFav && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onToggleFav(); } }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(0,0,0,.55)" }}
        >
          <Heart size={14} color={favorited ? C.ember : "#fff"} fill={favorited ? C.ember : "none"} />
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,.85), transparent)" }}>
        <div className="text-xs font-bold tracking-wide" style={{ color: C.cyan }}>{tag}</div>
        <div className="text-sm font-semibold text-white leading-tight mt-0.5">{title}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,.35)" }}>
        <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: C.primary }}>
          <Play size={18} fill="#fff" color="#fff" />
        </div>
      </div>
    </button>
  );
}

function ContinueCard({ item, onPlay }) {
  return (
    <button className="shrink-0 w-52 group text-left" onClick={onPlay}>
      <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "16/10", background: `linear-gradient(160deg, ${item.grad[0]}, ${item.grad[1]})` }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Film size={40} color="#fff" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,.35)" }}>
          <Play size={26} fill="#fff" color="#fff" />
        </div>
      </div>
      <div className="mt-2">
        <div className="text-sm font-semibold text-white truncate">{item.t}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>{item.sub}</div>
        <div className="h-1 rounded-full mt-1.5" style={{ background: C.line }}>
          <div className="h-1 rounded-full" style={{ width: `${item.pct}%`, background: C.cyan }} />
        </div>
      </div>
    </button>
  );
}

/* ----------------------------- Live TV panel ----------------------------- */

const channelsApi = resource("channels", "name");
const programsApi = resource("programs", "id");
const categoryColor = {
  News: C.primary, Sports: C.green, Movies: C.purple, Kids: C.amber,
  Music: C.cyan, Documentary: C.ember,
};

function ChannelCard({ channel, onPlay, nowPlaying }) {
  const color = categoryColor[channel.category] || C.primary;
  const playable = !!channel.streamUrl;
  return (
    <button
      onClick={() => playable && onPlay(channel)}
      className="text-left rounded-xl overflow-hidden group"
      style={{ background: C.bgCard, border: `1px solid ${C.line}`, cursor: playable ? "pointer" : "default" }}
    >
      <div className="relative h-24 flex items-center justify-center" style={{ background: `linear-gradient(150deg, ${color}33, ${color}0D)` }}>
        <Radio size={28} color={color} />
        {playable ? (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex items-center gap-1" style={{ background: C.ember }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
          </span>
        ) : (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: C.bgRaised, color: C.textFaint }}>
            OFFLINE
          </span>
        )}
        <span className="absolute top-2 right-2 text-[11px] font-black px-1.5 py-0.5 rounded" style={{ background: `${C.primary}22`, color: C.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
          {channel.order}
        </span>
        {playable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,.4)" }}>
            <Play size={22} fill="#fff" color="#fff" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-white truncate">{channel.name}</div>
        <div className="text-xs truncate" style={{ color: nowPlaying ? C.textDim : C.textFaint }}>
          {nowPlaying ? nowPlaying.title : channel.category}
        </div>
      </div>
    </button>
  );
}

/* ----------------------------- EPG Guide (grid) ----------------------------- */

const PX_PER_MIN = 4;
const WINDOW_HOURS = 4;
const CHANNEL_COL_WIDTH = 108;
const ROW_HEIGHT = 68;
const HEADER_HEIGHT = 32;

function EpgGuide({ channels, onPlay, programs, loading }) {
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const windowStart = useMemo(() => {
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - (d.getMinutes() % 30), 0, 0);
    return d;
  }, [now]);

  const totalMinutes = WINDOW_HOURS * 60;
  const totalWidth = totalMinutes * PX_PER_MIN;
  const windowEnd = new Date(windowStart.getTime() + totalMinutes * 60000);

  const timeLabels = [];
  for (let m = 0; m <= totalMinutes; m += 30) {
    const tt = new Date(windowStart.getTime() + m * 60000);
    timeLabels.push({ left: m * PX_PER_MIN, label: tt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) });
  }

  const nowOffset = Math.max(0, Math.min(totalWidth, (now - windowStart) / 60000 * PX_PER_MIN));

  const totalHeight = HEADER_HEIGHT + channels.length * ROW_HEIGHT;

  function blockStyle(p) {
    const start = new Date(p.start);
    const end = new Date(p.end);
    if (end <= windowStart || start >= windowEnd) return null;
    const clippedStart = start < windowStart ? windowStart : start;
    const clippedEnd = end > windowEnd ? windowEnd : end;
    const left = (clippedStart - windowStart) / 60000 * PX_PER_MIN;
    const width = Math.max(24, (clippedEnd - clippedStart) / 60000 * PX_PER_MIN);
    const isLive = now >= start && now < end;
    return { left, width, isLive };
  }

  if (loading) {
    return <div className="text-sm py-10 text-center" style={{ color: C.textFaint }}>{t("live_tv_loading")}</div>;
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.line}`, boxShadow: "0 20px 50px rgba(0,0,0,.35)" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.cyan}, ${C.ember})` }} />
      <div style={{ overflow: "auto", maxHeight: 480, background: C.bg }}>
        <div style={{ position: "relative", width: CHANNEL_COL_WIDTH + totalWidth }}>
          <div className="flex" style={{ position: "sticky", top: 0, zIndex: 30 }}>
            <div style={{ width: CHANNEL_COL_WIDTH, height: HEADER_HEIGHT, position: "sticky", left: 0, zIndex: 31, background: C.bgRaised, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} />
            <div style={{ position: "relative", width: totalWidth, height: HEADER_HEIGHT, background: C.bgRaised, borderBottom: `1px solid ${C.line}` }}>
              {timeLabels.map((tl, i) => (
                <div
                  key={i}
                  className="absolute text-[10px] font-semibold top-0 h-full flex items-center tracking-wide"
                  style={{ left: tl.left, color: i === 0 ? C.cyan : C.textFaint, borderLeft: i > 0 ? `1px solid ${C.line}` : "none", paddingLeft: 6, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {tl.label}
                </div>
              ))}
            </div>
          </div>

          <div
            className="absolute"
            style={{
              left: CHANNEL_COL_WIDTH + nowOffset,
              top: HEADER_HEIGHT,
              width: 2,
              height: totalHeight - HEADER_HEIGHT,
              background: C.ember,
              boxShadow: `0 0 10px 1px ${C.ember}99`,
              zIndex: 25,
              pointerEvents: "none",
            }}
          />
          <div
            className="absolute flex items-center justify-center"
            style={{ left: CHANNEL_COL_WIDTH + nowOffset, top: 0, height: HEADER_HEIGHT, transform: "translateX(-50%)", zIndex: 32, pointerEvents: "none" }}
          >
            <div
              className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap"
              style={{ background: C.ember, boxShadow: `0 0 8px ${C.ember}88` }}
            >
              {t("guide_now")}
            </div>
          </div>

          {channels.map((ch, rowIdx) => {
            return (
              <div key={ch.name} className="flex" style={{ borderTop: `1px solid ${C.line}`, background: rowIdx % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                <div
                  className="flex items-center gap-2 px-2.5"
                  style={{ width: CHANNEL_COL_WIDTH, height: ROW_HEIGHT, position: "sticky", left: 0, zIndex: 15, background: C.bgCard, borderRight: `1px solid ${C.line}` }}
                >
                  <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 font-black text-[11px]" style={{ background: `${C.primary}22`, color: C.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {ch.order}
                  </div>
                  <span className="text-[11px] font-semibold text-white truncate leading-tight">{ch.name}</span>
                </div>
                <div style={{ position: "relative", width: totalWidth, height: ROW_HEIGHT }}>
                  {programs.filter((p) => p.channel === ch.name).map((p) => {
                    const style = blockStyle(p);
                    if (!style) return null;
                    const playable = style.isLive && !!ch.streamUrl;
                    return (
                      <button
                        key={p.id}
                        onClick={() => playable && onPlay(ch)}
                        className={cx("absolute top-2 bottom-2 rounded-lg px-2.5 text-left overflow-hidden transition-all", playable && "hover:brightness-125")}
                        style={{
                          left: style.left + 2,
                          width: style.width - 4,
                          background: style.isLive
                            ? `linear-gradient(135deg, ${C.primary}55, ${C.primary}22)`
                            : `linear-gradient(135deg, ${C.bgCard}, ${C.bgRaised})`,
                          border: `1px solid ${style.isLive ? C.primary : C.line}`,
                          boxShadow: style.isLive ? `0 0 14px ${C.primary}33` : "none",
                          cursor: playable ? "pointer" : "default",
                        }}
                      >
                        {style.isLive && (
                          <div className="flex items-center gap-1 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.ember }} />
                            <span className="text-[8px] font-bold tracking-wide" style={{ color: C.ember }}>{t("guide_on_now")}</span>
                          </div>
                        )}
                        <div className="text-[11px] font-semibold text-white truncate leading-tight">{p.title}</div>
                        <div className="text-[10px] truncate" style={{ color: C.textFaint }}>
                          {new Date(p.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LiveTVPanel({ onPlay, channels, loading, view, setView }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [viewMenuOpen, setViewMenuOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    programsApi.list().then(setPrograms).catch(() => {}).finally(() => setProgramsLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  function getNowPlaying(channelName) {
    return programs.find((p) => p.channel === channelName && now >= new Date(p.start) && now < new Date(p.end)) || null;
  }

  const categories = ["All", ...Array.from(new Set(channels.map((c) => c.category)))];
  const shown = filter === "All" ? channels : channels.filter((c) => c.category === filter);
  const viewOptions = [["channels", t("guide_view_channels")], ["guide", t("guide_view_guide")]];
  const currentViewLabel = viewOptions.find(([id]) => id === view)?.[1];

  return (
    <div className="px-6 md:px-8 pb-10 pt-6" onClick={() => setViewMenuOpen(false)}>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div className="text-lg font-black" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{t("live_tv_title")}</div>
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setViewMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: C.bgCard, color: C.text, border: `1px solid ${C.line}` }}
          >
            {currentViewLabel}
            <ChevronDown size={14} color={C.textFaint} style={{ transform: viewMenuOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>
          {viewMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 rounded-lg overflow-hidden z-30"
              style={{ background: C.bgCard, border: `1px solid ${C.line}`, minWidth: 150, boxShadow: "0 10px 24px rgba(0,0,0,.45)" }}
            >
              {viewOptions.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => { setView(id); setViewMenuOpen(false); }}
                  className="w-full text-left px-3.5 py-2.5 text-xs font-semibold flex items-center justify-between gap-3"
                  style={{ color: view === id ? C.primary : C.textDim, background: view === id ? `${C.primary}15` : "transparent" }}
                >
                  {label}
                  {view === id && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-xs mb-5" style={{ color: C.textFaint }}>
        {loading ? t("live_tv_loading") : t("live_tv_subtitle")}
      </p>
      {!loading && channels.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: C.textFaint }}>{t("live_tv_empty")}</div>
      ) : view === "guide" ? (
        <div className="flex gap-4 items-start">
          <div className="hidden sm:flex flex-col gap-1 shrink-0" style={{ width: 168 }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-left px-3 py-2.5 rounded-lg text-xs font-semibold"
                style={{
                  background: filter === cat ? C.bgCardHover : "transparent",
                  color: filter === cat ? C.text : C.textDim,
                  border: `1px solid ${filter === cat ? C.line : "transparent"}`,
                }}
              >
                {cat === "All" ? t("category_all") : cat}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-0">
            <EpgGuide channels={shown} onPlay={onPlay} programs={programs} loading={programsLoading} />
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{
                  background: filter === cat ? C.primary : C.bgCard,
                  color: filter === cat ? "#fff" : C.textDim,
                  border: `1px solid ${filter === cat ? C.primary : C.line}`,
                }}
              >
                {cat === "All" ? t("category_all") : cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shown.map((c) => <ChannelCard key={c.name} channel={c} onPlay={onPlay} nowPlaying={getNowPlaying(c.name)} />)}
          </div>
        </>
      )}
    </div>
  );
}

/* ----------------------------- Movies / Series / Favorites ----------------------------- */

function GridPage({ title, subtitle, items, onPlay, favorites, onToggleFav }) {
  const { t } = useTranslation();
  return (
    <div className="px-6 md:px-8 pb-10 pt-6">
      <div className="text-lg font-black mb-1" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
      {subtitle && <p className="text-xs mb-5" style={{ color: C.textFaint }}>{subtitle}</p>}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Heart size={32} color={C.textFaint} />
          <div className="text-sm" style={{ color: C.textDim }}>{t("favorites_empty_title")}</div>
          <div className="text-xs" style={{ color: C.textFaint }}>{t("favorites_empty_sub")}</div>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
          {items.map((m) => (
            <PosterCard
              key={m.t}
              title={m.t}
              tag={m.tag}
              grad={m.grad}
              onPlay={() => onPlay(m)}
              favorited={favorites.has(m.t)}
              onToggleFav={() => onToggleFav(m.t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Settings ----------------------------- */

function ToggleRow({ icon: Icon, label, sub, on, onChange }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bgCard }}>
          <Icon size={16} color={C.textDim} />
        </div>
        <div>
          <div className="text-sm font-medium text-white">{label}</div>
          {sub && <div className="text-xs" style={{ color: C.textFaint }}>{sub}</div>}
        </div>
      </div>
      <button
        onClick={() => onChange(!on)}
        className="relative w-11 h-6 rounded-full transition-colors shrink-0"
        style={{ background: on ? C.primary : C.line }}
      >
        <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? "translateX(22px)" : "translateX(2px)" }} />
      </button>
    </div>
  );
}

function SettingsPage({ onLogout }) {
  const { lang, setLang, t } = useTranslation();
  const [pushNotif, setPushNotif] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [parental, setParental] = useState(false);

  return (
    <div className="px-6 md:px-8 pb-10 pt-6 max-w-xl">
      <div className="text-lg font-black mb-5" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{t("settings_title")}</div>

      <div className="rounded-xl p-4 mb-5" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
        <ToggleRow icon={Bell} label={t("settings_push_label")} sub={t("settings_push_sub")} on={pushNotif} onChange={setPushNotif} />
        <ToggleRow icon={Play} label={t("settings_autoplay_label")} sub={t("settings_autoplay_sub")} on={autoplay} onChange={setAutoplay} />
        <ToggleRow icon={Volume2} label={t("settings_datasaver_label")} sub={t("settings_datasaver_sub")} on={dataSaver} onChange={setDataSaver} />
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bgCard }}>
              <Lock size={16} color={C.textDim} />
            </div>
            <div>
              <div className="text-sm font-medium text-white">{t("settings_parental_label")}</div>
              <div className="text-xs" style={{ color: C.textFaint }}>{t("settings_parental_sub")}</div>
            </div>
          </div>
          <button
            onClick={() => setParental((v) => !v)}
            className="relative w-11 h-6 rounded-full transition-colors shrink-0"
            style={{ background: parental ? C.primary : C.line }}
          >
            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: parental ? "translateX(22px)" : "translateX(2px)" }} />
          </button>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-5" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bgCard }}>
            <Globe size={16} color={C.textDim} />
          </div>
          <div className="text-sm font-medium text-white">{t("settings_language_label")}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: lang === l.code ? C.primary : C.bgRaised,
                color: lang === l.code ? "#fff" : C.textDim,
                border: `1px solid ${lang === l.code ? C.primary : C.line}`,
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-4 mb-5 flex items-center gap-3" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
        <Info size={16} color={C.textFaint} />
        <div className="text-xs" style={{ color: C.textFaint }}>{t("settings_version")}</div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
        style={{ background: `${C.ember}18`, color: C.ember, border: `1px solid ${C.ember}55` }}
      >
        <LogOut size={16} /> {t("settings_logout")}
      </button>
    </div>
  );
}

/* ----------------------------- Notifications & Profile popovers ----------------------------- */

function NotificationsPanel({ items, onMarkAllRead, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-30" style={{ background: C.bgCard, border: `1px solid ${C.line}`, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="text-sm font-semibold text-white">{t("notif_title")}</div>
        <button onClick={onMarkAllRead} className="text-xs font-semibold" style={{ color: C.cyan }}>{t("notif_mark_all")}</button>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {items.map((n) => (
          <div key={n.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${C.line}`, background: n.read ? "transparent" : `${C.primary}0C` }}>
            <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.read ? C.textFaint : C.cyan }} />
            <div>
              <div className="text-xs font-medium text-white">{n.title}</div>
              <div className="text-[11px]" style={{ color: C.textFaint }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePanel({ onSettings, onLogout }) {
  const { t } = useTranslation();
  return (
    <div className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden z-30" style={{ background: C.bgCard, border: `1px solid ${C.line}`, boxShadow: "0 12px 30px rgba(0,0,0,.5)" }}>
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="text-sm font-semibold text-white">{t("profile_my_account")}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>{t("profile_customer")}</div>
      </div>
      <button onClick={onSettings} className="w-full flex items-center justify-between px-4 py-3 text-sm text-white" style={{ borderBottom: `1px solid ${C.line}` }}>
        {t("profile_settings")} <ChevronRight size={14} color={C.textFaint} />
      </button>
      <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-3 text-sm" style={{ color: C.ember }}>
        <LogOut size={14} /> {t("profile_logout")}
      </button>
    </div>
  );
}

/* ----------------------------- Announcement ticker ----------------------------- */

const announcements = [
  "Welcome to BenTech TV Stick",
  "For advertising call 305-555-1234",
  "Special IPTV offers available this month",
  "New channels added to the Sports category",
  "Refer a friend and get 1 month free",
];

function AnnouncementTicker() {
  const text = announcements.join("   •   ");

  return (
    <div
      className="sticky bottom-0 flex items-center gap-3 px-4 py-2 text-xs font-medium overflow-hidden"
      style={{ background: C.bgRaised, borderTop: `1px solid ${C.line}`, color: C.green }}
    >
      <style>{`
        @keyframes bentech-ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <span className="shrink-0 px-2 py-0.5 rounded font-bold text-white" style={{ background: C.primary }}>ANNOUNCEMENT</span>
      <Megaphone size={13} className="shrink-0" />
      <div className="flex-1 overflow-hidden whitespace-nowrap">
        <div
          className="inline-block"
          style={{ animation: "bentech-ticker-scroll 22s linear infinite" }}
        >
          <span>{text}</span>
          <span className="pl-16">{text}</span>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- TV App (standalone) ----------------------------- */

function TVHomeScreen({ onLogout }) {
  const { lang, t } = useTranslation();
  const navItems = [
    { id: "home", label: t("nav_home"), icon: Home },
    { id: "live", label: t("nav_live"), icon: Tv },
    { id: "movies", label: t("nav_movies"), icon: Film },
    { id: "series", label: t("nav_series"), icon: Layers },
    { id: "fav", label: t("nav_favorites"), icon: Heart },
    { id: "settings", label: t("nav_settings"), icon: Settings },
  ];
  const [active, setActive] = useState("home");
  const [playing, setPlaying] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);
  const [channels, setChannels] = useState([]);
  const [channelsLoading, setChannelsLoading] = useState(true);
  const [liveView, setLiveView] = useState("channels"); // "channels" | "guide"

  useEffect(() => {
    channelsApi.list()
      .then((data) => setChannels(data.filter((c) => c.enabled).sort((a, b) => a.order - b.order)))
      .catch(() => {})
      .finally(() => setChannelsLoading(false));
  }, []);

  function toggleFav(title) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  }

  const unreadCount = notifList.filter((n) => !n.read).length;
  function markAllRead() {
    setNotifList((list) => list.map((n) => ({ ...n, read: true })));
  }

  const allTitles = useMemo(() => [
    ...movies.map((m) => ({ ...m, kind: "Movie" })),
    ...series.map((s) => ({ ...s, kind: "Series" })),
  ], []);
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const titleHits = allTitles.filter((m) => m.t.toLowerCase().includes(q));
    const channelHits = channels.filter((c) => c.name.toLowerCase().includes(q));
    return [...titleHits, ...channelHits.map((c) => ({ t: c.name, tag: c.category, isChannel: true, channel: c }))];
  }, [query, allTitles, channels]);

  const favItems = allTitles.filter((m) => favorites.has(m.t));

  function closePopovers() {
    setNotifOpen(false);
    setProfileOpen(false);
  }

  return (
    <div className="w-full h-screen flex" style={{ background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ${TV_FOCUS_STYLES}
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #2A4270; border-radius: 3px; }
      `}</style>

      <NavShell
        items={navItems}
        activeId={active}
        onSelect={(id) => { setActive(id); closePopovers(); setSearchOpen(false); }}
        footer={
          <div className="px-5 py-5" style={{ borderTop: `1px solid ${C.line}` }}>
            <div className="text-sm font-semibold" style={{ color: C.green }}>10:45 AM</div>
            <div className="text-xs" style={{ color: C.textFaint }}>Sunday, May 25</div>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto" onClick={() => closePopovers()}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-5 md:px-8 relative">
          <div className="md:hidden"><Logo size={32} /></div>

          {searchOpen ? (
            <div className="flex items-center gap-2 flex-1 max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
                <Search size={15} color={C.textFaint} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="bg-transparent outline-none text-sm flex-1"
                  style={{ color: C.text }}
                />
              </div>
              <button onClick={() => { setSearchOpen(false); setQuery(""); }} className="text-xs font-semibold" style={{ color: C.textDim }}>{t("search_cancel")}</button>
            </div>
          ) : (
            <div className="hidden md:block text-lg font-semibold" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>
              {active === "home" ? t("greeting_home") : ""}
            </div>
          )}

          <div className="flex items-center gap-4 relative" onClick={(e) => e.stopPropagation()}>
            {!searchOpen && (
              <button onClick={() => setSearchOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.bgCard }}>
                <Search size={16} color={C.textDim} />
              </button>
            )}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                className="w-9 h-9 rounded-full flex items-center justify-center relative"
                style={{ background: C.bgCard }}
              >
                <Bell size={16} color={C.textDim} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: C.ember }}>{unreadCount}</div>
                )}
              </button>
              {notifOpen && <NotificationsPanel items={notifList} onMarkAllRead={markAllRead} onClose={() => setNotifOpen(false)} />}
            </div>
            <div className="relative">
              <button onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.primary }}>
                <User size={16} color="#fff" />
              </button>
              {profileOpen && (
                <ProfilePanel
                  onSettings={() => { setActive("settings"); setProfileOpen(false); }}
                  onLogout={onLogout}
                />
              )}
            </div>
          </div>
        </div>

        {/* Search results */}
        {searchOpen && query.trim() && (
          <div className="px-6 md:px-8 pb-8">
            <div className="text-xs mb-3" style={{ color: C.textFaint }}>{searchResults.length} result{searchResults.length === 1 ? "" : "s"} for "{query}"</div>
            {searchResults.length === 0 ? (
              <div className="text-sm" style={{ color: C.textDim }}>{t("search_no_matches")}</div>
            ) : (
              <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
                {searchResults.map((r, i) => (
                  <PosterCard
                    key={i}
                    title={r.t}
                    tag={r.tag}
                    grad={r.grad || [C.primary, C.bgRaised]}
                    onPlay={() => setPlaying(r.isChannel ? r.channel : r)}
                    favorited={!r.isChannel && favorites.has(r.t)}
                    onToggleFav={r.isChannel ? null : () => toggleFav(r.t)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!searchOpen && active === "live" && <LiveTVPanel onPlay={setPlaying} channels={channels} loading={channelsLoading} view={liveView} setView={setLiveView} />}
        {!searchOpen && active === "movies" && (
          <GridPage title={t("movies_title")} subtitle={t("movies_subtitle")} items={movies} onPlay={setPlaying} favorites={favorites} onToggleFav={toggleFav} />
        )}
        {!searchOpen && active === "series" && (
          <GridPage title={t("series_title")} subtitle={t("series_subtitle")} items={series} onPlay={setPlaying} favorites={favorites} onToggleFav={toggleFav} />
        )}
        {!searchOpen && active === "fav" && (
          <GridPage title={t("favorites_title")} subtitle={t("favorites_subtitle")} items={favItems} onPlay={setPlaying} favorites={favorites} onToggleFav={toggleFav} />
        )}
        {!searchOpen && active === "settings" && <SettingsPage onLogout={onLogout} />}

        {!searchOpen && active === "home" && (
          <div className="px-6 md:px-8 pb-10 space-y-8">
            {channels.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 -mt-2">
                {channels.map((ch) => {
                  const accent = categoryColor[ch.category] || C.primary;
                  const playable = !!ch.streamUrl;
                  return (
                    <button
                      key={ch.name}
                      onClick={() => playable ? setPlaying(ch) : setActive("live")}
                      className="shrink-0 px-3.5 py-2.5 rounded-lg flex items-center justify-center relative"
                      style={{ background: `linear-gradient(135deg, ${accent}33, ${accent}11)`, border: `1px solid ${accent}55`, minWidth: 78 }}
                    >
                      {playable && <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.ember }} />}
                      <span className="text-[11px] font-black tracking-tight text-white whitespace-nowrap">{ch.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(120deg, #08152C, #0A1D3D)`, border: `1px solid ${C.line}` }}>
              <SignalRing />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-6 py-8 md:px-10 md:py-10">
                <div>
                  <div className="text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: C.text }}>
                    {t("hero_title1")}
                  </div>
                  <div className="text-2xl md:text-3xl font-black" style={{ color: C.green, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {t("hero_title2")}
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm" style={{ color: C.textDim }}>
                    {[t("hero_feature1"), t("hero_feature2"), t("hero_feature3")].map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: `${C.green}22` }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green }} />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Wifi size={90} color={C.cyan} strokeWidth={1.3} style={{ filter: `drop-shadow(0 0 20px ${C.cyan}66)` }} />
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Logo size={44} />
                  <button className="px-5 py-2 rounded-lg text-sm font-bold text-white" style={{ background: C.green }}>
                    {t("hero_subscribe")}
                  </button>
                  <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: C.textDim }}>
                    <Phone size={13} /> 305-555-1234
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 pb-4 relative">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-full" style={{ width: i === 0 ? 16 : 6, height: 6, background: i === 0 ? C.primary : C.line }} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("tile_live_label"), sub: t("tile_live_sub"), icon: Tv, badge: t("tile_live_badge"), grad: [C.ember, "#5E0F1E"], id: "live" },
                { label: t("tile_movies_label"), sub: t("tile_movies_sub"), icon: Film, grad: [C.purple, "#1E2E7A"], id: "movies" },
                { label: t("tile_series_label"), sub: t("tile_series_sub"), icon: Layers, grad: ["#1E3A5F", "#0B1830"], id: "series" },
                { label: t("tile_fav_label"), sub: t("tile_fav_sub"), icon: Heart, grad: [C.amber, "#8A5A0E"], id: "fav" },
              ].map((tile) => (
                <button
                  key={tile.label}
                  onClick={() => setActive(tile.id)}
                  className="relative rounded-xl overflow-hidden p-5 h-32 flex flex-col justify-between text-left"
                  style={{ background: `linear-gradient(150deg, ${tile.grad[0]}, ${tile.grad[1]})` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                      <tile.icon size={18} /> {tile.label}
                    </div>
                    {tile.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#fff", color: tile.grad[0] }}>{tile.badge}</span>
                    )}
                  </div>
                  <div className="text-xs text-white/70">{tile.sub}</div>
                </button>
              ))}
            </div>

            <LiveEventsSection onPlay={setPlaying} />

            <div>
              <div className="text-sm font-bold tracking-wide mb-3" style={{ color: C.text }}>{t("section_continue")}</div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {continueWatching.map((c) => <ContinueCard key={c.t} item={c} onPlay={() => setPlaying(c)} />)}
              </div>
            </div>

            <div>
              <div className="text-sm font-bold tracking-wide mb-3" style={{ color: C.text }}>{t("section_trending")}</div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {[...movies.slice(0, 3), ...series.slice(0, 3)].map((m) => (
                  <PosterCard
                    key={m.t}
                    title={m.t}
                    tag={m.tag}
                    grad={m.grad}
                    onPlay={() => setPlaying(m)}
                    favorited={favorites.has(m.t)}
                    onToggleFav={() => toggleFav(m.t)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <AnnouncementTicker />
      </div>

      <PlayModal item={playing} onClose={() => setPlaying(null)} />
    </div>
  );
}

/* ----------------------------- Live Events (from admin panel) ----------------------------- */

const liveEventsApi = resource("live-events", "title");

function LiveEventCard({ event, onPlay }) {
  const isLive = event.status === "Live";
  const start = event.start ? new Date(event.start) : null;
  return (
    <button
      onClick={() => isLive && event.streamUrl && onPlay(event)}
      className="shrink-0 w-64 text-left rounded-xl overflow-hidden group"
      style={{ background: C.bgCard, border: `1px solid ${C.line}`, cursor: isLive && event.streamUrl ? "pointer" : "default" }}
    >
      <div className="relative h-28 flex items-center justify-center" style={{ background: `linear-gradient(150deg, ${C.ember}33, #05070C)` }}>
        <CalendarClock size={26} color={C.ember} />
        {isLive && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex items-center gap-1" style={{ background: C.ember }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE NOW
          </span>
        )}
        {isLive && event.streamUrl && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,.4)" }}>
            <Play size={22} fill="#fff" color="#fff" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-white truncate">{event.title}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>
          {event.channel}{start ? ` • ${start.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}
        </div>
      </div>
    </button>
  );
}

function LiveEventsSection({ onPlay }) {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    liveEventsApi.list().then((data) => {
      const relevant = data.filter((e) => e.status !== "Ended").sort((a, b) => new Date(a.start) - new Date(b.start));
      setEvents(relevant);
    }).catch(() => {});
  }, []);

  if (events.length === 0) return null;

  return (
    <div>
      <div className="text-sm font-bold tracking-wide mb-3" style={{ color: C.text }}>{t("section_live_events")}</div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {events.map((ev) => <LiveEventCard key={ev.title} event={ev} onPlay={onPlay} />)}
      </div>
    </div>
  );
}

/* ----------------------------- Login screen ----------------------------- */

function LoginScreen({ onLogin }) {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleActivate() {
    const digits = code.trim();
    if (!/^\d{6,}$/.test(digits)) {
      setError(t("login_error"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await api.activate(digits);
      onLogin(`BT-${digits}`);
    } catch (e) {
      setError(e.message || "Couldn't activate this code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden" style={{ background: `radial-gradient(circle at 50% 20%, #12295A, ${C.bg} 65%)`, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        ${TV_FOCUS_STYLES}
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
      <SignalRing />
      <div className="relative w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-6">
          <Logo size={52} />
        </div>
        <div className="rounded-2xl p-6" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
          <div className="text-center mb-6">
            <div className="text-lg font-black" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>
              {t("login_title")}
            </div>
            <div className="text-xs mt-1" style={{ color: C.textDim }}>
              {t("login_subtitle")}
            </div>
          </div>
          <div className="space-y-3">
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg"
              style={{ background: C.bgRaised, border: `1px solid ${error ? C.ember : C.line}` }}
            >
              <Lock size={15} color={C.textFaint} className="shrink-0" />
              <span className="text-sm font-semibold shrink-0" style={{ color: C.cyan }}>BT-</span>
              <input
                value={code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); if (error) setError(""); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleActivate(); }}
                placeholder="12233333333"
                inputMode="numeric"
                className="bg-transparent outline-none text-sm flex-1 tracking-wider"
                style={{ color: C.text }}
              />
            </div>
            {error && (
              <div className="text-xs font-medium" style={{ color: C.ember }}>{error}</div>
            )}
            <button
              className="w-full py-2.5 rounded-lg font-bold text-white text-sm mt-2"
              style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})`, opacity: loading ? 0.7 : 1 }}
              onClick={handleActivate}
              disabled={loading}
            >
              {loading ? t("login_activating") : t("login_activate")}
            </button>
          </div>
          <div className="text-center text-xs mt-5" style={{ color: C.textFaint }}>
            {t("login_no_code")} <span style={{ color: C.cyan }}>{t("login_contact_provider")}</span>
          </div>
        </div>
        <div className="rounded-xl p-4 mt-4" style={{ background: C.bgCard, border: `1px solid ${C.line}` }}>
          <div className="text-xs font-semibold mb-2" style={{ color: C.textDim }}>{t("login_need_help")}</div>
          <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold" style={{ color: C.green, border: `1px solid ${C.green}55` }}>
            <MessageCircle size={15} /> {t("login_whatsapp")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Root ----------------------------- */

export default function App() {
  useTVNavigation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [lang, setLang] = useState("en");
  const contextValue = useMemo(() => ({
    lang,
    setLang,
    t: (key) => t(lang, key),
  }), [lang]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {loggedIn
        ? <TVHomeScreen onLogout={() => setLoggedIn(false)} />
        : <LoginScreen onLogin={() => setLoggedIn(true)} />}
    </LanguageContext.Provider>
  );
}
