import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { ClipboardCheck, Briefcase, Hammer } from "lucide-react";

export default function HeroSection() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);

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
            <Hammer size={13} className="text-green-300" strokeWidth={2.5} />
            <span className="text-xs font-bold text-green-300 uppercase tracking-widest">
              Komunitas Pendengar · ABG Siniar
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
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
            Ruang pura-pura produktif sejak hari pertama.
          </p>
          <h1 className="text-5xl font-extrabold text-white leading-[1.05] tracking-tight">
            Selamat datang,{" "}
            <span className="text-yellow-400">Para Pekerja.</span>
          </h1>
        </div>
        <div className="w-full h-px bg-green-500 mb-8" />
        <div className="flex items-end justify-between gap-12">
          <p className="text-green-200 text-sm leading-relaxed max-w-sm">
            Absen tiap hari, kirim kerjaan absurd, vote siapa yang paling benar,
            dan arsipkan quote terbaik dari setiap episode.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollTo("attendance")}
              className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors duration-150"
            >
              <ClipboardCheck size={13} strokeWidth={2.5} />
              Absen Sekarang
            </button>
            <button
              onClick={() => scrollTo("jobs")}
              className="flex items-center gap-2 border border-green-400 hover:border-green-300 hover:bg-green-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors duration-150"
            >
              <Briefcase size={13} strokeWidth={2.5} />
              Kerjaan 5 Juta
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
