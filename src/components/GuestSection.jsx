import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  runTransaction,
  increment,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { Star, LogIn } from "lucide-react";

const GUESTS = [
  { id: "adi", name: "Adi Arkiang", episodes: ["Episode 1", "Episode 3"] },
  { id: "pandji", name: "Pandji Pragiwaksono", episodes: ["Episode 2"] },
  { id: "raditya", name: "Raditya Dika", episodes: ["Episode 4", "Episode 5"] },
];

const GUEST_COLORS = {
  adi: {
    accent: "bg-violet-500",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    vote: "bg-violet-500 hover:bg-violet-600",
    voteLight: "bg-violet-50 border-violet-300 text-violet-700",
    bar: "bg-violet-400",
    rank: "text-violet-500",
  },
  pandji: {
    accent: "bg-orange-500",
    light: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    vote: "bg-orange-500 hover:bg-orange-600",
    voteLight: "bg-orange-50 border-orange-300 text-orange-700",
    bar: "bg-orange-400",
    rank: "text-orange-500",
  },
  raditya: {
    accent: "bg-rose-500",
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    vote: "bg-rose-500 hover:bg-rose-600",
    voteLight: "bg-rose-50 border-rose-300 text-rose-700",
    bar: "bg-rose-400",
    rank: "text-rose-500",
  },
};

const getColor = (id) =>
  GUEST_COLORS[id] ?? {
    accent: "bg-gray-500",
    light: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    vote: "bg-gray-500 hover:bg-gray-600",
    voteLight: "bg-gray-50 border-gray-300 text-gray-700",
    bar: "bg-gray-400",
    rank: "text-gray-400",
  };

function GuestCard({ guest, voteCount, voters, rank, user, onVote }) {
  const color = getColor(guest.id);
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
            className={`text-lg font-extrabold tabular-nums ${
              isTop ? color.rank : "text-gray-200"
            }`}
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

        <div className="shrink-0 flex flex-col items-center gap-1.5">
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
  const user = useSelector((s) => s.auth.user);
  const [guestData, setGuestData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs = GUESTS.map((g) => {
      const ref = doc(db, "guest_rankings", g.id);
      return onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          setGuestData((prev) => ({ ...prev, [g.id]: snap.data() }));
        } else {
          setGuestData((prev) => ({
            ...prev,
            [g.id]: { voteCount: 0, voters: [] },
          }));
        }
        setLoading(false);
      });
    });
    return () => unsubs.forEach((u) => u());
  }, []);

  const handleVote = useCallback(
    async (guestId) => {
      if (!user) return;
      try {
        const ref = doc(db, "guest_rankings", guestId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (snap.exists() && snap.data().voters?.includes(user.uid)) return;
          if (snap.exists()) {
            tx.update(ref, {
              voteCount: increment(1),
              voters: arrayUnion(user.uid),
            });
          } else {
            tx.set(ref, {
              guestId,
              voteCount: 1,
              voters: [user.uid],
              createdAt: serverTimestamp(),
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const ranked = [...GUESTS].sort((a, b) => {
    const va = guestData[a.id]?.voteCount ?? 0;
    const vb = guestData[b.id]?.voteCount ?? 0;
    return vb - va;
  });

  const totalVotes = Object.values(guestData).reduce(
    (sum, d) => sum + (d?.voteCount ?? 0),
    0,
  );

  return (
    <section
      id="guest-ranking"
      className="w-full bg-gradient-to-br from-green-600 to-green-700 border-t-4 border-green-500"
    >
      <div className="max-w-5xl mx-auto px-8 py-20">
        <div className="flex items-start justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-500/40 text-green-100 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              <Star size={12} strokeWidth={2.5} />
              Peringkat Tamu
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Tamu Terbaik
              <br />
              <span className="text-yellow-400">Versi Para Pekerja</span>
            </h2>
            <p className="text-green-100 text-sm mt-2 max-w-xs leading-relaxed">
              Vote guest favoritmu. Ranking ditentukan sepenuhnya oleh
              komunitas.
            </p>
          </div>

          {totalVotes > 0 && (
            <div className="shrink-0 text-right">
              <p className="text-3xl font-extrabold text-white">
                {totalVotes.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-green-200 mt-0.5">total vote</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl px-6 py-5 animate-pulse"
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
            : ranked.map((guest, index) => (
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
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-green-200">
            <Link
              to="/masuk"
              className="inline-flex items-center gap-1.5 text-yellow-400 font-bold hover:underline"
            >
              <LogIn size={12} />
              Masuk
            </Link>
            <span>untuk vote guest favoritmu.</span>
          </div>
        )}
      </div>
    </section>
  );
}
