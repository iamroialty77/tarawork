import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const facebookUrl = "https://www.facebook.com/profile.php?id=61581316087458&mibextid=wwXIfr";
const linkedinUrl = "https://www.linkedin.com/company/tarawork-online/posts/?feedView=all";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.35fr_0.8fr_1fr] lg:px-10">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-3 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
              <Image src="/tarawork-removebg-preview.png" alt="TaraWork logo" width={34} height={34} />
            </span>
            <span>
              <span className="block text-lg font-black tracking-tight">TaraWork.online</span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">
                Filipino talent. Global opportunities.
              </span>
            </span>
          </Link>
          <p className="mt-5 text-sm leading-7 text-zinc-400">
            A professional marketplace connecting businesses with skilled Filipino freelancers and helping remote
            professionals build credible careers online.
          </p>
          <div className="mt-6 flex gap-3">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit TaraWork on Facebook" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 transition hover:border-teal-400 hover:bg-teal-400 hover:text-zinc-950">
              <Facebook className="h-5 w-5" />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit TaraWork on LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 transition hover:border-teal-400 hover:bg-teal-400 hover:text-zinc-950">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Quick links</h2>
          <nav className="mt-5 grid gap-3 text-sm font-semibold">
            <Link href="/about" className="transition hover:text-teal-400">About TaraWork</Link>
            <Link href="/hire-filipino-freelancers" className="transition hover:text-teal-400">Hire Filipino Talent</Link>
            <Link href="/remote-jobs-philippines" className="transition hover:text-teal-400">Find Remote Jobs</Link>
            <Link href="/blog" className="transition hover:text-teal-400">Insights &amp; Guides</Link>
            <Link href="/safety" className="transition hover:text-teal-400">Safety Center</Link>
            <Link href="/contact" className="transition hover:text-teal-400">Contact Us</Link>
          </nav>
        </div>

        <div>
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Get in touch</h2>
          <div className="mt-5 space-y-4 text-sm">
            <a href="tel:+639944834740" className="flex items-start gap-3 transition hover:text-teal-400">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
              <span>+63 994 483 4740</span>
            </a>
            <a href="mailto:hello@tarawork.online" className="flex items-start gap-3 transition hover:text-teal-400">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
              <span>hello@tarawork.online</span>
            </a>
            <address className="flex items-start gap-3 not-italic leading-6 text-zinc-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" />
              <span>Waling-Waling, Purok Sta. Cruz, Calumpang, General Santos City, Philippines</span>
            </address>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-5 text-xs text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <p>© {new Date().getFullYear()} TaraWork.online. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/privacy" className="transition hover:text-zinc-200">Privacy</Link>
            <Link href="/terms" className="transition hover:text-zinc-200">Terms</Link>
            <Link href="/cookies" className="transition hover:text-zinc-200">Cookies</Link>
            <Link href="/payment-policy" className="transition hover:text-zinc-200">Payment Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
