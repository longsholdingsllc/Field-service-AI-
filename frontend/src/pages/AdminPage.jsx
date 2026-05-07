import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  KeyRound,
  LogOut,
  RefreshCw,
  Download,
  ArrowLeft,
  Mail,
  Users,
  BarChart3,
  Send,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TOKEN_KEY = "ss_admin_token";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sendingRoundup, setSendingRoundup] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  const load = async () => {
    setLoading(true);
    try {
      const headers = { "X-Admin-Token": token };
      const [s, l] = await Promise.all([
        axios.get(`${API}/leads/stats`, { headers }),
        axios.get(`${API}/leads?limit=200`, { headers }),
      ]);
      setStats(s.data);
      setLeads(l.data);
    } catch (e) {
      if (e?.response?.status === 401) {
        toast.error("Invalid admin token");
        logout();
      } else {
        toast.error("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    localStorage.setItem(TOKEN_KEY, input.trim());
    setToken(input.trim());
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setInput("");
    setStats(null);
    setLeads([]);
  };

  const exportCsv = () => {
    if (!leads.length) return;
    const headers = ["created_at", "name", "business", "phone", "email", "variant", "source"];
    const rows = leads.map((l) =>
      headers
        .map((h) => {
          const v = l[h] ?? "";
          return `"${String(v).replace(/"/g, '""')}"`;
        })
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `servicespeak-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendRoundup = async () => {
    setSendingRoundup(true);
    try {
      const res = await axios.post(
        `${API}/admin/roundup/send`,
        {},
        { headers: { "X-Admin-Token": token } },
      );
      const d = res.data;
      if (d.status === "sent") {
        toast.success(`Roundup sent — ${d.leads} lead${d.leads === 1 ? "" : "s"}`);
      } else if (d.status === "skipped") {
        toast("Roundup skipped", {
          description: "RESEND_API_KEY or LEAD_NOTIFY_EMAIL not configured.",
        });
      } else {
        toast.error("Roundup failed", { description: d.detail || "Unknown error" });
      }
    } catch (e) {
      toast.error("Couldn't trigger roundup");
    } finally {
      setSendingRoundup(false);
    }
  };

  if (!authed) {
    return (
      <div
        data-testid="admin-login-page"
        className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-body"
      >
        <div className="w-full max-w-md bg-white border-2 border-slate-950 shadow-[16px_16px_0_rgba(2,8,23,1)] p-8 md:p-10">
          <div className="mono-overline text-blue-600 mb-3">
            ServiceSpeak · Admin
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight text-slate-950">
            Enter admin token.
          </h1>
          <p className="mt-3 text-slate-600 font-medium text-sm leading-relaxed">
            The token is set in{" "}
            <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5">
              /app/backend/.env
            </code>{" "}
            as <code className="font-mono text-xs">ADMIN_TOKEN</code>.
          </p>

          <form onSubmit={login} className="mt-8">
            <label className="mono-overline text-slate-500 block mb-2">
              Admin token
            </label>
            <div className="relative">
              <KeyRound
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                data-testid="admin-token-input"
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                placeholder="paste token here"
                className="w-full h-12 pl-10 pr-3 border border-slate-300 focus:border-slate-950 focus:ring-0 outline-none font-mono text-sm"
              />
            </div>
            <button
              type="submit"
              data-testid="admin-login-btn"
              className="mt-5 w-full bg-slate-950 hover:bg-blue-600 text-white font-bold py-4 transition-all"
            >
              Sign in
            </button>
          </form>

          <a
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-950 transition-colors"
          >
            <ArrowLeft size={12} /> Back to landing
          </a>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(1, ...(stats?.by_variant?.map((v) => v.count) || [1]));

  return (
    <div
      data-testid="admin-dashboard"
      className="min-h-screen bg-slate-50 font-body"
    >
      {/* Topbar */}
      <header className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-semibold"
            >
              <ArrowLeft size={14} /> Landing
            </a>
            <span className="text-slate-700">·</span>
            <span className="mono-overline text-blue-400">ADMIN · LEADS</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              data-testid="admin-refresh-btn"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600 px-3 py-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
            <button
              onClick={logout}
              data-testid="admin-logout-btn"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-slate-800 hover:border-slate-600 px-3 py-2 transition-colors"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Page title */}
        <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
          <div>
            <div className="mono-overline text-blue-600">Dashboard</div>
            <h1 className="font-display font-black text-4xl md:text-5xl tracking-[-0.03em] text-slate-950 mt-2">
              Lead pipeline.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={sendRoundup}
              disabled={sendingRoundup}
              data-testid="admin-send-roundup-btn"
              className="flex items-center gap-2 bg-white border-2 border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white font-bold px-5 py-3 text-sm transition-all"
            >
              <Send size={14} />
              {sendingRoundup ? "Sending…" : "Send roundup email"}
            </button>
            <button
              onClick={exportCsv}
              data-testid="admin-export-csv-btn"
              disabled={!leads.length}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-5 py-3 text-sm transition-all"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <StatCard
            icon={Users}
            label="Total leads"
            value={stats?.total ?? "—"}
            testId="stat-total"
          />
          <StatCard
            icon={BarChart3}
            label="A/B variants live"
            value={stats?.by_variant?.length ?? "—"}
            testId="stat-variants"
          />
          <StatCard
            icon={Mail}
            label="Daily roundup"
            value="09:00 UTC"
            hint="Automated · Resend"
            testId="stat-roundup"
          />
        </div>

        {/* A/B breakdown */}
        {stats?.by_variant?.length > 0 && (
          <section
            data-testid="ab-breakdown"
            className="bg-white border border-slate-200 p-6 md:p-8 mb-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="mono-overline text-blue-600">A/B · Pricing</div>
                <h2 className="font-display font-extrabold text-2xl text-slate-950 mt-1">
                  Variant performance
                </h2>
              </div>
              <span className="mono-overline text-slate-400">
                {stats.total} total leads
              </span>
            </div>

            <div className="space-y-4">
              {stats.by_variant.map((v) => (
                <div key={v.variant} data-testid={`ab-row-${v.variant}`}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-display font-extrabold text-slate-950">
                      {v.variant}
                    </span>
                    <span className="mono-overline text-slate-500">
                      {v.count} · {(v.share * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 overflow-hidden">
                    <div
                      className={
                        v.variant === "pro_first_mobile"
                          ? "h-full bg-blue-600"
                          : v.variant === "control"
                          ? "h-full bg-slate-950"
                          : "h-full bg-slate-300"
                      }
                      style={{ width: `${(v.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leads table */}
        <section className="bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 md:px-8 py-5 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-display font-extrabold text-xl text-slate-950">
              Recent leads
            </h2>
            <span className="mono-overline text-slate-500">
              {leads.length} shown
            </span>
          </div>

          <div className="overflow-x-auto" data-testid="leads-table">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <Th>When</Th>
                  <Th>Name</Th>
                  <Th>Business</Th>
                  <Th>Phone</Th>
                  <Th>Email</Th>
                  <Th>Variant</Th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-slate-400 font-medium"
                    >
                      {loading ? "Loading…" : "No leads yet."}
                    </td>
                  </tr>
                ) : (
                  leads.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
                      data-testid={`lead-row-${l.id}`}
                    >
                      <Td>
                        <span className="mono-overline text-slate-500 text-[0.6rem]">
                          {fmtTime(l.created_at)}
                        </span>
                      </Td>
                      <Td bold>{l.name}</Td>
                      <Td muted>{l.business || "—"}</Td>
                      <Td>{l.phone}</Td>
                      <Td muted>{l.email}</Td>
                      <Td>
                        <VariantTag v={l.variant} />
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

const Th = ({ children }) => (
  <th className="text-left px-4 md:px-6 py-3 mono-overline text-slate-500 text-[0.6rem] font-bold">
    {children}
  </th>
);

const Td = ({ children, bold, muted }) => (
  <td
    className={`px-4 md:px-6 py-3.5 text-sm ${
      bold
        ? "font-display font-extrabold text-slate-950"
        : muted
        ? "text-slate-500 font-medium"
        : "text-slate-700 font-semibold"
    }`}
  >
    {children}
  </td>
);

const VariantTag = ({ v }) => {
  if (!v)
    return (
      <span className="mono-overline text-[0.6rem] text-slate-400">—</span>
    );
  const styles =
    v === "pro_first_mobile"
      ? "bg-blue-100 text-blue-700"
      : v === "control"
      ? "bg-slate-900 text-white"
      : "bg-slate-100 text-slate-500";
  return (
    <span className={`mono-overline text-[0.6rem] px-2 py-1 ${styles}`}>
      {v}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, hint, testId }) => (
  <div
    data-testid={testId}
    className="bg-white border border-slate-200 p-6 flex items-start gap-4 hover:border-blue-300 transition-colors"
  >
    <div className="w-10 h-10 shrink-0 bg-slate-950 flex items-center justify-center">
      <Icon size={18} className="text-blue-400" strokeWidth={2.25} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="mono-overline text-slate-500">{label}</div>
      <div className="font-display font-black text-3xl text-slate-950 mt-1 leading-none">
        {value}
      </div>
      {hint && (
        <div className="text-xs text-slate-500 mt-1.5 font-semibold">
          {hint}
        </div>
      )}
    </div>
  </div>
);

const fmtTime = (iso) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};
