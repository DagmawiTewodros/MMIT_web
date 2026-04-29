import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import consulting from "@/assets/consulting.jpg";
import training from "@/assets/training.jpg";
import research from "@/assets/research.jpg";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Consulting, Training & Research | MATED" },
      {
        name: "description",
        content:
          "Three practices: management consultancy, professional training and applied research — designed to deliver measurable value to Ethiopian institutions.",
      },
      { property: "og:title", content: "Services | MATED Institute" },
      { property: "og:image", content: consulting },
    ],
  }),
});

const services = [
  {
    title: "Consultancy",
    img: consulting,
    lead:
      "Industry-focused advisory for public and private clients navigating complex strategic, financial and operational decisions.",
    items: [
      "Strategy & business planning",
      "Financial advisory & restructuring",
      "Audit & internal controls",
      "Taxation & regulatory compliance",
      "Information technology advisory",
    ],
  },
  {
    title: "Training & Capacity Development",
    img: training,
    lead:
      "Practical programs that build the leadership and technical capabilities institutions need to perform.",
    items: [
      "Executive & leadership development",
      "Finance, accounting and audit training",
      "Project management certifications",
      "Tailored programs for SMEs",
      "Government & NGO capacity building",
    ],
  },
  {
    title: "Applied Research",
    img: research,
    lead:
      "Evidence and analysis that translates directly into better policy and management decisions.",
    items: [
      "Sector & market studies",
      "Policy and impact research",
      "Organizational diagnostics",
      "Data analysis & reporting",
      "Knowledge products",
    ],
  },
];

function ServicesPage() {
  return (
    <SiteShell>
      <section className="pt-32 md:pt-44 pb-20 md:pb-28">
        <div className="container-editorial">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-6">
            Services
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-4xl"
          >
            Three practices designed to make institutions stronger.
          </motion.h1>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-editorial space-y-24 md:space-y-36">
          {services.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="grid md:grid-cols-12 gap-10 md:gap-16 items-center"
            >
              <div className={`md:col-span-6 ${i % 2 ? "md:order-2" : ""}`}>
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={1280}
                  height={896}
                  className="rounded-2xl aspect-[4/3] object-cover w-full"
                />
              </div>
              <div className="md:col-span-6">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                  0{i + 1} — Practice
                </div>
                <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
                  {s.title}
                </h2>
                <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                  {s.lead}
                </p>
                <ul className="mt-8 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm">
                      <span className="mt-2 h-1 w-1 rounded-full bg-accent shrink-0" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-secondary/40 border-t border-border">
        <div className="container-editorial text-center">
          <h2 className="font-display text-4xl md:text-5xl leading-tight max-w-2xl mx-auto text-balance">
            Tell us about the outcome you need.
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-10 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition"
          >
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
