import { useState } from "react";
import {
  MessageSquareQuote,
  Star,
  Plus,
  X,
  Send,
  ChevronDown,
  TrendingUp,
  Clock3,
} from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
  SectionButton,
} from "./SectionComponents";
import { useQuotes } from "../hooks/useQuotes";
import LoginGateModal from "./LoginGateModal";
import { EPISODES } from "../data/episodes";
import { HOSTS, GUESTS, getSpeakerColor } from "../data/speakers";

function QuoteSortToggle({ value, onChange }) {
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

function SubmitModal({ onClose, onSubmit, submitting }) {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [quoteText, setQuoteText] = useState("");
  const [episodeOpen, setEpisodeOpen] = useState(false);

  const canSubmit =
    selectedEpisode && selectedSpeaker && quoteText.trim().length >= 5;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      episodeId: selectedEpisode.id,
      episodeLabel: selectedEpisode.label,
      speakerId: selectedSpeaker.id,
      speakerName: selectedSpeaker.name,
      speakerType: selectedSpeaker.type,
      text: quoteText.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-green-600 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg bg-green-500/40 text-green-100 hover:bg-green-500/70 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquareQuote
              size={12}
              className="text-green-200"
              strokeWidth={2.5}
            />
            <span className="text-green-200 text-xs font-medium uppercase tracking-widest">
              Tambah Quote
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-tight">
            Quote Battle
          </p>
          <p className="text-green-300 text-xs font-normal mt-1">
            Pilih episode, siapa yang ngomong, lalu tulis quote-nya.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 flex flex-col gap-5 bg-white"
        >
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Episode
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setEpisodeOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  selectedEpisode
                    ? "border-green-500 text-gray-900"
                    : "border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                <span>
                  {selectedEpisode ? selectedEpisode.label : "Pilih episode..."}
                </span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 text-gray-400 ${episodeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {episodeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden z-10">
                  {EPISODES.map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => {
                        setSelectedEpisode(ep);
                        setEpisodeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-green-50 hover:text-green-700 ${
                        selectedEpisode?.id === ep.id
                          ? "bg-green-50 text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Siapa yang ngomong
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {HOSTS.map((s) => {
                  const color = getSpeakerColor(s.id);
                  const isSelected = selectedSpeaker?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSpeaker(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                        isSelected
                          ? `${color.bg} text-white border-transparent`
                          : `${color.light} hover:opacity-80`
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : color.dot}`}
                      />
                      {s.name}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
                  Tamu
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {GUESTS.map((s) => {
                  const color = getSpeakerColor(s.id);
                  const isSelected = selectedSpeaker?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedSpeaker(s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
                        isSelected
                          ? `${color.bg} text-white border-transparent`
                          : `${color.light} hover:opacity-80`
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : color.dot}`}
                      />
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Quote
            </label>
            <textarea
              placeholder="Tulis quote persis seperti yang diucapkan..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              maxLength={200}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors resize-none leading-relaxed font-medium"
            />
            <p className="text-xs font-normal text-gray-300 mt-1 text-right tabular-nums">
              {quoteText.length}/200
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-semibold text-xs py-3 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={12} />
                Kirim Quote
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function QuoteCard({ quote, user, onVote, onLoginGate, rank }) {
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

          <div
            className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {EPISODES.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              const count = totalQuotes[ep.id] ?? 0;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {ep.label}
                  {count > 0 && (
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? "bg-green-500 text-green-100"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!loading && !isEmpty && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs font-medium text-gray-300 uppercase tracking-widest mr-1">
                Dalam episode ini:
              </span>
              {[...HOSTS, ...GUESTS].map((s) => {
                const color = getSpeakerColor(s.id);
                const count = quotes.filter((q) => q.speakerId === s.id).length;
                if (count === 0) return null;
                return (
                  <span
                    key={s.id}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest px-2.5 py-1 rounded-lg border ${color.light}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                    {s.name}
                    {s.type === "guest" && (
                      <span className="opacity-50 font-medium normal-case tracking-normal">
                        · tamu
                      </span>
                    )}
                    <span className="opacity-50">({count})</span>
                  </span>
                );
              })}
            </div>
          )}

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
