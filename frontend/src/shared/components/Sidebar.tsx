import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/expenses", label: "Expenses" },
  { to: "/categories", label: "Categories" },
  { to: "/budgets", label: "Budgets" },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-base-300 bg-base-200 p-4">
      <h1 className="mb-4 px-2 text-xl font-bold">Expense Tracker</h1>
      <ul className="menu w-full gap-1">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                isActive ? "active font-semibold" : ""
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
