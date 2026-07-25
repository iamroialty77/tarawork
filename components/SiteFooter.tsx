import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

const facebookUrl = "https://www.facebook.com/profile.php?id=61581316087458&mibextid=wwXIfr";
const linkedinUrl = "https://www.linkedin.com/company/tarawork-online/posts/?feedView=all";

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.438H7.078v-3.489h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.974h-1.513c-1.49 0-1.956.931-1.956 1.887v2.26h3.328l-.532 3.489h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V8.997h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.371 4.267 5.456v6.288ZM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128ZM7.119 20.452H3.555V8.997h3.564v11.455ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="border-b border-zinc-800 bg-gradient-to-r from-teal-950 via-zinc-950 to-zinc-950">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-400">Build better remote teams</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white">Ready to find the right Filipino talent?</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/hire/request" className="inline-flex items-center gap-2 rounded-lg bg-teal-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-teal-300">
              Request a shortlist <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href="/auth" className="inline-flex items-center rounded-lg border border-zinc-700 px-5 py-3 text-sm font-black text-white transition hover:border-zinc-500 hover:bg-zinc-900">
              Join TaraWork
            </Link>
          </div>
        </div>
      </div>

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
          <div className="mt-6 grid max-w-sm grid-cols-2 gap-3">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit TaraWork on Facebook" className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 transition hover:-translate-y-0.5 hover:border-[#1877F2]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1877F2] text-white">
                <FacebookLogo />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Follow us</span>
                <span className="text-sm font-bold text-white">Facebook</span>
              </span>
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit TaraWork on LinkedIn" className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 transition hover:-translate-y-0.5 hover:border-[#0A66C2]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-white">
                <LinkedInLogo />
              </span>
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Connect</span>
                <span className="text-sm font-bold text-white">LinkedIn</span>
              </span>
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
          <div className="mt-5 space-y-3 text-sm">
            <a href="tel:+639944834740" className="flex items-start gap-3 rounded-lg p-2 -ml-2 transition hover:bg-zinc-900 hover:text-teal-400">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-400/10"><Phone className="h-4 w-4 text-teal-400" /></span>
              <span><span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Call us</span>+63 994 483 4740</span>
            </a>
            <a href="mailto:hello@tarawork.online" className="flex items-start gap-3 rounded-lg p-2 -ml-2 transition hover:bg-zinc-900 hover:text-teal-400">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-400/10"><Mail className="h-4 w-4 text-teal-400" /></span>
              <span><span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email us</span>hello@tarawork.online</span>
            </a>
            <a href="https://www.google.com/maps/search/?api=1&query=Waling-Waling%2C+Purok+Sta.+Cruz%2C+Calumpang%2C+General+Santos+City" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg p-2 -ml-2 leading-6 text-zinc-400 transition hover:bg-zinc-900 hover:text-teal-400">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-400/10"><MapPin className="h-4 w-4 text-teal-400" /></span>
              <address className="not-italic"><span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Our address</span>Waling-Waling, Purok Sta. Cruz, Calumpang, General Santos City, Philippines</address>
            </a>
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
