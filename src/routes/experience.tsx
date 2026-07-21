import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  BarChart2,
  Monitor,
  TrendingUp,
  PieChart,
  ThumbsUp,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import {
  ifrsClients,
  ipsasClients,
  assetValuationClients,
} from "@/data/experienceClients";
import type { ClientEntry } from "@/components/site/ExperienceDetailPage";

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

const ORANGE = "#1C2841";
const DARK_RED = "#b71c1c";

type Experience = {
  Icon: typeof BarChart2;
  title: string;
  desc: string;
  clients?: ClientEntry[];
  link?: string;
};

const experiences: Experience[] = [
  {
    Icon: BarChart2,
    title: "IFRS for SMEs consultancy Services",
    desc: "Specialized International Financial Reporting Standards implementation for small and medium enterprises. Our experts guide you through seamless transition to IFRS compliance, ensuring accurate financial reporting and enhanced stakeholder confidence.",
    clients: ifrsClients,
  },
  {
    Icon: Monitor,
    title: "Training- IFRS, IPSAS, Asset Valuation & Others",
    desc: "Comprehensive professional training programs designed to build expertise in financial reporting standards. Our hands-on workshops and certification courses empower finance professionals with practical skills and industry knowledge.",
    clients: ifrsClients,
  },
  {
    Icon: TrendingUp,
    title: "IPSAS Consultancy Services",
    desc: "Expert International Public Sector Accounting Standards implementation for government entities and public sector organizations. We ensure compliance, improve transparency, and enhance public financial management through our specialized consultancy services.",
    clients: ipsasClients,
  },
  {
    Icon: PieChart,
    title: "Consultancy Services Offered",
    desc: "Strategic business advisory services covering financial management, operational efficiency, and organizational development. Our tailored solutions address unique challenges and drive sustainable growth for your organization.",
    clients: ifrsClients,
  },
  {
    Icon: ThumbsUp,
    title: "Asset Valuation & Revaluation Consultancy Services",
    desc: "Professional asset valuation services providing accurate assessment of tangible and intangible assets. Our certified experts deliver reliable valuations for financial reporting, mergers & acquisitions, and strategic decision-making.",
    clients: assetValuationClients,
  },
  {
    Icon: Smartphone,
    title: "More",
    desc: "Discover our full range of specialized consulting and training services. From risk management to internal audit, we offer comprehensive solutions to meet all your professional development and organizational needs.",
    link: "/contact",
  },
];

function ExperiencePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <SiteShell>
      <section
        id="experience"
        className="pt-32 md:pt-40 pb-20 md:pb-28 bg-[#f9f9f9] dark:bg-background"
      >
        <div className="container-editorial">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-[30px]">
            {experiences.map((exp, idx) => {
              const { Icon, title, desc, clients, link } = exp;
              const isOpen = openIndex === idx;
              return (
                <div
                  key={title}
                  className="bg-white dark:bg-card rounded-lg p-[30px] text-center transition-all duration-300"
                  style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
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
                  <p className="mb-5 leading-[1.6] text-foreground/70">{desc}</p>

                  {clients ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIndex(isOpen ? null : idx)
                      }
                      className="inline-flex items-center gap-1 font-medium transition-colors"
                      style={{ color: isOpen ? DARK_RED : ORANGE }}
                    >
                      {isOpen ? "Show Less" : "Read More"}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <a
                      href={link}
                      className="font-medium transition-colors"
                      style={{ color: ORANGE }}
                    >
                      Read More
                    </a>
                  )}

                  {clients && isOpen && (
                    <div className="mt-6 pt-6 border-t border-border text-left animate-fade-in">
                      <h4
                        className="font-display font-semibold mb-4 text-center"
                        style={{ color: DARK_RED }}
                      >
                        Selected Clients
                      </h4>
                      <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                        {clients.map((c, i) => (
                          <li
                            key={`${c.name}-${i}`}
                            className="flex gap-3 items-start"
                          >
                            {c.logo && (
                              <div className="h-12 w-12 flex-shrink-0 bg-[#f9f9f9] dark:bg-muted rounded flex items-center justify-center overflow-hidden">
                                <img
                                  src={c.logo}
                                  alt={c.name}
                                  className="max-h-10 max-w-10 object-contain"
                                  loading="lazy"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-sm font-semibold"
                                style={{ color: DARK_RED }}
                              >
                                {c.website ? (
                                  <a
                                    href={c.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    {c.name}
                                  </a>
                                ) : (
                                  c.name
                                )}
                              </p>
                              <p className="text-xs text-foreground/60 leading-relaxed mt-1">
                                {c.description}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
