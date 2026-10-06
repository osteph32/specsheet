import { NavLink } from "react-router-dom";

interface NavigationItem {
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    label: "Garage",
    path: "/garage",
  },
  {
    label: "Maintenance",
    path: "/maintenance",
  },
  {
    label: "Builds",
    path: "/builds",
  },
  {
    label: "Expenses",
    path: "/expenses",
  },
  {
    label: "Analytics",
    path: "/analytics",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 shrink-0 border-r border-zinc-800 bg-zinc-950 md:flex md:flex-col">
      <div className="border-b border-zinc-800 px-6 py-6">
        <p className="text-xl font-semibold tracking-tight text-zinc-100">
          SpecSheet
        </p>

        <p className="mt-1 text-xs text-zinc-500">Vehicle management</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 px-6 py-4">
        <p className="text-xs text-zinc-600">SpecSheet V1</p>
      </div>
    </aside>
  );
}
