import Link from "next/link";

type SidebarProps = {
  currentView: "host" | "remote";
};

export function Sidebar({ currentView }: SidebarProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-500">Menu</p>
      <nav className="mt-3 grid gap-2">
        <Link
          href="/?view=host"
          className={`rounded-md px-3 py-2 text-sm ${
            currentView === "host" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          Host
        </Link>
        <Link
          href="/?view=remote"
          className={`rounded-md px-3 py-2 text-sm ${
            currentView === "remote" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
          }`}
        >
          Remote
        </Link>
        <Link href="/signin" className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700">
          Sign in
        </Link>
      </nav>
    </aside>
  );
}
