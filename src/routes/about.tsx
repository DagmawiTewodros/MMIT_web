import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SiteShell } from "@/components/site/SiteShell";
import hero from "@/assets/mated/hero.jpg";
import consulting from "@/assets/mated/team.jpg";
import ceoImg from "@/assets/mated/ceo.jpg";
import deputyCeoImg from "@/assets/mated/deputy-ceo.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About MATED — Who We Are" },
      {
        name: "description",
        content:
          "MATED Management and Research Institute partners with public and private organizations across Ethiopia, providing strategic consulting, training and research.",
      },
      { property: "og:title", content: "About MATED Institute" },
      { property: "og:image", content: hero },
    ],
  }),
});

function AboutPage() {
  return (
    <SiteShell>
      <section className="pt-32 md:pt-44 pb-16 md:pb-24">
        <div className="container-editorial grid md:grid-cols-12 gap-10">
          <div className="md:col-span-2 text-xs uppercase tracking-[0.2em] text-accent font-medium pt-3">
            About
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="md:col-span-10 font-display text-5xl md:text-7xl leading-[1.02] text-balance"
          >
            A management institute built to deliver value — not just deliverables.
          </motion.h1>
        </div>
      </section>

      <section className="pb-24 md:pb-32">
        <div className="container-editorial max-w-3xl space-y-6 text-lg leading-relaxed text-foreground/85">
          <p>
            MATED Consulting & Training PLC was founded to bring rigor, clarity and local insight to
            the institutions shaping Ethiopia's economy. From our base in Addis Ababa we serve
            government, non-governmental and private clients across the country.
          </p>
          <p>
            Our work spans strategy, finance, auditing, taxation, information technology and other
            business-related disciplines. What unites it is a simple commitment: every
            recommendation we make is one we would be willing to implement ourselves.
          </p>
          <p>
            We measure success the way our clients do — by what changes after we leave the room.
          </p>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-secondary/40 border-y border-border">
        <div className="container-editorial grid md:grid-cols-2 gap-12">
          {[
            {
              h: "Mission",
              p: "To deliver strategic, evidence-based solutions that strengthen institutions and develop the people who lead them.",
            },
            {
              h: "Vision",
              p: "To be East Africa's most trusted partner for management consulting, training and applied research.",
            },
          ].map(({ h, p }) => (
            <div key={h} className="bg-card rounded-2xl p-10 border border-border">
              <div className="text-xs uppercase tracking-[0.2em] text-accent mb-4">{h}</div>
              <p className="font-display text-2xl md:text-3xl leading-snug text-balance">{p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-editorial">
          <div className="text-xs uppercase tracking-[0.2em] text-accent font-medium mb-4 text-center">
            Leadership
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-center mb-16 text-balance">
            The people leading MATED
          </h2>
          {/* Compact strip — original site style */}
          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-16 border-t border-border pt-10">
            {[
              { name: "Tewodros Endale", role: "CEO", img: ceoImg, anchor: "tewodros" },
              {
                name: "Wogayehu W/Yesus",
                role: "Deputy CEO",
                img: deputyCeoImg,
                anchor: "wogayehu",
              },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-5">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="h-16 w-16 rounded-full object-cover object-top border border-border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-semibold leading-tight">{p.name}</div>
                  <div className="text-sm text-muted-foreground">{p.role}</div>
                </div>
                <a
                  href={`#${p.anchor}`}
                  className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition whitespace-nowrap"
                >
                  Discover More
                </a>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {[
              {
                name: "Tewodros Endale",
                role: "Chief Executive Officer",
                bio: "Tewodros Endale (MSC, CIFI, FE, CPA and CFI) is the Founder and Chief Executive Officer of MATED Consulting and Training PLC, providing strategic leadership and overseeing client engagements. With over two decades of experience, he advises public and private sector organizations across Ethiopia in management consulting, finance, accounting, auditing, taxation, and organizational development. Renowned for delivering practical, results-driven solutions, he helps organizations strengthen performance, ensure compliance, and achieve sustainable growth.",
                img: ceoImg,
                anchor: "tewodros",
              },
              {
                name: "Wogayehu W/Yesus",
                role: "Deputy Chief Executive Officer",
                bio: "Wogayehu oversees consulting delivery and operations, with deep expertise in financial reporting, IPSAS adoption and capacity-building programs.",
                img: deputyCeoImg,
                anchor: "wogayehu",
              },
            ].map((p) => (
              <div
                key={p.name}
                id={p.anchor}
                className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col scroll-mt-32"
              >
                <div className="p-7">
                  <div className="text-xs uppercase tracking-[0.18em] text-accent mb-2">
                    {p.role}
                  </div>
                  <h3 className="font-display text-2xl font-semibold mb-3">{p.name}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{p.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-secondary/40 border-t border-border">
        <div className="container-editorial text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl leading-tight text-balance">
            Ready to explore how we can help?
          </h2>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-10 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:bg-primary/90 transition"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
