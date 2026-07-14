import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { SiteShell } from "@/components/site/SiteShell";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Admin Sign In — MATED Institute" },
      { name: "description", content: "Sign in to the MATED admin dashboard." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(128),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const mode = "signin" as const; // public sign-up disabled — admins are provisioned manually

  // If already signed in, redirect to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/admin/messages" });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) throw error;
      toast.success("Welcome back");
      navigate({ to: "/admin/messages" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <section className="pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="container-editorial max-w-md mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4 text-center">
            Admin Area
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-center mb-2">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-10">
            {mode === "signin"
              ? "Access the contact-form dashboard."
              : "Set up your admin account."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-8 space-y-5"
          >
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Admin accounts are provisioned manually. Contact the site owner for access.
            </p>
          </form>

          <div className="text-center mt-8 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← Back to site
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
