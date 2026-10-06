import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Garage", path: "/garage" },
  { label: "Maintenance", path: "/maintenance" },
  { label: "Builds", path: "/builds" },
  { label: "Expenses", path: "/expenses" },
  { label: "Analytics", path: "/analytics" },
];

export function MobileNav() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 md:hidden">
      <div className="flex gap-1 overflow-x-auto px-4 py-3">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
