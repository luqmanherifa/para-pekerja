import { MessageSquareQuote, Plus } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
  SectionButton,
} from "../../components/SectionComponents";
import { useQuotes } from "../../hooks/useQuotes";
import LoginGateModal from "../../components/LoginGateModal";
import SubmitModal from "./SubmitModal";
import QuoteCard from "./QuoteCard";
import EpisodeTabs from "./EpisodeTabs";
import SpeakerFilter from "./SpeakerFilter";
import QuoteSortToggle from "./QuoteSortToggle";

export default function QuoteSection() {
  const {
    user,
    activeEpisode,
    quotes,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    totalQuotes,
    quoteSort,
    isEmpty,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
    setQuoteSort,
    submitQuote,
    voteQuote,
    openSubmitModal,
  } = useQuotes();

  return (
    <>
      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={submitQuote}
          submitting={submitting}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <SeparatorBar />

      <section id="kutipan" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <SectionHeader icon={MessageSquareQuote} label="Quote Battle">
            {totalQuotes[activeEpisode.id] > 0 && (
              <SectionCounter
                label="Quote terkumpul"
                value={totalQuotes[activeEpisode.id]}
              />
            )}
          </SectionHeader>

          <SectionTitle
            title="Arsip Quote Para Pekerja"
            subtitle="Kumpulkan momen terbaik dari tiap episode. Satu quote, satu vote."
          >
            <SectionButton onClick={openSubmitModal} icon={Plus}>
              Tambah Quote
            </SectionButton>
          </SectionTitle>

          <EpisodeTabs
            activeEpisode={activeEpisode}
            totalQuotes={totalQuotes}
            onSelect={setActiveEpisode}
          />

          {!loading && !isEmpty && <SpeakerFilter quotes={quotes} />}

          {!isEmpty && !loading && (
            <div className="flex justify-end mb-4">
              <QuoteSortToggle value={quoteSort} onChange={setQuoteSort} />
            </div>
          )}

          <div className="flex flex-col gap-2.5">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl px-6 py-5 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-5 h-4 bg-gray-100 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded-full w-24" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                    <div className="w-10 h-12 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))
            ) : isEmpty ? (
              <div className="border border-dashed border-gray-200 rounded-2xl px-8 py-14 text-center">
                <MessageSquareQuote
                  size={26}
                  className="text-gray-200 mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-xs font-bold text-gray-400 mb-1">
                  Belum ada quote untuk episode ini.
                </p>
                <p className="text-xs font-normal text-gray-300 mb-5">
                  Jadilah yang pertama mengarsipkan momen terbaik.
                </p>
                <button
                  onClick={openSubmitModal}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={12} />
                  Tambah Quote Pertama
                </button>
              </div>
            ) : (
              quotes.map((quote, index) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  user={user}
                  onVote={voteQuote}
                  onLoginGate={() => setShowLoginGate(true)}
                  rank={index + 1}
                />
              ))
            )}
          </div>

          {!user && <LoginNudge text="untuk submit quote dan ikut vote." />}
        </div>
      </section>
    </>
  );
}
