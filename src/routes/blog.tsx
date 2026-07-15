import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { CalendarDays, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog — MATED Institute" },
      {
        name: "description",
        content:
          "Insights, articles and updates from MATED Institute on consulting, training, IPSAS, IFRS and more.",
      },
      { property: "og:title", content: "Blog — MATED Institute" },
      {
        property: "og:description",
        content:
          "Insights, articles and updates from MATED Institute on consulting, training, IPSAS, IFRS and more.",
      },
    ],
  }),
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  author_name: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("blog_posts")
      .select("id, slug, title, excerpt, author_name, image_url, published_at, created_at")
      .eq("published", true)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (mounted) {
          setPosts((data as Post[] | null) ?? []);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SiteShell>
      <section className="pt-32 pb-12 border-b border-border">
        <div className="container-editorial">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Journal
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Insights & updates
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Perspectives from our consulting and training practice.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-editorial">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : posts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No posts yet. Check back soon.
            </div>
          ) : (
            <ul className="grid md:grid-cols-2 gap-8">
              {posts.map((p) => (
                <li
                  key={p.id}
                  className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-foreground/30 transition"
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="block"
                  >
                    {p.image_url ? (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    ) : null}
                    <div className="p-8">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(p.published_at ?? p.created_at)}
                      {p.author_name ? <span>· {p.author_name}</span> : null}
                    </div>
                    <h2 className="font-display text-2xl font-semibold tracking-tight group-hover:text-primary transition">
                      {p.title}
                    </h2>
                    {p.excerpt ? (
                      <p className="mt-3 text-foreground/70 line-clamp-3">
                        {p.excerpt}
                      </p>
                    ) : null}
                    <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                      Read article{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                    </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </SiteShell>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
