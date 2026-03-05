import { getSpeakerColor } from "../../data/speakers";

export default function BattleCard({ battle, user, onVote, onLoginGate }) {
  const colorA = getSpeakerColor(battle.speakerAId);
  const colorB = getSpeakerColor(battle.speakerBId);

  const totalVotes = (battle.voteCountA ?? 0) + (battle.voteCountB ?? 0);
  const pctA =
    totalVotes > 0
      ? Math.round(((battle.voteCountA ?? 0) / totalVotes) * 100)
      : 50;
  const pctB = 100 - pctA;

  const votedA = battle.votersA?.includes(user?.uid);
  const votedB = battle.votersB?.includes(user?.uid);
  const hasVoted = votedA || votedB;

  const handleVote = (side) => {
    if (!user) {
      onLoginGate();
      return;
    }
    if (hasVoted) return;
    onVote(battle.id, side);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between px-6 pt-4 pb-3">
        <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
          {battle.episodeLabel}
        </span>
        <span className="text-xs font-normal text-gray-300">
          oleh {battle.submittedBy}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-6 pb-5">
        <div className="flex flex-col gap-3">
          <span
            className={`inline-flex items-center gap-1.5 self-start text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${colorA.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorA.dot}`} />
            {battle.speakerAName}
            {battle.speakerAType === "guest" && (
              <span className="opacity-50 font-normal normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-xs font-normal text-gray-600 leading-relaxed">
            {battle.summaryA}
          </p>
        </div>

        <div className="flex items-center justify-center px-4">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-xs font-bold tracking-widest">
              VS
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-end text-right">
          <span
            className={`inline-flex items-center gap-1.5 self-end text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${colorB.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorB.dot}`} />
            {battle.speakerBName}
            {battle.speakerBType === "guest" && (
              <span className="opacity-50 font-normal normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-xs font-normal text-gray-600 leading-relaxed">
            {battle.summaryB}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
        {totalVotes > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium text-gray-400 tabular-nums w-8 text-right">
              {pctA}%
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorA.bar}`}
                style={{ width: `${pctA}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-400 tabular-nums w-8">
              {pctB}%
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleVote("A")}
            disabled={hasVoted && !votedA}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
              votedA
                ? `${colorA.voteLight} border`
                : hasVoted
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50 cursor-pointer"
            }`}
          >
            {votedA && (
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            )}
            {battle.speakerAName.split(" ")[0]}
            <span className="tabular-nums opacity-60">
              {battle.voteCountA ?? 0}
            </span>
          </button>
          <button
            onClick={() => handleVote("B")}
            disabled={hasVoted && !votedB}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
              votedB
                ? `${colorB.voteLight} border`
                : hasVoted
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50 cursor-pointer"
            }`}
          >
            {votedB && (
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
            )}
            {battle.speakerBName.split(" ")[0]}
            <span className="tabular-nums opacity-60">
              {battle.voteCountB ?? 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
