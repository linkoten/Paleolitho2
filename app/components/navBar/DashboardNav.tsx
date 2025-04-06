"use client";

import { SidebarDemo } from "./SidebarDemo";

export default function DashboardNav({ user }: any) {
  return (
    <nav className="fixed left-0 top-1/4 h-2/3 z-10 w-fit ">
      <SidebarDemo user={user} />
    </nav>
  );
}
