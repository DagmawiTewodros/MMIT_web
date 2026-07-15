import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostPage,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — MATED Institute Blog` },
      { property: "og:title", content: `${params.slug} — MATED Institute Blog` },
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
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

function BlogPostPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("blog_posts")
      .select(
        "id, slug, title, excerpt, content_md, author_name, image_url, published_at, created_at",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        if (!data) setNotFound(true);
        else setPost(data as Post);
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  return (
    <SiteShell>
      <article className="pt-32 pb-20">
        <div className="container-editorial max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> All posts
          </Link>

          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : notFound || !post ? (
            <div>
              <h1 className="font-display text-3xl font-semibold mb-2">
                Post not found
              </h1>
              <p className="text-muted-foreground">
                This article may have been unpublished or moved.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(post.published_at ?? post.created_at)}
                {post.author_name ? <span>· {post.author_name}</span> : null}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
                {post.title}
              </h1>
              {post.excerpt ? (
                <p className="mt-4 text-lg text-muted-foreground">
                  {post.excerpt}
                </p>
              ) : null}

              <div className="prose prose-neutral dark:prose-invert max-w-none mt-10 prose-headings:font-display prose-a:text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content_md}
                </ReactMarkdown>
              </div>
            </>
          )}
        </div>
      </article>
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
