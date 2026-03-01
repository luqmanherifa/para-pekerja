import { Star } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
} from "./SectionComponents";
import { useGuest } from "../hooks/useGuest";
import LoginGateModal from "./LoginGateModal";
import { getSpeakerColor } from "../data/speakers";
import { useState } from "react";

function GuestCard({ guest, voteCount, voters, rank, user, onVote }) {
  const color = getSpeakerColor(guest.id);
  const hasVoted = voters?.includes(user?.uid);
  const canVote = !!user && !hasVoted;

  const rankLabel =
    rank === 1 ? "①" : rank === 2 ? "②" : rank === 3 ? "③" : `#${rank}`;
  const isTop = rank <= 3;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-6 py-4 hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center gap-4">
        <div className="shrink-0 w-6 text-center">
          <span
            className={`text-xs font-black tabular-nums ${isTop ? color.rank : "text-gray-200"}`}
          >
            {rankLabel}
          </span>
        </div>
        <div
          className={`shrink-0 w-9 h-9 rounded-xl ${color.accent} flex items-center justify-center`}
        >
          <span className="text-white font-black text-sm leading-none">
            {guest.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-gray-900">{guest.name}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {guest.episodes.map((ep) => (
              <span
                key={ep}
                className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
              >
                {ep}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => canVote && onVote(guest.id)}
            disabled={!canVote}
            title={!user ? "Masuk untuk vote" : hasVoted ? "Sudah di-vote" : ""}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${
              hasVoted
                ? `${color.voteLight} border`
                : !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : `${color.vote} text-white border-transparent`
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

export default function GuestSection() {
  const { user, guestData, loading, rankedGuests, totalVotes, voteGuest } =
    useGuest();
  const [showLoginGate, setShowLoginGate] = useState(false);

  const handleVote = (guestId) => {
    if (!user) {
      setShowLoginGate(true);
      return;
    }
    voteGuest(guestId);
  };

  return (
    <>
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <SeparatorBar color="gray" />

      <section id="guest-ranking" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <SectionHeader icon={Star} label="Peringkat Tamu">
            {totalVotes > 0 && (
              <SectionCounter label="Total vote" value={totalVotes} />
            )}
          </SectionHeader>

          <SectionTitle
            title="Tamu Terbaik Versi Para Pekerja"
            subtitle="Vote guest favoritmu. Ranking ditentukan sepenuhnya oleh komunitas."
          />

          <div className="flex flex-col gap-2.5">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 rounded-2xl px-6 py-4 animate-pulse"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-4 bg-gray-100 rounded" />
                      <div className="w-9 h-9 bg-gray-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-100 rounded-full w-28" />
                        <div className="h-2.5 bg-gray-100 rounded-full w-16" />
                      </div>
                      <div className="w-12 h-12 bg-gray-100 rounded-xl shrink-0" />
                    </div>
                  </div>
                ))
              : rankedGuests.map((guest, index) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    voteCount={guestData[guest.id]?.voteCount ?? 0}
                    voters={guestData[guest.id]?.voters ?? []}
                    rank={index + 1}
                    user={user}
                    onVote={handleVote}
                  />
                ))}
          </div>

          {!user && !loading && (
            <LoginNudge text="untuk vote guest favoritmu." />
          )}
        </div>
      </section>
    </>
  );
}
