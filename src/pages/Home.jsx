import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";
import HeroSection from "../components/HeroSection";
import AbsensiSection from "../components/AbsensiSection";
import KerjaanSection from "../components/KerjaanSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageSquareQuote, Scale, Star } from "lucide-react";

const COMING_SOON_SECTIONS = [
  {
    id: "quote-battle",
    icon: MessageSquareQuote,
    label: "Fitur 4",
    title: "Quote Battle",
    desc: "Pilih komedian, pilih episode, dan kirim quote terbaik versi kamu. Komunitas yang vote mana yang paling berkesan.",
    bg: "bg-gradient-to-br from-green-600 to-green-700",
    border: "border-t-4 border-green-500",
    textMain: "text-white",
    textSub: "text-green-100",
    iconBg: "bg-green-800",
    iconColor: "text-white",
    badge: "bg-green-800 text-green-200",
  },
  {
    id: "siapa-paling-benar",
    icon: Scale,
    label: "Fitur 5",
    title: "Siapa Paling Benar?",
    desc: "Rangkum opini masing-masing komedian dalam satu episode. Komunitas vote siapa yang paling masuk akal — atau paling chaos.",
    bg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    border: "border-t-4 border-yellow-300",
    textMain: "text-gray-900",
    textSub: "text-yellow-900",
    iconBg: "bg-yellow-600",
    iconColor: "text-white",
    badge: "bg-yellow-600 text-yellow-100",
  },
  {
    id: "guest-ranking",
    icon: Star,
    label: "Fitur 6",
    title: "Peringkat Tamu",
    desc: "Vote performa tamu terbaik dan tambahkan momen favoritmu. Siapa tamu terbaik versi para pekerja? Kamu yang menentukan.",
    bg: "bg-gradient-to-br from-green-600 to-green-700",
    border: "border-t-4 border-green-500",
    textMain: "text-white",
    textSub: "text-green-100",
    iconBg: "bg-green-800",
    iconColor: "text-white",
    badge: "bg-green-800 text-green-200",
  },
];

export default function Home() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onLogout={handleLogout} />

      <HeroSection />

      <div className="border-t-4 border-yellow-400">
        <AbsensiSection />
      </div>

      <KerjaanSection />

      {COMING_SOON_SECTIONS.map((section) => {
        const Icon = section.icon;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`w-full ${section.bg} ${section.border}`}
          >
            <div className="max-w-5xl mx-auto px-8 py-20 flex items-center justify-between gap-12">
              <div className="flex-1">
                <div
                  className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 ${section.badge}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${section.iconBg}`}
                  />
                  {section.label} · Segera Hadir
                </div>
                <h2
                  className={`text-3xl font-extrabold leading-tight mb-3 ${section.textMain}`}
                >
                  {section.title}
                </h2>
                <p
                  className={`text-sm leading-relaxed max-w-md ${section.textSub}`}
                >
                  {section.desc}
                </p>
              </div>
              <div
                className={`w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 ${section.iconBg}`}
              >
                <Icon
                  size={40}
                  className={section.iconColor}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </section>
        );
      })}

      <Footer />
    </div>
  );
}
