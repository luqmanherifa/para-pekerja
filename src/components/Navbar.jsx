import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  LogOut,
  ClipboardCheck,
  Briefcase,
  MessageSquareQuote,
  Scale,
  Star,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Absensi & Slip Gaji", href: "#absensi", icon: ClipboardCheck },
  { label: "Kerjaan 5 Juta", href: "#kerjaan", icon: Briefcase },
  { label: "Quote Battle", href: "#quote-battle", icon: MessageSquareQuote },
  { label: "Siapa Paling Benar", href: "#siapa-paling-benar", icon: Scale },
  { label: "Peringkat Tamu", href: "#guest-ranking", icon: Star },
];

export default function Navbar({ onLogout }) {
  const user = useSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-extrabold tracking-tight leading-none select-none">
              PP
            </span>
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-green-600 transition-colors duration-150">
            Para Pekerja
          </span>
        </a>

        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-colors duration-150 ${
                open
                  ? "border-green-600 text-green-600 bg-green-50"
                  : "border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600"
              }`}
            >
              <LayoutGrid size={13} />
              Fitur
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl overflow-hidden z-50">
                {NAV_LINKS.map(({ label, href, icon: Icon }, i) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-100 ${
                      i !== NAV_LINKS.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon
                        size={14}
                        className="text-gray-500"
                        strokeWidth={2}
                      />
                    </div>
                    <span className="font-medium">{label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-200" />

          <span className="text-xs text-gray-400 hidden xl:block max-w-[160px] truncate">
            {user?.email}
          </span>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs font-semibold border border-gray-300 hover:border-red-400 hover:text-red-500 text-gray-600 px-3 py-2 rounded-lg transition-colors duration-150"
          >
            <LogOut size={13} />
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
}
