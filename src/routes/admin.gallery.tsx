import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Images,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Upload,
  X,
} from "lucide-react";
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

type AlbumImage = { id: string; storage_path: string; image_url: string; sort_order: number };
type GalleryAlbum = {
  id: string;
  storage_path: string;
  image_url: string;
  title: string | null;
  description: string | null;
  category: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  images: AlbumImage[];
};
type EditState = {
  id?: string;
  title: string;
  description: string;
  category: string;
  sort_order: number;
  published: boolean;
  images: AlbumImage[];
  files: File[];
  previews: string[];
};

const emptyEdit: EditState = {
  title: "",
  description: "",
  category: "Gallery",
  sort_order: 0,
  published: false,
  images: [],
  files: [],
  previews: [],
};

function AdminGalleryPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const refresh = async () => {
    const { data: albumData, error: albumError } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (albumError) return toast.error(albumError.message);
    const ids = (albumData ?? []).map((album) => album.id);
    const { data: imageData, error: imageError } = ids.length
      ? await supabase
          .from("gallery_album_images")
          .select("*")
          .in("gallery_id", ids)
          .order("sort_order")
          .order("created_at")
      : { data: [], error: null };
    if (imageError) return toast.error(imageError.message);
    setAlbums(
      (albumData ?? []).map((album) => ({
        ...album,
        images: (imageData ?? []).filter((image) => image.gallery_id === album.id),
      })) as GalleryAlbum[],
    );
  };

  useEffect(() => {
    if (auth.status === "admin") refresh().finally(() => setLoading(false));
  }, [auth.status]);

  const uploadFiles = async (files: File[]) => {
    const uploaded: Omit<AlbumImage, "id">[] = [];
    for (const file of files) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const storage_path = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery-images")
        .upload(storage_path, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      const { data: signed, error: signError } = await supabase.storage
        .from("gallery-images")
        .createSignedUrl(storage_path, IMAGE_SIGN_EXPIRY);
      if (signError || !signed) throw signError ?? new Error("Could not prepare image");
      uploaded.push({ storage_path, image_url: signed.signedUrl, sort_order: 0 });
    }
    return uploaded;
  };

  const pickFiles = (fileList: FileList | null) => {
    if (!edit || !fileList) return;
    const files = Array.from(fileList);
    if (files.some((file) => !ALLOWED.includes(file.type)))
      return toast.error("Only JPG, PNG or WEBP images are allowed");
    if (files.some((file) => file.size > MAX_BYTES))
      return toast.error("Each image must be 5MB or smaller");
    setEdit({
      ...edit,
      files: [...edit.files, ...files],
      previews: [...edit.previews, ...files.map((file) => URL.createObjectURL(file))],
    });
  };

  const updateCover = async (albumId: string, images: AlbumImage[]) => {
    const cover = images[0];
    if (!cover) return;
    const { error } = await supabase
      .from("gallery_images")
      .update({ storage_path: cover.storage_path, image_url: cover.image_url })
      .eq("id", albumId);
    if (error) throw error;
  };

  const save = async () => {
    if (!edit) return;
    if (!edit.id && !edit.files.length)
      return toast.error("Add at least one image to create an album");
    setSaving(true);
    try {
      if (!edit.id) {
        const uploaded = await uploadFiles(edit.files);
        const cover = uploaded[0];
        const { data: album, error: albumError } = await supabase
          .from("gallery_images")
          .insert({
            storage_path: cover.storage_path,
            image_url: cover.image_url,
            title: edit.title || null,
            description: edit.description || null,
            category: edit.category || null,
            sort_order: edit.sort_order,
            published: edit.published,
          })
          .select("id")
          .single();
        if (albumError || !album) throw albumError ?? new Error("Could not create album");
        const { error: imageError } = await supabase
          .from("gallery_album_images")
          .insert(
            uploaded.map((image, index) => ({ ...image, gallery_id: album.id, sort_order: index })),
          );
        if (imageError) throw imageError;
        toast.success("Album added");
      } else {
        const { error } = await supabase
          .from("gallery_images")
          .update({
            title: edit.title || null,
            description: edit.description || null,
            category: edit.category || null,
            sort_order: edit.sort_order,
            published: edit.published,
          })
          .eq("id", edit.id);
        if (error) throw error;
        if (edit.files.length) {
          const uploaded = await uploadFiles(edit.files);
          const { error: imageError } = await supabase.from("gallery_album_images").insert(
            uploaded.map((image, index) => ({
              ...image,
              gallery_id: edit.id!,
              sort_order: edit.images.length + index,
            })),
          );
          if (imageError) throw imageError;
        }
        toast.success("Album updated");
      }
      setEdit(null);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const reorderImage = async (image: AlbumImage, direction: -1 | 1) => {
    if (!edit?.id) return;
    const index = edit.images.findIndex((candidate) => candidate.id === image.id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= edit.images.length) return;
    const images = [...edit.images];
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    const { error } = await supabase
      .from("gallery_album_images")
      .upsert(images.map((item, sort_order) => ({ ...item, gallery_id: edit.id!, sort_order })));
    if (error) return toast.error(error.message);
    try {
      await updateCover(edit.id, images);
      setEdit({ ...edit, images: images.map((item, sort_order) => ({ ...item, sort_order })) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not reorder images");
    }
  };

  const removeAlbumImage = async (image: AlbumImage) => {
    if (!edit?.id || edit.images.length <= 1)
      return toast.error("An album must keep at least one image");
    const { error } = await supabase.from("gallery_album_images").delete().eq("id", image.id);
    if (error) return toast.error(error.message);
    const images = edit.images.filter((candidate) => candidate.id !== image.id);
    try {
      await updateCover(edit.id, images);
      const { error: storageError } = await supabase.storage
        .from("gallery-images")
        .remove([image.storage_path]);
      if (storageError) throw storageError;
      setEdit({ ...edit, images });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image removed, but storage cleanup failed",
      );
    }
  };

  const removeAlbum = async (album: GalleryAlbum) => {
    if (!confirm(`Delete album "${album.title ?? "Untitled"}" and all of its images?`)) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", album.id);
    if (error) return toast.error(error.message);
    const paths = [
      ...new Set([...album.images.map((image) => image.storage_path), album.storage_path]),
    ];
    const { error: storageError } = await supabase.storage.from("gallery-images").remove(paths);
    if (storageError) toast.error(`Album deleted, but ${storageError.message}`);
    else toast.success("Album deleted");
    refresh();
  };

  const togglePublish = async (album: GalleryAlbum) => {
    const { error } = await supabase
      .from("gallery_images")
      .update({ published: !album.published })
      .eq("id", album.id);
    if (error) return toast.error(error.message);
    toast.success(!album.published ? "Published" : "Unpublished");
    refresh();
  };

  if (auth.status === "loading")
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  if (auth.status === "unauthenticated")
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">You must sign in to manage the gallery.</p>
        <Link
          to="/auth"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  if (auth.status === "not-admin")
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Your account does not have admin access.</p>
        <Link to="/" className="text-sm underline">
          Back to site
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background">
        <div className="container-editorial flex h-16 items-center justify-between gap-4">
          <Link to="/" className="font-display font-semibold tracking-tight">
            MATED <span className="font-normal text-muted-foreground">· Admin · Gallery</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/messages"
              className="rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"
            >
              Messages
            </Link>
            <Link
              to="/admin/blog"
              className="rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"
            >
              Blog
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="container-editorial py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold md:text-4xl">Gallery management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {albums.length} albums · {albums.filter((album) => album.published).length} published
              · {albums.filter((album) => !album.published).length} drafts
            </p>
          </div>
          <button
            onClick={() =>
              setEdit({
                ...emptyEdit,
                sort_order: (albums[albums.length - 1]?.sort_order ?? 0) + 1,
              })
            }
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Upload className="h-4 w-4" /> Add album
          </button>
        </div>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : albums.length === 0 ? (
          <p className="text-sm text-muted-foreground">No albums yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <div
                key={album.id}
                className="overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="relative aspect-[4/3] bg-muted">
                  <img
                    src={album.images[0]?.image_url ?? album.image_url}
                    alt={album.title ?? ""}
                    className="h-full w-full object-cover"
                  />
                  <span
                    className={`absolute left-2 top-2 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wider ${album.published ? "bg-green-600 text-white" : "bg-amber-500 text-white"}`}
                  >
                    {album.published ? "Published" : "Draft"}
                  </span>
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white">
                    <Images className="h-3 w-3" /> {album.images.length}
                  </span>
                </div>
                <div className="space-y-2 p-4">
                  <h3 className="truncate text-sm font-medium">{album.title || "Untitled"}</h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {album.category ?? "—"} · order {album.sort_order}
                  </p>
                  {album.description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {album.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 pt-1">
                    <button
                      onClick={() => togglePublish(album)}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs transition hover:bg-muted"
                    >
                      {album.published ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      {album.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() =>
                        setEdit({
                          id: album.id,
                          title: album.title ?? "",
                          description: album.description ?? "",
                          category: album.category ?? "",
                          sort_order: album.sort_order,
                          published: album.published,
                          images: album.images.length
                            ? album.images
                            : [
                                {
                                  id: `${album.id}-legacy`,
                                  storage_path: album.storage_path,
                                  image_url: album.image_url,
                                  sort_order: 0,
                                },
                              ],
                          files: [],
                          previews: [],
                        })
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs transition hover:bg-muted"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => removeAlbum(album)}
                      className="ml-auto inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2.5 py-1.5 text-xs text-destructive transition hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      {edit && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4"
          onClick={() => !saving && setEdit(null)}
        >
          <div
            className="my-8 w-full max-w-2xl rounded-xl bg-background shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-display text-xl font-semibold">
                {edit.id ? "Edit album" : "Add album"}
              </h2>
              <button
                onClick={() => !saving && setEdit(null)}
                className="rounded-md p-1.5 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
                  Album images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => pickFiles(event.target.files)}
                  className="block w-full text-sm"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Add one or more JPG, PNG, or WEBP images, up to 5MB each.
                </p>
              </div>
              {edit.images.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider">
                    Current images
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {edit.images.map((image, index) => (
                      <div
                        key={image.id}
                        className="overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={image.image_url}
                          alt={`Album image ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <div className="flex items-center justify-between p-2">
                          <span className="text-xs text-muted-foreground">
                            {index === 0 ? "Cover" : `Image ${index + 1}`}
                          </span>
                          <div className="flex">
                            <button
                              disabled={index === 0}
                              onClick={() => reorderImage(image, -1)}
                              className="rounded p-1 hover:bg-muted disabled:opacity-30"
                              aria-label="Move image earlier"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              disabled={index === edit.images.length - 1}
                              onClick={() => reorderImage(image, 1)}
                              className="rounded p-1 hover:bg-muted disabled:opacity-30"
                              aria-label="Move image later"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeAlbumImage(image)}
                              className="rounded p-1 text-destructive hover:bg-destructive/10"
                              aria-label="Remove image"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {edit.previews.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider">Images to add</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {edit.previews.map((preview, index) => (
                      <div
                        key={preview}
                        className="relative overflow-hidden rounded-lg border border-border"
                      >
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="aspect-[4/3] w-full object-cover"
                        />
                        <button
                          onClick={() =>
                            setEdit({
                              ...edit,
                              files: edit.files.filter((_, fileIndex) => fileIndex !== index),
                              previews: edit.previews.filter(
                                (_, previewIndex) => previewIndex !== index,
                              ),
                            })
                          }
                          className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                          aria-label="Remove pending image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
                  Caption / Title
                </label>
                <input
                  value={edit.title}
                  onChange={(event) => setEdit({ ...edit, title: event.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
                  Description (optional)
                </label>
                <textarea
                  value={edit.description}
                  onChange={(event) => setEdit({ ...edit, description: event.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    value={edit.category}
                    onChange={(event) => setEdit({ ...edit, category: event.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium uppercase tracking-wider">
                    Display order
                  </label>
                  <input
                    type="number"
                    value={edit.sort_order}
                    onChange={(event) =>
                      setEdit({ ...edit, sort_order: Number(event.target.value) || 0 })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={edit.published}
                  onChange={(event) => setEdit({ ...edit, published: event.target.checked })}
                />{" "}
                Published (visible on public gallery)
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
              <button
                onClick={() => setEdit(null)}
                disabled={saving}
                className="rounded-full border border-border px-4 py-2 text-xs font-medium transition hover:bg-muted disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
              >
                <Plus className="h-3.5 w-3.5" />
                {saving ? "Saving…" : edit.id ? "Save changes" : "Create album"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
