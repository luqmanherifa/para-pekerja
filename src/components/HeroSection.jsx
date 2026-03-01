import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Users, Zap, ClipboardCheck, Briefcase } from "lucide-react";

export default function HeroSection() {
  const [totalMembers, setTotalMembers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);

  useEffect(() => {
    const unsubTotal = onSnapshot(collection(db, "users"), (snap) => {
      setTotalMembers(snap.size);
    });

    const since = Timestamp.fromDate(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
    );
    const activeQuery = query(
      collection(db, "users"),
      where("lastActiveAt", ">=", since),
    );
    const unsubActive = onSnapshot(activeQuery, (snap) => {
      setActiveToday(snap.size);
    });

    return () => {
      unsubTotal();
      unsubActive();
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="w-full bg-gradient-to-br from-green-600 to-green-700">
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="flex items-end justify-between gap-12">
          <div className="flex-1 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              <Zap size={11} strokeWidth={2.5} />
              Komunitas Pendengar · ABG Siniar
            </div>

            <h1 className="text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
              Selamat datang,
              <br />
              <span className="text-yellow-400">Para Pekerja.</span>
            </h1>

            <p className="text-green-100 text-base leading-relaxed mb-8 max-w-md">
              Ini bukan tempat kerja beneran. Tapi kamu tetap perlu absen, kirim
              kerjaan absurd, dan vote siapa yang paling benar.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollTo("absensi")}
                className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-700 font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150"
              >
                <ClipboardCheck size={16} />
                Absen Sekarang
              </button>
              <button
                onClick={() => scrollTo("kerjaan")}
                className="flex items-center gap-2 border border-green-400 hover:border-yellow-400 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors duration-150"
              >
                <Briefcase size={16} />
                Kerjaan 5 Juta
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-60 shrink-0">
            <div className="border border-green-500 rounded-2xl px-6 py-5 bg-green-700 bg-opacity-60">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-green-200 uppercase tracking-widest">
                  Total Pekerja
                </p>
                <div className="p-1.5 bg-green-800 rounded-lg">
                  <Users size={13} className="text-white" />
                </div>
              </div>
              <p className="text-4xl font-extrabold text-white tracking-tight">
                {totalMembers.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-green-200 mt-1">anggota terdaftar</p>
            </div>

            <div className="border border-yellow-400 rounded-2xl px-6 py-5 bg-yellow-400 bg-opacity-20">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-yellow-300 uppercase tracking-widest">
                  Aktif Hari Ini
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-xs text-yellow-300 font-medium">
                    langsung
                  </span>
                </div>
              </div>
              <p className="text-4xl font-extrabold text-yellow-400 tracking-tight">
                {activeToday.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-yellow-300 mt-1">
                pekerja dalam 24 jam terakhir
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
