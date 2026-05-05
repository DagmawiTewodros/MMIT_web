import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Compass, GraduationCap, LineChart } from "lucide-react";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import heroA from "@/assets/mated/training-2.jpg";
import heroB from "@/assets/mated/training-1.jpg";
import heroC from "@/assets/mated/consulting-1.jpg";
import heroD from "@/assets/mated/hero-classroom.jpg";
import heroE from "@/assets/mated/consulting-3.jpg";
import heroF from "@/assets/mated/team.jpg";
import consulting from "@/assets/mated/consulting-1.jpg";
import training from "@/assets/mated/training-1.jpg";
import research from "@/assets/mated/consulting-3.jpg";
import approachA from "@/assets/mated/consulting-2.jpg";
import approachB from "@/assets/mated/team.jpg";
import partnerChamber from "@/assets/mated/partner-chamber.jpg";
import partnerAirports from "@/assets/mated/partner-airports.jpg";
import partnerElili from "@/assets/mated/partner-elili.jpg";
import partnerFamily from "@/assets/mated/partner-family.jpg";
import partnerTirett from "@/assets/mated/partner-tirett.jpg";
import partnerPulp from "@/assets/mated/partner-pulp.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "MATED Institute — Strategic Consulting & Training, Addis Ababa" },
      {
        name: "description",
        content:
          "We partner with public and private organizations to deliver strategy, finance, audit, taxation, IT and capacity-development services across Ethiopia.",
      },
    ],
  }),
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const heroSlides = [
  { src: heroA, alt: "MATED training session" },
  { src: heroB, alt: "MATED capacity development" },
  { src: heroC, alt: "MATED consulting engagement" },
  { src: heroD, alt: "MATED advisory work" },
  { src: heroE, alt: "MATED strategy session" },
  { src: heroF, alt: "MATED team" },
];

function Index() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-32 overflow-hidden">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-end">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="md:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              <span className="h-px w-8 bg-accent" />
              Consulting · Training · Research
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance">
              Strategy that<br />
              <em className="not-italic text-accent">moves</em> institutions<br />
              forward.
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              MATED is an Addis Ababa–based management institute delivering rigorous
              consulting, research and capacity development for the organizations
              shaping Ethiopia's economy.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition"
              >
                Explore our services <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-medium hover:bg-muted transition"
              >
                Who we are
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 relative"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
              <AnimatePresence mode="sync">
                <motion.img
                  key={slide}
                  src={heroSlides[slide].src}
                  alt={heroSlides[slide].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    aria-label={`Show slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -left-8 -bottom-8 hidden md:block bg-card border border-border rounded-xl p-5 shadow-sm w-56">
              <div className="font-display text-3xl">15+</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Years advising leaders
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE / CREDIBILITY STRIP */}
      <section className="border-y border-border bg-secondary/40">
        <div className="container-editorial py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["500+", "Professionals trained"],
            ["120+", "Engagements delivered"],
            ["40+", "Public & private partners"],
            ["15+", "Years of practice"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="font-display text-4xl md:text-5xl text-primary">{n}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2">
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="grid md:grid-cols-12 gap-8 mb-16">
            <div className="md:col-span-4">
              <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium">
                What we do
              </div>
            </div>
            <h2 className="md:col-span-8 font-display text-4xl md:text-6xl leading-tight text-balance">
              Three practices, one principle: deliver value worth measuring.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Compass,
                title: "Consultancy",
                img: consulting,
                desc: "Strategy, finance, auditing, taxation and IT advisory for organizations navigating complex change.",
                to: "/services" as const,
              },
              {
                icon: GraduationCap,
                title: "Training",
                img: training,
                desc: "Tailored capacity-development programs for individuals, SMEs, government and non-governmental institutions.",
                to: "/services" as const,
              },
              {
                icon: LineChart,
                title: "Research",
                img: research,
                desc: "Applied management research and policy studies that translate evidence into practical decisions.",
                to: "/services" as const,
              },
            ].map(({ icon: Icon, title, img, desc, to }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    width={1280}
                    height={896}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-7">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-md bg-accent/15 text-accent grid place-items-center">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-2xl">{title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-1 mt-5 text-sm font-medium text-primary hover:text-accent transition"
                  >
                    Learn more <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-24 md:py-32 bg-secondary/40 border-y border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6">
            <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-6">
              Our approach
            </div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
              We work alongside leaders — not above them.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Every engagement begins with listening. We combine deep functional
              expertise with on-the-ground knowledge of Ethiopian institutions to
              produce recommendations that get implemented, not shelved.
            </p>

            <ul className="mt-10 space-y-5">
              {[
                ["Evidence-led", "Decisions grounded in rigorous analysis and research."],
                ["Locally rooted", "Deep familiarity with the Ethiopian regulatory and business landscape."],
                ["Built to last", "We transfer knowledge so capability stays with your team."],
              ].map(([h, d]) => (
                <li key={h} className="flex gap-4">
                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                  <div>
                    <div className="font-medium">{h}</div>
                    <div className="text-sm text-muted-foreground">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <img src={approachA} alt="" loading="lazy" width={1280} height={960}
              className="rounded-2xl aspect-[3/4] object-cover w-full" />
            <img src={approachB} alt="" loading="lazy" width={300} height={250}
              className="rounded-2xl aspect-[3/4] object-cover w-full mt-12" />
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-20 md:py-24 border-b border-border">
        <div className="container-editorial">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground text-center mb-10">
            Trusted by leading Ethiopian institutions
          </div>
          <div
            className="group relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="flex w-max animate-marquee gap-12 md:gap-20 items-center group-hover:[animation-play-state:paused]">
              {[
                [partnerChamber, "Addis Ababa Chamber of Commerce"],
                [partnerAirports, "Ethiopian Airports Enterprise"],
                [partnerElili, "Elili Hotel"],
                [partnerFamily, "Ethiopian Family"],
                [partnerTirett, "Tirett"],
                [partnerPulp, "Ethiopian Paper and Pulp"],
              ]
                .concat([
                  [partnerChamber, "Addis Ababa Chamber of Commerce"],
                  [partnerAirports, "Ethiopian Airports Enterprise"],
                  [partnerElili, "Elili Hotel"],
                  [partnerFamily, "Ethiopian Family"],
                  [partnerTirett, "Tirett"],
                  [partnerPulp, "Ethiopian Paper and Pulp"],
                ])
                .map(([src, alt], i) => (
                  <div
                    key={`${alt}-${i}`}
                    className="flex items-center justify-center shrink-0"
                  >
                    <img
                      src={src}
                      alt={alt}
                      loading="lazy"
                      className="max-h-16 w-auto object-contain hover:scale-110 transition"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="rounded-3xl bg-primary text-primary-foreground p-10 md:p-20 grid md:grid-cols-12 gap-10 items-end">
            <h2 className="md:col-span-8 font-display text-4xl md:text-6xl leading-tight text-balance">
              Have a challenge worth solving? Let's talk.
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
