import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlogPage,
  head: () => ({
    meta: [
      { title: "Admin · Blog — MATED Institute" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  author_name: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function AdminBlogPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load posts");
      return;
    }
    setPosts((data as Post[] | null) ?? []);
  };

  useEffect(() => {
    if (auth.status === "admin") {
      refresh().finally(() => setLoading(false));
    }
  }, [auth.status]);

  if (auth.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (auth.status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">You must sign in to manage the blog.</p>
        <Link
          to="/auth"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (auth.status === "not-admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Your account does not have admin access.
        </p>
        <Link to="/" className="text-sm underline">
          Back to site
        </Link>
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const onDelete = async (p: Post) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    refresh();
  };

  const togglePublish = async (p: Post) => {
    const next = !p.published;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        published: next,
        published_at: next ? p.published_at ?? new Date().toISOString() : p.published_at,
      })
      .eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(next ? "Post published" : "Post unpublished");
    refresh();
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container-editorial h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-display font-semibold tracking-tight">
            MATED <span className="text-muted-foreground font-normal">· Admin · Blog</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/messages"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition"
            >
              Messages
            </Link>
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
        {editing || creating ? (
          <PostEditor
            initial={editing}
            onCancel={() => {
              setEditing(null);
              setCreating(false);
            }}
            onSaved={() => {
              setEditing(null);
              setCreating(false);
              refresh();
            }}
          />
        ) : (
          <>
            <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-semibold">
                  Blog posts
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {posts.length} total · {posts.filter((p) => p.published).length} published
                </p>
              </div>
              <button
                onClick={() => setCreating(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition"
              >
                <Plus className="h-4 w-4" /> New post
              </button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  Loading…
                </div>
              ) : posts.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">
                  No posts yet. Create your first one.
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {posts.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{p.title}</span>
                          <span
                            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              p.published
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {p.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          /{p.slug} · updated {new Date(p.updated_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => togglePublish(p)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition"
                          title={p.published ? "Unpublish" : "Publish"}
                        >
                          {p.published ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditing(p)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-muted transition"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PostEditor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: Post | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [author, setAuthor] = useState(initial?.author_name ?? "");
  const [content, setContent] = useState(initial?.content_md ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const onSave = async () => {
    if (!title.trim()) return toast.error("Title is required");
    if (!slug.trim()) return toast.error("Slug is required");
    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim() || null,
      author_name: author.trim() || null,
      content_md: content,
      published,
      published_at:
        published && !initial?.published_at
          ? new Date().toISOString()
          : initial?.published_at ?? null,
    };

    const { error } = initial
      ? await supabase.from("blog_posts").update(payload).eq("id", initial.id)
      : await supabase.from("blog_posts").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(initial ? "Post updated" : "Post created");
    onSaved();
  };

  return (
    <div>
      <button
        onClick={onCancel}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to posts
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <h2 className="font-display text-2xl font-semibold mb-6">
          {initial ? "Edit post" : "New post"}
        </h2>

        <div className="grid gap-5">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="A great article title"
            />
          </Field>

          <Field label="Slug" hint="URL: /blog/your-slug">
            <input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="your-slug"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Author (optional)">
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </Field>
            <Field label="Status">
              <label className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-background text-sm">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Published (visible on /blog)
              </label>
            </Field>
          </div>

          <Field label="Excerpt (optional)" hint="Shown on the blog index">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </Field>

          <Field
            label="Content (Markdown)"
            hint="Supports **bold**, _italic_, lists, # headings, [links](url), tables, code blocks."
          >
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setPreview(false)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  !preview ? "bg-foreground text-background border-foreground" : "border-border"
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setPreview(true)}
                className={`text-xs px-3 py-1 rounded-full border ${
                  preview ? "bg-foreground text-background border-foreground" : "border-border"
                }`}
              >
                Preview
              </button>
            </div>
            {preview ? (
              <div className="min-h-[300px] px-4 py-3 rounded-lg border border-border bg-background prose prose-neutral dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "_Nothing to preview yet._"}
                </ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring/40"
                placeholder={"# Your heading\n\nWrite your post in Markdown..."}
              />
            )}
          </Field>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onCancel}
              className="rounded-full border border-border px-5 py-2.5 text-sm hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
            >
              {saving ? "Saving…" : initial ? "Save changes" : "Create post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {label}
        </label>
        {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}
