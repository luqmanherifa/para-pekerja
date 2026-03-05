import { useState } from "react";
import { Star } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
} from "../../components/SectionComponents";
import { useGuest } from "../../hooks/useGuest";
import LoginGateModal from "../../components/LoginGateModal";
import GuestCard from "./GuestCard";

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

      <SeparatorBar />

      <section id="tamu" className="w-full bg-white">
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
                    onLoginGate={() => setShowLoginGate(true)}
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
