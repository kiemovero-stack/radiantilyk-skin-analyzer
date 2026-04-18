/**
 * MobileTabBar — Bottom tab navigation for the RadiantilyK app.
 *
 * Two modes:
 * 1. Client mode (standalone client domain): Home, Analyze, Rewards, Book, Profile
 * 2. Staff mode (staff domain): Dashboard, History, Rewards Mgmt, Appointments, Leads
 *
 * Hidden entirely on report pages and non-mobile viewports.
 */
import { useLocation } from "wouter";
import {
  Home, Camera, Gift, CalendarDays, User,
  LayoutDashboard, Clock, Award, Users,
} from "lucide-react";
import { clientPath, isStandaloneClient } from "@/lib/clientPaths";

const C = {
  gold: "#B8964A",
  charcoal: "#2C2C2C",
  muted: "#9CA3AF",
  ivory: "#FAF7F2",
  indigo: "#4F46E5",
};

interface TabItem {
  label: string;
  icon: typeof Home;
  path: string;
}

const clientTabs: TabItem[] = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Analyze", icon: Camera, path: "/start" },
  { label: "Rewards", icon: Gift, path: "/rewards" },
  { label: "Book", icon: CalendarDays, path: "/book" },
  { label: "Profile", icon: User, path: "/profile" },
];

const staffTabs: TabItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "History", icon: Clock, path: "/history" },
  { label: "Rewards", icon: Award, path: "/rewards-admin" },
  { label: "Appts", icon: CalendarDays, path: "/appointments" },
  { label: "Leads", icon: Users, path: "/leads" },
];

/** Staff routes that should show the staff tab bar */
const STAFF_ROUTE_PREFIXES = [
  "/history",
  "/analyze",
  "/report/",
  "/leads",
  "/rewards-admin",
  "/appointments",
  "/guide",
  "/staff",
  "/compare",
];

function isStaffRoute(location: string): boolean {
  // Root "/" is the staff dashboard on the staff domain
  if (location === "/") return true;
  return STAFF_ROUTE_PREFIXES.some((prefix) => location.startsWith(prefix));
}

export default function MobileTabBar() {
  const [location, setLocation] = useLocation();

  const standalone = isStandaloneClient();

  // On standalone client domain, always show client tabs (except report pages)
  if (standalone) {
    if (location.includes("/report/")) return null;

    return (
      <TabBarShell accent={C.gold} bg="rgba(250, 247, 242, 0.95)" borderColor={C.gold + "20"}>
        {clientTabs.map((tab) => {
          const fullPath = clientPath(tab.path);
          const isActive =
            tab.path === "/"
              ? location === fullPath || location === clientPath("")
              : location.startsWith(fullPath);
          return (
            <TabButton
              key={tab.path}
              tab={tab}
              isActive={isActive}
              accent={C.gold}
              onClick={() => setLocation(fullPath)}
            />
          );
        })}
      </TabBarShell>
    );
  }

  // On staff domain: show staff tabs for staff routes
  if (!isStaffRoute(location)) return null;

  // Hide on individual report pages (they have their own nav)
  if (location.startsWith("/report/")) return null;

  return (
    <TabBarShell accent={C.indigo} bg="rgba(255, 255, 255, 0.95)" borderColor="#E5E7EB">
      {staffTabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? location === "/"
            : location.startsWith(tab.path);
        return (
          <TabButton
            key={tab.path}
            tab={tab}
            isActive={isActive}
            accent={C.indigo}
            onClick={() => setLocation(tab.path)}
          />
        );
      })}
    </TabBarShell>
  );
}

/* ── Sub-components ─────────────────────────────── */

function TabBarShell({
  children,
  accent,
  bg,
  borderColor,
}: {
  children: React.ReactNode;
  accent: string;
  bg: string;
  borderColor: string;
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-xl md:hidden"
      style={{
        background: bg,
        borderColor,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {children}
      </div>
    </nav>
  );
}

function TabButton({
  tab,
  isActive,
  accent,
  onClick,
}: {
  tab: TabItem;
  isActive: boolean;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-0.5 py-2 px-3 transition-colors duration-200"
      style={{ minWidth: 56 }}
    >
      <tab.icon
        className="w-5 h-5 transition-colors duration-200"
        style={{ color: isActive ? accent : C.muted }}
        strokeWidth={isActive ? 2.2 : 1.8}
      />
      <span
        className="text-[10px] font-medium tracking-wide transition-colors duration-200"
        style={{
          color: isActive ? accent : C.muted,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {tab.label}
      </span>
    </button>
  );
}
