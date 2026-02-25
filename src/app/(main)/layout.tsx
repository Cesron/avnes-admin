import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { verifySession } from "@/lib/auth-utils";
import type { UserRole } from "@/types/user";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();
  const userRole = (session.user.role as UserRole) || null;

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <SidebarInset>
        <div className="px-4 md:px-6 lg:px-8 @container">
          <div className="w-full max-w-6xl mx-auto">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
