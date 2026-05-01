import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";

const ORANGE = "#ff6b35";
const DARK_RED = "#b71c1c";

export type ClientEntry = {
  name: string;
  description: string;
  logo?: string;
  website?: string;
};

const STANDARDS = [
  "Determine, on each engagement, who our clients are and directly ascertain their expectations for our performance.",
  "Analyze client's needs and professional service requirements.",
  "Develop client service objectives that will enable us to fulfill our professional responsibilities, satisfy our client's needs, and exceed their expectations. Prepare an appropriate client service plan to achieve these client service objectives.",
  "Execute the client service plan in a manner, which ensures commitments are met, potential problems anticipated and surprises avoided.",
  "Establish effective communications, both internal and external, to enhance client perceptions of the value and quality of our service.",
  "Provide management with insights on the current condition of their business and meaningful suggestions for improvement.",
  "Continually broaden and strengthen our relationships with key management personnel to facilitate effective communication.",
  "Ensure that any professional, technical, or client-service problem is resolved promptly with timely consultation in an environment of mutual respect.",
  "Obtain from the client, formally and informally, a regular assessment of our performance.",
  "Receive fees that reflect the value of services provided and responsibilities assumed and are considered fair and reasonable by our clients.",
];

export function ExperienceDetailPage({
  title,
  intro,
  clients,
}: {
  title: string;
  intro?: string;
  clients: ClientEntry[];
}) {
  return (
    <SiteShell>
      {/* Page header */}
      <section
        className="pt-32 md:pt-40 pb-12 md:pb-16"
        style={{ background: "#f9f9f9" }}
      >
        <div className="container-editorial text-center">
          <h6
            className="text-xs uppercase tracking-[0.25em] font-medium mb-3"
            style={{ color: ORANGE }}
          >
            Delivering Value!
          </h6>
          <h1 className="font-display text-3xl md:text-5xl font-semibold mb-4">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">–</span>
            <Link to="/experience" className="hover:underline">Experience</Link>
            <span className="mx-2">–</span>
            <span>{title}</span>
          </p>
        </div>
      </section>

      {/* Intro + clients */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-editorial">
          <div className="text-center mb-12">
            <h6
              className="text-xs uppercase tracking-[0.25em] font-medium mb-3"
              style={{ color: ORANGE }}
            >
              Delivering Value!
            </h6>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-6">
              Consultancy & Training{" "}
              <span style={{ color: ORANGE }}>Experience</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-5 text-[15px] leading-relaxed text-foreground/80 mb-14">
            <p>
              {intro ??
                "The consultancy service is ideally conducted by a team of professional consultants who are expected to demonstrate strong credentials in IFRS implementation in various industries. The consulting firm has already undertaken consultancy service and advisory assignments for various industries. Clients will get a continued service without impersonal attitude beyond a commercial relationship."}{" "}
              <strong>MATED Management and Research Institute (MMRI)</strong>{" "}
              provides the full range of consulting and training services.
            </p>
            <p>
              To partners advocate a continuous staff professional development
              program to ensure the high professional caliber of its staff is
              maintained. The institute will promote its staff by encouraging
              them to participate in training programs including those of
              international so that gets certified including the owners. The
              following are some of the lists of clients to which the institute
              delivered both trainings and consulting services.
            </p>
          </div>

          {/* Client grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {clients.map((c, idx) => (
              <article
                key={`${c.name}-${idx}`}
                className="bg-white rounded-lg p-6 transition-all duration-300 hover:-translate-y-[6px]"
                style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.06)" }}
              >
                {c.logo && (
                  <div className="h-32 flex items-center justify-center mb-5 bg-[#f9f9f9] rounded">
                    {c.website ? (
                      <a href={c.website} target="_blank" rel="noopener noreferrer">
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="max-h-28 max-w-full object-contain"
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="max-h-28 max-w-full object-contain"
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                <h3
                  className="font-display text-lg font-semibold mb-3"
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
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                  {c.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Client Service Standards */}
      <section className="py-16 md:py-20" style={{ background: "#f9f9f9" }}>
        <div className="container-editorial">
          <div className="text-center mb-10">
            <h6
              className="text-xs uppercase tracking-[0.25em] font-medium mb-3"
              style={{ color: ORANGE }}
            >
              Delivering Value!
            </h6>
            <h2 className="font-display text-3xl md:text-4xl font-semibold">
              Client Service{" "}
              <span style={{ color: ORANGE }}>Standards</span>
            </h2>
          </div>
          <p className="max-w-3xl mx-auto text-center text-foreground/75 mb-10">
            We have a rigorous set of client service standards. These standards
            are followed throughout the firm to ensure quality service to all
            our clients.
          </p>
          <ul className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {STANDARDS.map((s, i) => (
              <li
                key={i}
                className="bg-white rounded-md p-5 text-sm leading-relaxed text-foreground/80"
                style={{ boxShadow: "0 3px 10px rgba(0,0,0,0.04)" }}
              >
                <span
                  className="inline-block mr-2 font-semibold"
                  style={{ color: ORANGE }}
                >
                  {String(i + 1).padStart(2, "0")}.
                </span>
                {s}
              </li>
            ))}
          </ul>

          <div className="mt-12 text-center">
            <Link
              to="/experience"
              className="inline-flex items-center rounded-full px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: DARK_RED }}
            >
              ← Back to Experiences
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
