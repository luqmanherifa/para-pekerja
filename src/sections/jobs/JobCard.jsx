import { Star } from "lucide-react";

export default function JobCard({
  job,
  user,
  onVote,
  onLoginGate,
  isNew,
  timeAgo,
}) {
  const hasVoted = job.voters_approved?.includes(user?.uid);
  const voteCount = job.approved ?? 0;
  const isOwn = job.uid === user?.uid;

  const handleVote = () => {
    if (!user) {
      onLoginGate();
      return;
    }
    if (isOwn) return;
    onVote(job.id, hasVoted);
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${
        isNew ? "border-green-400" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-2 flex-wrap">
        <p className="text-sm font-bold text-gray-900 leading-snug flex-1">
          {job.title}
        </p>
        {isNew && (
          <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
            baru!
          </span>
        )}
      </div>

      <p className="text-xs font-normal text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {job.description}
      </p>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 truncate">
            {job.submittedBy}
          </p>
          <p className="text-xs font-normal text-gray-300 mt-0.5">
            {timeAgo(job.createdAt)}
          </p>
        </div>

        <button
          onClick={handleVote}
          disabled={isOwn && !!user}
          title={
            isOwn && user
              ? "Tidak bisa vote sendiri"
              : hasVoted
                ? "Batalkan vote"
                : "Vote layak 5 juta"
          }
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
            hasVoted
              ? "bg-yellow-50 border-yellow-300 text-yellow-500"
              : isOwn && user
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer"
          }`}
        >
          <Star
            size={11}
            strokeWidth={2}
            className={hasVoted ? "fill-yellow-400" : ""}
          />
          <span className="tabular-nums">{voteCount}</span>
        </button>
      </div>
    </div>
  );
}
