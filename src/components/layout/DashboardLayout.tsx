import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen">
    <AppSidebar />
    <main className="flex-1 overflow-auto">
      <div className="p-6 md:p-8 max-w-6xl">{children}</div>
    </main>
  </div>
);

export default DashboardLayout;
