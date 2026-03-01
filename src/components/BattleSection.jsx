import { useState } from "react";
import { Link } from "react-router-dom";
import { Scale, Plus, X, Send, LogIn, ChevronDown, Swords } from "lucide-react";
import { useBattles } from "../hooks/useBattles";
import LoginGateModal from "./LoginGateModal";
import { EPISODES } from "../data/episodes";
import { HOSTS, GUESTS, getSpeakerColor } from "../data/speakers";

function SubmitModal({ onClose, onSubmit, submitting }) {
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

  const SpeakerButton = ({ speaker, selected, onSelect, disabledId }) => {
    const color = getSpeakerColor(speaker.id);
    const isSelected = selected?.id === speaker.id;
    const isDisabled = speaker.id === disabledId;
    return (
      <button
        type="button"
        onClick={() => !isDisabled && onSelect(speaker)}
        disabled={isDisabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150 ${
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
            className={`${isSelected ? "opacity-60" : "opacity-40"} font-medium normal-case`}
          >
            · tamu
          </span>
        )}
      </button>
    );
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
          <div className="flex items-center gap-2 mb-1.5">
            <Scale size={12} className="text-yellow-800" strokeWidth={2.5} />
            <span className="text-yellow-800 text-[10px] font-bold uppercase tracking-widest">
              Buat Battle
            </span>
          </div>
          <p className="text-gray-900 font-black text-lg leading-tight">
            Siapa Paling Benar?
          </p>
          <p className="text-yellow-800 text-[11px] mt-1">
            Pilih episode, dua orang, lalu ringkas pendapat masing-masing.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 flex flex-col gap-5 bg-white"
        >
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Episode
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setEpisodeOpen((v) => !v)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
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
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-yellow-50 hover:text-yellow-700 ${
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
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
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
                <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
                  Guest
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
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
                />
                <p className="text-[10px] text-gray-300 mt-1 text-right tabular-nums">
                  {summaryA.length}/300
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-[9px] font-black tracking-widest">
                VS
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
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
                <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
                  Guest
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
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
                />
                <p className="text-[10px] text-gray-300 mt-1 text-right tabular-nums">
                  {summaryB.length}/300
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-xs py-3 rounded-xl transition-colors"
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

function BattleCard({ battle, user, onVote }) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-200">
      <div className="flex items-center justify-between px-6 pt-4 pb-3">
        <span className="text-[10px] text-gray-300 font-semibold uppercase tracking-widest">
          {battle.episodeLabel}
        </span>
        <span className="text-[10px] text-gray-300 font-medium">
          oleh {battle.submittedBy}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-0 px-6 pb-5">
        <div className="flex flex-col gap-3">
          <span
            className={`inline-flex items-center gap-1.5 self-start text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${colorA.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorA.dot}`} />
            {battle.speakerAName}
            {battle.speakerAType === "guest" && (
              <span className="opacity-50 font-medium normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {battle.summaryA}
          </p>
        </div>

        <div className="flex items-center justify-center px-4">
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-[9px] font-black tracking-widest">
              VS
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-end text-right">
          <span
            className={`inline-flex items-center gap-1.5 self-end text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${colorB.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorB.dot}`} />
            {battle.speakerBName}
            {battle.speakerBType === "guest" && (
              <span className="opacity-50 font-medium normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-xs text-gray-700 leading-relaxed font-medium">
            {battle.summaryB}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
        {totalVotes > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-gray-400 tabular-nums w-8 text-right">
              {pctA}%
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorA.bar}`}
                style={{ width: `${pctA}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-400 tabular-nums w-8">
              {pctB}%
            </span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => user && !hasVoted && onVote(battle.id, "A")}
            disabled={!user || hasVoted}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${
              votedA
                ? `${colorA.voteLight} border`
                : hasVoted || !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50"
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
            onClick={() => user && !hasVoted && onVote(battle.id, "B")}
            disabled={!user || hasVoted}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${
              votedB
                ? `${colorB.voteLight} border`
                : hasVoted || !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-600 hover:border-yellow-300 hover:text-yellow-700 hover:bg-yellow-50"
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
        {!user && (
          <p className="text-center text-[10px] text-gray-300 mt-2">
            <Link
              to="/masuk"
              className="text-yellow-600 font-bold hover:underline"
            >
              Masuk
            </Link>{" "}
            untuk vote
          </p>
        )}
      </div>
    </div>
  );
}

export default function BattleSection() {
  const {
    user,
    activeEpisode,
    battles,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    totalBattles,
    isEmpty,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
    submitBattle,
    voteBattle,
    openSubmitModal,
  } = useBattles();

  return (
    <>
      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={submitBattle}
          submitting={submitting}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <div className="w-full h-1 bg-yellow-400" />

      <section id="siapa-paling-benar" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <Scale size={13} className="text-yellow-500" strokeWidth={2.5} />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Siapa Paling Benar?
              </span>
            </div>
            <div className="flex items-center gap-3">
              {(totalBattles[activeEpisode.id] ?? 0) > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    Battle aktif
                  </span>
                  <span className="text-sm font-black text-gray-900 tabular-nums">
                    {totalBattles[activeEpisode.id]}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mb-8 gap-6">
            <div>
              <p className="text-base font-black text-gray-900 leading-tight">
                Duel Pendapat Per Episode
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Rangkum argumen dua orang. Komunitas pilih siapa yang paling
                benar — atau paling chaos.
              </p>
            </div>
            <button
              onClick={openSubmitModal}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
            >
              <Plus size={12} strokeWidth={2.5} />
              Buat Battle
            </button>
          </div>

          <div
            className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {EPISODES.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              const count = totalBattles[ep.id] ?? 0;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 border-yellow-400"
                      : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:text-yellow-600"
                  }`}
                >
                  {ep.label}
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full tabular-nums ${
                        isActive
                          ? "bg-yellow-500 text-yellow-100"
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

          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl p-6 animate-pulse"
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-100 rounded-full w-24" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                    <div className="w-7 h-7 bg-gray-100 rounded-full self-center" />
                    <div className="space-y-2 items-end flex flex-col">
                      <div className="h-4 bg-gray-100 rounded-full w-24" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                  </div>
                </div>
              ))
            ) : isEmpty ? (
              <div className="border border-dashed border-gray-200 rounded-2xl px-8 py-14 text-center">
                <Swords
                  size={28}
                  className="text-gray-200 mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-xs font-black text-gray-400 mb-1">
                  Belum ada battle untuk episode ini.
                </p>
                <p className="text-[11px] text-gray-300 mb-5">
                  Jadilah yang pertama merangkum duel pendapat.
                </p>
                <button
                  onClick={openSubmitModal}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={12} />
                  Buat Battle Pertama
                </button>
              </div>
            ) : (
              battles.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  user={user}
                  onVote={voteBattle}
                />
              ))
            )}
          </div>

          {!user && !isEmpty && !loading && (
            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-400">
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-yellow-600 font-bold hover:underline"
              >
                <LogIn size={11} />
                Masuk
              </Link>
              <span>untuk buat battle dan ikut vote.</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
