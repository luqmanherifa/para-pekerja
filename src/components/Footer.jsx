import {
  ClipboardCheck,
  Briefcase,
  MessageSquareQuote,
  Scale,
  Star,
  ArrowUp,
  Hammer,
} from "lucide-react";

const FOOTER_LINKS = [
  { label: "Absensi & Slip Gaji", href: "#absen", icon: ClipboardCheck },
  { label: "Kerjaan 5 Juta", href: "#kerjaan", icon: Briefcase },
  { label: "Quote Battle", href: "#kutipan", icon: MessageSquareQuote },
  { label: "Siapa Paling Benar", href: "#debat", icon: Scale },
  { label: "Peringkat Tamu", href: "#tamu", icon: Star },
];

export default function Footer() {
  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="w-full bg-green-600">
      <div className="max-w-5xl mx-auto px-8 pt-14 pb-8">
        <div className="flex items-start justify-between gap-12 mb-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-4">
              <Hammer size={15} className="text-yellow-400" strokeWidth={2.5} />
              <span className="font-bold text-white text-sm tracking-tight">
                Para Pekerja
              </span>
            </div>
            <p className="text-green-200 text-xs font-normal leading-relaxed mb-4">
              Ruang digital komunitas ABG Siniar. Dibangun oleh para pekerja,
              untuk para pekerja — yang sedang berpura-pura produktif.
            </p>
            <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg">
              Fan-made · Bukan afiliasi resmi
            </span>
          </div>

          <div>
            <p className="text-xs font-medium text-green-300 uppercase tracking-widest mb-4">
              Fitur
            </p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className="flex items-center gap-2 text-xs font-medium text-green-200 hover:text-yellow-400 transition-colors duration-150"
                  >
                    <Icon
                      size={11}
                      strokeWidth={2}
                      className="text-green-400 shrink-0"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-xs">
            <p className="text-xs font-medium text-green-300 uppercase tracking-widest mb-4">
              Kata Mereka
            </p>
            <div className="border-l-2 border-yellow-400 pl-4">
              <p className="text-green-100 text-xs font-normal italic leading-relaxed">
                "Kerjaan apa yang gajinya 5 juta sehari?"
              </p>
              <p className="text-yellow-400 text-xs font-semibold mt-2 uppercase tracking-widest">
                — ABG Siniar
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-green-500 pt-5 flex items-center justify-between">
          <p className="text-xs font-normal text-green-400">
            © {new Date().getFullYear()} Para Pekerja · Fan-made community
            platform · Bukan produk resmi ABG Siniar
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-medium text-green-300 hover:text-yellow-400 uppercase tracking-widest transition-colors duration-150"
          >
            <ArrowUp size={11} strokeWidth={2.5} />
            Kembali ke atas
          </button>
        </div>
      </div>
    </footer>
  );
}
