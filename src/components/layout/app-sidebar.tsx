"use client";

import {
  BabyIcon,
  BlocksIcon,
  BookMarkedIcon,
  CalendarDaysIcon,
  ClipboardCheckIcon,
  GaugeIcon,
  HomeIcon,
  UserRoundCogIcon,
  UsersRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { NavUser } from "@/components/layout/nav-user";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { hasAccess } from "@/lib/permissions";
import type { UserRole } from "@/types/user";
import { ActiveSidebarMenuItem } from "./active-sidebar-menu-button";

const data = {
  navMain: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: GaugeIcon,
        },
        {
          title: "Familias",
          url: "/families",
          icon: HomeIcon,
        },
        {
          title: "Niños",
          url: "/children",
          icon: BabyIcon,
        },
        {
          title: "Grupos",
          url: "/groups",
          icon: UsersRoundIcon,
        },
        {
          title: "Actividades",
          url: "/activities",
          icon: CalendarDaysIcon,
        },
        {
          title: "Asistencia",
          url: "/attendance",
          icon: ClipboardCheckIcon,
        },
        {
          title: "Mentoras",
          url: "/mentors",
          icon: BookMarkedIcon,
        },
        {
          title: "Clubes",
          url: "/clubs",
          icon: BlocksIcon,
        },
        {
          title: "Usuarios",
          url: "/users",
          icon: UserRoundCogIcon,
        },
      ],
    },
  ],
};

function SidebarLogo() {
  return (
    <div className="flex px-2 group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-in-out">
      <Link
        className="inline-flex items-center gap-3 overflow-hidden rounded-md focus-visible:outline-ring focus-visible:outline-2 focus-visible:outline-offset-4"
        href="/"
        aria-label="AVNES · Inicio"
      >
        <Image
          src="/logo.png"
          alt=""
          width={40}
          height={40}
          priority
          className="size-10 shrink-0 rounded-full group-data-[collapsible=icon]:size-8 transition-[width,height] duration-200 ease-in-out"
        />
        <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
          <span className="font-semibold leading-tight">AVNES</span>
          <span className="text-xs text-muted-foreground">
            Panel de administración
          </span>
        </span>
      </Link>
    </div>
  );
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  userRole: UserRole | null;
};

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const isFirstRender = useRef(true);

  // Cerrar el sidebar móvil al cambiar de ruta
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers closing the mobile menu after navigation.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const filteredNav = data.navMain
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => hasAccess(userRole, item.url)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader className="h-16 max-md:mt-2 mb-2 justify-center">
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent className="-mt-2">
        {filteredNav.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="uppercase text-muted-foreground/65">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <ActiveSidebarMenuItem title={item.title} url={item.url}>
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-muted-foreground/65 group-data-[active=true]/menu-button:text-primary"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </ActiveSidebarMenuItem>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <InstallAppButton sidebar />
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-2">
          <NavUser />
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
