import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  CheckCircle2,
  Smile,
  UserCheck,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import heroImg from "@/assets/mated/training-2.jpg";
import sideImg from "@/assets/mated/training-1.jpg";
import partnerChamber from "@/assets/mated/partner-chamber.jpg";
import partnerAirports from "@/assets/mated/partner-airports.jpg";
import partnerElili from "@/assets/mated/partner-elili.jpg";
import partnerFamily from "@/assets/mated/partner-family.jpg";
import partnerTirett from "@/assets/mated/partner-tirett.jpg";
import partnerPulp from "@/assets/mated/partner-pulp.png";

export const Route = createFileRoute("/experience")({
  component: ExperiencePage,
  head: () => ({
    meta: [
      { title: "Our Experience — MATED Institute" },
      {
        name: "description",
        content:
          "25+ years of experience advising Ethiopian institutions in consulting, training and research. Meet the partners and clients who trust MATED.",
      },
      { property: "og:title", content: "Our Experience | MATED Institute" },
      { property: "og:image", content: heroImg },
    ],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stats = [
  { icon: Briefcase, value: "120+", label: "Consulting solutions delivered" },
  { icon: CheckCircle2, value: "300+", label: "Complete cases" },
  { icon: Smile, value: "500+", label: "Happy clients" },
  { icon: UserCheck, value: "50+", label: "Expert consultants" },
];

const partners = [
  { src: partnerChamber, name: "Addis Ababa Chamber of Commerce" },
  { src: partnerAirports, name: "Ethiopian Airports Enterprise" },
  { src: partnerElili, name: "Elili Hotel" },
  { src: partnerFamily, name: "Ethiopian Family" },
  { src: partnerTirett, name: "Tirett" },
  { src: partnerPulp, name: "Ethiopian Paper & Pulp" },
];

const expertise = [
  {
    title: "Strategy & Business Planning",
    desc: "Consultation and development of strategic plans for SMEs, government and NGOs across Ethiopia.",
  },
  {
    title: "Financial Statements & Closing",
    desc: "Consultation and preparation of monthly VAT, TOT and Withholding tax reports and statutory closing.",
  },
  {
    title: "IFRS Training & Implementation",
    desc: "Hands-on IFRS, IPSAS and IFRS for SMEs implementation programs for finance teams.",
  },
  {
    title: "Policy & Procedure Manuals",
    desc: "Development of financial, procurement, HR, property administration and records-management manuals.",
  },
  {
    title: "Organization Design",
    desc: "Structures, staffing plans, job descriptions, evaluations, salary scales and incentive schemes.",
  },
  {
    title: "Customer Satisfaction Research",
    desc: "Customer satisfaction surveys and applied research that informs strategic decisions.",
  },
];

function ExperiencePage() {
  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-24 overflow-hidden">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-end">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="md:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              <span className="h-px w-8 bg-primary" />
              Our Experience
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.02] text-balance font-semibold">
              25+ years of <span className="text-primary">delivering value</span> to
              Ethiopian institutions.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Since 2013, MATED has partnered with small and medium businesses,
              government bodies and non-governmental organizations — pairing local
              insight with international standards to make change stick.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <img
                src={heroImg}
                alt="MATED training session"
                className="h-full w-full object-cover"
                width={960}
                height={1280}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent" />
            </div>
            <div className="absolute -left-6 -bottom-6 hidden md:block bg-card border border-border rounded-xl p-5 shadow-sm w-52">
              <div className="font-display text-3xl font-semibold">25+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Years of experience
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-editorial py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label}>
              <div className="mx-auto h-10 w-10 rounded-md bg-primary/10 text-primary grid place-items-center mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-display text-4xl md:text-5xl font-semibold text-primary">
                {value}
              </div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE SERVE */}
      <section className="py-24 md:py-32">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <img
              src={sideImg}
              alt="MATED consultants in workshop"
              loading="lazy"
              width={1280}
              height={960}
              className="rounded-2xl aspect-[4/3] object-cover w-full"
            />
          </div>
          <div className="md:col-span-6">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-6">
              Who we serve
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance font-semibold">
              Trusted advisors to a growing economy.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              MATED Management and Research Institute began operations in February
              2013 from Addis Ababa, providing business advisory, consultancy,
              training and development services. Our work spans:
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Small and medium-sized businesses",
                "Government ministries and agencies",
                "Non-governmental organizations",
                "Strategic alliances and partnerships",
              ].map((it) => (
                <li key={it} className="flex gap-3 items-start">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground/90">{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AREAS OF EXPERTISE */}
      <section className="py-24 md:py-32 bg-secondary/40 border-y border-border">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-14">
            <div className="md:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                Areas of expertise
              </div>
            </div>
            <h2 className="md:col-span-8 font-display text-4xl md:text-5xl leading-tight text-balance font-semibold">
              Where we've made a measurable difference.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {expertise.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-card rounded-xl border border-border p-7 hover:border-primary/40 hover:shadow-sm transition"
              >
                <div className="font-display text-lg font-semibold mb-2">
                  {e.title}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {e.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS / CLIENTS */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-4">
              Meet our partners
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance font-semibold max-w-2xl mx-auto">
              Organizations that have entrusted us with their growth.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {partners.map((p) => (
              <div
                key={p.name}
                className="aspect-square rounded-xl border border-border bg-card grid place-items-center p-6 hover:border-primary/40 hover:shadow-sm transition group"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-20 w-auto object-contain opacity-80 group-hover:opacity-100 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container-editorial">
          <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-20 grid md:grid-cols-12 gap-10 items-end">
            <h2 className="md:col-span-8 font-display text-4xl md:text-6xl leading-tight text-balance font-semibold">
              Ready to add your name to the list?
            </h2>
            <div className="md:col-span-4 md:text-right">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-7 py-4 text-sm font-medium hover:opacity-90 transition"
              >
                Start a conversation <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
