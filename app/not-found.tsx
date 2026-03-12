import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="text-slate-600">
          Check the URL and try again, or go back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Go to Home
          </Link>
          <Link
            href="/auth"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Open Login
          </Link>
        </div>
      </div>
    </main>
  );
}
