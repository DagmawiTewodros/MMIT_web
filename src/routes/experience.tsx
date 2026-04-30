import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Monitor, LineChart, PieChart, ThumbsUp, MonitorSmartphone } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/experience")({
  component: ExperiencePage,
  head: () => ({
    meta: [
      { title: "Our Experiences — MATED Institute" },
      {
        name: "description",
        content:
          "Our experiences: IFRS for SMEs, Training, IPSAS, Consultancy, Asset Valuation and more.",
      },
      { property: "og:title", content: "Our Experiences | MATED Institute" },
      {
        property: "og:description",
        content:
          "Our experiences: IFRS for SMEs, Training, IPSAS, Consultancy, Asset Valuation and more.",
      },
    ],
  }),
});

const experiences = [
  {
    Icon: BarChart3,
    title: "IFRS for SMEs consultancy Services",
    desc: "Specialized International Financial Reporting Standards implementation for small and medium enterprises. Our experts guide you through seamless transition to IFRS compliance, ensuring accurate financial reporting and enhanced stakeholder confidence.",
    link: "/ifrs-for-smes-consultancy-services/",
  },
  {
    Icon: Monitor,
    title: "Training- IFRS, IPSAS, Asset Valuation & Others",
    desc: "Comprehensive professional training programs designed to build expertise in financial reporting standards. Our hands-on workshops and certification courses empower finance professionals with practical skills and industry knowledge.",
    link: "/training-ifrs-ipsas-asset-valuation-others/",
  },
  {
    Icon: LineChart,
    title: "IPSAS Consultancy Services",
    desc: "Expert International Public Sector Accounting Standards implementation for government entities and public sector organizations. We ensure compliance, improve transparency, and enhance public financial management through our specialized consultancy services.",
    link: "/ipsas-consultancy-services/",
  },
  {
    Icon: PieChart,
    title: "Consultancy Services Offered",
    desc: "Strategic business advisory services covering financial management, operational efficiency, and organizational development. Our tailored solutions address unique challenges and drive sustainable growth for your organization.",
    link: "/consultancy-services-offered/",
  },
  {
    Icon: ThumbsUp,
    title: "Asset Valuation & Revaluation Consultancy Services",
    desc: "Professional asset valuation services providing accurate assessment of tangible and intangible assets. Our certified experts deliver reliable valuations for financial reporting, mergers & acquisitions, and strategic decision-making.",
    link: "/asset-valuation-revaluation-consultancy-services/",
  },
  {
    Icon: MonitorSmartphone,
    title: "More",
    desc: "Discover our full range of specialized consulting and training services. From risk management to internal audit, we offer comprehensive solutions to meet all your professional development and organizational needs.",
    link: "#",
  },
];

function ExperiencePage() {
  return (
    <SiteShell>
      <section
        id="experience"
        className="pt-32 md:pt-40 pb-20 md:pb-28 bg-secondary/40"
      >
        <div className="container-editorial">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <h6 className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-3">
              Experiences
            </h6>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Our <span className="text-primary">Experiences</span>
            </h2>
            <a
              href="#all"
              className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-medium hover:bg-primary/90 transition"
            >
              View All Portfolios
            </a>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
            {experiences.map(({ Icon, title, desc, link }) => (
              <div
                key={title}
                className="bg-card rounded-lg p-8 text-center shadow-sm hover:-translate-y-2 hover:shadow-lg transition-all duration-300 border border-border/50"
              >
                <Icon
                  className="mx-auto mb-5 h-10 w-10 text-accent"
                  strokeWidth={1.75}
                />
                <h3 className="font-display text-lg font-semibold mb-3 text-primary">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {desc}
                </p>
                <a
                  href={link}
                  className="text-sm font-medium text-accent hover:text-primary transition-colors"
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
