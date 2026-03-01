import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  increment,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import {
  Zap,
  Coffee,
  BatteryLow,
  Target,
  Tv2,
  Umbrella,
  AlertTriangle,
  CheckCircle2,
  Users,
  ThumbsUp,
  X,
  FileText,
  Sparkles,
  Ghost,
} from "lucide-react";

const getTodayDate = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

const formatRupiah = (n) => `Rp ${(n ?? 0).toLocaleString("id-ID")}`;

const MOODS = [
  {
    id: "productive",
    label: "Produktif Total",
    icon: Zap,
    pill: "bg-green-50 text-green-700 border-green-200 hover:border-green-400",
    active: "bg-green-600 text-white border-green-600",
    bar: "bg-green-500",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: "chill",
    label: "Santai tapi Jalan",
    icon: Coffee,
    pill: "bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-400",
    active: "bg-sky-500 text-white border-sky-500",
    bar: "bg-sky-400",
    badge: "bg-sky-100 text-sky-700",
  },
  {
    id: "low_energy",
    label: "Low Energy",
    icon: BatteryLow,
    pill: "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400",
    active: "bg-gray-600 text-white border-gray-600",
    bar: "bg-gray-400",
    badge: "bg-gray-100 text-gray-600",
  },
  {
    id: "focus",
    label: "Fokus, Jangan Ganggu",
    icon: Target,
    pill: "bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-400",
    active: "bg-amber-500 text-white border-amber-500",
    bar: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    id: "watching",
    label: "Kerja Sambil Nonton",
    icon: Tv2,
    pill: "bg-violet-50 text-violet-700 border-violet-200 hover:border-violet-400",
    active: "bg-violet-500 text-white border-violet-500",
    bar: "bg-violet-400",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    id: "freelance",
    label: "Freelancer Mode",
    icon: Umbrella,
    pill: "bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400",
    active: "bg-orange-500 text-white border-orange-500",
    bar: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    id: "survival",
    label: "Survival Mode",
    icon: AlertTriangle,
    pill: "bg-red-50 text-red-700 border-red-200 hover:border-red-400",
    active: "bg-red-500 text-white border-red-500",
    bar: "bg-red-400",
    badge: "bg-red-100 text-red-700",
  },
  {
    id: "autopilot",
    label: "Autopilot Mode",
    icon: Ghost,
    pill: "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400",
    active: "bg-slate-600 text-white border-slate-600",
    bar: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600",
  },
];

const getMoodById = (id) => MOODS.find((m) => m.id === id) ?? MOODS[0];

const GHOST_ATTENDEES = [
  { id: "g1", displayName: "Arif Brata", mood: "productive" },
  { id: "g2", displayName: "Bintang Emon", mood: "chill" },
  { id: "g3", displayName: "Gilang Bhaskara", mood: "focus" },
  { id: "g4", displayName: "Adi Arkiang", mood: "watching" },
  { id: "g5", displayName: "Pandji Pragiwaksono", mood: "freelance" },
  { id: "g6", displayName: "Raditya Dika", mood: "survival" },
  { id: "g7", displayName: "Arif Brata", mood: "low_energy" },
  { id: "g8", displayName: "Bintang Emon", mood: "autopilot" },
];

const PAYSLIP_DATA = {
  productive: {
    items: [
      { label: "Bonus Semangat Pagi", amount: 250000 },
      { label: "Insentif Kamera Menyala saat Meeting", amount: 175000 },
      { label: "Potongan Overthinking Deadline", amount: -75000 },
    ],
    hrNote:
      "Kinerja hari ini patut diapresiasi. Pertahankan — meski kita semua tahu besok mungkin berbeda.",
  },
  chill: {
    items: [
      { label: "Bonus Tidak Panik", amount: 200000 },
      { label: "Insentif Mengalir Apa Adanya", amount: 100000 },
      { label: "Potongan Terlalu Santai di Jam Sibuk", amount: -50000 },
    ],
    hrNote:
      "Santai memang pilihan hidup. HR mencatat kehadiran, bukan kegelisahan kamu.",
  },
  low_energy: {
    items: [
      { label: "Tunjangan Tetap Masuk Kerja", amount: 100000 },
      { label: "Apresiasi Buka Laptop Walau Berat", amount: 75000 },
      { label: "Potongan Semangat Tertinggal di Kasur", amount: -150000 },
      { label: "Potongan Sering Lihat Jam", amount: -50000 },
    ],
    hrNote:
      "HR memahami. Terkadang hadir secara fisik sudah merupakan prestasi tersendiri.",
  },
  focus: {
    items: [
      { label: "Bonus Mode Tidak Terganggu", amount: 300000 },
      { label: "Insentif Notifikasi Dibisukan", amount: 125000 },
      { label: "Potongan Lupa Makan Siang", amount: -25000 },
    ],
    hrNote:
      "HR menghormati ketenangan kamu hari ini. Pintu HR juga dikunci untuk kamu.",
  },
  watching: {
    items: [
      { label: "Bonus Multitasking Profesional", amount: 200000 },
      { label: "Insentif Tidak Tertangkap Basah", amount: 150000 },
      { label: "Potongan Produktivitas Terbagi", amount: -200000 },
      { label: "Potongan Rewind 3 Menit karena Tidak Fokus", amount: -75000 },
    ],
    hrNote:
      "HR tidak bertanya. HR juga sedang menonton sesuatu saat menulis catatan ini.",
  },
  freelance: {
    items: [
      { label: "Bonus Kebebasan Waktu", amount: 350000 },
      { label: "Insentif Tidak Ada yang Mengawasi", amount: 200000 },
      { label: "Potongan Batas Waktu Ambigu", amount: -100000 },
      { label: "Potongan Tidak Ada BPJS", amount: -125000 },
    ],
    hrNote:
      "Kebebasan adalah gaji yang tidak tertulis. Tapi ini tetap slip bergaji 5 juta.",
  },
  survival: {
    items: [
      { label: "Tunjangan Bertahan Hidup", amount: 100000 },
      { label: "Bonus Belum Resign", amount: 250000 },
      { label: "Potongan Kekacauan Hari Ini", amount: -200000 },
      { label: "Potongan Energi Habis sejak Senin", amount: -150000 },
    ],
    hrNote:
      "HR melihat kondisi kamu. HR ikut berdoa. Semoga hari ini segera selesai.",
  },
  autopilot: {
    items: [
      { label: "Bonus Tubuh Hadir, Pikiran Entah di Mana", amount: 200000 },
      { label: "Insentif Menjawab Chat Tanpa Membaca", amount: 100000 },
      { label: "Potongan Tidak Ingat Apa yang Dikerjakan", amount: -125000 },
      {
        label: "Potongan Rapat Dihadiri tapi Tidak Didengarkan",
        amount: -75000,
      },
    ],
    hrNote:
      "HR tidak tahu kamu hadir atau tidak. Kamu juga tidak tahu. Sama-sama.",
  },
};

const buildPayslip = (moodId) => {
  const base = 5000000;
  const data = PAYSLIP_DATA[moodId] ?? PAYSLIP_DATA.productive;
  const total = base + data.items.reduce((sum, item) => sum + item.amount, 0);
  return { base, items: data.items, total, hrNote: data.hrNote };
};

const AMBIENT_TEXT = {
  productive: "Kantor hari ini sedang bersemangat.",
  chill: "Suasana santai tapi tetap jalan hari ini.",
  low_energy: "Kantor hari ini sedang tidak baik-baik saja.",
  focus: "Bisukan notifikasi. Kantor sedang serius.",
  watching: "Separuh kantor sedang menonton sesuatu.",
  freelance: "Hari ini mayoritas kerja dari mana saja.",
  survival: "Mode darurat. Bertahanlah.",
  autopilot: "Hari ini kantor berjalan sendiri. Entah siapa yang mengemudikan.",
  default: "Absen dulu sebelum pura-pura kerja.",
};

function LoginNudgeModal({ moodId, onClose }) {
  const mood = getMoodById(moodId);
  const Icon = mood.icon;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "nudgeIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes nudgeIn {
            from { opacity: 0; transform: translateY(32px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className="px-7 pt-7 pb-2">
          <button
            onClick={onClose}
            className="float-right w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${mood.active}`}
          >
            <Icon size={26} strokeWidth={2} />
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Mood Kamu Hari Ini
          </p>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            {mood.label}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Masuk dulu untuk absen dengan mood ini dan dapatkan slip gaji
            imajiner hari ini.
          </p>
        </div>
        <div className="px-7 pb-7 pt-5 flex flex-col gap-2.5">
          <Link
            to="/masuk"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-colors"
          >
            Masuk & Absen Sekarang
          </Link>
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-gray-600 font-semibold text-sm py-2.5 rounded-2xl transition-colors"
          >
            Nanti dulu
          </button>
        </div>
      </div>
    </div>
  );
}

function PayslipModal({ payslip, moodId, onClose }) {
  const mood = getMoodById(moodId);
  const Icon = mood.icon;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slipIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes slipIn {
            from { opacity: 0; transform: translateY(24px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
        <div className="bg-gradient-to-br from-green-600 to-green-700 px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-green-500/40 text-green-100 hover:bg-green-500/70 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-yellow-400 flex items-center justify-center">
              <Icon size={13} className="text-gray-900" strokeWidth={2.5} />
            </div>
            <span className="text-green-200 text-xs font-bold uppercase tracking-widest">
              Slip Gaji Imajiner
            </span>
          </div>
          <p className="text-white font-extrabold text-xl leading-tight">
            PT. Para Pekerja Indonesia
          </p>
          <p className="text-green-300 text-xs mt-1.5">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex h-5 bg-gray-50 items-center overflow-hidden px-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-full bg-white shrink-0 border border-gray-200"
              style={{ marginLeft: i === 0 ? 0 : "-3px" }}
            />
          ))}
        </div>

        <div className="px-7 py-5 bg-gray-50">
          <div className="flex justify-between items-center py-3.5 border-b border-dashed border-gray-200">
            <span className="text-sm text-gray-500">Gaji Pokok</span>
            <span className="text-sm font-bold text-gray-900">
              {formatRupiah(payslip.base)}
            </span>
          </div>
          {payslip.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-start py-3 border-b border-dashed border-gray-100 gap-4"
            >
              <span className="text-xs text-gray-500 leading-snug flex-1">
                {item.label}
              </span>
              <span
                className={`text-xs font-bold shrink-0 ${item.amount >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                {item.amount >= 0 ? "+" : ""}Rp{" "}
                {Math.abs(item.amount).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-4">
            <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest mb-2">
              Catatan HR
            </p>
            <p className="text-xs text-amber-800 leading-relaxed italic">
              "{payslip.hrNote}"
            </p>
          </div>
          <div className="flex justify-between items-center pt-5 mt-2 border-t-2 border-dashed border-gray-300">
            <span className="text-sm font-bold text-gray-900">
              Total Diterima
            </span>
            <span className="text-2xl font-extrabold text-green-600">
              {formatRupiah(payslip.total)}
            </span>
          </div>
        </div>

        <div className="px-7 py-5 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm py-3 rounded-2xl transition-colors"
          >
            Tutup Slip
          </button>
        </div>
      </div>
    </div>
  );
}

function AttendeeCard({ attendee, isGhost }) {
  const mood = getMoodById(attendee.mood);
  const Icon = mood.icon;
  return (
    <div
      className={`flex items-center gap-2 bg-white border rounded-2xl px-3.5 py-2.5 shrink-0 transition-all duration-200 ${isGhost ? "opacity-30 border-gray-200 select-none" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`}
    >
      <div
        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${mood.active}`}
      >
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
        {attendee.displayName}
      </span>
      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${mood.badge}`}
      >
        {mood.label.split(" ")[0]}
      </span>
    </div>
  );
}

function MoodGrid({ phase, selectedMood, onMoodClick }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {MOODS.map((mood) => {
        const Icon = mood.icon;
        const isSelected = selectedMood === mood.id;
        const isDone = phase === "done";

        let className;
        if (isDone && isSelected)
          className = mood.active + " opacity-100 cursor-default";
        else if (isDone) className = mood.pill + " opacity-30 cursor-default";
        else if (isSelected) className = mood.active;
        else className = mood.pill + " cursor-pointer";

        return (
          <button
            key={mood.id}
            onClick={() => !isDone && onMoodClick(mood.id)}
            disabled={isDone}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all duration-150 text-left ${className}`}
          >
            <Icon size={16} strokeWidth={2} className="shrink-0" />
            <span className="leading-tight">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function AttendanceSection() {
  const user = useSelector((s) => s.auth.user);
  const today = getTodayDate();

  const [phase, setPhase] = useState("loading");
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [myPayslip, setMyPayslip] = useState(null);
  const [myMood, setMyMood] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);
  const [loginNudgeMood, setLoginNudgeMood] = useState(null);

  const [attendees, setAttendees] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [totalToday, setTotalToday] = useState(0);
  const [featuredPayslips, setFeaturedPayslips] = useState([]);
  const [dominantMood, setDominantMood] = useState(null);

  useEffect(() => {
    if (!user) {
      setPhase("guest");
      return;
    }
    getDoc(doc(db, "attendance", `${user.uid}_${today}`)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMyMood(data.mood);
        setMyPayslip(data.payslip);
        setSelectedMood(data.mood);
        setPhase("done");
      } else {
        setPhase("pick_mood");
      }
    });
  }, [user, today]);

  useEffect(() => {
    const q = query(
      collection(db, "attendance"),
      where("date", "==", today),
      orderBy("createdAt", "desc"),
      limit(40),
    );
    return onSnapshot(q, (snap) =>
      setAttendees(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [today]);

  useEffect(() => {
    return onSnapshot(doc(db, "daily_stats", today), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setDailyStats(data.moods ?? {});
      setTotalToday(data.total ?? 0);
      const top = Object.entries(data.moods ?? {}).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (top) setDominantMood(top[0]);
    });
  }, [today]);

  useEffect(() => {
    return onSnapshot(doc(db, "daily_featured", today), (snap) => {
      if (snap.exists()) setFeaturedPayslips(snap.data().payslips ?? []);
    });
  }, [today]);

  const handleSubmit = useCallback(async () => {
    if (!user || !selectedMood || submitting) return;
    setSubmitting(true);
    try {
      const payslip = buildPayslip(selectedMood);
      const attendanceRef = doc(db, "attendance", `${user.uid}_${today}`);
      const statsRef = doc(db, "daily_stats", today);
      const featuredRef = doc(db, "daily_featured", today);

      await runTransaction(db, async (tx) => {
        const [statsSnap, featuredSnap] = await Promise.all([
          tx.get(statsRef),
          tx.get(featuredRef),
        ]);

        tx.set(attendanceRef, {
          uid: user.uid,
          displayName:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          mood: selectedMood,
          payslip,
          date: today,
          createdAt: serverTimestamp(),
          voteCount: 0,
          voters: [],
        });

        statsSnap.exists()
          ? tx.update(statsRef, {
              total: increment(1),
              [`moods.${selectedMood}`]: increment(1),
            })
          : tx.set(statsRef, {
              total: 1,
              moods: { [selectedMood]: 1 },
              date: today,
            });

        const entry = {
          id: `${user.uid}_${today}`,
          uid: user.uid,
          displayName:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          mood: selectedMood,
          hrNote: payslip.hrNote,
          total: payslip.total,
          voteCount: 0,
          voters: [],
        };
        const existing = featuredSnap.exists()
          ? (featuredSnap.data().payslips ?? [])
          : [];
        if (!featuredSnap.exists())
          tx.set(featuredRef, { payslips: [entry], date: today });
        else if (existing.length < 5)
          tx.update(featuredRef, { payslips: [...existing, entry] });
      });

      setMyMood(selectedMood);
      setMyPayslip(payslip);
      setPhase("done");
      setShowPayslipModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [user, selectedMood, submitting, today]);

  const handleVote = useCallback(
    async (slipId) => {
      if (!user) return;
      try {
        await runTransaction(db, async (tx) => {
          const featuredRef = doc(db, "daily_featured", today);
          const attendanceRef = doc(db, "attendance", slipId);
          const snap = await tx.get(featuredRef);
          if (!snap.exists()) return;
          const updated = (snap.data().payslips ?? []).map((s) =>
            s.id === slipId && !s.voters?.includes(user.uid)
              ? {
                  ...s,
                  voteCount: (s.voteCount ?? 0) + 1,
                  voters: [...(s.voters ?? []), user.uid],
                }
              : s,
          );
          tx.update(featuredRef, { payslips: updated });
          tx.update(attendanceRef, {
            voteCount: increment(1),
            voters: arrayUnion(user.uid),
          });
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user, today],
  );

  const handleMoodClick = (moodId) => {
    if (phase === "guest") setLoginNudgeMood(moodId);
    else if (phase === "pick_mood") setSelectedMood(moodId);
  };

  const isGhost = attendees.length === 0;
  const displayAttendees = isGhost ? GHOST_ATTENDEES : attendees;
  const ambientText = AMBIENT_TEXT[dominantMood] ?? AMBIENT_TEXT.default;

  return (
    <>
      {showPayslipModal && myPayslip && (
        <PayslipModal
          payslip={myPayslip}
          moodId={myMood}
          onClose={() => setShowPayslipModal(false)}
        />
      )}
      {loginNudgeMood && (
        <LoginNudgeModal
          moodId={loginNudgeMood}
          onClose={() => setLoginNudgeMood(null)}
        />
      )}

      <section id="attendance" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <CheckCircle2 size={12} strokeWidth={2.5} />
                Absensi Harian
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Daftar Hadir
                <span className="text-green-600"> Para Pekerja</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">
                Absen dulu sebelum pura-pura produktif. Reset tiap hari.
              </p>
            </div>
            <div className="shrink-0 text-right hidden sm:block">
              <p className="text-3xl font-extrabold text-gray-900">
                {totalToday > 0 ? totalToday.toLocaleString("id-ID") : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">sudah absen hari ini</p>
              {dominantMood && (
                <p className="text-xs text-gray-500 mt-2.5 italic max-w-[180px] leading-snug">
                  {ambientText}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Users size={13} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Yang sudah masuk hari ini
              </span>
              {isGhost && (
                <span className="text-[10px] text-gray-300 italic ml-1">
                  · preview
                </span>
              )}
            </div>
            <div
              className="flex items-center gap-2.5 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {displayAttendees.map((a) => (
                <AttendeeCard key={a.id} attendee={a} isGhost={isGhost} />
              ))}
              <div className="shrink-0 pl-1">
                <span className="text-xs text-gray-300 whitespace-nowrap">
                  {isGhost ? "Jadilah yang pertama ✦" : "· · ·"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            <div className="lg:col-span-3">
              <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                <div className="px-7 pt-7 pb-5 border-b border-gray-100 min-h-[88px] flex items-center">
                  {phase === "loading" && (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin shrink-0" />
                      <span className="text-sm text-gray-400">
                        Memeriksa absensi kamu...
                      </span>
                    </div>
                  )}
                  {(phase === "guest" || phase === "pick_mood") && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Pilih Mood Kamu
                      </p>
                      <h3 className="text-lg font-extrabold text-gray-900">
                        Kondisi kerja hari ini?
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {phase === "guest"
                          ? "Klik mood untuk masuk dan absen."
                          : "Pilih satu — tidak bisa diubah setelah absen."}
                      </p>
                    </div>
                  )}
                  {phase === "done" &&
                    (() => {
                      const mood = getMoodById(myMood);
                      const Icon = mood.icon;
                      return (
                        <div className="flex items-center gap-4 w-full">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${mood.active}`}
                          >
                            <Icon size={22} strokeWidth={2} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-0.5">
                              Sudah Absen ✓
                            </p>
                            <p className="text-lg font-extrabold text-gray-900">
                              {mood.label}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400">
                              Gaji hari ini
                            </p>
                            <p className="text-lg font-extrabold text-green-600">
                              {formatRupiah(myPayslip?.total)}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                </div>

                <div className="px-7 py-6">
                  {phase === "loading" ? (
                    <div className="grid grid-cols-2 gap-2.5">
                      {MOODS.map((m) => (
                        <div
                          key={m.id}
                          className="h-[54px] rounded-2xl bg-gray-50 animate-pulse"
                        />
                      ))}
                    </div>
                  ) : (
                    <MoodGrid
                      phase={phase}
                      selectedMood={selectedMood}
                      onMoodClick={handleMoodClick}
                    />
                  )}
                </div>

                <div className="px-7 pb-7">
                  {phase === "guest" && (
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                      <p className="text-xs text-gray-500">
                        Klik salah satu mood di atas untuk masuk dan absen.
                      </p>
                    </div>
                  )}
                  {phase === "pick_mood" && (
                    <button
                      onClick={handleSubmit}
                      disabled={!selectedMood || submitting}
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-sm py-4 rounded-2xl transition-colors"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} /> Absen & Lihat Slip Gaji
                        </>
                      )}
                    </button>
                  )}
                  {phase === "done" && (
                    <button
                      onClick={() => setShowPayslipModal(true)}
                      className="flex items-center justify-center gap-2 w-full border-2 border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-500 font-bold text-sm py-4 rounded-2xl transition-colors"
                    >
                      <FileText size={15} />
                      Lihat Slip Gaji Lengkap
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="border border-gray-200 rounded-3xl px-6 py-6 bg-white shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                  Suasana Kantor Hari Ini
                </p>
                <div className="space-y-4">
                  {MOODS.map((m) => {
                    const count = dailyStats[m.id] ?? 0;
                    const percentage =
                      totalToday > 0
                        ? Math.round((count / totalToday) * 100)
                        : 0;
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-3 transition-opacity ${count === 0 ? "opacity-25" : ""}`}
                      >
                        <Icon
                          size={13}
                          className="text-gray-400 shrink-0"
                          strokeWidth={2}
                        />
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${m.bar}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-400 w-5 text-right tabular-nums">
                          {count > 0 ? count : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {totalToday === 0 && (
                  <p className="text-xs text-gray-300 text-center mt-5 italic">
                    Belum ada yang absen hari ini.
                  </p>
                )}
              </div>

              <div className="border border-gray-200 rounded-3xl px-6 py-6 bg-white shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                  Slip Paling Relate
                </p>
                {featuredPayslips.length === 0 ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 opacity-40"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gray-200" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2.5 bg-gray-200 rounded-full w-2/3" />
                          <div className="h-2 bg-gray-200 rounded-full w-1/3" />
                        </div>
                        <div className="w-10 h-9 rounded-xl bg-gray-200" />
                      </div>
                    ))}
                    <p className="text-xs text-gray-300 text-center pt-1 italic">
                      Belum ada slip hari ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {featuredPayslips.map((slip) => {
                      const mood = getMoodById(slip.mood);
                      const Icon = mood.icon;
                      const hasVoted = slip.voters?.includes(user?.uid);
                      const isOwn = slip.uid === user?.uid;
                      const cannotVote = isOwn || hasVoted || !user;

                      return (
                        <div
                          key={slip.id}
                          className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${mood.active}`}
                          >
                            <Icon size={15} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-800 truncate">
                              {slip.displayName}
                            </p>
                            <p className="text-xs font-semibold text-green-600 mt-0.5">
                              {formatRupiah(slip.total)}
                            </p>
                          </div>
                          <button
                            onClick={() => !cannotVote && handleVote(slip.id)}
                            disabled={cannotVote}
                            title={
                              isOwn
                                ? "Tidak bisa vote slip sendiri"
                                : hasVoted
                                  ? "Sudah di-vote"
                                  : !user
                                    ? "Masuk untuk vote"
                                    : ""
                            }
                            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                              hasVoted
                                ? "bg-green-50 border-green-300 text-green-600"
                                : cannotVote
                                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                  : "border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <ThumbsUp size={13} />
                            <span className="tabular-nums">
                              {slip.voteCount ?? 0}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
