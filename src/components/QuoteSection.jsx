import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageSquareQuote,
  ThumbsUp,
  Plus,
  X,
  Send,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { useQuotes } from "../hooks/useQuotes";
import LoginGateModal from "./LoginGateModal";
import { EPISODES } from "../data/episodes";
import { HOSTS, GUESTS, getSpeakerColor } from "../data/speakers";

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
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-gradient-to-br from-green-600 to-green-700 px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-green-500/40 text-green-100 hover:bg-green-500/70 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquareQuote
              size={13}
              className="text-green-200"
              strokeWidth={2.5}
            />
            <span className="text-green-200 text-xs font-bold uppercase tracking-widest">
              Tambah Quote
            </span>
          </div>
          <h3 className="text-white font-extrabold text-xl leading-tight">
            Quote Battle
          </h3>
          <p className="text-green-300 text-xs mt-1.5">
            Pilih episode, siapa yang ngomong, lalu tulis quote-nya.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-7 py-6 flex flex-col gap-5 bg-white"
        >
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Episode
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setEpisodeOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-colors ${selectedEpisode ? "border-green-500 text-gray-900" : "border-gray-200 text-gray-400 hover:border-gray-300"}`}
              >
                <span>
                  {selectedEpisode ? selectedEpisode.label : "Pilih episode..."}
                </span>
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-200 text-gray-400 ${episodeOpen ? "rotate-180" : ""}`}
                />
              </button>
              {episodeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl overflow-hidden z-10 shadow-lg">
                  {EPISODES.map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => {
                        setSelectedEpisode(ep);
                        setEpisodeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-green-50 hover:text-green-700 ${selectedEpisode?.id === ep.id ? "bg-green-50 text-green-700" : "text-gray-700"}`}
                    >
                      {ep.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${isSelected ? `${color.bg} text-white border-transparent` : `${color.light} hover:opacity-80`}`}
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
                <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
                  Guest
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
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${isSelected ? `${color.bg} text-white border-transparent` : `${color.light} hover:opacity-80`}`}
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
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Quote
            </label>
            <textarea
              placeholder="Tulis quote persis seperti yang diucapkan..."
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              maxLength={200}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors resize-none leading-relaxed font-medium"
            />
            <p className="text-[10px] text-gray-300 mt-1.5 text-right tabular-nums">
              {quoteText.length}/200
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-sm py-4 rounded-2xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Mengirim...
              </>
            ) : (
              <>
                <Send size={14} /> Kirim Quote
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function QuoteCard({ quote, user, onVote, rank }) {
  const color = getSpeakerColor(quote.speakerId);
  const hasVoted = quote.voters?.includes(user?.uid);
  const isOwn = user && quote.uid === user.uid;
  const cannotVote = isOwn || hasVoted || !user;

  return (
    <div className="group bg-white border border-gray-200 rounded-3xl px-6 py-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-6 text-center">
          <span
            className={`text-xs font-extrabold tabular-nums ${rank <= 3 ? "text-yellow-500" : "text-gray-300"}`}
          >
            {rank <= 3 ? ["①", "②", "③"][rank - 1] : rank}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${color.light}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
              {quote.speakerName}
              {quote.speakerType === "guest" && (
                <span className="opacity-50 font-medium normal-case tracking-normal">
                  · tamu
                </span>
              )}
            </span>
            <span className="text-[10px] text-gray-300 font-medium">
              {quote.episodeLabel}
            </span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed font-medium italic">
            "{quote.text}"
          </p>
          <p className="text-[10px] text-gray-300 mt-2">
            oleh {quote.submittedBy}
          </p>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => !cannotVote && onVote(quote.id)}
            disabled={cannotVote}
            title={
              isOwn
                ? "Tidak bisa vote quote sendiri"
                : hasVoted
                  ? "Sudah di-vote"
                  : !user
                    ? "Masuk untuk vote"
                    : ""
            }
            className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-150 ${
              hasVoted
                ? "bg-green-50 border-green-300 text-green-600"
                : cannotVote
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <ThumbsUp size={13} />
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
    isEmpty,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
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

      <section
        id="quote-battle"
        className="w-full bg-white border-t-4 border-green-600"
      >
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <MessageSquareQuote size={12} strokeWidth={2.5} />
                Quote Battle
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Arsip Quote
                <br />
                <span className="text-green-600">Para Pekerja</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                Kumpulkan momen terbaik dari tiap episode. Satu quote, satu
                vote.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-3">
              {totalQuotes[activeEpisode.id] > 0 && (
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-gray-900">
                    {totalQuotes[activeEpisode.id]}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    quote terkumpul
                  </p>
                </div>
              )}
              <button
                onClick={openSubmitModal}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
                Tambah Quote
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-2 mb-8 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {EPISODES.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              const count = totalQuotes[ep.id] ?? 0;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  {ep.label}
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${isActive ? "bg-green-500 text-green-100" : "bg-gray-100 text-gray-500"}`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-gray-300 font-semibold uppercase tracking-widest mr-1">
              Dalam episode ini:
            </span>
            {[...HOSTS, ...GUESTS].map((s) => {
              const color = getSpeakerColor(s.id);
              const count = quotes.filter((q) => q.speakerId === s.id).length;
              if (count === 0) return null;
              return (
                <span
                  key={s.id}
                  className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${color.light}`}
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

          <div className="flex flex-col gap-3">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-3xl px-6 py-5 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-4 bg-gray-100 rounded" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-5 bg-gray-100 rounded-full w-28" />
                      <div className="h-3.5 bg-gray-100 rounded-full w-full" />
                      <div className="h-3.5 bg-gray-100 rounded-full w-4/5" />
                    </div>
                    <div className="w-12 h-14 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))
            ) : isEmpty ? (
              <div className="border-2 border-dashed border-gray-200 rounded-3xl px-8 py-16 text-center">
                <MessageSquareQuote
                  size={32}
                  className="text-gray-200 mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-bold text-gray-400 mb-1">
                  Belum ada quote untuk episode ini.
                </p>
                <p className="text-xs text-gray-300 mb-6">
                  Jadilah yang pertama mengarsipkan momen terbaik.
                </p>
                <button
                  onClick={openSubmitModal}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors"
                >
                  <Plus size={14} />
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
                  rank={index + 1}
                />
              ))
            )}
          </div>

          {!user && !isEmpty && !loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-green-600 font-bold hover:underline"
              >
                <LogIn size={12} />
                Masuk
              </Link>
              <span>untuk submit quote dan ikut vote.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
