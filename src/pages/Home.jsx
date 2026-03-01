import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";
import HeroSection from "../components/HeroSection";
import AttendanceSection from "../components/AttendanceSection";
import JobsSection from "../components/JobsSection";
import QuoteSection from "../components/QuoteSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Scale, Star } from "lucide-react";
import BattleSection from "../components/BattleSection";

const COMING_SOON_SECTIONS = [
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
        <AttendanceSection />
      </div>

      <JobsSection />

      <QuoteSection />

      <BattleSection />

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
