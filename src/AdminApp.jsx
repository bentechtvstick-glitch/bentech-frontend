import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard, Users, UserPlus, UserCog, KeyRound, HardDrive, History,
  ClipboardList, Layers, FilePlus, Radio, Globe, MapPin, Tags, Megaphone,
  MonitorPlay, ScrollText, BarChart3, Languages, Settings as SettingsIcon,
  ShieldCheck, Wrench, FileClock, Search, Bell, ChevronDown, Plus, Pencil,
  Trash2, X, Lock, Eye, EyeOff, TrendingUp, TrendingDown, Check, ToggleLeft,
  ToggleRight, Filter, Download, RefreshCcw, AlertTriangle, CalendarClock, Clock
} from "lucide-react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar
} from "recharts";
import { api, resource } from "./api.js";

/* ============================== Design tokens ============================== */
const C = {
  primary: "#3B7CF6",
  primaryDim: "#1F4EBF",
  cyan: "#22D3EE",
  ember: "#F0384B",
  green: "#2ED893",
  greenDark: "#1B9E70",
  amber: "#F5A623",
  purple: "#8B5CF6",
  ink: "#1A1F2E",
  sub: "#5C6478",
  faint: "#8993A8",
  line: "#EEF1F7",
  bgApp: "#F5F7FB",
  sidebar: "#0E1524",
  sidebarLine: "#1E2A45",
  sidebarText: "#8C9BB8",
};

function cx(...a) { return a.filter(Boolean).join(" "); }

/* ============================== Logo ============================== */
const LOGO_SRC = "data:image/png;base64,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";

function Logo({ size = 34 }) {
  return (
    <img
      src={LOGO_SRC}
      alt="BenTech TV Stick"
      style={{ height: size, width: "auto", objectFit: "contain" }}
      className="select-none"
    />
  );
}

/* ============================== Nav config ============================== */
const NAV = [
  { group: "Overview", items: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ]},
  { group: "Customers", items: [
    { id: "customers", label: "Customers List", icon: Users },
    { id: "customer-add", label: "Add Customer", icon: UserPlus },
  ]},
  { group: "Activation & Devices", items: [
    { id: "activation-codes", label: "Activation Codes", icon: KeyRound },
    { id: "devices", label: "Device Management", icon: HardDrive },
    { id: "device-history", label: "Device History", icon: History },
    { id: "subscriptions", label: "Subscriptions", icon: ClipboardList },
  ]},
  { group: "Channels & Profiles", items: [
    { id: "live-events", label: "Live Events", icon: CalendarClock },
    { id: "program-guide", label: "Program Guide", icon: Clock },
    { id: "channel-profiles", label: "Channel Profiles", icon: Layers },
    { id: "profile-create", label: "Create Profile", icon: FilePlus },
    { id: "channel-manager", label: "Channel Manager", icon: Radio },
    { id: "countries", label: "Countries", icon: Globe },
    { id: "regions", label: "Regions", icon: MapPin },
    { id: "categories", label: "Categories", icon: Tags },
  ]},
  { group: "Marketing", items: [
    { id: "banners", label: "Banner Manager", icon: Megaphone },
    { id: "popups", label: "Popup Manager", icon: MonitorPlay },
    { id: "tickers", label: "Ticker Manager", icon: ScrollText },
  ]},
  { group: "Reports & System", items: [
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "languages", label: "Languages", icon: Languages },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "admin-users", label: "Admin Users", icon: ShieldCheck },
    { id: "maintenance", label: "Maintenance Mode", icon: Wrench },
    { id: "audit-logs", label: "Audit Logs", icon: FileClock },
  ]},
];
const FLAT_NAV = NAV.flatMap((g) => g.items);

/* ============================== Shared UI ============================== */

function Badge({ text, tone = "neutral" }) {
  const map = {
    success: { bg: `${C.green}1A`, fg: C.greenDark },
    danger: { bg: `${C.ember}17`, fg: C.ember },
    warning: { bg: `${C.amber}1A`, fg: "#A9700F" },
    info: { bg: `${C.primary}17`, fg: C.primaryDim },
    neutral: { bg: "#EEF1F7", fg: C.sub },
    purple: { bg: `${C.purple}17`, fg: "#6D3FD1" },
  };
  const s = map[tone] || map.neutral;
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: s.bg, color: s.fg }}>
      {text}
    </span>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
      <div>
        <div className="text-xl font-bold" style={{ color: C.ink }}>{title}</div>
        {subtitle && <div className="text-sm mt-0.5" style={{ color: C.faint }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function Card({ children, className, ...rest }) {
  return (
    <div className={cx("rounded-xl p-5", className)} style={{ background: "#fff", border: `1px solid ${C.line}` }} {...rest}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, icon: Icon, onClick, variant = "primary" }) {
  const bg = variant === "danger" ? C.ember : variant === "ghost" ? "#fff" : C.primary;
  const color = variant === "ghost" ? C.ink : "#fff";
  const border = variant === "ghost" ? `1px solid ${C.line}` : "none";
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-2 rounded-lg"
      style={{ background: bg, color, border }}
    >
      {Icon && <Icon size={14} />} {children}
    </button>
  );
}

function SearchBox({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "#F1F4FA", minWidth: 220 }}>
      <Search size={14} color={C.faint} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent outline-none text-sm flex-1"
        style={{ color: C.ink }}
      />
    </div>
  );
}

function DataTable({ columns, rows, searchable = true, onAdd, addLabel = "Add New", pageTitle, pageSubtitle, renderActions }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q) return rows;
    const l = q.toLowerCase();
    return rows.filter((r) => columns.some((c) => String(r[c.key] ?? "").toLowerCase().includes(l)));
  }, [q, rows, columns]);

  return (
    <div>
      <PageHeader
        title={pageTitle}
        subtitle={pageSubtitle}
        action={onAdd ? <PrimaryButton icon={Plus} onClick={onAdd}>{addLabel}</PrimaryButton> : null}
      />
      <Card>
        {searchable && (
          <div className="flex items-center justify-between mb-4">
            <SearchBox value={q} onChange={setQ} />
            <div className="text-xs" style={{ color: C.faint }}>{filtered.length} of {rows.length}</div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: C.faint }} className="text-left">
                {columns.map((c) => (
                  <th key={c.key} className="font-medium pb-3 pr-4 whitespace-nowrap">{c.label}</th>
                ))}
                {renderActions && <th className="font-medium pb-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  {columns.map((c) => (
                    <td key={c.key} className="py-3 pr-4 whitespace-nowrap" style={{ color: C.ink }}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="py-3 text-right whitespace-nowrap">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-sm" style={{ color: C.faint }}>
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function RowActions() {
  return (
    <span className="inline-flex gap-3 items-center">
      <Pencil size={14} color={C.faint} className="cursor-pointer" />
      <Trash2 size={14} color={C.ember} className="cursor-pointer" />
    </span>
  );
}

function Field({ label, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold mb-1.5" style={{ color: C.sub }}>{label}</label>
      {children}
      {hint && <div className="text-[11px] mt-1" style={{ color: C.faint }}>{hint}</div>}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  border: `1px solid ${C.line}`,
  fontSize: 13,
  color: C.ink,
  outline: "none",
  background: "#FBFCFE",
};

function TextInput(props) { return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />; }
function TextArea(props) { return <textarea {...props} style={{ ...inputStyle, minHeight: 90, ...(props.style || {}) }} />; }
function Select({ options, ...props }) {
  return (
    <select {...props} style={{ ...inputStyle, ...(props.style || {}) }}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Toggle({ on, onChange, label }) {
  return (
    <button onClick={() => onChange(!on)} className="flex items-center gap-2">
      {on ? <ToggleRight size={30} color={C.green} /> : <ToggleLeft size={30} color={C.faint} />}
      {label && <span className="text-sm" style={{ color: C.ink }}>{label}</span>}
    </button>
  );
}

function Modal({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(15,20,35,.5)" }} onClick={onClose}>
      <div className="w-full max-w-md rounded-xl overflow-hidden" style={{ background: "#fff" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.line}` }}>
          <div className="text-sm font-bold" style={{ color: C.ink }}>{title}</div>
          <button onClick={onClose}><X size={16} color={C.faint} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex items-center gap-3 px-5 py-4" style={{ borderTop: `1px solid ${C.line}` }}>{footer}</div>}
      </div>
    </div>
  );
}

function SimpleCrudPage({ title, subtitle, addLabel, initialRows, fields, columns, api: res }) {
  const [rows, setRows] = useState(initialRows);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", row }
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!res) return;
    res.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    const empty = {};
    fields.forEach((f) => { empty[f.key] = f.default ?? ""; });
    setForm(empty);
    setModal({ type: "add" });
  }
  function openEdit(row) {
    setForm({ ...row });
    setModal({ type: "edit", row });
  }
  function openDelete(row) {
    setModal({ type: "delete", row });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    try {
      if (res) await res.add(form);
      setRows((r) => [...r, { ...form }]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    try {
      if (res) await res.update(modal.row[res.idField], form);
      setRows((r) => r.map((x) => x === modal.row ? { ...form } : x));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      if (res) await res.remove(modal.row[res.idField]);
      setRows((r) => r.filter((x) => x !== modal.row));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader title={title} subtitle={subtitle} action={<PrimaryButton icon={Plus} onClick={openAdd}>{addLabel}</PrimaryButton>} />
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: C.faint }} className="text-left">
                {columns.map((c) => <th key={c.key} className="font-medium pb-3 pr-4 whitespace-nowrap">{c.label}</th>)}
                <th className="font-medium pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                  {columns.map((c) => (
                    <td key={c.key} className="py-3 pr-4 whitespace-nowrap" style={{ color: C.ink }}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                  <td className="py-3 text-right whitespace-nowrap">
                    <span className="inline-flex gap-3 items-center">
                      <button onClick={() => openEdit(row)}><Pencil size={14} color={C.faint} /></button>
                      <button onClick={() => openDelete(row)}><Trash2 size={14} color={C.ember} /></button>
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="py-8 text-center text-sm" style={{ color: C.faint }}>No entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? addLabel : `Edit`}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Save" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          {fields.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.type === "select" ? (
                <Select
                  value={form[f.key] ?? ""}
                  options={f.options}
                  onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
                />
              ) : (
                <TextInput
                  type={f.type || "text"}
                  value={form[f.key] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm((x) => ({ ...x, [f.key]: e.target.value }))}
                />
              )}
            </Field>
          ))}
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Entry"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>Are you sure you want to delete this entry?</p>
        </Modal>
      )}
    </div>
  );
}

function FormPage({ title, subtitle, sections, onCancel, onSave, saveLabel = "Save" }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card className="max-w-3xl">
        {sections.map((sec, i) => (
          <div key={i} className={i > 0 ? "mt-6 pt-6" : ""} style={i > 0 ? { borderTop: `1px solid ${C.line}` } : {}}>
            {sec.title && <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>{sec.title}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              {sec.fields}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: `1px solid ${C.line}` }}>
          <PrimaryButton onClick={onSave}>{saveLabel}</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onCancel}>Cancel</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

/* ============================== Mock data ============================== */

const customers = [
  { id: "C-1001", name: "John Doe", email: "john.doe@example.com", phone: "305-555-0101", plan: "12 Months", status: "Active", expiry: "2027-01-15" },
  { id: "C-1002", name: "Jane Smith", email: "jane.smith@example.com", phone: "305-555-0102", plan: "6 Months", status: "Active", expiry: "2026-11-02" },
  { id: "C-1003", name: "Mike Johnson", email: "mike.j@example.com", phone: "305-555-0103", plan: "1 Month", status: "Expired", expiry: "2026-06-20" },
  { id: "C-1004", name: "Carla Reyes", email: "carla.reyes@example.com", phone: "305-555-0104", plan: "12 Months", status: "Active", expiry: "2027-03-10" },
  { id: "C-1005", name: "David Lin", email: "david.lin@example.com", phone: "305-555-0105", plan: "3 Months", status: "Suspended", expiry: "2026-08-01" },
];

const activationCodes = [
  { code: "BT-10293841", status: "Used", assignedTo: "John Doe", created: "2026-05-01" },
  { code: "BT-58201933", status: "Unused", assignedTo: "-", created: "2026-06-10" },
  { code: "BT-77102844", status: "Used", assignedTo: "Jane Smith", created: "2026-05-22" },
  { code: "BT-40912765", status: "Revoked", assignedTo: "Mike Johnson", created: "2026-04-18" },
  { code: "BT-99123456", status: "Unused", assignedTo: "-", created: "2026-07-01" },
];

const devices = [
  { deviceName: "Living Room TV", deviceId: "DVC-A1B2C3", customer: "John Doe", type: "Android TV", status: "Online", activated: "2026-05-01", lastSeen: "2 min ago", limit: 1, blocked: false },
  { deviceName: "Bedroom Firestick", deviceId: "DVC-D4E5F6", customer: "Jane Smith", type: "Fire TV", status: "Offline", activated: "2026-05-22", lastSeen: "3 hours ago", limit: 1, blocked: false },
  { deviceName: "Office Box", deviceId: "DVC-G7H8I9", customer: "Mike Johnson", type: "Google TV", status: "Offline", activated: "2026-04-18", lastSeen: "2 days ago", limit: 1, blocked: true },
  { deviceName: "Main TV", deviceId: "DVC-J1K2L3", customer: "Carla Reyes", type: "Android TV", status: "Online", activated: "2026-03-10", lastSeen: "Just now", limit: 2, blocked: false },
  { deviceName: "Bedroom TV", deviceId: "DVC-M4N5O6", customer: "Carla Reyes", type: "Fire TV", status: "Online", activated: "2026-04-02", lastSeen: "10 min ago", limit: 2, blocked: false },
];

const deviceHistory = [
  { deviceId: "DVC-A1B2C3", event: "Device activated", date: "2026-05-01 10:22" },
  { deviceId: "DVC-A1B2C3", event: "Reconnected", date: "2026-06-30 08:05" },
  { deviceId: "DVC-D4E5F6", event: "Device activated", date: "2026-05-22 14:41" },
  { deviceId: "DVC-D4E5F6", event: "Disconnected", date: "2026-07-04 20:10" },
  { deviceId: "DVC-G7H8I9", event: "Suspicious login blocked", date: "2026-07-02 03:15" },
];

const subscriptions = [
  { customer: "John Doe", plan: "12 Months", start: "2026-01-15", end: "2027-01-15", status: "Active" },
  { customer: "Jane Smith", plan: "6 Months", start: "2026-05-02", end: "2026-11-02", status: "Active" },
  { customer: "Mike Johnson", plan: "1 Month", start: "2026-05-20", end: "2026-06-20", status: "Expired" },
  { customer: "Carla Reyes", plan: "12 Months", start: "2026-03-10", end: "2027-03-10", status: "Active" },
  { customer: "David Lin", plan: "3 Months", start: "2026-05-01", end: "2026-08-01", status: "Suspended" },
];

const channelProfiles = [
  { name: "50 Channels Starter", channels: 50, customers: 540, tags: "General" },
  { name: "Sports Plus", channels: 45, customers: 340, tags: "Sports" },
  { name: "Haiti Bundle", channels: 32, customers: 268, tags: "Haiti" },
  { name: "USA Bundle", channels: 110, customers: 812, tags: "USA" },
  { name: "Family Bundle", channels: 90, customers: 265, tags: "General" },
  { name: "International Mix", channels: 60, customers: 111, tags: "Multi-region" },
];

const channelList = [
  { order: 1, name: "News One", category: "News", country: "USA", enabled: true, streamUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" },
  { order: 2, name: "Sports Max", category: "Sports", country: "USA", enabled: true, streamUrl: "" },
  { order: 3, name: "Cinema Plus", category: "Movies", country: "USA", enabled: true, streamUrl: "" },
  { order: 4, name: "Kids Zone", category: "Kids", country: "Canada", enabled: true, streamUrl: "" },
  { order: 5, name: "Music Live", category: "Music", country: "UK", enabled: false, streamUrl: "" },
  { order: 6, name: "Discovery Wild", category: "Documentary", country: "UK", enabled: true, streamUrl: "" },
  { order: 7, name: "T\u00e9l\u00e9 Haiti", category: "News", country: "Haiti", enabled: true, streamUrl: "" },
  { order: 8, name: "Radio T\u00e9l\u00e9 Haiti Sport", category: "Sports", country: "Haiti", enabled: true, streamUrl: "" },
];

const countries = [
  { name: "United States", channels: 210, regions: "North America" },
  { name: "Canada", channels: 85, regions: "North America" },
  { name: "United Kingdom", channels: 96, regions: "Europe" },
  { name: "France", channels: 54, regions: "Europe" },
  { name: "Haiti", channels: 22, regions: "Caribbean" },
];

const regions = [
  { name: "North America", countries: 3, channels: 340 },
  { name: "Europe", countries: 12, channels: 512 },
  { name: "Caribbean", countries: 8, channels: 96 },
  { name: "Latin America", countries: 15, channels: 210 },
];

const categories = [
  { name: "News", channels: 84 },
  { name: "Sports", channels: 62 },
  { name: "Movies", channels: 118 },
  { name: "Kids", channels: 40 },
  { name: "Music", channels: 33 },
  { name: "Documentary", channels: 27 },
];

const banners = [
  { type: "Banner", content: "Internet Ultra Fast Banner", status: "Active" },
  { type: "Banner", content: "Promo 6 Months", status: "Active" },
  { type: "Ticker", content: "Welcome to BenTech TV Stick", status: "Active" },
];

const popups = [
  { title: "Summer Promo", active: "Yes", start: "2026-06-01", end: "2026-08-31" },
  { title: "Maintenance Notice", active: "No", start: "2026-05-10", end: "2026-05-12" },
];

const tickers = [
  { message: "Welcome to BenTech TV Stick", status: "Active" },
  { message: "Special IPTV offers available", status: "Active" },
  { message: "For advertising call 305-555-1234", status: "Paused" },
];

const languages = [
  { name: "English", code: "en", status: "Active" },
  { name: "French", code: "fr", status: "Active" },
  { name: "Haitian Creole", code: "ht", status: "Active" },
  { name: "Spanish", code: "es", status: "Inactive" },
];

const adminUsers = [
  { name: "Admin", email: "admin@bentechtvstick.net", role: "Super Administrator", status: "Active" },
  { name: "Sophie Laurent", email: "sophie@bentechtvstick.net", role: "Support Staff", status: "Active" },
  { name: "Marc Bellevue", email: "marc@bentechtvstick.net", role: "Billing", status: "Suspended" },
];

const auditLogs = [
  { user: "Admin", action: "Created activation code BT-99123456", date: "2026-07-05 09:12", ip: "192.168.1.10" },
  { user: "Sophie Laurent", action: "Suspended customer C-1005", date: "2026-07-04 16:40", ip: "192.168.1.22" },
  { user: "Admin", action: "Updated Banner Manager entry", date: "2026-07-03 11:05", ip: "192.168.1.10" },
  { user: "Marc Bellevue", action: "Failed login attempt", date: "2026-07-02 22:51", ip: "203.0.113.4" },
];

const revenueData = [
  { d: "Apr 26", v: 1200 }, { d: "Apr 30", v: 1500 }, { d: "May 4", v: 900 },
  { d: "May 8", v: 1800 }, { d: "May 12", v: 1400 }, { d: "May 16", v: 2000 },
  { d: "May 20", v: 1600 }, { d: "May 24", v: 1900 },
];
const growthData = [
  { m: "Feb", v: 980 }, { m: "Mar", v: 1120 }, { m: "Apr", v: 1260 }, { m: "May", v: 1390 }, { m: "Jun", v: 1528 },
];
const subOverview = [
  { name: "6 Months", value: 876, color: C.primary },
  { name: "12 Months", value: 512, color: C.cyan },
  { name: "Other Plans", value: 140, color: C.green },
];
const devicesByType = [
  { name: "Android TV", value: 430, color: C.primary },
  { name: "Firestick", value: 287, color: C.cyan },
  { name: "Android Box", value: 143, color: C.purple },
  { name: "Other Devices", value: 96, color: C.amber },
];

/* ============================== Badges helpers ============================== */
const toneFor = (status) => ({
  Active: "success", Online: "success", Used: "info", Yes: "success",
  Expired: "danger", Offline: "neutral", Revoked: "danger", No: "neutral",
  Suspended: "warning", Unused: "neutral", Inactive: "neutral", Paused: "warning",
  Live: "danger", Upcoming: "info", Ended: "neutral",
}[status] || "neutral");

/* ============================== Pages ============================== */

function DashboardPage() {
  const totalSub = subOverview.reduce((a, b) => a + b.value, 0);
  const totalDev = devicesByType.reduce((a, b) => a + b.value, 0);
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your BenTech TV Stick service" />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
        <StatMini icon={Users} label="Total Clients" value="1,528" delta="+12%" color={C.primary} />
        <StatMini icon={Users} label="Active Clients" value="1,234" delta="+8%" color={C.green} />
        <StatMini icon={Users} label="Expired Clients" value="294" delta="-5%" color={C.ember} />
        <StatMini icon={BarChart3} label="Monthly Revenue" value="$12,450" delta="+18%" color={C.amber} />
        <StatMini icon={HardDrive} label="Connected Devices" value="956" delta="+15%" color={C.purple} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <Card>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Subscription Overview</div>
          <Donut data={subOverview} total={totalSub} />
        </Card>
        <Card>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Devices by Type</div>
          <Donut data={devicesByType} total={totalDev} compact />
        </Card>
        <Card>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Revenue (30 Days)</div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke={C.primary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Recent Activity</div>
        <div className="space-y-3">
          {auditLogs.slice(0, 4).map((a, i) => (
            <div key={i} className="flex items-center justify-between text-sm" style={{ borderBottom: i < 3 ? `1px solid ${C.line}` : "none", paddingBottom: 8 }}>
              <div>
                <span className="font-semibold" style={{ color: C.ink }}>{a.user}</span>{" "}
                <span style={{ color: C.sub }}>{a.action}</span>
              </div>
              <span className="text-xs" style={{ color: C.faint }}>{a.date}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function StatMini({ icon: Icon, label, value, delta, color }) {
  const up = delta.startsWith("+");
  return (
    <Card className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}1A` }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div className="text-[11px]" style={{ color: C.faint }}>{label}</div>
        <div className="text-base font-bold" style={{ color: C.ink }}>{value}</div>
        <div className="text-[10px] font-semibold flex items-center gap-1" style={{ color: up ? C.greenDark : C.ember }}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {delta}
        </div>
      </div>
    </Card>
  );
}

function Donut({ data, total, compact }) {
  return (
    <div className="flex items-center gap-5">
      <div style={{ width: compact ? 110 : 130, height: compact ? 110 : 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={compact ? 32 : 38} outerRadius={compact ? 54 : 62} paddingAngle={2} stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-[11px]">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span style={{ color: C.sub }} className="w-20 truncate">{d.name}</span>
            <span className="font-semibold" style={{ color: C.ink }}>{d.value}</span>
          </div>
        ))}
        <div className="text-[11px] pt-1" style={{ color: C.faint }}>Total: {total.toLocaleString()}</div>
      </div>
    </div>
  );
}

function CustomersListPage({ onNavigate, onEdit }) {
  const [rows, setRows] = useState(customers); // fallback seed data while loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.listCustomers()
      .then((data) => setRows(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(row) {
    api.deleteCustomer(row.id).then(() => setRows((r) => r.filter((x) => x.id !== row.id))).catch((e) => setError(e.message));
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> Couldn't reach the API ({error}). Showing local demo data instead.
        </div>
      )}
      <DataTable
        pageTitle="Customers List"
        pageSubtitle={loading ? "Loading from API..." : "All registered customers"}
        onAdd={() => onNavigate("customer-add")}
        addLabel="Add Customer"
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "plan", label: "Plan" },
          { key: "status", label: "Status", render: (r) => <Badge text={r.status} tone={toneFor(r.status)} /> },
          { key: "expiry", label: "Expires" },
        ]}
        rows={rows}
        renderActions={(row) => (
          <span className="inline-flex gap-3 items-center">
            <button onClick={() => onEdit(row)}><Pencil size={14} color={C.faint} /></button>
            <button onClick={() => handleDelete(row)}><Trash2 size={14} color={C.ember} /></button>
          </span>
        )}
      />
    </div>
  );
}

function CustomerFormPage({ mode = "add", editing, onNavigate }) {
  const [form, setForm] = useState({
    name: editing?.name || "",
    email: editing?.email || "",
    phone: editing?.phone || "",
    status: editing?.status || "Active",
    plan: editing?.plan || "1 Month",
    expiry: editing?.expiry || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      if (mode === "add") {
        const id = "C-" + Math.floor(1000 + Math.random() * 8999);
        await api.addCustomer({ id, ...form });
      } else {
        await api.updateCustomer(editing.id, form);
      }
      onNavigate("customers");
    } catch (e) {
      setError(e.message || "Couldn't save customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <FormPage
        title={mode === "add" ? "Add Customer" : "Edit Customer"}
        subtitle={mode === "add" ? "Create a new customer account" : `Editing ${editing?.name}`}
        onCancel={() => onNavigate("customers")}
        onSave={handleSave}
        saveLabel={saving ? "Saving..." : mode === "add" ? "Create Customer" : "Save Changes"}
        sections={[
          {
            title: "Account Details",
            fields: (
              <>
                <Field label="Full Name"><TextInput value={form.name} onChange={set("name")} placeholder="John Doe" /></Field>
                <Field label="Email"><TextInput value={form.email} onChange={set("email")} placeholder="john@example.com" /></Field>
                <Field label="Phone"><TextInput value={form.phone} onChange={set("phone")} placeholder="305-555-0101" /></Field>
                <Field label="Status">
                  <Select value={form.status} onChange={set("status")} options={["Active", "Suspended", "Expired"]} />
                </Field>
              </>
            ),
          },
          {
            title: "Subscription",
            fields: (
              <>
                <Field label="Plan">
                  <Select value={form.plan} onChange={set("plan")} options={["1 Month", "3 Months", "6 Months", "12 Months"]} />
                </Field>
                <Field label="Expiry Date"><TextInput type="date" value={form.expiry} onChange={set("expiry")} /></Field>
                <Field label="Channel Profile">
                  <Select options={channelProfiles.map((p) => p.name)} />
                </Field>
                <Field label="Activation Code" hint="Optional — link an existing unused code">
                  <TextInput placeholder="BT-XXXXXXXXXXX" />
                </Field>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

const activationCodesApi = resource("activation-codes", "code");
function ActivationCodesPage() {
  return (
    <SimpleCrudPage
      title="Activation Codes"
      subtitle="Generate and track device activation codes"
      addLabel="Generate Code"
      api={activationCodesApi}
      initialRows={activationCodes}
      fields={[
        { key: "code", label: "Code", placeholder: "BT-XXXXXXXXXXX", default: "BT-" + Math.floor(10000000 + Math.random() * 89999999) },
        { key: "status", label: "Status", type: "select", options: ["Unused", "Used", "Revoked"], default: "Unused" },
        { key: "assignedTo", label: "Assigned To", placeholder: "-", default: "-" },
        { key: "created", label: "Created", type: "date" },
      ]}
      columns={[
        { key: "code", label: "Code" },
        { key: "status", label: "Status", render: (r) => <Badge text={r.status} tone={toneFor(r.status)} /> },
        { key: "assignedTo", label: "Assigned To" },
        { key: "created", label: "Created" },
      ]}
    />
  );
}

function DevicesPage() {
  const [rows, setRows] = useState(devices); // fallback seed while loading
  const [loadError, setLoadError] = useState("");
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // { type, device }
  const [form, setForm] = useState({});

  useEffect(() => {
    api.listDevices().then(setRows).catch((e) => setLoadError(e.message));
  }, []);

  const filtered = q
    ? rows.filter((r) => [r.deviceId, r.deviceName, r.customer, r.type].some((v) => v.toLowerCase().includes(q.toLowerCase())))
    : rows;

  function openModal(type, device = null) {
    setForm(device ? { limit: device.limit } : { customer: "", type: "Android TV", deviceName: "" });
    setModal({ type, device });
  }
  function closeModal() { setModal(null); }

  const selectedCustomerCount = form.customer ? rows.filter((d) => d.customer === form.customer).length : 0;
  const selectedCustomerLimit = form.customer ? (rows.find((d) => d.customer === form.customer)?.limit ?? 1) : null;
  const overLimit = form.customer && selectedCustomerLimit !== null && selectedCustomerCount >= selectedCustomerLimit;

  async function handleAddDevice() {
    if (overLimit) return;
    const id = "DVC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const today = new Date().toISOString().slice(0, 10);
    const newDevice = {
      deviceName: form.deviceName || "New Device",
      deviceId: id,
      customer: form.customer || "Unassigned",
      type: form.type || "Android TV",
      status: "Online",
      activated: today,
      lastSeen: "Just now",
      limit: selectedCustomerLimit || 1,
      blocked: false,
    };
    try {
      await api.addDevice(newDevice);
      setRows((r) => [...r, newDevice]);
    } catch (e) { setLoadError(e.message); }
    closeModal();
  }

  async function handleReplaceDevice() {
    const newId = "DVC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const updated = { ...modal.device, deviceId: newId, status: "Online", lastSeen: "Just now" };
    try {
      await api.deleteDevice(modal.device.deviceId);
      await api.addDevice(updated);
      setRows((r) => r.map((d) => d.deviceId === modal.device.deviceId ? updated : d));
    } catch (e) { setLoadError(e.message); }
    closeModal();
  }

  async function handleRemoveDevice() {
    try {
      await api.deleteDevice(modal.device.deviceId);
      setRows((r) => r.filter((d) => d.deviceId !== modal.device.deviceId));
    } catch (e) { setLoadError(e.message); }
    closeModal();
  }

  async function handleToggleBlock(device) {
    const updated = { blocked: !device.blocked, status: !device.blocked ? "Offline" : device.status };
    try {
      await api.updateDevice(device.deviceId, updated);
      setRows((r) => r.map((d) => d.deviceId === device.deviceId ? { ...d, ...updated } : d));
    } catch (e) { setLoadError(e.message); }
  }

  async function handleResetAll() {
    try {
      await Promise.all(rows.map((d) => api.updateDevice(d.deviceId, { status: "Offline", lastSeen: "Reset", blocked: false })));
      setRows((r) => r.map((d) => ({ ...d, status: "Offline", lastSeen: "Reset", blocked: false })));
    } catch (e) { setLoadError(e.message); }
  }

  async function handleChangeLimit() {
    const newLimit = Number(form.limit) || 1;
    try {
      await api.updateDevice(modal.device.deviceId, { limit: newLimit });
      setRows((r) => r.map((d) => d.deviceId === modal.device.deviceId ? { ...d, limit: newLimit } : d));
    } catch (e) { setLoadError(e.message); }
    closeModal();
  }

  return (
    <div>
      {loadError && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> API error: {loadError}. Changes may not be saved.
        </div>
      )}
      <PageHeader
        title="Device Management"
        subtitle="1 device per customer by default \u2014 manage devices, limits and access"
        action={
          <div className="flex gap-2">
            <PrimaryButton variant="ghost" icon={RefreshCcw} onClick={handleResetAll}>Reset Devices</PrimaryButton>
            <PrimaryButton icon={Plus} onClick={() => openModal("add")}>Add Device</PrimaryButton>
          </div>
        }
      />
      <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.primary}12`, color: C.primaryDim, width: "fit-content" }}>
        <ShieldCheck size={13} /> "Add Device" is restricted to admin accounts only.
      </div>
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SearchBox value={q} onChange={setQ} placeholder="Search devices..." />
          <div className="text-xs" style={{ color: C.faint }}>{filtered.length} of {rows.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: C.faint }} className="text-left">
                <th className="font-medium pb-3 pr-4">Device Name</th>
                <th className="font-medium pb-3 pr-4">Device Type</th>
                <th className="font-medium pb-3 pr-4">Device ID</th>
                <th className="font-medium pb-3 pr-4">Customer</th>
                <th className="font-medium pb-3 pr-4">Status</th>
                <th className="font-medium pb-3 pr-4">Device Limit</th>
                <th className="font-medium pb-3 pr-4">Activation Date</th>
                <th className="font-medium pb-3 pr-4">Last Online Time</th>
                <th className="font-medium pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.deviceId} style={{ borderTop: `1px solid ${C.line}` }}>
                  <td className="py-3 pr-4 whitespace-nowrap font-medium" style={{ color: C.ink }}>{d.deviceName}</td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.ink }}>{d.type}</td>
                  <td className="py-3 pr-4 whitespace-nowrap font-mono text-xs" style={{ color: C.faint }}>{d.deviceId}</td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.ink }}>{d.customer}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    {d.blocked ? <Badge text="Blocked" tone="danger" /> : <Badge text={d.status} tone={toneFor(d.status)} />}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.ink }}>
                    <button onClick={() => openModal("limit", d)} className="flex items-center gap-1 font-semibold" style={{ color: C.primaryDim }}>
                      {d.limit} <Pencil size={11} />
                    </button>
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{d.activated}</td>
                  <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{d.lastSeen}</td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <span className="inline-flex gap-3 items-center">
                      <button title="Replace Device" onClick={() => openModal("replace", d)}>
                        <RefreshCcw size={14} color={C.primaryDim} />
                      </button>
                      <button title={d.blocked ? "Unblock Device" : "Block Device"} onClick={() => handleToggleBlock(d)}>
                        <ShieldCheck size={14} color={d.blocked ? C.green : C.ember} />
                      </button>
                      <button title="Remove Device" onClick={() => openModal("remove", d)}>
                        <Trash2 size={14} color={C.ember} />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-sm" style={{ color: C.faint }}>No devices found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {modal?.type === "add" && (
        <Modal
          title="Add Device (Admin Only)"
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={handleAddDevice} variant={overLimit ? "ghost" : "primary"}>Add Device</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Device Name">
            <TextInput placeholder="Living Room TV" value={form.deviceName || ""} onChange={(e) => setForm((f) => ({ ...f, deviceName: e.target.value }))} />
          </Field>
          <Field label="Customer">
            <Select value={form.customer || ""} options={["", ...customers.map((c) => c.name)]} onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))} />
          </Field>
          <Field label="Device Type">
            <Select value={form.type || "Android TV"} options={["Fire TV", "Android TV", "Google TV"]} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} />
          </Field>
          {form.customer && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
              style={overLimit ? { background: `${C.ember}12`, color: C.ember } : { background: `${C.green}12`, color: C.greenDark }}
            >
              {overLimit ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
              {form.customer} has {selectedCustomerCount} of {selectedCustomerLimit} device{selectedCustomerLimit === 1 ? "" : "s"} used.
              {overLimit ? " Increase their device limit first to add another." : " This device will be added under the same customer."}
            </div>
          )}
        </Modal>
      )}

      {modal?.type === "replace" && (
        <Modal
          title="Replace Device"
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={handleReplaceDevice}>Confirm Replace</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Replacing <span className="font-semibold" style={{ color: C.ink }}>{modal.device.deviceName}</span> ({modal.device.deviceId}) will deactivate it and generate a new device ID for {modal.device.customer}. The old device will lose access immediately.
          </p>
        </Modal>
      )}

      {modal?.type === "remove" && (
        <Modal
          title="Remove Device"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleRemoveDevice}>Remove Device</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to permanently remove <span className="font-semibold" style={{ color: C.ink }}>{modal.device.deviceName}</span> ({modal.device.deviceId}) from {modal.device.customer}'s account?
          </p>
        </Modal>
      )}

      {modal?.type === "limit" && (
        <Modal
          title="Change Device Limit"
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={handleChangeLimit}>Save Limit</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label={`Device limit for ${modal.device.customer}`} hint="Default is 1 device per customer">
            <TextInput
              type="number"
              min={1}
              defaultValue={modal.device.limit}
              onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
            />
          </Field>
        </Modal>
      )}
    </div>
  );
}

function DeviceHistoryPage() {
  return (
    <DataTable
      pageTitle="Device History"
      pageSubtitle="Activity log for connected devices"
      searchable
      columns={[
        { key: "deviceId", label: "Device ID" },
        { key: "event", label: "Event" },
        { key: "date", label: "Date" },
      ]}
      rows={deviceHistory}
    />
  );
}

function SubscriptionsPage() {
  return (
    <DataTable
      pageTitle="Subscriptions"
      pageSubtitle="Customer plan status and billing cycles"
      columns={[
        { key: "customer", label: "Customer" },
        { key: "plan", label: "Plan" },
        { key: "start", label: "Start" },
        { key: "end", label: "End" },
        { key: "status", label: "Status", render: (r) => <Badge text={r.status} tone={toneFor(r.status)} /> },
      ]}
      rows={subscriptions}
      renderActions={() => <RowActions />}
    />
  );
}

function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

const liveEventsApi = resource("live-events", "title");

function VideoPlayer({ src }) {
  const videoRef = React.useRef(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
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
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} controls autoPlay playsInline className="w-full h-full" />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-white/70">Loading stream\u2026</div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center text-xs px-6 text-center" style={{ color: C.ember }}>
          Couldn't load this stream. Check the URL.
        </div>
      )}
    </div>
  );
}

function LiveEventsPage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", event }
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ title: "", channel: "", category: "Sports", start: "", end: "", status: "Upcoming", featured: false, streamUrl: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    liveEventsApi.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    setForm({ title: "", channel: "", category: "Sports", start: "", end: "", status: "Upcoming", featured: false, streamUrl: "" });
    setModal({ type: "add" });
  }
  function openEdit(ev) {
    setForm({ ...ev });
    setModal({ type: "edit", event: ev });
  }
  function openDelete(ev) {
    setModal({ type: "delete", event: ev });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    if (!form.title.trim()) return;
    const data = { ...form, title: form.title.trim() };
    try {
      await liveEventsApi.add(data);
      setRows((r) => [...r, data]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    const data = { ...form, title: form.title.trim() };
    try {
      await liveEventsApi.update(modal.event.title, data);
      setRows((r) => r.map((ev) => ev === modal.event ? data : ev));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      await liveEventsApi.remove(modal.event.title);
      setRows((r) => r.filter((ev) => ev !== modal.event));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  const sorted = [...rows].sort((a, b) => new Date(a.start) - new Date(b.start));

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Live Events"
        subtitle="Schedule live broadcasts and specials shown in the TV app's Live TV section"
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Live Event</PrimaryButton>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Event</th>
              <th className="font-medium pb-3 pr-4">Channel</th>
              <th className="font-medium pb-3 pr-4">Category</th>
              <th className="font-medium pb-3 pr-4">Start</th>
              <th className="font-medium pb-3 pr-4">End</th>
              <th className="font-medium pb-3 pr-4">Status</th>
              <th className="font-medium pb-3 pr-4">Featured</th>
              <th className="font-medium pb-3 pr-4">Stream</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ev, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-3 pr-4 font-medium" style={{ color: C.ink }}>{ev.title}</td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{ev.channel}</td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{ev.category}</td>
                <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{fmtDateTime(ev.start)}</td>
                <td className="py-3 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{fmtDateTime(ev.end)}</td>
                <td className="py-3 pr-4"><Badge text={ev.status} tone={toneFor(ev.status)} /></td>
                <td className="py-3 pr-4">{ev.featured ? <Badge text="Featured" tone="purple" /> : <span style={{ color: C.faint }}>\u2014</span>}</td>
                <td className="py-3 pr-4">
                  {ev.streamUrl ? (
                    <button onClick={() => setPreview(ev)} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.primaryDim }}>
                      <Radio size={12} /> Connected
                    </button>
                  ) : (
                    <span className="text-xs" style={{ color: C.faint }}>Not set</span>
                  )}
                </td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => openEdit(ev)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => openDelete(ev)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={8} className="py-8 text-center text-sm" style={{ color: C.faint }}>No live events scheduled.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Live Event" : "Edit Live Event"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Add Event" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Event Title">
            <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Copa America Final" />
          </Field>
          <Field label="Channel">
            <Select value={form.channel} options={["", ...channelList.map((c) => c.name)]} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))} />
          </Field>
          <Field label="Category">
            <Select value={form.category} options={categories.map((c) => c.name)} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time">
              <TextInput type="datetime-local" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
            </Field>
            <Field label="End Time">
              <TextInput type="datetime-local" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
            </Field>
          </div>
          <Field label="Status">
            <Select value={form.status} options={["Upcoming", "Live", "Ended"]} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} />
          </Field>
          <Field label="Stream URL" hint="HLS (.m3u8) link for your own licensed source. Leave blank if not live yet.">
            <TextInput value={form.streamUrl} onChange={(e) => setForm((f) => ({ ...f, streamUrl: e.target.value }))} placeholder="https://your-stream-source.com/stream.m3u8" />
          </Field>
          <label className="flex items-center gap-2 text-sm mt-1" style={{ color: C.ink }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Feature this event on the TV app home screen
          </label>
        </Modal>
      )}

      {preview && (
        <Modal title={`Preview: ${preview.title}`} onClose={() => setPreview(null)}>
          <VideoPlayer src={preview.streamUrl} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Live Event"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to delete "<span className="font-semibold" style={{ color: C.ink }}>{modal.event.title}</span>"?
          </p>
        </Modal>
      )}
    </div>
  );
}

const programsApi = resource("programs", "id");

function ProgramGuidePage() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", program }
  const [form, setForm] = useState({ channel: "", title: "", category: "News", start: "", end: "" });
  const [error, setError] = useState("");
  const [channelFilter, setChannelFilter] = useState("All");

  useEffect(() => {
    programsApi.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    setForm({ channel: channelList[0]?.name || "", title: "", category: "News", start: "", end: "" });
    setModal({ type: "add" });
  }
  function openEdit(p) {
    setForm({ channel: p.channel, title: p.title, category: p.category, start: p.start, end: p.end });
    setModal({ type: "edit", program: p });
  }
  function openDelete(p) {
    setModal({ type: "delete", program: p });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    if (!form.title.trim() || !form.channel || !form.start || !form.end) return;
    const data = { ...form, title: form.title.trim() };
    try {
      const saved = await programsApi.add(data);
      setRows((r) => [...r, saved]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    const data = { ...form, title: form.title.trim() };
    try {
      await programsApi.update(modal.program.id, data);
      setRows((r) => r.map((p) => p === modal.program ? { ...p, ...data } : p));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      await programsApi.remove(modal.program.id);
      setRows((r) => r.filter((p) => p !== modal.program));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  const channelNames = ["All", ...Array.from(new Set(rows.map((p) => p.channel)))];
  const filtered = (channelFilter === "All" ? rows : rows.filter((p) => p.channel === channelFilter))
    .slice()
    .sort((a, b) => a.channel.localeCompare(b.channel) || new Date(a.start) - new Date(b.start));

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Program Guide"
        subtitle="Schedule of programs per channel, shown as a TV-style grid guide in the app"
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Program</PrimaryButton>}
      />
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 overflow-x-auto">
            {channelNames.map((c) => (
              <button
                key={c}
                onClick={() => setChannelFilter(c)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
                style={{
                  background: channelFilter === c ? C.primary : C.bgApp,
                  color: channelFilter === c ? "#fff" : C.sub,
                  border: `1px solid ${channelFilter === c ? C.primary : C.line}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="text-xs" style={{ color: C.faint }}>{filtered.length} of {rows.length}</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Channel</th>
              <th className="font-medium pb-3 pr-4">Program</th>
              <th className="font-medium pb-3 pr-4">Category</th>
              <th className="font-medium pb-3 pr-4">Start</th>
              <th className="font-medium pb-3 pr-4">End</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-2.5 pr-4 font-medium" style={{ color: C.ink }}>{p.channel}</td>
                <td className="py-2.5 pr-4" style={{ color: C.ink }}>{p.title}</td>
                <td className="py-2.5 pr-4" style={{ color: C.sub }}>{p.category}</td>
                <td className="py-2.5 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{p.start?.replace("T", " ")}</td>
                <td className="py-2.5 pr-4 whitespace-nowrap" style={{ color: C.faint }}>{p.end?.replace("T", " ")}</td>
                <td className="py-2.5 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => openEdit(p)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => openDelete(p)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-sm" style={{ color: C.faint }}>No programs scheduled yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Program" : "Edit Program"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Add Program" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Channel">
            <Select value={form.channel} options={channelList.map((c) => c.name)} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))} />
          </Field>
          <Field label="Program Title">
            <TextInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Evening News" />
          </Field>
          <Field label="Category">
            <Select value={form.category} options={categories.map((c) => c.name)} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Time">
              <TextInput type="datetime-local" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
            </Field>
            <Field label="End Time">
              <TextInput type="datetime-local" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
            </Field>
          </div>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Program"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to delete "<span className="font-semibold" style={{ color: C.ink }}>{modal.program.title}</span>"?
          </p>
        </Modal>
      )}
    </div>
  );
}

function ChannelProfilesPage({ profiles, onEdit, onDelete, onCreate }) {
  const [q, setQ] = useState("");
  const filtered = q
    ? profiles.filter((p) => [p.name, p.tags].some((v) => v.toLowerCase().includes(q.toLowerCase())))
    : profiles;

  return (
    <div>
      <PageHeader
        title="Channel Profiles"
        subtitle="Bundled channel packages assigned to customers"
        action={<PrimaryButton icon={Plus} onClick={onCreate}>Create Profile</PrimaryButton>}
      />
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SearchBox value={q} onChange={setQ} placeholder="Search profiles..." />
          <div className="text-xs" style={{ color: C.faint }}>{filtered.length} of {profiles.length}</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Profile Name</th>
              <th className="font-medium pb-3 pr-4">Focus</th>
              <th className="font-medium pb-3 pr-4">Channels</th>
              <th className="font-medium pb-3 pr-4">Customers Assigned</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.name}</td>
                <td className="py-3 pr-4"><Badge text={p.tags} tone="purple" /></td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.channels}</td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.customers}</td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => onEdit(p)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => onDelete(p)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: C.faint }}>No profiles found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function ProfileFormPage({ mode = "create", editing, onCancel, onSave }) {
  const [name, setName] = useState(editing?.name || "");
  const [tags, setTags] = useState(editing?.tags || categories[0]?.name || "");
  const [checked, setChecked] = useState(() => new Set(mode === "edit" ? channelList.map((c) => c.name) : []));

  function toggleChannel(name) {
    setChecked((s) => {
      const next = new Set(s);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  }

  function handleSave() {
    onSave({
      name: name.trim() || "Untitled Profile",
      tags,
      channels: checked.size,
      customers: editing?.customers ?? 0,
    });
  }

  return (
    <div>
      <PageHeader title={mode === "create" ? "Create Profile" : "Edit Profile"} subtitle="Define a channel bundle customers can subscribe to" />
      <Card className="max-w-3xl">
        <div className="mb-6">
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Profile Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Field label="Profile Name">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Sports Plus" />
            </Field>
            <Field label="Category">
              <Select value={tags} options={categories.map((c) => c.name)} onChange={(e) => setTags(e.target.value)} />
            </Field>
          </div>
        </div>
        <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${C.line}` }}>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Included Channels ({checked.size} selected)</div>
          <div className="grid grid-cols-2 gap-2">
            {channelList.map((c) => (
              <label key={c.name} className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                <input type="checkbox" checked={checked.has(c.name)} onChange={() => toggleChannel(c.name)} /> {c.name}
                <span className="text-[11px]" style={{ color: C.faint }}>({c.category})</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6 pt-5" style={{ borderTop: `1px solid ${C.line}` }}>
          <PrimaryButton onClick={handleSave}>{mode === "create" ? "Create Profile" : "Save Changes"}</PrimaryButton>
          <PrimaryButton variant="ghost" onClick={onCancel}>Cancel</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

function ChannelManagerPage() {
  const [rows, setRows] = useState([...channelList].sort((a, b) => a.order - b.order));
  const [dragIdx, setDragIdx] = useState(null);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(null); // { type: "add" | "edit", channel? }
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", category: "News", country: "", streamUrl: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    channelsApi.list().then((data) => setRows([...data].sort((a, b) => a.order - b.order))).catch((e) => setError(e.message));
  }, []);

  async function handleDrop(targetIdx) {
    if (dragIdx === null || dragIdx === targetIdx) return;
    const next = [...rows];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(targetIdx, 0, moved);
    const reordered = next.map((c, i) => ({ ...c, order: i + 1 }));
    setRows(reordered);
    setDragIdx(null);
    try {
      await Promise.all(reordered.map((c) => channelsApi.update(c.name, { order: c.order })));
    } catch (e) { setError(e.message); }
  }

  async function toggleEnabled(name) {
    const channel = rows.find((c) => c.name === name);
    const next = !channel.enabled;
    setRows((r) => r.map((c) => c.name === name ? { ...c, enabled: next } : c));
    try {
      await channelsApi.update(name, { enabled: next });
    } catch (e) { setError(e.message); }
  }

  function openAdd() {
    setForm({ name: "", category: "News", country: "", streamUrl: "" });
    setModal({ type: "add" });
  }
  function openEdit(c) {
    setForm({ name: c.name, category: c.category, country: c.country, streamUrl: c.streamUrl || "" });
    setModal({ type: "edit", channel: c });
  }
  function closeModal() { setModal(null); }

  async function handleAddChannel() {
    if (!form.name.trim()) return;
    const data = { order: rows.length + 1, name: form.name.trim(), category: form.category, country: form.country, streamUrl: form.streamUrl.trim(), enabled: true };
    try {
      await channelsApi.add(data);
      setRows((r) => [...r, data]);
      closeModal();
    } catch (e) { setError(e.message); }
  }

  async function handleSaveEdit() {
    const updates = { name: form.name.trim(), category: form.category, country: form.country, streamUrl: form.streamUrl.trim() };
    try {
      await channelsApi.update(modal.channel.name, updates);
      setRows((r) => r.map((c) => c === modal.channel ? { ...c, ...updates } : c));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  const filtered = q ? rows.filter((c) => [c.name, c.category, c.country].some((v) => v.toLowerCase().includes(q.toLowerCase()))) : rows;

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Channel Manager"
        subtitle="Drag rows to reorder. Add a Stream URL to make a channel actually playable in the TV app."
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Channel</PrimaryButton>}
      />
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SearchBox value={q} onChange={setQ} placeholder="Search channels..." />
          <div className="text-xs" style={{ color: C.faint }}>{filtered.length} of {rows.length}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: C.faint }} className="text-left">
                <th className="font-medium pb-3 pr-2 w-8"></th>
                <th className="font-medium pb-3 pr-4">#</th>
                <th className="font-medium pb-3 pr-4">Channel</th>
                <th className="font-medium pb-3 pr-4">Category</th>
                <th className="font-medium pb-3 pr-4">Country</th>
                <th className="font-medium pb-3 pr-4">Stream</th>
                <th className="font-medium pb-3 pr-4">Enabled</th>
                <th className="font-medium pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.name}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  style={{ borderTop: `1px solid ${C.line}`, opacity: c.enabled ? 1 : 0.5, cursor: "grab" }}
                >
                  <td className="py-3 pr-2">
                    <span style={{ color: C.faint }}>\u2630</span>
                  </td>
                  <td className="py-3 pr-4" style={{ color: C.faint }}>{c.order}</td>
                  <td className="py-3 pr-4 font-medium" style={{ color: C.ink }}>{c.name}</td>
                  <td className="py-3 pr-4" style={{ color: C.ink }}>{c.category}</td>
                  <td className="py-3 pr-4" style={{ color: C.ink }}>{c.country}</td>
                  <td className="py-3 pr-4">
                    {c.streamUrl ? (
                      <button onClick={() => setPreview(c)} className="flex items-center gap-1 text-xs font-semibold" style={{ color: C.primaryDim }}>
                        <Radio size={12} /> Connected
                      </button>
                    ) : (
                      <span className="text-xs" style={{ color: C.faint }}>Not set</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Toggle on={c.enabled} onChange={() => toggleEnabled(c.name)} />
                  </td>
                  <td className="py-3 text-right">
                    <button onClick={() => openEdit(c)}><Pencil size={14} color={C.faint} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-sm" style={{ color: C.faint }}>No channels found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Channel" : "Edit Channel"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleAddChannel : handleSaveEdit}>
              {modal.type === "add" ? "Add Channel" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Channel Name">
            <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="T\u00e9l\u00e9 Haiti" />
          </Field>
          <Field label="Category">
            <Select value={form.category} options={categories.map((c) => c.name)} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} />
          </Field>
          <Field label="Country">
            <Select value={form.country} options={countries.map((c) => c.name)} onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))} />
          </Field>
          <Field label="Stream URL" hint="HLS (.m3u8) link for your own licensed source. Leave blank to keep the channel listed but not playable yet.">
            <TextInput value={form.streamUrl} onChange={(e) => setForm((f) => ({ ...f, streamUrl: e.target.value }))} placeholder="https://your-stream-source.com/channel.m3u8" />
          </Field>
        </Modal>
      )}

      {preview && (
        <Modal title={`Preview: ${preview.name}`} onClose={() => setPreview(null)}>
          <VideoPlayer src={preview.streamUrl} />
        </Modal>
      )}
    </div>
  );
}

const countriesApi = resource("countries", "name");
function CountriesPage() {
  return (
    <SimpleCrudPage
      title="Countries"
      subtitle="Channel availability by country"
      addLabel="Add Country"
      api={countriesApi}
      initialRows={countries}
      fields={[
        { key: "name", label: "Country", placeholder: "Haiti" },
        { key: "regions", label: "Region", type: "select", options: ["North America", "Europe", "Caribbean", "Latin America"] },
        { key: "channels", label: "Channels", type: "number", default: "0" },
      ]}
      columns={[
        { key: "name", label: "Country" },
        { key: "regions", label: "Region" },
        { key: "channels", label: "Channels" },
      ]}
    />
  );
}

const regionsApi = resource("regions", "name");
function RegionsPage() {
  return (
    <SimpleCrudPage
      title="Regions"
      subtitle="Group countries into regions"
      addLabel="Add Region"
      api={regionsApi}
      initialRows={regions}
      fields={[
        { key: "name", label: "Region", placeholder: "Caribbean" },
        { key: "countries", label: "Countries", type: "number", default: "0" },
        { key: "channels", label: "Channels", type: "number", default: "0" },
      ]}
      columns={[
        { key: "name", label: "Region" },
        { key: "countries", label: "Countries" },
        { key: "channels", label: "Channels" },
      ]}
    />
  );
}

const categoriesApi = resource("categories", "name");
function CategoriesPage() {
  return (
    <SimpleCrudPage
      title="Categories"
      subtitle="Channel categories used across the catalog"
      addLabel="Add Category"
      api={categoriesApi}
      initialRows={categories}
      fields={[
        { key: "name", label: "Category", placeholder: "Sports" },
        { key: "channels", label: "Channels", type: "number", default: "0" },
      ]}
      columns={[
        { key: "name", label: "Category" },
        { key: "channels", label: "Channels" },
      ]}
    />
  );
}

const bannersApi = resource("banners", "content");
function BannersPage() {
  const [rows, setRows] = useState(banners);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", banner }
  const [form, setForm] = useState({ type: "Banner", content: "", status: "Active" });
  const [error, setError] = useState("");

  useEffect(() => {
    bannersApi.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    setForm({ type: "Banner", content: "", status: "Active" });
    setModal({ type: "add" });
  }
  function openEdit(b) {
    setForm({ type: b.type, content: b.content, status: b.status });
    setModal({ type: "edit", banner: b });
  }
  function openDelete(b) {
    setModal({ type: "delete", banner: b });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    if (!form.content.trim()) return;
    const data = { ...form, content: form.content.trim() };
    try {
      await bannersApi.add(data);
      setRows((r) => [...r, data]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    const data = { ...form, content: form.content.trim() };
    try {
      await bannersApi.update(modal.banner.content, data);
      setRows((r) => r.map((b) => b === modal.banner ? data : b));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      await bannersApi.remove(modal.banner.content);
      setRows((r) => r.filter((b) => b !== modal.banner));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Banner Manager"
        subtitle="Homepage banners shown in the TV app"
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Banner</PrimaryButton>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Type</th>
              <th className="font-medium pb-3 pr-4">Content</th>
              <th className="font-medium pb-3 pr-4">Status</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{b.type}</td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{b.content}</td>
                <td className="py-3 pr-4"><Badge text={b.status} tone={toneFor(b.status)} /></td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => openEdit(b)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => openDelete(b)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="py-8 text-center text-sm" style={{ color: C.faint }}>No banners yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Banner" : "Edit Banner"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Add Banner" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Type">
            <Select
              value={form.type}
              options={["Banner", "Ticker"]}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            />
          </Field>
          <Field label="Content">
            <TextInput
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Promo 6 Months"
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              options={["Active", "Inactive"]}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            />
          </Field>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Banner"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to delete "<span className="font-semibold" style={{ color: C.ink }}>{modal.banner.content}</span>"?
          </p>
        </Modal>
      )}
    </div>
  );
}

const popupsApi = resource("popups", "title");
function PopupsPage() {
  const [rows, setRows] = useState(popups);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", popup }
  const [form, setForm] = useState({ title: "", active: "Yes", start: "", end: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    popupsApi.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    setForm({ title: "", active: "Yes", start: "", end: "" });
    setModal({ type: "add" });
  }
  function openEdit(p) {
    setForm({ title: p.title, active: p.active, start: p.start, end: p.end });
    setModal({ type: "edit", popup: p });
  }
  function openDelete(p) {
    setModal({ type: "delete", popup: p });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    if (!form.title.trim()) return;
    const data = { ...form, title: form.title.trim() };
    try {
      await popupsApi.add(data);
      setRows((r) => [...r, data]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    const data = { ...form, title: form.title.trim() };
    try {
      await popupsApi.update(modal.popup.title, data);
      setRows((r) => r.map((p) => p === modal.popup ? data : p));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      await popupsApi.remove(modal.popup.title);
      setRows((r) => r.filter((p) => p !== modal.popup));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Popup Manager"
        subtitle="Promotional and maintenance popups"
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Popup</PrimaryButton>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Title</th>
              <th className="font-medium pb-3 pr-4">Active</th>
              <th className="font-medium pb-3 pr-4">Start Date</th>
              <th className="font-medium pb-3 pr-4">End Date</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.title}</td>
                <td className="py-3 pr-4"><Badge text={p.active} tone={toneFor(p.active)} /></td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.start}</td>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{p.end}</td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => openEdit(p)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => openDelete(p)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: C.faint }}>No popups yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Popup" : "Edit Popup"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Add Popup" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Title">
            <TextInput
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Summer Promo"
            />
          </Field>
          <Field label="Active">
            <Select
              value={form.active}
              options={["Yes", "No"]}
              onChange={(e) => setForm((f) => ({ ...f, active: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date">
              <TextInput type="date" value={form.start} onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))} />
            </Field>
            <Field label="End Date">
              <TextInput type="date" value={form.end} onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))} />
            </Field>
          </div>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Popup"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to delete "<span className="font-semibold" style={{ color: C.ink }}>{modal.popup.title}</span>"?
          </p>
        </Modal>
      )}
    </div>
  );
}

const tickersApi = resource("tickers", "message");
function TickersPage() {
  const [rows, setRows] = useState(tickers);
  const [modal, setModal] = useState(null); // { type: "add" | "edit" | "delete", ticker }
  const [form, setForm] = useState({ message: "", status: "Active" });
  const [error, setError] = useState("");

  useEffect(() => {
    tickersApi.list().then(setRows).catch((e) => setError(e.message));
  }, []);

  function openAdd() {
    setForm({ message: "", status: "Active" });
    setModal({ type: "add" });
  }
  function openEdit(t) {
    setForm({ message: t.message, status: t.status });
    setModal({ type: "edit", ticker: t });
  }
  function openDelete(t) {
    setModal({ type: "delete", ticker: t });
  }
  function closeModal() { setModal(null); }

  async function handleSaveAdd() {
    if (!form.message.trim()) return;
    const data = { message: form.message.trim(), status: form.status };
    try {
      await tickersApi.add(data);
      setRows((r) => [...r, data]);
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleSaveEdit() {
    const data = { message: form.message.trim(), status: form.status };
    try {
      await tickersApi.update(modal.ticker.message, data);
      setRows((r) => r.map((t) => t === modal.ticker ? data : t));
      closeModal();
    } catch (e) { setError(e.message); }
  }
  async function handleDelete() {
    try {
      await tickersApi.remove(modal.ticker.message);
      setRows((r) => r.filter((t) => t !== modal.ticker));
      closeModal();
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      <PageHeader
        title="Ticker Manager"
        subtitle="Scrolling announcement messages"
        action={<PrimaryButton icon={Plus} onClick={openAdd}>Add Ticker</PrimaryButton>}
      />
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: C.faint }} className="text-left">
              <th className="font-medium pb-3 pr-4">Message</th>
              <th className="font-medium pb-3 pr-4">Status</th>
              <th className="font-medium pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-3 pr-4" style={{ color: C.ink }}>{t.message}</td>
                <td className="py-3 pr-4"><Badge text={t.status} tone={toneFor(t.status)} /></td>
                <td className="py-3 text-right whitespace-nowrap">
                  <span className="inline-flex gap-3 items-center">
                    <button onClick={() => openEdit(t)}><Pencil size={14} color={C.faint} /></button>
                    <button onClick={() => openDelete(t)}><Trash2 size={14} color={C.ember} /></button>
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={3} className="py-8 text-center text-sm" style={{ color: C.faint }}>No tickers yet.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {(modal?.type === "add" || modal?.type === "edit") && (
        <Modal
          title={modal.type === "add" ? "Add Ticker" : "Edit Ticker"}
          onClose={closeModal}
          footer={<>
            <PrimaryButton onClick={modal.type === "add" ? handleSaveAdd : handleSaveEdit}>
              {modal.type === "add" ? "Add Ticker" : "Save Changes"}
            </PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <Field label="Message">
            <TextInput
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Welcome to BenTech TV Stick"
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              options={["Active", "Paused"]}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            />
          </Field>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal
          title="Delete Ticker"
          onClose={closeModal}
          footer={<>
            <PrimaryButton variant="danger" onClick={handleDelete}>Delete</PrimaryButton>
            <PrimaryButton variant="ghost" onClick={closeModal}>Cancel</PrimaryButton>
          </>}
        >
          <p className="text-sm" style={{ color: C.sub }}>
            Are you sure you want to delete "<span className="font-semibold" style={{ color: C.ink }}>{modal.ticker.message}</span>"?
          </p>
        </Modal>
      )}
    </div>
  );
}

function ReportsPage() {
  return (
    <div>
      <PageHeader title="Reports" subtitle="Revenue and growth over time" action={<PrimaryButton icon={Download} variant="ghost">Export CSV</PrimaryButton>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <Card>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Revenue (30 Days)</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <XAxis dataKey="d" tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke={C.primary} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Customer Growth</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: C.faint }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="v" fill={C.cyan} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <div className="text-sm font-bold mb-4" style={{ color: C.ink }}>Top Plans by Revenue</div>
        <table className="w-full text-sm">
          <thead><tr style={{ color: C.faint }} className="text-left">
            <th className="font-medium pb-2">Plan</th><th className="font-medium pb-2">Clients</th><th className="font-medium pb-2 text-right">Revenue</th>
          </tr></thead>
          <tbody>
            {[["12 Months", 712, "$8,540"], ["6 Months", 512, "$3,420"], ["3 Months", 184, "$1,104"], ["1 Month", 98, "$588"]].map((r) => (
              <tr key={r[0]} style={{ borderTop: `1px solid ${C.line}` }}>
                <td className="py-2" style={{ color: C.ink }}>{r[0]}</td>
                <td className="py-2" style={{ color: C.faint }}>{r[1]}</td>
                <td className="py-2 text-right font-semibold" style={{ color: C.ink }}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

const languagesApi = resource("languages", "name");
function LanguagesPage() {
  return (
    <SimpleCrudPage
      title="Languages"
      subtitle="App interface languages"
      addLabel="Add Language"
      api={languagesApi}
      initialRows={languages}
      fields={[
        { key: "name", label: "Language", placeholder: "Portuguese" },
        { key: "code", label: "Code", placeholder: "pt" },
        { key: "status", label: "Status", type: "select", options: ["Active", "Inactive"], default: "Active" },
      ]}
      columns={[
        { key: "name", label: "Language" },
        { key: "code", label: "Code" },
        { key: "status", label: "Status", render: (r) => <Badge text={r.status} tone={toneFor(r.status)} /> },
      ]}
    />
  );
}

function SettingsPage() {
  const [form, setForm] = useState({
    siteName: "BenTech TV Stick",
    website: "https://www.bentechtvstick.net",
    supportPhone: "305-555-1234",
    supportEmail: "support@bentechtvstick.net",
    timezone: "America/New_York",
    emailAlerts: true,
    smsAlerts: false,
    showAnnouncementLabel: true,
  });
  const [status, setStatus] = useState(""); // "loading" | "saving" | "saved" | error message
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus("loading");
    api.getSettings()
      .then((data) => { setForm((f) => ({ ...f, ...data })); setStatus(""); })
      .catch((e) => { setError(e.message); setStatus(""); });
  }, []);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSave() {
    setStatus("saving");
    setError("");
    try {
      await api.updateSettings(form);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2000);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.ember}12`, color: C.ember, width: "fit-content" }}>
          <AlertTriangle size={13} /> {error}
        </div>
      )}
      {status === "saved" && (
        <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.green}12`, color: C.greenDark, width: "fit-content" }}>
          <Check size={13} /> Settings saved.
        </div>
      )}
      <FormPage
        title="Settings"
        subtitle="General configuration for BenTech TV Stick"
        onCancel={() => {}}
        onSave={handleSave}
        saveLabel={status === "saving" ? "Saving..." : "Save"}
        sections={[
          {
            title: "General",
            fields: (
              <>
                <Field label="Site Name"><TextInput value={form.siteName} onChange={set("siteName")} /></Field>
                <Field label="Website"><TextInput value={form.website} onChange={set("website")} /></Field>
                <Field label="Support Phone"><TextInput value={form.supportPhone} onChange={set("supportPhone")} /></Field>
                <Field label="Support Email"><TextInput value={form.supportEmail} onChange={set("supportEmail")} /></Field>
                <Field label="Timezone">
                  <Select value={form.timezone} onChange={set("timezone")} options={["America/New_York", "America/Port-au-Prince", "UTC"]} />
                </Field>
              </>
            ),
          },
          {
            title: "Ticker Display",
            fields: (
              <>
                <Field label={'"ANNOUNCEMENT" Label'}>
                  <Toggle
                    on={form.showAnnouncementLabel}
                    onChange={(v) => setForm((f) => ({ ...f, showAnnouncementLabel: v }))}
                    label={form.showAnnouncementLabel ? "Shown before ticker text" : "Hidden — ticker text only"}
                  />
                </Field>
              </>
            ),
          },
          {
            title: "Notifications",
            fields: (
              <>
                <Field label="Email Alerts"><Toggle on={form.emailAlerts} onChange={(v) => setForm((f) => ({ ...f, emailAlerts: v }))} label={form.emailAlerts ? "Enabled" : "Disabled"} /></Field>
                <Field label="SMS Alerts"><Toggle on={form.smsAlerts} onChange={(v) => setForm((f) => ({ ...f, smsAlerts: v }))} label={form.smsAlerts ? "Enabled" : "Disabled"} /></Field>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

const adminUsersApi = resource("admin-users", "email");
function AdminUsersPage() {
  return (
    <SimpleCrudPage
      title="Admin Users"
      subtitle="Staff accounts with dashboard access"
      addLabel="Add Admin"
      api={adminUsersApi}
      initialRows={adminUsers}
      fields={[
        { key: "name", label: "Name", placeholder: "Sophie Laurent" },
        { key: "email", label: "Email", placeholder: "sophie@bentechtvstick.net" },
        { key: "role", label: "Role", type: "select", options: ["Super Administrator", "Support Staff", "Billing"] },
        { key: "status", label: "Status", type: "select", options: ["Active", "Suspended"], default: "Active" },
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role", render: (r) => <Badge text={r.role} tone="purple" /> },
        { key: "status", label: "Status", render: (r) => <Badge text={r.status} tone={toneFor(r.status)} /> },
      ]}
    />
  );
}

function MaintenancePage() {
  const [on, setOn] = useState(false);
  return (
    <div>
      <PageHeader title="Maintenance Mode" subtitle="Temporarily disable customer access to the app" />
      <Card className="max-w-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-sm font-bold" style={{ color: C.ink }}>Maintenance Mode</div>
            <div className="text-xs" style={{ color: C.faint }}>When enabled, customers see the message below instead of the app</div>
          </div>
          <Toggle on={on} onChange={setOn} />
        </div>
        {on && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: `${C.amber}1A`, color: "#A9700F" }}>
            <AlertTriangle size={14} /> Customers currently cannot access the app.
          </div>
        )}
        <Field label="Maintenance Message">
          <TextArea defaultValue="We're performing scheduled maintenance. We'll be back shortly — thank you for your patience." />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Scheduled Start"><TextInput type="datetime-local" /></Field>
          <Field label="Scheduled End"><TextInput type="datetime-local" /></Field>
        </div>
        <PrimaryButton>Save Settings</PrimaryButton>
      </Card>
    </div>
  );
}

function AuditLogsPage() {
  return (
    <DataTable
      pageTitle="Audit Logs"
      pageSubtitle="System-wide action history for accountability"
      columns={[
        { key: "user", label: "User" },
        { key: "action", label: "Action" },
        { key: "date", label: "Date" },
        { key: "ip", label: "IP Address" },
      ]}
      rows={auditLogs}
    />
  );
}

/* ============================== Login ============================== */

function AdminLogin({ onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await api.login(username, password);
      onLogin();
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 20%, #16203A, ${C.sidebar} 70%)`, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="w-full max-w-sm px-6">
        <div className="flex justify-center mb-6"><Logo size={48} /></div>
        <div className="rounded-2xl p-6" style={{ background: "#131B30", border: `1px solid ${C.sidebarLine}` }}>
          <div className="text-center mb-6">
            <div className="text-lg font-black text-white">Admin Login</div>
            <div className="text-xs mt-1" style={{ color: C.sidebarText }}>Sign in to access the admin panel</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg" style={{ background: "#0E1524", border: `1px solid ${error ? C.ember : C.sidebarLine}` }}>
              <Users size={15} color={C.sidebarText} />
              <input value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Username" className="bg-transparent outline-none text-sm flex-1 text-white" />
            </div>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg" style={{ background: "#0E1524", border: `1px solid ${error ? C.ember : C.sidebarLine}` }}>
              <Lock size={15} color={C.sidebarText} />
              <input value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} type={showPw ? "text" : "password"} placeholder="Password" className="bg-transparent outline-none text-sm flex-1 text-white" />
              <button onClick={() => setShowPw((s) => !s)}>
                {showPw ? <EyeOff size={15} color={C.sidebarText} /> : <Eye size={15} color={C.sidebarText} />}
              </button>
            </div>
            {error && <div className="text-xs font-medium" style={{ color: C.ember }}>{error}</div>}
            <button
              className="w-full py-2.5 rounded-lg font-bold text-white text-sm mt-2"
              style={{ background: `linear-gradient(90deg, ${C.primary}, ${C.cyan})`, opacity: loading ? 0.7 : 1 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "LOG IN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== Shell ============================== */

const channelProfilesApi = resource("channel-profiles", "name");
const channelsApi = resource("channels", "name");

function AdminShell({ onLogout }) {
  const [active, setActive] = useState("dashboard");
  const [profiles, setProfiles] = useState(channelProfiles);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    channelProfilesApi.list().then(setProfiles).catch((e) => setProfileError(e.message));
  }, []);

  function goEditCustomer(row) {
    setEditingCustomer(row);
    setActive("customer-edit");
  }

  function goCreateProfile() {
    setEditingProfile(null);
    setActive("profile-create");
  }
  function goEditProfile(p) {
    setEditingProfile(p);
    setActive("profile-edit");
  }
  async function deleteProfile(p) {
    try {
      await channelProfilesApi.remove(p.name);
      setProfiles((r) => r.filter((x) => x !== p));
    } catch (e) { setProfileError(e.message); }
  }
  async function saveProfile(data) {
    try {
      if (editingProfile) {
        await channelProfilesApi.update(editingProfile.name, data);
        setProfiles((r) => r.map((x) => x === editingProfile ? { ...x, ...data } : x));
      } else {
        await channelProfilesApi.add(data);
        setProfiles((r) => [...r, data]);
      }
      setActive("channel-profiles");
    } catch (e) { setProfileError(e.message); }
  }

  const page = useMemo(() => {
    switch (active) {
      case "dashboard": return <DashboardPage />;
      case "customers": return <CustomersListPage onNavigate={setActive} onEdit={goEditCustomer} />;
      case "customer-add": return <CustomerFormPage mode="add" editing={null} onNavigate={setActive} />;
      case "customer-edit": return <CustomerFormPage mode="edit" editing={editingCustomer} onNavigate={setActive} />;
      case "activation-codes": return <ActivationCodesPage />;
      case "devices": return <DevicesPage />;
      case "device-history": return <DeviceHistoryPage />;
      case "subscriptions": return <SubscriptionsPage />;
      case "live-events": return <LiveEventsPage />;
      case "program-guide": return <ProgramGuidePage />;
      case "channel-profiles": return <ChannelProfilesPage profiles={profiles} onEdit={goEditProfile} onDelete={deleteProfile} onCreate={goCreateProfile} />;
      case "profile-create": return <ProfileFormPage mode="create" editing={null} onCancel={() => setActive("channel-profiles")} onSave={saveProfile} />;
      case "profile-edit": return <ProfileFormPage mode="edit" editing={editingProfile} onCancel={() => setActive("channel-profiles")} onSave={saveProfile} />;
      case "channel-manager": return <ChannelManagerPage />;
      case "countries": return <CountriesPage />;
      case "regions": return <RegionsPage />;
      case "categories": return <CategoriesPage />;
      case "banners": return <BannersPage />;
      case "popups": return <PopupsPage />;
      case "tickers": return <TickersPage />;
      case "reports": return <ReportsPage />;
      case "languages": return <LanguagesPage />;
      case "settings": return <SettingsPage />;
      case "admin-users": return <AdminUsersPage />;
      case "maintenance": return <MaintenancePage />;
      case "audit-logs": return <AuditLogsPage />;
      default: return <DashboardPage />;
    }
  }, [active, profiles, editingProfile, editingCustomer]);

  return (
    <div className="flex h-screen" style={{ background: C.bgApp, fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #C7CEDD; border-radius: 3px; }
      `}</style>

      <aside className="hidden md:flex flex-col shrink-0 h-full overflow-y-auto" style={{ width: 250, background: C.sidebar, borderRight: `1px solid ${C.sidebarLine}` }}>
        <div className="px-5 py-6"><Logo size={32} /></div>
        <nav className="flex-1 px-3 pb-4">
          {NAV.map((g) => (
            <div key={g.group} className="mb-4">
              <div className="px-3.5 mb-1 text-[10px] font-bold tracking-wider" style={{ color: "#3E4C6E" }}>{g.group.toUpperCase()}</div>
              {g.items.map((it) => {
                const activeIt = it.id === active;
                return (
                  <button
                    key={it.id}
                    onClick={() => setActive(it.id)}
                    className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-[13px] font-medium"
                    style={{ background: activeIt ? C.primary : "transparent", color: activeIt ? "#fff" : C.sidebarText }}
                  >
                    <it.icon size={15} /> {it.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 sticky top-0 z-10" style={{ background: "#fff", borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs" style={{ background: "#F1F4FA" }}>
            <Search size={14} color={C.faint} />
            <input placeholder="Search anything..." className="bg-transparent outline-none text-sm flex-1" style={{ color: C.ink }} />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell size={17} color={C.sub} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: C.ember }}>5</div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={onLogout}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.primary }}>
                <Users size={14} color="#fff" />
              </div>
              <div className="text-xs">
                <div className="font-semibold" style={{ color: C.ink }}>Admin</div>
                <div style={{ color: C.faint }}>Super Administrator</div>
              </div>
              <ChevronDown size={14} color={C.faint} />
            </div>
          </div>
        </div>
        <div className="p-6">
          {page}
        </div>
      </div>
    </div>
  );
}

/* ============================== Root ============================== */

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return loggedIn ? <AdminShell onLogout={() => setLoggedIn(false)} /> : <AdminLogin onLogin={() => setLoggedIn(true)} />;
}
