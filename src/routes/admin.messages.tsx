import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Mail, Trash2, Search, LogOut, Eye, EyeOff, Phone, Building2, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
  head: () => ({
    meta: [
      { title: "Admin · Contact Messages — MATED Institute" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

function AdminMessagesPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (auth.status === "unauthenticated") {
      navigate({ to: "/auth" });
    }
  }, [auth.status, navigate]);

  // Load + subscribe
  useEffect(() => {
    if (auth.status !== "admin") return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error) {
        toast.error("Failed to load messages");
      } else {
        setItems((data ?? []) as Submission[]);
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("contact_submissions_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_submissions" },
        (payload) => {
          setItems((prev) => [payload.new as Submission, ...prev]);
          toast.message("New message received", {
            description: (payload.new as Submission).name,
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "contact_submissions" },
        (payload) => {
          setItems((prev) =>
            prev.map((m) => (m.id === (payload.new as Submission).id ? (payload.new as Submission) : m)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "contact_submissions" },
        (payload) => {
          setItems((prev) => prev.filter((m) => m.id !== (payload.old as { id: string }).id));
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [auth.status]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (filter === "unread" && m.is_read) return false;
      if (filter === "read" && !m.is_read) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          m.name.toLowerCase().includes(s) ||
          m.email.toLowerCase().includes(s) ||
          m.message.toLowerCase().includes(s) ||
          (m.organization?.toLowerCase().includes(s) ?? false)
        );
      }
      return true;
    });
  }, [items, filter, search]);

  const unreadCount = items.filter((m) => !m.is_read).length;

  const toggleRead = async (m: Submission) => {
    const { error } = await supabase
      .from("contact_submissions")
      .update({ is_read: !m.is_read })
      .eq("id", m.id);
    if (error) toast.error("Could not update message");
  };

  const deleteMessage = async (m: Submission) => {
    if (!confirm(`Delete message from ${m.name}? This cannot be undone.`)) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", m.id);
    if (error) {
      toast.error("Could not delete message");
    } else {
      toast.success("Message deleted");
      if (selected?.id === m.id) setSelected(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  // Loading / auth states
  if (auth.status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <div className="text-sm text-muted-foreground">Checking access…</div>
      </div>
    );
  }

  if (auth.status === "not-admin") {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="font-display text-3xl font-semibold mb-3">Access denied</h1>
          <p className="text-muted-foreground mb-6">
            Your account doesn't have admin access. Ask the site owner to grant you the
            admin role.
          </p>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (auth.status !== "admin") return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container-editorial h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-display font-semibold tracking-tight">
            MATED <span className="text-muted-foreground font-normal">· Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {auth.session.user.email}
            </span>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-editorial py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">
              Contact messages
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} total · {unreadCount} unread
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(["all", "unread", "read"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs uppercase tracking-wider rounded-full border transition ${
                  filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {f}{" "}
                {f === "unread" && unreadCount > 0 && (
                  <span className="ml-1 opacity-80">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-6 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, organization, message…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* List */}
          <div className="lg:col-span-5 bg-card rounded-2xl border border-border overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                Loading messages…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center">
                <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <div className="text-sm text-muted-foreground">
                  {items.length === 0
                    ? "No messages yet. Submissions from your contact form will appear here."
                    : "No messages match your filters."}
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border max-h-[70vh] overflow-y-auto">
                {filtered.map((m) => (
                  <li key={m.id}>
                    <button
                      onClick={() => setSelected(m)}
                      className={`w-full text-left px-5 py-4 hover:bg-muted/60 transition ${
                        selected?.id === m.id ? "bg-muted" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {!m.is_read && (
                          <span
                            className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0"
                            aria-label="Unread"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <div
                              className={`truncate text-sm ${
                                m.is_read ? "font-normal" : "font-semibold"
                              }`}
                            >
                              {m.name}
                            </div>
                            <div className="text-[11px] text-muted-foreground shrink-0">
                              {formatRelative(m.created_at)}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {m.email}
                            {m.organization ? ` · ${m.organization}` : ""}
                          </div>
                          <div className="text-xs text-foreground/70 mt-1 line-clamp-2">
                            {m.message}
                          </div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail */}
          <div className="lg:col-span-7">
            {selected ? (
              <DetailCard
                key={selected.id}
                m={selected}
                onToggleRead={() => toggleRead(selected)}
                onDelete={() => deleteMessage(selected)}
              />
            ) : (
              <div className="bg-card rounded-2xl border border-border p-12 text-center text-sm text-muted-foreground">
                Select a message to view its details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailCard({
  m,
  onToggleRead,
  onDelete,
}: {
  m: Submission;
  onToggleRead: () => void;
  onDelete: () => void;
}) {
  const replyHref = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(
    "Re: your message to MATED Institute",
  )}&body=${encodeURIComponent(`Hello ${m.name},\n\n`)}`;

  return (
    <article className="bg-card rounded-2xl border border-border p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold">{m.name}</h2>
          <div className="text-xs text-muted-foreground mt-1">
            Received {new Date(m.created_at).toLocaleString()}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href={replyHref}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-medium hover:bg-primary/90 transition"
          >
            <Mail className="h-3.5 w-3.5" /> Reply by email
          </a>
          <button
            onClick={onToggleRead}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-medium hover:bg-muted transition"
          >
            {m.is_read ? (
              <>
                <EyeOff className="h-3.5 w-3.5" /> Mark as unread
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5" /> Mark as read
              </>
            )}
          </button>
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs font-medium hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>

      <dl className="grid sm:grid-cols-3 gap-4 mb-8 text-sm">
        <Field icon={Mail} label="Email" value={m.email} href={`mailto:${m.email}`} />
        <Field
          icon={Phone}
          label="Phone"
          value={m.phone ?? "—"}
          href={m.phone ? `tel:${m.phone}` : undefined}
        />
        <Field icon={Building2} label="Organization" value={m.organization ?? "—"} />
      </dl>

      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
        Message
      </div>
      <div className="whitespace-pre-wrap text-base leading-relaxed text-foreground/90 bg-secondary/40 rounded-xl p-5 border border-border">
        {m.message}
      </div>
    </article>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <dt className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-1.5">
        <Icon className="h-3 w-3" /> {label}
      </dt>
      <dd className="mt-1 text-sm break-all">{value}</dd>
    </>
  );
  return href ? (
    <a href={href} className="block hover:text-primary transition">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString();
}
