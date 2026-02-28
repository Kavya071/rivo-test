import { Outlet, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Home, Briefcase, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";
import InstallPrompt from "@/components/InstallPrompt";

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide bottom nav on onboarding screens
  const hideNav = !isAuthenticated || ["/", "/referral-bonus", "/terms", "/privacy", "/bonus-terms", "/referral-info", "/referral-success", "/whatsapp-verify"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-rivo-bg min-h-screen shadow-2xl shadow-zinc-900 relative flex flex-col border-x border-rivo-border transition-all duration-300">
        <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
          <Outlet />
        </main>

        {!hideNav && (
          <nav className="fixed bottom-0 w-full md:max-w-2xl lg:max-w-4xl xl:max-w-5xl bg-black border-t border-zinc-800 px-6 py-4 flex justify-between items-center z-50 left-1/2 -translate-x-1/2 transition-all duration-300">
            <NavItem to="/home" icon={Home} label="Home" active={location.pathname === "/home"} />
            <NavItem to="/clients" icon={Briefcase} label="Clients" active={location.pathname === "/clients"} />
            <NavItem to="/network" icon={Users} label="Network" active={location.pathname === "/network"} />
            <NavItem to="/profile" icon={User} label="Profile" active={location.pathname === "/profile"} />
          </nav>
        )}

        <InstallPrompt hasNav={!hideNav} />
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) {
  return (
    <Link to={to} className="flex flex-col items-center space-y-1">
      <Icon
        size={24}
        className={cn("transition-colors", active ? "text-rivo-green" : "text-rivo-text-secondary")}
        strokeWidth={active ? 2.5 : 2}
      />
      <span className={cn("text-[10px] font-medium transition-colors", active ? "text-rivo-green" : "text-rivo-text-secondary")}>
        {label}
      </span>
    </Link>
  );
}
