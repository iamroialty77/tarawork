"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

  const navLinks = [
    { label: "Find Talent", href: "/#filipino-freelancers" },
    { label: "Remote Jobs", href: "/#latest-jobs" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Guides", href: "/blog" },
    { label: "Contact", href: "/#contact" },
  ];

export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncLocation = () => {
      setScrolled(window.scrollY > 12);
      setHash(window.location.hash);
    };
    syncLocation();
    window.addEventListener("scroll", syncLocation, { passive: true });
    window.addEventListener("hashchange", syncLocation);
    return () => {
      window.removeEventListener("scroll", syncLocation);
      window.removeEventListener("hashchange", syncLocation);
    };
  }, []);

  const isActive = (href: string) => {
    const [linkPath, linkHash] = href.split("#");
    if (linkHash) return pathname === "/" && hash === `#${linkHash}`;
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  };

  const transparent = overlay && !scrolled && !isMenuOpen;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        transparent
          ? "border-white/15 bg-zinc-950/45 backdrop-blur-sm"
          : "border-white/10 bg-zinc-950/95 shadow-xl shadow-black/10 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex min-h-[72px] w-full max-w-[1536px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="TaraWork home">
          <img src="/tarawork-logo.png" alt="TaraWork" className="h-auto w-[138px] object-contain sm:w-[158px]" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center rounded-xl border border-white/10 bg-white/[0.06] p-1 xl:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2.5 py-2 text-[12px] font-bold whitespace-nowrap transition ${
                  active ? "bg-white text-zinc-950 shadow-sm" : "text-white/72 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 xl:flex">
          <Link href="/auth" className="rounded-lg border border-white/20 px-3.5 py-2 text-sm font-black text-white transition hover:border-white/35 hover:bg-white/10">
            Sign In
          </Link>
          <Link href="/auth" className="rounded-lg bg-teal-400 px-3.5 py-2 text-sm font-black text-zinc-950 transition hover:bg-teal-300">
            Join Now
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg border border-white/20 p-2 text-white transition hover:bg-white/10 xl:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 pb-5 pt-3 shadow-2xl xl:hidden">
          <nav aria-label="Mobile navigation" className="mx-auto grid max-w-2xl gap-1 sm:grid-cols-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition ${
                    active ? "bg-white text-zinc-950" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mx-auto mt-3 grid max-w-2xl grid-cols-2 gap-2">
            <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-black text-white">
              Sign In
            </Link>
            <Link href="/auth" onClick={() => setIsMenuOpen(false)} className="rounded-lg bg-teal-400 px-4 py-3 text-center text-sm font-black text-zinc-950">
              Join Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
