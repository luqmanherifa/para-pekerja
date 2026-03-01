import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  runTransaction,
} from "firebase/firestore";
import { Scale, Plus, X, Send, LogIn, ChevronDown, Swords } from "lucide-react";

const EPISODES = [
  { id: "ep1", label: "Episode 1" },
  { id: "ep2", label: "Episode 2" },
  { id: "ep3", label: "Episode 3" },
  { id: "ep4", label: "Episode 4" },
  { id: "ep5", label: "Episode 5" },
];

const COMEDIANS = [
  { id: "arif", name: "Arif Brata", type: "host" },
  { id: "bintang", name: "Bintang Emon", type: "host" },
  { id: "gilang", name: "Gilang Bhaskara", type: "host" },
];

const GUESTS = [
  { id: "adi", name: "Adi Arkiang", type: "guest" },
  { id: "pandji", name: "Pandji Pragiwaksono", type: "guest" },
  { id: "raditya", name: "Raditya Dika", type: "guest" },
];

const ALL_SPEAKERS = [...COMEDIANS, ...GUESTS];

const SPEAKER_COLORS = {
  arif: {
    bg: "bg-green-600",
    light: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
    vote: "bg-green-600 hover:bg-green-700",
    voteLight: "bg-green-50 border-green-300 text-green-700",
    bar: "bg-green-500",
  },
  bintang: {
    bg: "bg-sky-500",
    light: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
    vote: "bg-sky-500 hover:bg-sky-600",
    voteLight: "bg-sky-50 border-sky-300 text-sky-700",
    bar: "bg-sky-500",
  },
  gilang: {
    bg: "bg-amber-500",
    light: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    vote: "bg-amber-500 hover:bg-amber-600",
    voteLight: "bg-amber-50 border-amber-300 text-amber-700",
    bar: "bg-amber-500",
  },
  adi: {
    bg: "bg-violet-500",
    light: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
    vote: "bg-violet-500 hover:bg-violet-600",
    voteLight: "bg-violet-50 border-violet-300 text-violet-700",
    bar: "bg-violet-500",
  },
  pandji: {
    bg: "bg-orange-500",
    light: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
    vote: "bg-orange-500 hover:bg-orange-600",
    voteLight: "bg-orange-50 border-orange-300 text-orange-700",
    bar: "bg-orange-500",
  },
  raditya: {
    bg: "bg-rose-500",
    light: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
    vote: "bg-rose-500 hover:bg-rose-600",
    voteLight: "bg-rose-50 border-rose-300 text-rose-700",
    bar: "bg-rose-500",
  },
};

const getSpeaker = (id) => ALL_SPEAKERS.find((s) => s.id === id);
const getSpeakerColor = (id) =>
  SPEAKER_COLORS[id] ?? {
    bg: "bg-gray-500",
    light: "bg-gray-50 text-gray-700 border-gray-200",
    dot: "bg-gray-400",
    vote: "bg-gray-500 hover:bg-gray-600",
    voteLight: "bg-gray-50 border-gray-300 text-gray-700",
    bar: "bg-gray-400",
  };

function SubmitModal({ onClose, onSubmit, submitting }) {
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [speakerA, setSpeakerA] = useState(null);
  const [speakerB, setSpeakerB] = useState(null);
  const [summaryA, setSummaryA] = useState("");
  const [summaryB, setSummaryB] = useState("");
  const [episodeOpen, setEpisodeOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${
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
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-yellow-300/50 text-yellow-900 hover:bg-yellow-300/80 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Scale size={13} className="text-yellow-800" strokeWidth={2.5} />
            <span className="text-yellow-800 text-xs font-bold uppercase tracking-widest">
              Buat Battle
            </span>
          </div>
          <h3 className="text-gray-900 font-extrabold text-xl leading-tight">
            Siapa Paling Benar?
          </h3>
          <p className="text-yellow-800 text-xs mt-1.5">
            Pilih episode, dua orang, lalu ringkas pendapat masing-masing.
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
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-colors ${
                  selectedEpisode
                    ? "border-yellow-400 text-gray-900 bg-white"
                    : "border-gray-200 text-gray-400 bg-white hover:border-gray-300"
                }`}
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
                      className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-yellow-50 hover:text-yellow-700 ${
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
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Orang A
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {COMEDIANS.map((c) => (
                  <SpeakerButton
                    key={c.id}
                    speaker={c}
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
                {GUESTS.map((g) => (
                  <SpeakerButton
                    key={g.id}
                    speaker={g}
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
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
                />
                <p className="text-[10px] text-gray-300 mt-1 text-right tabular-nums">
                  {summaryA.length}/300
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-extrabold tracking-widest">
                VS
              </span>
            </div>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Orang B
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                {COMEDIANS.map((c) => (
                  <SpeakerButton
                    key={c.id}
                    speaker={c}
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
                {GUESTS.map((g) => (
                  <SpeakerButton
                    key={g.id}
                    speaker={g}
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
                  className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-yellow-400 transition-colors resize-none leading-relaxed font-medium"
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
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-sm py-4 rounded-2xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Mengirim...
              </>
            ) : (
              <>
                <Send size={14} /> Buat Battle
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoginGateModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>
        <div className="px-7 pt-7 pb-2">
          <button
            onClick={onClose}
            className="float-right w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 flex items-center justify-center mb-5">
            <Scale size={26} className="text-gray-900" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">
            Masuk dulu, Pekerja.
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Kamu perlu masuk untuk buat battle dan ikut vote bersama komunitas.
          </p>
        </div>
        <div className="px-7 pb-7 pt-5 flex flex-col gap-2.5">
          <Link
            to="/masuk"
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-colors"
          >
            Masuk Sekarang
          </Link>
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-gray-600 font-semibold text-sm py-2.5 rounded-2xl transition-colors"
          >
            Nanti dulu
          </button>
        </div>
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
    <div className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
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
            className={`inline-flex items-center gap-1.5 self-start text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${colorA.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorA.dot}`} />
            {battle.speakerAName}
            {battle.speakerAType === "guest" && (
              <span className="opacity-50 font-medium normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {battle.summaryA}
          </p>
        </div>

        <div className="flex items-center justify-center px-5">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <span className="text-gray-400 text-[10px] font-extrabold tracking-widest">
              VS
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-end text-right">
          <span
            className={`inline-flex items-center gap-1.5 self-end text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${colorB.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${colorB.dot}`} />
            {battle.speakerBName}
            {battle.speakerBType === "guest" && (
              <span className="opacity-50 font-medium normal-case tracking-normal">
                · tamu
              </span>
            )}
          </span>
          <p className="text-sm text-gray-700 leading-relaxed font-medium">
            {battle.summaryB}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-6 py-4">
        {totalVotes > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-extrabold text-gray-400 tabular-nums w-8 text-right">
              {pctA}%
            </span>
            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden flex">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorA.bar}`}
                style={{ width: `${pctA}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-gray-400 tabular-nums w-8">
              {pctB}%
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => user && !hasVoted && onVote(battle.id, "A")}
            disabled={!user || hasVoted}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-150 ${
              votedA
                ? `${colorA.voteLight} border`
                : hasVoted || !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : `border-gray-200 text-gray-600 hover:${colorA.voteLight} hover:border-transparent`
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
            className={`flex items-center justify-center gap-2 py-2.5 rounded-2xl border text-xs font-bold transition-all duration-150 ${
              votedB
                ? `${colorB.voteLight} border`
                : hasVoted || !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : `border-gray-200 text-gray-600 hover:${colorB.voteLight} hover:border-transparent`
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
  const user = useSelector((s) => s.auth.user);

  const [activeEpisode, setActiveEpisode] = useState(EPISODES[0]);
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalBattles, setTotalBattles] = useState({});

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "battles"),
      where("episodeId", "==", activeEpisode.id),
      orderBy("totalVotes", "desc"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setBattles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [activeEpisode.id]);

  useEffect(() => {
    const unsubscribes = EPISODES.map((ep) => {
      const q = query(
        collection(db, "battles"),
        where("episodeId", "==", ep.id),
      );
      return onSnapshot(q, (snap) => {
        setTotalBattles((prev) => ({ ...prev, [ep.id]: snap.size }));
      });
    });
    return () => unsubscribes.forEach((u) => u());
  }, []);

  const handleSubmit = useCallback(
    async ({
      episodeId,
      episodeLabel,
      speakerAId,
      speakerAName,
      speakerAType,
      summaryA,
      speakerBId,
      speakerBName,
      speakerBType,
      summaryB,
    }) => {
      if (!user) return;
      setSubmitting(true);
      try {
        await addDoc(collection(db, "battles"), {
          episodeId,
          episodeLabel,
          speakerAId,
          speakerAName,
          speakerAType,
          summaryA,
          speakerBId,
          speakerBName,
          speakerBType,
          summaryB,
          uid: user.uid,
          submittedBy:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          voteCountA: 0,
          voteCountB: 0,
          totalVotes: 0,
          votersA: [],
          votersB: [],
          createdAt: serverTimestamp(),
        });
        setShowSubmitModal(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [user],
  );

  const handleVote = useCallback(
    async (battleId, side) => {
      if (!user) return;
      try {
        const battleRef = doc(db, "battles", battleId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(battleRef);
          if (!snap.exists()) return;
          const data = snap.data();
          if (
            data.votersA?.includes(user.uid) ||
            data.votersB?.includes(user.uid)
          )
            return;

          if (side === "A") {
            tx.update(battleRef, {
              voteCountA: increment(1),
              totalVotes: increment(1),
              votersA: [...(data.votersA ?? []), user.uid],
            });
          } else {
            tx.update(battleRef, {
              voteCountB: increment(1),
              totalVotes: increment(1),
              votersB: [...(data.votersB ?? []), user.uid],
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const isEmpty = !loading && battles.length === 0;

  return (
    <>
      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <section
        id="siapa-paling-benar"
        className="w-full bg-white border-t-4 border-yellow-400"
      >
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <Scale size={12} strokeWidth={2.5} />
                Siapa Paling Benar?
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Duel Pendapat
                <br />
                <span className="text-yellow-500">Per Episode</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                Rangkum argumen dua orang. Komunitas pilih siapa yang paling
                benar — atau paling chaos.
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-3">
              {(totalBattles[activeEpisode.id] ?? 0) > 0 && (
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-gray-900">
                    {totalBattles[activeEpisode.id]}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">battle aktif</p>
                </div>
              )}
              <button
                onClick={() =>
                  user ? setShowSubmitModal(true) : setShowLoginGate(true)
                }
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
                Buat Battle
              </button>
            </div>
          </div>

          <div
            className="flex items-center gap-2 mb-8 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {EPISODES.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              const count = totalBattles[ep.id] ?? 0;
              return (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-yellow-400 text-gray-900 border-yellow-400"
                      : "bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:text-yellow-600"
                  }`}
                >
                  {ep.label}
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tabular-nums ${
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

          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-3xl p-6 animate-pulse"
                >
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-100 rounded-full w-24" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full self-center" />
                    <div className="space-y-2 items-end flex flex-col">
                      <div className="h-5 bg-gray-100 rounded-full w-24" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                  </div>
                </div>
              ))
            ) : isEmpty ? (
              <div className="border-2 border-dashed border-gray-200 rounded-3xl px-8 py-16 text-center">
                <Swords
                  size={32}
                  className="text-gray-200 mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-bold text-gray-400 mb-1">
                  Belum ada battle untuk episode ini.
                </p>
                <p className="text-xs text-gray-300 mb-6">
                  Jadilah yang pertama merangkum duel pendapat.
                </p>
                <button
                  onClick={() =>
                    user ? setShowSubmitModal(true) : setShowLoginGate(true)
                  }
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors"
                >
                  <Plus size={14} />
                  Buat Battle Pertama
                </button>
              </div>
            ) : (
              battles.map((battle) => (
                <BattleCard
                  key={battle.id}
                  battle={battle}
                  user={user}
                  onVote={handleVote}
                />
              ))
            )}
          </div>

          {!user && !isEmpty && !loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-yellow-600 font-bold hover:underline"
              >
                <LogIn size={12} />
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
