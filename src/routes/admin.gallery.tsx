import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Upload, Pencil, Trash2, Eye, EyeOff, LogOut, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage,
  head: () => ({
    meta: [
      { title: "Admin · Gallery — MATED Institute" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const IMAGE_SIGN_EXPIRY = 60 * 60 * 24 * 365 * 10;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

type GalleryImage = {
  id: string;
  storage_path: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

type EditState = {
  id?: string;
  title: string;
  description: string;
  category: string;
  sort_order: number;
  published: boolean;
  image_url?: string;
  storage_path?: string;
  file?: File | null;
  previewUrl?: string | null;
};

const emptyEdit: EditState = {
  title: "",
  description: "",
  category: "Gallery",
  sort_order: 0,
  published: false,
  file: null,
  previewUrl: null,
};

function AdminGalleryPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setItems((data as GalleryImage[] | null) ?? []);
  };

  useEffect(() => {
    if (auth.status === "admin") refresh().finally(() => setLoading(false));
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
        <p className="text-muted-foreground">You must sign in to manage the gallery.</p>
        <Link to="/auth" className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium">
          Sign in
        </Link>
      </div>
    );
  }
  if (auth.status === "not-admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Your account does not have admin access.</p>
        <Link to="/" className="text-sm underline">Back to site</Link>
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const onPickFile = (f: File | null) => {
    if (!edit) return;
    if (!f) {
      setEdit({ ...edit, file: null, previewUrl: edit.image_url ?? null });
      return;
    }
    if (!ALLOWED.includes(f.type)) return toast.error("Only JPG, PNG or WEBP");
    if (f.size > MAX_BYTES) return toast.error("Image must be ≤ 5MB");
    const url = URL.createObjectURL(f);
    setEdit({ ...edit, file: f, previewUrl: url });
  };

  const save = async () => {
    if (!edit) return;
    setSaving(true);
    try {
      let image_url = edit.image_url ?? "";
      let storage_path = edit.storage_path ?? "";

      if (edit.file) {
        const ext = edit.file.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("gallery-images")
          .upload(path, edit.file, { contentType: edit.file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: signed, error: signErr } = await supabase.storage
          .from("gallery-images")
          .createSignedUrl(path, IMAGE_SIGN_EXPIRY);
        if (signErr || !signed) throw signErr ?? new Error("Sign failed");
        // remove old file if replacing
        if (edit.id && edit.storage_path) {
          await supabase.storage.from("gallery-images").remove([edit.storage_path]);
        }
        image_url = signed.signedUrl;
        storage_path = path;
      }

      if (!edit.id) {
        if (!storage_path) throw new Error("Please choose an image to upload");
        const { error } = await supabase.from("gallery_images").insert({
          storage_path,
          image_url,
          title: edit.title || null,
          description: edit.description || null,
          category: edit.category || null,
          sort_order: edit.sort_order,
          published: edit.published,
        });
        if (error) throw error;
        toast.success("Image added");
      } else {
        const { error } = await supabase
          .from("gallery_images")
          .update({
            title: edit.title || null,
            description: edit.description || null,
            category: edit.category || null,
            sort_order: edit.sort_order,
            published: edit.published,
            ...(edit.file ? { image_url, storage_path } : {}),
          })
          .eq("id", edit.id);
        if (error) throw error;
        toast.success("Image updated");
      }
      setEdit(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (it: GalleryImage) => {
    if (!confirm(`Delete "${it.title ?? "image"}"?`)) return;
    try {
      if (it.storage_path) {
        await supabase.storage.from("gallery-images").remove([it.storage_path]);
      }
      const { error } = await supabase.from("gallery_images").delete().eq("id", it.id);
      if (error) throw error;
      toast.success("Deleted");
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const togglePublish = async (it: GalleryImage) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ published: !it.published })
      .eq("id", it.id);
    if (error) return toast.error(error.message);
    toast.success(!it.published ? "Published" : "Unpublished");
    refresh();
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="bg-background border-b border-border sticky top-0 z-30">
        <div className="container-editorial h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-display font-semibold tracking-tight">
            MATED <span className="text-muted-foreground font-normal">· Admin · Gallery</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/admin/messages" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition">
              Messages
            </Link>
            <Link to="/admin/blog" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition">
              Blog
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-editorial py-10">
        <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold">Gallery management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {items.length} total · {items.filter((i) => i.published).length} published · {items.filter((i) => !i.published).length} drafts
            </p>
          </div>
          <button
            onClick={() => setEdit({ ...emptyEdit, sort_order: (items[items.length - 1]?.sort_order ?? 0) + 1 })}
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition"
          >
            <Upload className="h-4 w-4" /> Add image
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it.id} className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-muted relative">
                  <img src={it.image_url} alt={it.title ?? ""} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${it.published ? "bg-green-600 text-white" : "bg-amber-500 text-white"}`}>
                    {it.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm truncate">{it.title || "Untitled"}</h3>
                      <p className="text-xs text-muted-foreground truncate">{it.category ?? "—"} · order {it.sort_order}</p>
                    </div>
                  </div>
                  {it.description && <p className="text-xs text-muted-foreground line-clamp-2">{it.description}</p>}
                  <div className="flex items-center gap-1 pt-1">
                    <button onClick={() => togglePublish(it)} className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted transition" title={it.published ? "Unpublish" : "Publish"}>
                      {it.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {it.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() =>
                        setEdit({
                          id: it.id,
                          title: it.title ?? "",
                          description: it.description ?? "",
                          category: it.category ?? "",
                          sort_order: it.sort_order,
                          published: it.published,
                          image_url: it.image_url,
                          storage_path: it.storage_path,
                          previewUrl: it.image_url,
                          file: null,
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs hover:bg-muted transition"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button onClick={() => remove(it)} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-2.5 py-1.5 text-xs hover:bg-destructive/10 transition ml-auto">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {edit && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto" onClick={() => !saving && setEdit(null)}>
          <div className="bg-background rounded-xl w-full max-w-2xl my-8 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-xl font-semibold">{edit.id ? "Edit image" : "Add image"}</h2>
              <button onClick={() => !saving && setEdit(null)} className="p-1.5 rounded-md hover:bg-muted"><X className="h-4 w-4" /></button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2">Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WEBP · max 5MB</p>
              </div>

              {edit.previewUrl && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider mb-2">Preview (as it will appear)</p>
                  <div className="rounded-lg overflow-hidden border border-border bg-muted max-w-sm">
                    <div className="aspect-[4/3] relative">
                      <img src={edit.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                        <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#1C2841" }}>
                          {edit.category || "Gallery"}
                        </p>
                        <h3 className="font-display text-base font-semibold leading-tight">{edit.title || "Untitled"}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2">Caption / Title</label>
                <input value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider mb-2">Description (optional)</label>
                <textarea value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2">Category</label>
                  <input value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2">Display order</label>
                  <input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) || 0 })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={edit.published} onChange={(e) => setEdit({ ...edit, published: e.target.checked })} />
                Published (visible on public gallery)
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border">
              <button onClick={() => setEdit(null)} disabled={saving} className="rounded-full border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition disabled:opacity-60">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-xs font-medium hover:bg-primary/90 transition disabled:opacity-60">
                {saving ? "Saving…" : edit.id ? "Save changes" : "Add image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
