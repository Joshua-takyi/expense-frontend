"use client";

import { Button } from "@heroui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeSwitch } from "./theme-provider";
import SignOutDialog from "./signoutDialog";

export default function AppSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();
  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      id: "transactions",
      label: "Transactions",
      href: "/transactions",
    },
    {
      id: "budgets",
      label: "Budgets",
      href: "/budgets",
    },
    {
      id: "reports",
      label: "Reports",
      href: "/reports",
    },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        isIconOnly
        variant="light"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden"
        aria-label="Toggle menu"
      >
        <HamburgerMenuIcon className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`  fixed inset-y-0 left-0 z-50 w-64 bg-[#FAFAFA] dark:bg-background  transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between h-full">
          {/* Header */}
          <div className="p-6">
            <h1 className="text-lg font-medium text-foreground">
              ExpenseTracker
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 space-y-1 overflow-y-auto">
            {items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`block py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {/* Footer */}
          <div className="p-6 border-t border-divider">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-foreground/70">Theme</span>
              <ThemeSwitch />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/70">Account</span>
              <SignOutDialog />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
