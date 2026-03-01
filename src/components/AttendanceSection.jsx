import {
  Zap,
  Coffee,
  BatteryLow,
  Target,
  Tv2,
  Umbrella,
  AlertTriangle,
  Ghost,
  ThumbsUp,
  FileText,
  Sparkles,
  X,
  ClipboardCheck,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAttendance } from "../hooks/useAttendance";
import LoginGateModal from "./LoginGateModal";
import {
  MOODS,
  GHOST_ATTENDEES,
  AMBIENT_TEXT,
  getMoodById,
  formatRupiah,
} from "../data/moods";
import { useState } from "react";

const MOOD_ICONS = {
  Zap,
  Coffee,
  BatteryLow,
  Target,
  Tv2,
  Umbrella,
  AlertTriangle,
  Ghost,
};

function PayslipModal({ payslip, moodId, onClose }) {
  const mood = getMoodById(moodId);
  const Icon = MOOD_ICONS[mood.icon];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
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

        <div className="bg-green-600 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg bg-green-500/40 text-green-100 hover:bg-green-500/70 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-md bg-yellow-400 flex items-center justify-center">
              <Icon size={11} className="text-gray-900" strokeWidth={2.5} />
            </div>
            <span className="text-green-200 text-[10px] font-bold uppercase tracking-widest">
              Slip Gaji Imajiner
            </span>
          </div>
          <p className="text-white font-black text-lg leading-tight">
            PT. Para Pekerja Indonesia
          </p>
          <p className="text-green-300 text-[11px] mt-1">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex h-4 bg-gray-50 items-center overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-white shrink-0 border border-gray-200"
              style={{ marginLeft: i === 0 ? 0 : "-2px" }}
            />
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-200">
            <span className="text-xs text-gray-500">Gaji Pokok</span>
            <span className="text-xs font-bold text-gray-900">
              {formatRupiah(payslip.base)}
            </span>
          </div>
          {payslip.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-start py-2.5 border-b border-dashed border-gray-100 gap-4"
            >
              <span className="text-[11px] text-gray-500 leading-snug flex-1">
                {item.label}
              </span>
              <span
                className={`text-[11px] font-bold shrink-0 ${item.amount >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                {item.amount >= 0 ? "+" : ""}Rp{" "}
                {Math.abs(item.amount).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
            <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest mb-1">
              Catatan HR
            </p>
            <p className="text-[11px] text-yellow-800 leading-relaxed italic">
              "{payslip.hrNote}"
            </p>
          </div>
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-dashed border-gray-300">
            <span className="text-xs font-bold text-gray-900">
              Total Diterima
            </span>
            <span className="text-xl font-black text-green-600">
              {formatRupiah(payslip.total)}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
          >
            Tutup Slip
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AttendanceSection() {
  const {
    user,
    phase,
    selectedMood,
    submitting,
    myPayslip,
    myMood,
    showPayslipModal,
    attendees,
    dailyStats,
    totalToday,
    featuredPayslips,
    dominantMood,
    setShowPayslipModal,
    submitAttendance,
    votePayslip,
    handleMoodClick,
  } = useAttendance();

  const [showLoginGate, setShowLoginGate] = useState(false);

  const isGhost = attendees.length === 0;
  const displayAttendees = isGhost ? GHOST_ATTENDEES : attendees;
  const ambientText = AMBIENT_TEXT[dominantMood] ?? AMBIENT_TEXT.default;

  const handleMoodClickWrapped = (moodId) => {
    if (phase === "guest") setShowLoginGate(true);
    else handleMoodClick(moodId);
  };

  return (
    <>
      {showPayslipModal && myPayslip && (
        <PayslipModal
          payslip={myPayslip}
          moodId={myMood}
          onClose={() => setShowPayslipModal(false)}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <div className="w-full h-1 bg-yellow-400" />

      <section id="attendance" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <ClipboardCheck
                size={13}
                className="text-green-600"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Absensi Harian
              </span>
            </div>
            <div className="flex items-center gap-3">
              {totalToday > 0 && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Sudah absen
                    </span>
                    <span className="text-sm font-black text-gray-900 tabular-nums">
                      {totalToday.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {dominantMood && (
                    <>
                      <div className="w-px h-3.5 bg-gray-200" />
                      <span className="text-[11px] text-gray-400 italic">
                        {ambientText}
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mb-8 gap-6">
            <div>
              <p className="text-base font-black text-gray-900 leading-tight">
                Kondisi Kerja Hari Ini
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Pilih mood, absen, dan dapatkan slip gaji imajiner kamu hari
                ini.
              </p>
            </div>
            {phase === "done" && (
              <button
                onClick={() => setShowPayslipModal(true)}
                className="flex items-center gap-2 border border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
              >
                <FileText size={12} />
                Lihat Slip Gaji
              </button>
            )}
          </div>

          <div
            className="mb-10 overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex items-center gap-2 pb-1">
              {displayAttendees.map((a) => {
                const mood = getMoodById(a.mood);
                const Icon = MOOD_ICONS[mood.icon];
                return (
                  <div
                    key={a.id}
                    className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 shrink-0 transition-all duration-200 ${
                      isGhost
                        ? "opacity-20 border-gray-200 select-none"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${mood.active}`}
                    >
                      <Icon size={9} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-700 whitespace-nowrap">
                      {a.displayName}
                    </span>
                  </div>
                );
              })}
              <span className="text-[11px] text-gray-300 whitespace-nowrap pl-1 shrink-0">
                {isGhost ? "Jadilah yang pertama ✦" : "· · ·"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-10">
            <div className="col-span-3">
              <div className="mb-5 h-10 flex items-center">
                {phase === "loading" && (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
                    <span className="text-xs text-gray-400">
                      Memeriksa absensi...
                    </span>
                  </div>
                )}
                {(phase === "guest" || phase === "pick_mood") && (
                  <div>
                    <p className="text-xs font-black text-gray-900 leading-tight">
                      Kondisi kerja hari ini?
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {phase === "guest"
                        ? "Klik mood untuk masuk dan absen."
                        : "Pilih satu — tidak bisa diubah setelah absen."}
                    </p>
                  </div>
                )}
                {phase === "done" &&
                  (() => {
                    const mood = getMoodById(myMood);
                    const Icon = MOOD_ICONS[mood.icon];
                    return (
                      <div className="flex items-center gap-3 w-full">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${mood.active}`}
                        >
                          <Icon size={15} strokeWidth={2} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">
                            Sudah Absen ✓
                          </p>
                          <p className="text-xs font-black text-gray-900">
                            {mood.label}
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="text-[10px] text-gray-400">
                            Gaji hari ini
                          </p>
                          <p className="text-xs font-black text-green-600">
                            {formatRupiah(myPayslip?.total)}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
              </div>

              {phase === "loading" ? (
                <div className="flex flex-wrap gap-2 mb-5">
                  {MOODS.map((m) => (
                    <div
                      key={m.id}
                      className="h-7 w-32 rounded-lg bg-gray-100 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-5">
                  {MOODS.map((mood) => {
                    const Icon = MOOD_ICONS[mood.icon];
                    const isSelected = selectedMood === mood.id;
                    const isDone = phase === "done";

                    let cls;
                    if (isDone && isSelected)
                      cls = `${mood.active} cursor-default`;
                    else if (isDone)
                      cls = `border-gray-100 bg-gray-50 text-gray-300 opacity-40 cursor-default`;
                    else if (isSelected) cls = mood.active;
                    else cls = `${mood.pill} cursor-pointer`;

                    return (
                      <button
                        key={mood.id}
                        onClick={() =>
                          !isDone && handleMoodClickWrapped(mood.id)
                        }
                        disabled={isDone}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${cls}`}
                      >
                        <Icon size={12} strokeWidth={2} className="shrink-0" />
                        {mood.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {phase === "guest" && (
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                  <p className="text-[11px] text-gray-500">
                    Klik salah satu mood di atas untuk masuk dan absen.
                  </p>
                </div>
              )}
              {phase === "pick_mood" && (
                <button
                  onClick={submitAttendance}
                  disabled={!selectedMood || submitting}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <Sparkles size={12} />
                      Absen & Lihat Slip Gaji
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="col-span-2 flex flex-col gap-7">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Suasana Kantor
                </p>
                <div className="space-y-2.5">
                  {MOODS.map((m) => {
                    const count = dailyStats[m.id] ?? 0;
                    const pct =
                      totalToday > 0
                        ? Math.round((count / totalToday) * 100)
                        : 0;
                    const Icon = MOOD_ICONS[m.icon];
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-2.5 transition-opacity ${count === 0 ? "opacity-20" : ""}`}
                      >
                        <Icon
                          size={11}
                          className="text-gray-400 shrink-0"
                          strokeWidth={2}
                        />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${m.bar}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 w-4 text-right tabular-nums">
                          {count > 0 ? count : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {totalToday === 0 && (
                  <p className="text-[11px] text-gray-300 mt-3 italic">
                    Belum ada yang absen hari ini.
                  </p>
                )}
              </div>

              <div className="w-full h-px bg-gray-100" />

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Slip Paling Relate
                </p>
                {featuredPayslips.length === 0 ? (
                  <div className="space-y-2.5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 opacity-25"
                      >
                        <div className="w-6 h-6 rounded-lg bg-gray-100" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2 bg-gray-100 rounded-full w-2/3" />
                          <div className="h-1.5 bg-gray-100 rounded-full w-1/3" />
                        </div>
                        <div className="w-9 h-7 rounded-lg bg-gray-100" />
                      </div>
                    ))}
                    <p className="text-[11px] text-gray-300 italic mt-1">
                      Belum ada slip hari ini.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {featuredPayslips.map((slip) => {
                      const mood = getMoodById(slip.mood);
                      const Icon = MOOD_ICONS[mood.icon];
                      const hasVoted = slip.voters?.includes(user?.uid);
                      const isOwn = slip.uid === user?.uid;
                      const cannotVote = isOwn || hasVoted || !user;
                      return (
                        <div
                          key={slip.id}
                          className="flex items-center gap-2.5"
                        >
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${mood.active}`}
                          >
                            <Icon size={11} strokeWidth={2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-bold text-gray-800 truncate">
                              {slip.displayName}
                            </p>
                            <p className="text-[10px] font-semibold text-green-600">
                              {formatRupiah(slip.total)}
                            </p>
                          </div>
                          <button
                            onClick={() => !cannotVote && votePayslip(slip.id)}
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
                            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-[10px] font-bold transition-all shrink-0 ${
                              hasVoted
                                ? "bg-green-50 border-green-200 text-green-600"
                                : cannotVote
                                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                                  : "border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <ThumbsUp size={10} />
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

          {phase === "guest" && (
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-green-600 font-bold hover:underline"
              >
                <LogIn size={11} />
                Masuk
              </Link>
              <span>untuk absen dan dapatkan slip gaji imajiner.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
