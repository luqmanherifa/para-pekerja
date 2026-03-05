import { Star, TrendingUp, Clock3 } from "lucide-react";
import { getMoodById, formatRupiah } from "../../data/moods";

function SlipSortToggle({ value, onChange }) {
  return (
    <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => onChange("top")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
          value === "top"
            ? "bg-white text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <TrendingUp size={10} strokeWidth={2.5} />
        Teratas
      </button>
      <button
        onClick={() => onChange("new")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
          value === "new"
            ? "bg-white text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Clock3 size={10} strokeWidth={2.5} />
        Terbaru
      </button>
    </div>
  );
}

export default function FeaturedPayslips({
  featuredPayslips,
  slipSort,
  setSlipSort,
  user,
  moodIcons,
  onVote,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
          Slip Paling Relate
        </p>
        <SlipSortToggle value={slipSort} onChange={setSlipSort} />
      </div>

      {featuredPayslips.length === 0 ? (
        <div className="space-y-2.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 opacity-25">
              <div className="w-6 h-6 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2 bg-gray-100 rounded-full w-2/3" />
                <div className="h-1.5 bg-gray-100 rounded-full w-1/3" />
              </div>
              <div className="w-9 h-7 rounded-lg bg-gray-100" />
            </div>
          ))}
          <p className="text-xs font-normal text-gray-300 italic mt-1">
            Belum ada slip hari ini.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {featuredPayslips.map((slip) => {
            const mood = getMoodById(slip.mood);
            const Icon = moodIcons[mood.icon];
            const hasVoted = slip.voters?.includes(user?.uid);
            const isOwn = slip.uid === user?.uid;
            const cannotVote = isOwn || hasVoted;

            return (
              <div key={slip.id} className="flex items-center gap-2.5">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${mood.active}`}
                >
                  <Icon size={11} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">
                    {slip.displayName}
                  </p>
                  <p className="text-xs font-medium text-green-600">
                    {formatRupiah(slip.payslip?.total)}
                  </p>
                </div>
                <button
                  onClick={() => !cannotVote && onVote(slip.id)}
                  disabled={cannotVote}
                  title={
                    isOwn
                      ? "Tidak bisa vote slip sendiri"
                      : hasVoted
                        ? "Sudah diberi bintang"
                        : "Beri bintang"
                  }
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 ${
                    hasVoted
                      ? "bg-yellow-50 border-yellow-200 text-yellow-500"
                      : cannotVote
                        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 hover:bg-yellow-50"
                  }`}
                >
                  <Star size={10} />
                  <span className="tabular-nums">{slip.voteCount ?? 0}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
