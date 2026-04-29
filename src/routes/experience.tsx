import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import imgLeft from "@/assets/mated/training-2.jpg";
import imgRight from "@/assets/mated/training-1.jpg";
import founder from "@/assets/mated/team.jpg";
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
          "25+ years of experience. MATED Management and Research Institute — vision, mission, core values, team and partners.",
      },
      { property: "og:title", content: "Our Experience | MATED Institute" },
      { property: "og:image", content: imgRight },
    ],
  }),
});

const partners = [
  { src: partnerPulp, name: "Ethiopian Paper & Pulp" },
  { src: partnerTirett, name: "Tirett" },
  { src: partnerFamily, name: "Ethiopian Family" },
  { src: partnerAirports, name: "Ethiopian Airports" },
  { src: partnerElili, name: "Elili Hotel" },
  { src: partnerChamber, name: "Addis Ababa Chambers" },
];

const coreValues = [
  {
    title: "Integrity",
    body:
      "MATED Management and Research Institute (MMRI) strives to ensure honesty and sincerity in all its undertakings. To that effect, the institute has put in place an effective management system tasked with making sure this is adhered to by the management.",
  },
  {
    title: "Accountability",
    body:
      "We are accountable principally to our client organization, stakeholders, partners, and the government.",
  },
  {
    title: "Transparency",
    body:
      "The institute values, among other things, transparency in all its dealings with client organizations it serves and partners it works with.",
  },
  {
    title: "Partnership",
    body:
      "MATED Management and Research Institute (MMRI) promotes the principle of participation and collaboration with client organizations, and other stakeholders at various levels.",
  },
  {
    title: "Ethical Professional Services",
    body:
      "We are committed to providing quality services in all program areas and sticking to strict ethical, professional and moral conduct at all times.",
  },
];

const counters = [
  { value: "120+", label: "Consulting Solutions" },
  { value: "300+", label: "Complete Cases" },
  { value: "500+", label: "Happy Customers" },
  { value: "50+", label: "Expert Consultants" },
];

function ExperiencePage() {
  return (
    <SiteShell>
      {/* PAGE TITLE BANNER (original layout: heading + breadcrumb) */}
      <section className="pt-32 md:pt-40 pb-12 border-b border-border bg-secondary/40">
        <div className="container-editorial">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl font-semibold"
          >
            Our Experience
          </motion.h1>
          <nav className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground/80">Our Experience</span>
          </nav>
        </div>
      </section>

      {/* INTRO: image + stat | image + paragraph (mirrors original 2x2 layout) */}
      <section className="py-20 md:py-28">
        <div className="container-editorial grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div className="relative">
            <img
              src={imgLeft}
              alt="MATED at work"
              loading="lazy"
              width={960}
              height={1280}
              className="rounded-2xl aspect-[3/4] object-cover w-full"
            />
            <div className="absolute -right-4 -bottom-6 md:-right-6 md:-bottom-8 bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="font-display text-4xl font-semibold text-primary">25+</div>
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                Experiences
              </div>
            </div>
          </div>

          <div>
            <img
              src={imgRight}
              alt="MATED training session"
              loading="lazy"
              width={1280}
              height={960}
              className="rounded-2xl aspect-[4/3] object-cover w-full"
            />
            <p className="mt-6 text-base md:text-lg text-foreground/85 leading-relaxed">
              Consultation and development of strategic plans; customer satisfaction
              surveys; consultation and financial statements preparation and closing;
              consultation and preparation of monthly VAT, TOT, & Withholding tax
              reports.
            </p>
            <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              As the business expands, the company may develop strategic alliances
              with other companies.
            </p>
            <div className="mt-6 inline-block">
              <span className="font-display text-2xl text-primary font-semibold">
                Delivering Value!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTE INTRO */}
      <section className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container-editorial">
          <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-balance max-w-4xl">
            MATED Management and Research Institute{" "}
            <span className="text-primary">(MMRI)</span>
          </h2>
          <div className="mt-8 grid md:grid-cols-2 gap-8 max-w-5xl text-base md:text-lg text-foreground/85 leading-relaxed">
            <p>
              <strong className="text-foreground">
                MATED Management and Research Institute (MMRI)
              </strong>{" "}
              has begun operations on February 2013. It is a service-rendering
              business located in Addis Ababa, Ethiopia, specializing in training,
              consulting and development; business advisory and consultancy services
              for small and medium sized businesses and government organizations as
              well.
            </p>
            <p>
              <strong className="text-foreground">MMRI</strong> primarily provides
              business advisory, consultancy, training and development services. The
              services include: IFRS Training and Implementation, financial policy
              and procedural manuals, organization structure, staffing plans, job
              descriptions, evaluations, salary scales, fringe benefits and
              incentive schemes, procurement manuals, property administration,
              human-resource policy and records management.
            </p>
          </div>
        </div>
      </section>

      {/* TEAM: 50+ Team Members + Founder card */}
      <section className="py-20 md:py-28">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-5">
            <div className="font-display text-6xl md:text-7xl font-semibold text-primary leading-none">
              50+
            </div>
            <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground mt-3">
              Team Members
            </div>
            <p className="mt-6 text-lg text-foreground/85 leading-relaxed max-w-md">
              A dedicated team of professionals specializing in different areas is
              the key to our success.
            </p>
          </div>

          <div className="md:col-span-7">
            <div className="bg-card border border-border rounded-2xl overflow-hidden grid sm:grid-cols-5">
              <div className="sm:col-span-2 aspect-square sm:aspect-auto">
                <img
                  src={founder}
                  alt="Tewodros Endale, Founder & CEO"
                  loading="lazy"
                  width={300}
                  height={250}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="sm:col-span-3 p-7 flex flex-col justify-center">
                <div className="text-xs uppercase tracking-[0.18em] text-primary mb-2">
                  Founder
                </div>
                <div className="font-display text-2xl font-semibold">
                  Tewodros Endale
                </div>
                <div className="text-sm text-muted-foreground mt-1">Founder, CEO</div>
                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">
                  Each of our consultants brings a long career of experience —
                  honesty, commitment, dedication and integrity combined with the
                  highest professional standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MMRI heading rule */}
      <div className="container-editorial">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground border-t border-border pt-6">
          MMRI
        </div>
      </div>

      {/* VISION */}
      <section className="py-20 md:py-24">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <h2 className="md:col-span-3 font-display text-4xl md:text-5xl font-semibold text-primary">
            Vision
          </h2>
          <div className="md:col-span-9 space-y-8">
            <div>
              <div className="font-display text-xl font-semibold mb-3">
                Delivering Professional Excellence
              </div>
              <ul className="space-y-3 text-foreground/85 leading-relaxed">
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  To be a preferred advisor or consultant to all small and medium
                  sized businesses across Ethiopia by January 1, 2030.
                </li>
                <li className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  To be the standard of excellence in the business community —
                  achieving status as one of the leading consultancies and training
                  institutes in Ethiopia and East Africa by January 1, 2030.
                </li>
              </ul>
            </div>
            <div>
              <div className="font-display text-xl font-semibold mb-3">
                Ethical & High-Quality Performers
              </div>
              <p className="text-foreground/85 leading-relaxed">
                To commit our ethics, integrity and quality in profession, and to
                back advice with performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="py-20 md:py-24 bg-secondary/40 border-y border-border">
        <div className="container-editorial grid md:grid-cols-12 gap-12">
          <h2 className="md:col-span-3 font-display text-4xl md:text-5xl font-semibold text-primary">
            Mission
          </h2>
          <div className="md:col-span-9">
            <p className="text-lg text-foreground/85 leading-relaxed">
              It is realized through being highly respected by the business
              community and potential clients, and by being:
            </p>
            <ul className="mt-6 space-y-4">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  The first choice of the country's most popular talent — drawn by
                  the company's reputation, culture and diversity.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span>
                  The first choice of the most sought-after clients — attracted by
                  the breadth and depth of our service in each market segment.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 md:py-28">
        <div className="container-editorial">
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary mb-12">
            Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="bg-card border border-border rounded-xl p-7 hover:border-primary/40 hover:shadow-sm transition"
              >
                <div className="font-display text-lg font-semibold mb-3">
                  {v.title}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEET OUR PARTNERS */}
      <section className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container-editorial">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-3">
              Meet Our Partners
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Organizations who trust MATED
            </h2>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5">
            {partners.map((p) => (
              <div
                key={p.name}
                className="aspect-square rounded-xl bg-card border border-border grid place-items-center p-5 hover:border-primary/40 hover:shadow-sm transition group"
              >
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  className="max-h-16 w-auto object-contain opacity-80 group-hover:opacity-100 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT SERVICE STANDARDS */}
      <section className="py-20 md:py-28">
        <div className="container-editorial grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl md:text-5xl font-semibold leading-tight text-balance">
              Client Service Standards
            </h2>
            <p className="mt-6 text-lg text-foreground/85 leading-relaxed max-w-2xl">
              We have a rigorous set of client service standards. These standards
              are followed throughout the firm to ensure quality service to all our
              clients.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-8 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition"
            >
              Read More
            </Link>
          </div>
          <div className="md:col-span-5 grid grid-cols-2 gap-4 text-center">
            {counters.map((c) => (
              <div
                key={c.label}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="font-display text-3xl md:text-4xl font-semibold text-primary">
                  {c.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mt-2">
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
