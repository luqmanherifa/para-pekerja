import { Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { MOODS, getMoodById, formatRupiah } from "../../data/moods";

export default function MoodPicker({
  phase,
  selectedMood,
  submitting,
  myMood,
  myPayslip,
  moodIcons,
  onMoodClick,
  onSubmit,
  onShowPayslip,
}) {
  return (
    <div className="mb-10">
      <div className="mb-5 h-10 flex items-center">
        {phase === "loading" && (
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
            <span className="text-xs font-normal text-gray-400">
              Memeriksa absensi...
            </span>
          </div>
        )}

        {(phase === "guest" || phase === "pick_mood") && (
          <div>
            <p className="text-xs font-bold text-gray-900 leading-tight">
              Kondisi kerja hari ini?
            </p>
            <p className="text-xs font-normal text-gray-400 mt-0.5">
              {phase === "guest"
                ? "Klik kondisi untuk masuk dan absen."
                : "Pilih satu, tidak bisa diubah setelah absen."}
            </p>
          </div>
        )}

        {phase === "done" &&
          (() => {
            const mood = getMoodById(myMood);
            const Icon = moodIcons[mood.icon];
            return (
              <div className="flex items-center gap-3 w-full">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${mood.active}`}
                >
                  <Icon size={15} strokeWidth={2} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <CheckCircle2
                      size={11}
                      className="text-green-600"
                      strokeWidth={2.5}
                    />
                    <p className="text-xs font-medium text-green-600 uppercase tracking-widest">
                      Sudah Absen
                    </p>
                  </div>
                  <p className="text-xs font-bold text-gray-900">
                    {mood.label}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs font-normal text-gray-400">
                    Gaji hari ini
                  </p>
                  <p className="text-xs font-bold text-green-600">
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
            const Icon = moodIcons[mood.icon];
            const isSelected = selectedMood === mood.id;
            const isDone = phase === "done";

            let cls;
            if (isDone && isSelected) cls = `${mood.active} cursor-default`;
            else if (isDone)
              cls = `border-gray-100 bg-gray-50 text-gray-300 opacity-40 cursor-default`;
            else if (isSelected) cls = mood.active;
            else cls = `${mood.pill} cursor-pointer`;

            return (
              <button
                key={mood.id}
                onClick={() => !isDone && onMoodClick(mood.id)}
                disabled={isDone}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${cls}`}
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
          <p className="text-xs font-normal text-gray-500">
            Klik salah satu kondisi di atas untuk masuk dan absen.
          </p>
        </div>
      )}

      {phase === "pick_mood" && (
        <button
          onClick={onSubmit}
          disabled={!selectedMood || submitting}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors"
        >
          {submitting ? (
            <>
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Sparkles size={12} />
              Absen dan Lihat Slip Gaji
            </>
          )}
        </button>
      )}

      {phase === "done" && (
        <button
          onClick={onShowPayslip}
          className="flex items-center gap-2 border border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-400 font-medium text-xs px-4 py-2.5 rounded-xl transition-colors"
        >
          <FileText size={12} />
          Lihat Slip Gaji
        </button>
      )}
    </div>
  );
}
