import Link from "next/link";
import { env } from "../env";
import { Sidebar } from "./_components/sidebar";

type PageProps = {
  searchParams?: Promise<{
    view?: string | string[];
  }>;
};

function normalizeView(value: string | string[] | undefined) {
  const currentValue = Array.isArray(value) ? value[0] : value;
  return currentValue === "remote" ? "remote" : "host";
}

export default async function Home({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : undefined;
  const currentView = normalizeView(params?.view);
  const authServerOrigin = env.NEXT_PUBLIC_AUTH_SERVER_ORIGIN;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Host Shell</h1>
            <p className="text-sm text-slate-500">port 3000</p>
          </div>
          <p className="text-sm text-slate-500">remote is available only through this host</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Sidebar currentView={currentView} />

        <main className="rounded-lg border border-slate-200 bg-white p-4">
          {currentView === "host" ? (
            <section className="grid gap-4">
              <div className="rounded-md border border-slate-200 p-4">
                <h2 className="text-xl font-semibold">Host</h2>
                <p className="mt-2 text-sm text-slate-600">
                  ログインは
                  <Link
                    href="/signin"
                    className="mx-1 font-medium text-slate-900 underline decoration-slate-300 underline-offset-4"
                  >
                    /signin
                  </Link>
                  で行ってください。
                </p>
                <p className="mt-4 text-sm text-slate-600">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
                    POST {authServerOrigin}/api/auth/sign-up/email
                  </code>
                  <span className="mx-2">creates a Better Auth account.</span>
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
                    POST {authServerOrigin}/api/auth/sign-in/email
                  </code>
                  <span className="mx-2">signs in with email/password.</span>
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-800">
                    GET {authServerOrigin}/api/auth/get-session
                  </code>
                  <span className="mx-2">provides the shared session for host and remote.</span>
                </p>
              </div>
            </section>
          ) : (
            <section className="grid gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Remote</h2>
                </div>
                <a
                  href="/remote"
                  className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700"
                >
                  Open /remote
                </a>
              </div>

              <iframe
                title="Remote app"
                src="/remote"
                className="h-[720px] w-full rounded-md border border-slate-200 bg-white"
              />
            </section>
          )}
        </main>
      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-slate-500">
          Header, footer, and sidebar belong to the host.
        </div>
      </footer>
    </div>
  );
}
