import { useState } from "react";
import { Scale, X, Send, ChevronDown } from "lucide-react";
import { EPISODES } from "../../data/episodes";
import { HOSTS, GUESTS, getSpeakerColor } from "../../data/speakers";

function SpeakerButton({ speaker, selected, onSelect, disabledId }) {
  const color = getSpeakerColor(speaker.id);
  const isSelected = selected?.id === speaker.id;
  const isDisabled = speaker.id === disabledId;
  return (
    <button
      type="button"
      onClick={() => !isDisabled && onSelect(speaker)}
      disabled={isDisabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 ${
        isDisabled
          ? "opacity-30 cursor-not-allowed border-gray-200 text-gray-400 bg-white"
          : isSelected
            ? `${color.bg} text-white border-transparent`
            : `${color.light} hover:opacity-80`
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/60" : color.dot}`}
      />
      {speaker.name}
      {speaker.type === "guest" && (
        <span
          className={`${isSelected ? "opacity-60" : "opacity-40"} font-normal normal-case`}
        >
          · tamu
        </span>
      )}
    </button>
  );
}

export default function SubmitModal({ onClose, onSubmit, submitting }) {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [speakerA, setSpeakerA] = useState(null);
  const [speakerB, setSpeakerB] = useState(null);
  const [summaryA, setSummaryA] = useState("");
  const [summaryB, setSummaryB] = useState("");
  const [episodeOpen, setEpisodeOpen] = useState(false);

  const handleSelectA = (s) => {
    setSpeakerA(s);
    if (speakerB?.id === s.id) setSpeakerB(null);
  };
  const handleSelectB = (s) => {
    setSpeakerB(s);
    if (speakerA?.id === s.id) setSpeakerA(null);
  };

  const canSubmit =
    selectedEpisode &&
    speakerA &&
    speakerB &&
    speakerA.id !== speakerB.id &&
    summaryA.trim().length >= 10 &&
    summaryB.trim().length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      episodeId: selectedEpisode.id,
      episodeLabel: selectedEpisode.label,
      speakerAId: speakerA.id,
      speakerAName: speakerA.name,
      speakerAType: speakerA.type,
      summaryA: summaryA.trim(),
      speakerBId: speakerB.id,
      speakerBName: speakerB.name,
      speakerBType: speakerB.type,
      summaryB: summaryB.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-yellow-400 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg bg-yellow-300/60 text-yellow-900 hover:bg-yellow-300/90 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Scale size={12} className="text-yellow-800" strokeWidth={2.5} />
            <span className="text-yellow-800 text-xs font-medium uppercase tracking-widest">
              Buat Battle
            </span>
          </div>
          <p className="text-gray-900 font-bold text-lg leading-tight">
            Siapa Paling Benar?
          </p>
          <p className="text-yellow-800 text-xs font-normal mt-1">
            Pilih episode, dua orang, lalu ringkas pendapat masing-masing.
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
                    ? "border-yellow-400 text-gray-900"
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
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors hover:bg-yellow-50 hover:text-yellow-700 ${
                        selectedEpisode?.id === ep.id
                          ? "bg-yellow-50 text-yellow-700"
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
              Orang A
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {HOSTS.map((s) => (
                  <SpeakerButton
                    key={s.id}
                    speaker={s}
                    selected={speakerA}
                    onSelect={handleSelectA}
                    disabledId={speakerB?.id}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
                  Tamu
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {GUESTS.map((s) => (
                  <SpeakerButton
                    key={s.id}
                    speaker={s}
                    selected={speakerA}
                    onSelect={handleSelectA}
                    disabledId={speakerB?.id}
                  />
                ))}
              </div>
            </div>
            {speakerA && (
              <div className="mt-3">
                <textarea
                  placeholder={`Ringkas pendapat ${speakerA.name} (2–4 kalimat)...`}
                  value={summaryA}
                  onChange={(e) => setSummaryA(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
                />
                <p className="text-xs font-normal text-gray-300 mt-1.5 text-right tabular-nums">
                  {summaryA.length}/300
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold tracking-widest">
                VS
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Orang B
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {HOSTS.map((s) => (
                  <SpeakerButton
                    key={s.id}
                    speaker={s}
                    selected={speakerB}
                    onSelect={handleSelectB}
                    disabledId={speakerA?.id}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">
                  Tamu
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="flex flex-wrap gap-2">
                {GUESTS.map((s) => (
                  <SpeakerButton
                    key={s.id}
                    speaker={s}
                    selected={speakerB}
                    onSelect={handleSelectB}
                    disabledId={speakerA?.id}
                  />
                ))}
              </div>
            </div>
            {speakerB && (
              <div className="mt-3">
                <textarea
                  placeholder={`Ringkas pendapat ${speakerB.name} (2–4 kalimat)...`}
                  value={summaryB}
                  onChange={(e) => setSummaryB(e.target.value)}
                  maxLength={300}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
                />
                <p className="text-xs font-normal text-gray-300 mt-1.5 text-right tabular-nums">
                  {summaryB.length}/300
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-semibold text-xs py-3 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={12} />
                Buat Battle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
