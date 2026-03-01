import { Link } from "react-router-dom";
import { Star, LogIn } from "lucide-react";
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
    <div className="group bg-white border border-gray-200 rounded-3xl px-6 py-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center gap-5">
        <div className="shrink-0 w-8 text-center">
          <span
            className={`text-lg font-extrabold tabular-nums ${isTop ? color.rank : "text-gray-200"}`}
          >
            {rankLabel}
          </span>
        </div>
        <div
          className={`shrink-0 w-12 h-12 rounded-2xl ${color.accent} flex items-center justify-center`}
        >
          <span className="text-white font-extrabold text-lg leading-none">
            {guest.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-gray-900">{guest.name}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {guest.episodes.map((ep) => (
              <span
                key={ep}
                className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
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
            className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-150 ${
              hasVoted
                ? `${color.voteLight} border`
                : !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : `${color.vote} text-white border-transparent`
            }`}
          >
            <Star
              size={13}
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

      <section
        id="guest-ranking"
        className="w-full bg-white border-t-4 border-gray-200"
      >
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <Star size={12} strokeWidth={2.5} />
                Peringkat Tamu
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Tamu Terbaik
                <br />
                <span className="text-green-600">Versi Para Pekerja</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                Vote guest favoritmu. Ranking ditentukan sepenuhnya oleh
                komunitas.
              </p>
            </div>
            {totalVotes > 0 && (
              <div className="shrink-0 text-right">
                <p className="text-3xl font-extrabold text-gray-900">
                  {totalVotes.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">total vote</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-3xl px-6 py-5 animate-pulse"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-8 h-6 bg-gray-100 rounded" />
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded-full w-32" />
                        <div className="h-3 bg-gray-100 rounded-full w-20" />
                      </div>
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl shrink-0" />
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
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-green-600 font-bold hover:underline"
              >
                <LogIn size={12} />
                Masuk
              </Link>
              <span>untuk vote guest favoritmu.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
