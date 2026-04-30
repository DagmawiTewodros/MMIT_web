import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart2,
  Monitor,
  TrendingUp,
  PieChart,
  ThumbsUp,
  Smartphone,
} from "lucide-react";
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

// Original palette from Experiences.css
const ORANGE = "#ff6b35";
const DARK_RED = "#b71c1c";

const experiences = [
  {
    Icon: BarChart2,
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
    Icon: TrendingUp,
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
    Icon: Smartphone,
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
        className="pt-32 md:pt-40 pb-20 md:pb-28"
        style={{ background: "#f9f9f9" }}
      >
        <div className="container-editorial">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-14">
            <h6
              className="text-xs uppercase tracking-[0.25em] font-medium mb-3"
              style={{ color: ORANGE }}
            >
              Experiences
            </h6>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6">
              Our <span style={{ color: ORANGE }}>Experiences</span>
            </h2>
            <a
              href="#all"
              className="inline-flex items-center rounded-full px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: DARK_RED }}
            >
              View All Portfolios
            </a>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-[30px]">
            {experiences.map(({ Icon, title, desc, link }) => (
              <div
                key={title}
                className="group bg-white rounded-lg p-[30px] text-center transition-all duration-300 hover:-translate-y-[10px]"
                style={{
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(255,107,53,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 5px 15px rgba(0,0,0,0.05)";
                }}
              >
                <Icon
                  className="mx-auto mb-5"
                  style={{ color: ORANGE, width: "2.5rem", height: "2.5rem" }}
                  strokeWidth={1.75}
                />
                <h3
                  className="font-display text-[1.2rem] font-semibold mb-[15px]"
                  style={{ color: DARK_RED }}
                >
                  {title}
                </h3>
                <p
                  className="mb-5 leading-[1.6]"
                  style={{ color: "#666" }}
                >
                  {desc}
                </p>
                <a
                  href={link}
                  className="font-medium transition-colors"
                  style={{ color: ORANGE }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = DARK_RED)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = ORANGE)
                  }
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
