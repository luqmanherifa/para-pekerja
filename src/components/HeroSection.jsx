import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useSelector } from "react-redux";
import {
  Radio,
  Users,
  ArrowRight,
  ClipboardCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      setTotalMembers(snap.size);
      const since = Date.now() - 24 * 60 * 60 * 1000;
      const active = snap.docs.filter((d) => {
        const t = d.data().lastActiveAt;
        return t && t.toMillis() >= since;
      });
      setActiveToday(active.length);
    });
    return () => unsubscribe();
  }, []);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="w-full bg-green-600">
      <div className="max-w-5xl mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <Radio size={13} className="text-green-300" strokeWidth={2.5} />
            <span className="text-xs font-bold text-green-300 uppercase tracking-widest">
              Komunitas Pendengar · ABG Siniar
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-green-300" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-green-300 uppercase tracking-widest">
                Pekerja
              </span>
              <span className="text-sm font-extrabold text-white tabular-nums">
                {totalMembers.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="w-px h-3.5 bg-green-500" />
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-300 uppercase tracking-widest">
                Aktif hari ini
              </span>
              <span className="text-sm font-extrabold text-yellow-400 tabular-nums">
                {activeToday.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm font-medium text-green-300 mb-1.5 italic">
            Dibuat oleh pendengar, untuk pendengar.
          </p>
          <h1 className="text-5xl font-extrabold text-white leading-[1.05] tracking-tight">
            Markas tidak resmi{" "}
            <span className="text-yellow-400">Para Pekerja.</span>
          </h1>
        </div>

        <div className="w-full h-px bg-green-500 mb-8" />

        <div className="flex items-center justify-between gap-12">
          <p className="text-green-200 text-sm leading-relaxed max-w-sm">
            Siniar komedi{" "}
            <span className="text-white font-bold">Arif Brata</span>,{" "}
            <span className="text-white font-bold">Bintang Emon</span>, dan{" "}
            <span className="text-white font-bold">Gilang Bhaskara</span>. Ruang
            para pendengar untuk absen, berdebat, dan mengarsipkan momen
            bersama.
          </p>

          {user ? (
            <div className="flex flex-col items-end gap-4 shrink-0">
              <p className="text-xs font-semibold text-green-300">
                {user.displayName ?? "Pekerja"} · {user.jobTitle ?? "Pekerja"}
              </p>
              <button
                onClick={() => scrollTo("absen")}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors duration-150"
              >
                <ClipboardCheck size={13} strokeWidth={2.5} />
                Absen Sekarang
                <Sparkles size={11} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end gap-4 shrink-0">
              <p className="text-xs font-semibold text-green-300">
                Bergabung bersama{" "}
                <span className="text-white font-extrabold">
                  {totalMembers.toLocaleString("id-ID")} pekerja
                </span>{" "}
                lainnya.
              </p>
              <button
                onClick={() => navigate("/masuk")}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors duration-150"
              >
                <ArrowRight size={13} strokeWidth={2.5} />
                Gabung Sekarang
                <Sparkles size={11} strokeWidth={2.5} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
