import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import {
  appliedResearchTopics,
  consultancyServiceGroups,
  trainingServiceGroups,
  type ServiceGroup,
} from "@/data/services";
import consulting from "@/assets/mated/consulting-1.jpg";
import training from "@/assets/mated/training-1.jpg";
import research from "@/assets/gallery/research2.jpg";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — Consulting, Training & Research | MATED" },
      {
        name: "description",
        content:
          "Explore MATED's professional training, business consultancy and applied research services for Ethiopian institutions.",
      },
      { property: "og:title", content: "Services | MATED Institute" },
      { property: "og:image", content: consulting },
    ],
  }),
});

function ServiceCatalog({ groups }: { groups: ServiceGroup[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {groups.map((group, index) => (
        <details key={group.title} className="group py-1" open={index === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left [&::-webkit-details-marker]:hidden">
            <div className="flex items-baseline gap-4">
              <span className="text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl font-semibold md:text-2xl">{group.title}</h3>
            </div>
            <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <ul className="grid gap-x-10 gap-y-3 pb-7 pl-10 sm:grid-cols-2">
            {group.topics.map((topic) => (
              <li key={topic} className="flex gap-3 text-sm leading-relaxed text-foreground/80">
                <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#F7941D]" />
                {topic}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

function ServicesPage() {
  return (
    <SiteShell>
      <section className="pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="container-editorial">
          <div className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Our Services
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl text-balance font-display text-5xl leading-[1.02] md:text-7xl"
          >
            Practical expertise for stronger institutions.
          </motion.h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Industry-focused training, advisory and research for individuals, businesses, government
            institutions and non-government organizations.
          </p>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label="Service areas">
            {[
              ["#training", "Training & Development"],
              ["#consultancy", "Consultancy"],
              ["#research", "Applied Research"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-[#F7941D]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="training" className="scroll-mt-24 border-t border-border py-20 md:py-28">
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <img
              src={training}
              alt="MATED professional training session"
              loading="lazy"
              width={1280}
              height={896}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="mt-7 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              01 — Practice
            </div>
            <h2 className="mt-3 text-balance font-display text-4xl leading-tight md:text-5xl">
              Training & Capacity Development
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Practical programs that strengthen leadership, technical capability and institutional
              performance.
            </p>
          </motion.div>
          <div className="lg:col-span-8">
            <ServiceCatalog groups={trainingServiceGroups} />
          </div>
        </div>
      </section>

      <section
        id="consultancy"
        className="scroll-mt-24 border-y border-border bg-secondary/35 py-20 md:py-28"
      >
        <div className="container-editorial grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-4"
          >
            <img
              src={consulting}
              alt="MATED consultancy engagement"
              loading="lazy"
              width={1280}
              height={896}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="mt-7 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              02 — Practice
            </div>
            <h2 className="mt-3 text-balance font-display text-4xl leading-tight md:text-5xl">
              Consultancy Services
            </h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Focused advisory and implementation support for strategic, financial, tax, human
              resource and operational priorities.
            </p>
          </motion.div>
          <div className="lg:col-span-8">
            <ServiceCatalog groups={consultancyServiceGroups} />
          </div>
        </div>
      </section>

      <section id="research" className="scroll-mt-24 py-20 md:py-28">
        <div className="container-editorial grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <img
              src={research}
              alt="MATED applied research"
              loading="lazy"
              width={1280}
              height={896}
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="lg:col-span-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              03 — Practice
            </div>
            <h2 className="mt-3 text-balance font-display text-4xl leading-tight md:text-5xl">
              Applied Research
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Evidence and analysis translated into clearer policy, investment and management
              decisions.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {appliedResearchTopics.map((topic) => (
                <li key={topic} className="flex gap-3 text-sm">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#F7941D]" />
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="services-consultation-cta border-t border-border py-24 md:py-32">
        <div className="container-editorial text-center">
          <h2 className="services-consultation-heading mx-auto max-w-2xl text-balance font-display text-4xl leading-tight md:text-5xl">
            Tell us about the outcome you need.
          </h2>
          <Link to="/contact" className="services-consultation-button">
            Request a consultation <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
