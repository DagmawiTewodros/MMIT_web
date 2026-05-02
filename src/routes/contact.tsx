import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { z } from "zod";
import { SiteShell } from "@/components/site/SiteShell";
import { localMessages } from "@/lib/local-messages";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact MATED Institute" },
      {
        name: "description",
        content:
          "Reach the MATED Institute team in Addis Ababa for consulting, training and research engagements.",
      },
    ],
  }),
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(5, "Please share a little more so we can help")
    .max(2000, "Please keep your message under 2000 characters"),
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: fd.get("name") ?? "",
      email: fd.get("email") ?? "",
      phone: fd.get("phone") ?? "",
      organization: fd.get("organization") ?? "",
      message: fd.get("message") ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        organization: parsed.data.organization || null,
        message: parsed.data.message,
      });
      if (error) throw error;
      setSubmitted(true);
      e.currentTarget.reset();
      toast.success("Message sent");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not send your message";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteShell>
      <section className="pt-32 md:pt-44 pb-16 md:pb-20">
        <div className="container-editorial">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-6">
            Contact
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-4xl"
          >
            Let's start a conversation.
          </motion.h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us a little about your organization and what you'd like to achieve.
            We'll be in touch within two business days.
          </p>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-8">
            {[
              { icon: Phone, label: "Phone", value: "+251-118-333536" },
              { icon: Mail, label: "Email", value: "info@matedinstitute.com" },
              { icon: MapPin, label: "Address", value: "P.O. Box 9885, Addis Ababa, Ethiopia" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-4">
                <div className="h-10 w-10 rounded-md bg-accent/15 text-accent grid place-items-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </div>
                  <div className="mt-1 text-base">{value}</div>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-border">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Office hours
              </div>
              <div className="text-sm text-foreground/80">
                Monday — Friday · 8:30 — 17:30 EAT
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-card border border-border rounded-2xl p-8 md:p-10 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Full name" name="name" required maxLength={120} />
                <Field label="Organization" name="organization" maxLength={160} />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field label="Email" name="email" type="email" required maxLength={255} />
                <Field label="Phone" name="phone" maxLength={40} />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2"
                >
                  How can we help?
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  maxLength={2000}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send message"}
              </button>
              {submitted && (
                <div className="text-sm text-accent-foreground bg-accent/20 border border-accent/30 rounded-md px-4 py-3">
                  Thanks — we've received your message and will respond shortly.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  );
}
