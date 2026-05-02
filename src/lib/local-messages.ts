// Local-storage backed message store (temporary, until backend is wired up)

export type LocalSubmission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

const KEY = "mated_contact_submissions_v1";
const EVENT = "mated:messages-changed";

function read(): LocalSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalSubmission[]) : [];
  } catch {
    return [];
  }
}

function write(items: LocalSubmission[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export const localMessages = {
  list(): LocalSubmission[] {
    return read().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  },
  add(input: Omit<LocalSubmission, "id" | "is_read" | "created_at">): LocalSubmission {
    const item: LocalSubmission = {
      ...input,
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    const items = read();
    items.unshift(item);
    write(items);
    return item;
  },
  update(id: string, patch: Partial<LocalSubmission>) {
    write(read().map((m) => (m.id === id ? { ...m, ...patch } : m)));
  },
  remove(id: string) {
    write(read().filter((m) => m.id !== id));
  },
  subscribe(cb: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const handler = () => cb();
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};
