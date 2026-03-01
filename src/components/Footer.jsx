import {
  ClipboardCheck,
  Briefcase,
  MessageSquareQuote,
  Scale,
  Star,
  ArrowUp,
} from "lucide-react";

const FOOTER_LINKS = [
  { label: "Absensi & Slip Gaji", href: "#absensi", icon: ClipboardCheck },
  { label: "Kerjaan 5 Juta", href: "#kerjaan", icon: Briefcase },
  { label: "Quote Battle", href: "#quote-battle", icon: MessageSquareQuote },
  { label: "Siapa Paling Benar", href: "#siapa-paling-benar", icon: Scale },
  { label: "Peringkat Tamu", href: "#guest-ranking", icon: Star },
];

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full bg-gradient-to-br from-green-800 to-green-900">
      <div className="max-w-5xl mx-auto px-8 pt-16 pb-10">
        <div className="flex items-start justify-between gap-12 mb-12">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center">
                <span className="text-gray-900 text-xs font-extrabold leading-none">
                  PP
                </span>
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                Para Pekerja
              </span>
            </div>
            <p className="text-green-300 text-sm leading-relaxed">
              Ruang digital komunitas ABG Siniar. Dibangun oleh para pekerja,
              untuk para pekerja — yang sedang berpura-pura produktif.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full">
              Fan-made · Bukan afiliasi resmi
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-4">
              Fitur
            </p>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="flex items-center gap-2 text-sm text-green-200 hover:text-yellow-400 transition-colors duration-150"
                  >
                    <Icon
                      size={13}
                      strokeWidth={2}
                      className="text-green-400"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-xs">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-4">
              Kata Mereka
            </p>
            <div className="border-l-2 border-yellow-400 pl-4">
              <p className="text-green-100 text-sm italic leading-relaxed">
                "Kerjaan apa yang gajinya 5 juta sehari?"
              </p>
              <p className="text-yellow-400 text-xs font-semibold mt-2 uppercase tracking-wide">
                — ABG Siniar
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 pt-6 flex items-center justify-between">
          <p className="text-xs text-green-500">
            © {new Date().getFullYear()} Para Pekerja · Fan-made community
            platform · Bukan produk resmi ABG Siniar
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-yellow-400 font-semibold transition-colors duration-150"
          >
            <ArrowUp size={13} />
            Kembali ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}
