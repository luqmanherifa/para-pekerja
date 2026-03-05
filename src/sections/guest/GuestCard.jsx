import { Star } from "lucide-react";
import { getSpeakerColor } from "../../data/speakers";

export default function GuestCard({
  guest,
  voteCount,
  voters,
  rank,
  user,
  onVote,
  onLoginGate,
}) {
  const color = getSpeakerColor(guest.id);
  const hasVoted = voters?.includes(user?.uid);
  const isTop = rank <= 3;
  const rankLabel =
    rank === 1 ? "①" : rank === 2 ? "②" : rank === 3 ? "③" : `#${rank}`;

  const handleVote = () => {
    if (!user) {
      onLoginGate();
      return;
    }
    if (hasVoted) return;
    onVote(guest.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-6 text-center">
          <span
            className={`text-xs font-bold tabular-nums ${isTop ? color.rank : "text-gray-200"}`}
          >
            {rankLabel}
          </span>
        </div>

        <div
          className={`shrink-0 w-9 h-9 rounded-xl ${color.accent} flex items-center justify-center`}
        >
          <span className="text-white font-bold text-sm leading-none">
            {guest.name.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900">{guest.name}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {guest.episodes.map((ep) => (
              <span
                key={ep}
                className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {ep}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={handleVote}
            disabled={hasVoted}
            title={hasVoted ? "Sudah di-vote" : "Vote guest ini"}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
              hasVoted
                ? `${color.voteLight} border`
                : "border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer"
            }`}
          >
            <Star
              size={11}
              className={hasVoted ? "fill-current" : ""}
              strokeWidth={hasVoted ? 0 : 2}
            />
            <span className="tabular-nums">{voteCount ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
