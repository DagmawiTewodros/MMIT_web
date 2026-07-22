import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container-editorial py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-3xl md:text-4xl leading-tight text-balance">
              Delivering value through clarity, rigor and trust.
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-8 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition"
            >
              Work with us →
            </Link>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60 mb-4">
              Contact
            </div>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li>+251 97 281 8181</li>
              <li>+251 97 724 4434</li>
              <li>
                <a href="mailto:matedtcplc@gmail.com" className="hover:text-accent">
                  matedtcplc@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:wogayehuwoldeyesus@gmail.com" className="hover:text-accent">
                  wogayehuwoldeyesus@gmail.com
                </a>
              </li>
              <li>
                <a href="mailto:teddy401994@gmail.com" className="hover:text-accent">
                  teddy401994@gmail.com
                </a>
              </li>
              <li>Kazanchis, Palace Commercial Center</li>
              <li>3rd Floor, Office #311</li>
              <li>P.O. Box 9885, Addis Ababa, Ethiopia</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60 mb-4">
              Explore
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-accent">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-accent">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-accent">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/15 flex flex-col md:flex-row gap-4 justify-between text-xs text-primary-foreground/60">
          <div>
            © {new Date().getFullYear()} MATED Consulting & Training PLC. All rights reserved.
          </div>
          <div>Delivering Value.</div>
        </div>
      </div>
    </footer>
  );
}
