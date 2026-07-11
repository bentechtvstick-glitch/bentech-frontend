import React, { useState, useMemo, useEffect } from "react";
import {
  Home, Tv, Film, Layers, Heart, Settings, Search, Bell, User,
  Wifi, Phone, Play, Megaphone, Lock, Eye, EyeOff, X, Radio, MessageCircle,
  LogOut, ChevronRight, Globe, Moon, Volume2, Info, Check, CalendarClock
} from "lucide-react";
import { api, resource } from "./api.js";

/* ----------------------------- Design tokens ----------------------------- */
const C = {
  bg: "#080B14",
  bgRaised: "#0E1524",
  bgCard: "#111A2E",
  bgCardHover: "#152040",
  line: "#1E2A45",
  primary: "#3B7CF6",
  cyan: "#22D3EE",
  ember: "#F0384B",
  green: "#2ED893",
  amber: "#F5A623",
  purple: "#8B5CF6",
  text: "#F3F6FC",
  textDim: "#8C9BB8",
  textFaint: "#5B6B8C",
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

const LOGO_SRC = "data:image/png;base64,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";

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
  { t: "The Last of Us", sub: "S1 \u2022 E5", pct: 62, grad: ["#233327", "#0e1a12"] },
  { t: "John Wick", sub: "Movie", pct: 34, grad: ["#1a1a2e", "#0f0f1a"] },
  { t: "Lupin", sub: "S2 \u2022 E3", pct: 80, grad: ["#1f2a3d", "#0b1220"] },
  { t: "Vikings", sub: "S6 \u2022 E10", pct: 20, grad: ["#2b2b2b", "#111"] },
  { t: "Spider-Man", sub: "Movie", pct: 48, grad: [C.ember, "#7A1128"] },
];

/* Live channels now come from the backend (channelsApi) instead of this static demo list. */

const notifications = [
  { id: 1, title: "Subscription renews in 3 days", time: "1 hour ago", read: false },
  { id: 2, title: "New episode of Vikings is available", time: "5 hours ago", read: false },
  { id: 3, title: "Payment of $59.99 received", time: "1 day ago", read: false },
  { id: 4, title: "New device connected to your account", time: "2 days ago", read: true },
];

// Public HLS test stream \u2014 swap this per-title with your own licensed source URL
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
    <div
      className="relative rounded-xl overflow-hidden shrink-0 cursor-pointer group w-40"
      style={{ aspectRatio: "2/3", background: `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` }}
      onClick={onPlay}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
        <Film size={48} color="#fff" />
      </div>
      {onToggleFav && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center z-10"
          style={{ background: "rgba(0,0,0,.55)" }}
        >
          <Heart size={14} color={favorited ? C.ember : "#fff"} fill={favorited ? C.ember : "none"} />
        </button>
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
    </div>
  );
}

function ContinueCard({ item, onPlay }) {
  return (
    <div className="shrink-0 w-52 cursor-pointer group" onClick={onPlay}>
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
    </div>
  );
}

/* ----------------------------- Live TV panel ----------------------------- */

const channelsApi = resource("channels", "name");
const programsApi = resource("programs", "id");
const categoryColor = {
  News: C.primary, Sports: C.green, Movies: C.purple, Kids: C.amber,
  Music: C.cyan, Documentary: C.ember,
};

function ChannelCard({ channel, onPlay }) {
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
        {playable && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,.4)" }}>
            <Play size={22} fill="#fff" color="#fff" />
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-white truncate">{channel.name}</div>
        <div className="text-xs" style={{ color: C.textFaint }}>{channel.category}</div>
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

function EpgGuide({ channels, onPlay }) {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    programsApi.list().then(setPrograms).catch(() => {}).finally(() => setLoading(false));
  }, []);

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
    <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
      <div style={{ overflow: "auto", maxHeight: 480 }}>
        <div style={{ position: "relative", width: CHANNEL_COL_WIDTH + totalWidth }}>
          <div className="flex" style={{ position: "sticky", top: 0, zIndex: 30 }}>
            <div style={{ width: CHANNEL_COL_WIDTH, height: HEADER_HEIGHT, position: "sticky", left: 0, zIndex: 31, background: C.bgRaised, borderRight: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} />
            <div style={{ position: "relative", width: totalWidth, height: HEADER_HEIGHT, background: C.bgRaised, borderBottom: `1px solid ${C.line}` }}>
              {timeLabels.map((tl, i) => (
                <div
                  key={i}
                  className="absolute text-[10px] top-0 h-full flex items-center"
                  style={{ left: tl.left, color: C.textFaint, borderLeft: i > 0 ? `1px solid ${C.line}` : "none", paddingLeft: 4 }}
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
              top: 0,
              width: 2,
              height: HEADER_HEIGHT + channels.length * ROW_HEIGHT,
              background: C.ember,
              zIndex: 25,
              pointerEvents: "none",
            }}
          />

          {channels.map((ch) => (
            <div key={ch.name} className="flex" style={{ borderTop: `1px solid ${C.line}` }}>
              <div
                className="flex items-center gap-2 px-2"
                style={{ width: CHANNEL_COL_WIDTH, height: ROW_HEIGHT, position: "sticky", left: 0, zIndex: 15, background: C.bgCard, borderRight: `1px solid ${C.line}` }}
              >
                <Radio size={13} color={categoryColor[ch.category] || C.primary} className="shrink-0" />
                <span className="text-[11px] font-semibold text-white truncate">{ch.name}</span>
              </div>
              <div style={{ position: "relative", width: totalWidth, height: ROW_HEIGHT, background: C.bg }}>
                {programs.filter((p) => p.channel === ch.name).map((p) => {
                  const style = blockStyle(p);
                  if (!style) return null;
                  const playable = style.isLive && !!ch.streamUrl;
                  return (
                    <button
                      key={p.id}
                      onClick={() => playable && onPlay(ch)}
                      className="absolute top-1.5 bottom-1.5 rounded-md px-2 text-left overflow-hidden"
                      style={{
                        left: style.left + 2,
                        width: style.width - 4,
                        background: style.isLive ? `${C.primary}33` : C.bgCard,
                        border: `1px solid ${style.isLive ? C.primary : C.line}`,
                        cursor: playable ? "pointer" : "default",
                      }}
                    >
                      <div className="text-[11px] font-semibold text-white truncate">{p.title}</div>
                      <div className="text-[10px] truncate" style={{ color: C.textFaint }}>
                        {new Date(p.start).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveTVPanel({ onPlay, channels, loading }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("channels"); // "channels" | "guide"

  const categories = ["All", ...Array.from(new Set(channels.map((c) => c.category)))];
  const shown = filter === "All" ? channels : channels.filter((c) => c.category === filter);

  return (
    <div className="px-6 md:px-8 pb-10 pt-6">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
        <div className="text-lg font-black" style={{ color: C.text, fontFamily: "'Space Grotesk', sans-serif" }}>{t("live_tv_title")}</div>
        <div className="flex rounded-lg overflow-hidden shrink-0" style={{ border: `1px solid ${C.line}` }}>
          {[["channels", t("guide_view_channels")], ["guide", t("guide_view_guide")]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className="px-3.5 py-1.5 text-xs font-semibold"
              style={{ background: view === id ? C.primary : C.bgCard, color: view === id ? "#fff" : C.textDim }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs mb-5" style={{ color: C.textFaint }}>
        {loading ? t("live_tv_loading") : t("live_tv_subtitle")}
      </p>
      {!loading && channels.length === 0 ? (
        <div className="text-sm py-10 text-center" style={{ color: C.textFaint }}>{t("live_tv_empty")}</div>
      ) : view === "guide" ? (
        <EpgGuide channels={channels} onPlay={onPlay} />
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
            {shown.map((c) => <ChannelCard key={c.name} channel={c} onPlay={onPlay} />)}
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
  const text = announcements.join("   \u2022   ");

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
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #2A3A5C; border-radius: 3px; }
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
              {{ home: t("greeting_home"), live: t("nav_live"), movies: t("nav_movies"), series: t("nav_series"), fav: t("nav_favorites"), settings: t("nav_settings") }[active]}
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

        {!searchOpen && active === "live" && <LiveTVPanel onPlay={setPlaying} channels={channels} loading={channelsLoading} />}
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
            {/* Hero */}
            <div className="relative rounded-2xl overflow-hidden" style={{ background: `linear-gradient(120deg, #0B1224, #0A1830)`, border: `1px solid ${C.line}` }}>
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

            {/* Quick tiles */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: t("tile_live_label"), sub: t("tile_live_sub"), icon: Tv, badge: t("tile_live_badge"), grad: [C.ember, "#5E0F1E"], id: "live" },
                { label: t("tile_movies_label"), sub: t("tile_movies_sub"), icon: Film, grad: [C.purple, "#3A1E7A"], id: "movies" },
                { label: t("tile_series_label"), sub: t("tile_series_sub"), icon: Layers, grad: ["#1E3A5F", "#0B1830"], id: "series" },
                { label: t("tile_fav_label"), sub: t("tile_fav_sub"), icon: Heart, grad: [C.amber, "#8A5A0E"], id: "fav" },
              ].map((tile) => (
                <div
                  key={tile.label}
                  onClick={() => setActive(tile.id)}
                  className="relative rounded-xl overflow-hidden p-5 h-32 flex flex-col justify-between cursor-pointer"
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
                </div>
              ))}
            </div>

            <LiveEventsSection onPlay={setPlaying} />

            {/* Continue watching */}
            <div>
              <div className="text-sm font-bold tracking-wide mb-3" style={{ color: C.text }}>{t("section_continue")}</div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {continueWatching.map((c) => <ContinueCard key={c.t} item={c} onPlay={() => setPlaying(c)} />)}
              </div>
            </div>

            {/* Trending row */}
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

        {/* Ticker */}
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
          {event.channel}{start ? ` \u2022 ${start.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}` : ""}
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
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden" style={{ background: `radial-gradient(circle at 50% 20%, #0F1B33, ${C.bg} 65%)`, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
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
