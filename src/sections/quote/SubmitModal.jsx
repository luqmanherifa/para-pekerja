import { useState } from "react";
import { MessageSquareQuote, X, Send, ChevronDown } from "lucide-react";
import { EPISODES } from "../../data/episodes";
import { HOSTS, GUESTS, getSpeakerColor } from "../../data/speakers";

export default function SubmitModal({ onClose, onSubmit, submitting }) {
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
