import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LogOut,
  ClipboardCheck,
  Briefcase,
  MessageSquareQuote,
  Scale,
  Star,
  LogIn,
  Hammer,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Slip Gaji", href: "#absen", icon: ClipboardCheck },
  { label: "Kerjaan Absurd", href: "#kerjaan", icon: Briefcase },
  { label: "Kutipan Terbaik", href: "#kutipan", icon: MessageSquareQuote },
  { label: "Siapa Benar", href: "#debat", icon: Scale },
  { label: "Peringkat Tamu", href: "#tamu", icon: Star },
];

const getInitials = (user) => {
  if (user.displayName) {
    return user.displayName
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
  return user.email?.[0]?.toUpperCase() ?? "P";
};

export default function Navbar({ onLogout }) {
  const user = useSelector((state) => state.auth.user);
  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-8 py-0 flex items-center justify-between h-14">
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group shrink-0"
        >
          <Hammer
            size={18}
            className="text-green-600 group-hover:text-green-700 transition-colors duration-150"
            strokeWidth={2.5}
          />
          <span className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-green-600 transition-colors duration-150">
            Para Pekerja
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:text-green-600 hover:bg-green-50 transition-all duration-150"
            >
              <Icon size={12} strokeWidth={2} />
              {label}
            </a>
          ))}
        </div>
        {user ? (
          <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden shrink-0">
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-5 h-5 rounded-md bg-green-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold leading-none">
                  {getInitials(user)}
                </span>
              </div>
              <span className="text-xs font-semibold text-gray-700 max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
            <div className="w-px h-5 bg-gray-300" />
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
            >
              <LogOut size={12} strokeWidth={2} />
              Keluar
            </button>
          </div>
        ) : (
          <Link
            to="/masuk"
            className="flex items-center gap-1.5 text-xs font-semibold bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition-colors duration-150 shrink-0"
          >
            <LogIn size={13} />
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}
