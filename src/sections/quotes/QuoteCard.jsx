import { Star } from "lucide-react";
import { getSpeakerColor } from "../../data/speakers";

export default function QuoteCard({ quote, user, onVote, onLoginGate, rank }) {
  const color = getSpeakerColor(quote.speakerId);
  const hasVoted = quote.voters?.includes(user?.uid);
  const isOwn = user && quote.uid === user.uid;

  const handleVote = () => {
    if (!user) {
      onLoginGate();
      return;
    }
    if (isOwn) return;
    onVote(quote.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 hover:border-gray-300 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-5 text-center pt-0.5">
          <span
            className={`text-xs font-bold tabular-nums ${rank <= 3 ? "text-yellow-500" : "text-gray-300"}`}
          >
            {rank <= 3 ? ["①", "②", "③"][rank - 1] : rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${color.light}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
              {quote.speakerName}
              {quote.speakerType === "guest" && (
                <span className="opacity-50 font-medium normal-case tracking-normal">
                  · tamu
                </span>
              )}
            </span>
            <span className="text-xs font-normal text-gray-300">
              {quote.episodeLabel}
            </span>
          </div>
          <p className="text-xs font-normal text-gray-700 leading-relaxed italic mb-2">
            "{quote.text}"
          </p>
          <p className="text-xs font-normal text-gray-300">
            oleh {quote.submittedBy}
          </p>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleVote}
            disabled={isOwn}
            title={
              isOwn
                ? "Tidak bisa vote quote sendiri"
                : hasVoted
                  ? "Batalkan vote"
                  : "Vote quote ini"
            }
            className={`flex flex-col items-center gap-1 px-2.5 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
              hasVoted
                ? "bg-yellow-50 border-yellow-300 text-yellow-500"
                : isOwn
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer"
            }`}
          >
            <Star
              size={11}
              strokeWidth={2}
              className={hasVoted ? "fill-yellow-400" : ""}
            />
            <span className="tabular-nums">{quote.voteCount ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
