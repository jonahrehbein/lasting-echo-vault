import { Link, useLocation } from "react-router-dom";
import { Heart, Video, Users, Library, Settings } from "lucide-react";

export function BottomNavigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: "/", icon: Heart, label: "Home" },
    { path: "/record", icon: Video, label: "Record" },
    { path: "/contacts", icon: Users, label: "Contacts" },
    { path: "/library", icon: Library, label: "Library" },
    { path: "/profile", icon: Settings, label: "Profile" },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center flex-1 py-2 px-1 rounded-lg transition-all duration-300 ${
              isActive(path)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icon className={`w-5 h-5 mb-1 ${isActive(path) ? "text-primary" : ""}`} />
            <span className={`text-xs font-medium ${isActive(path) ? "text-primary" : ""}`}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}