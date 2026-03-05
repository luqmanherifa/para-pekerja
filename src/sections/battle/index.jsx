import { Scale, Plus, Swords } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
  SectionButton,
} from "../../components/SectionComponents";
import { useBattles } from "../../hooks/useBattles";
import LoginGateModal from "../../components/LoginGateModal";
import { EPISODES } from "../../data/episodes";
import SubmitModal from "./SubmitModal";
import BattleCard from "./BattleCard";
import BattleSortToggle from "./BattleSortToggle";

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
    battleSort,
    isEmpty,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
    setBattleSort,
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

      <SeparatorBar />

      <section id="debat" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <SectionHeader icon={Scale} label="Siapa Paling Benar?">
            {(totalBattles[activeEpisode.id] ?? 0) > 0 && (
              <SectionCounter
                label="Battle aktif"
                value={totalBattles[activeEpisode.id]}
              />
            )}
          </SectionHeader>

          <SectionTitle
            title="Duel Pendapat Per Episode"
            subtitle="Rangkum argumen dua orang. Komunitas pilih siapa yang paling benar — atau paling chaos."
          >
            <SectionButton onClick={openSubmitModal} icon={Plus}>
              Buat Battle
            </SectionButton>
          </SectionTitle>

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

          {!isEmpty && !loading && (
            <div className="flex justify-end mb-4">
              <BattleSortToggle value={battleSort} onChange={setBattleSort} />
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
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
                  size={26}
                  className="text-gray-200 mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-xs font-bold text-gray-400 mb-1">
                  Belum ada battle untuk episode ini.
                </p>
                <p className="text-xs font-normal text-gray-300 mb-5">
                  Jadilah yang pertama merangkum duel pendapat.
                </p>
                <button
                  onClick={openSubmitModal}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
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
                  onLoginGate={() => setShowLoginGate(true)}
                />
              ))
            )}
          </div>

          {!user && <LoginNudge text="untuk buat battle dan ikut vote." />}
        </div>
      </section>
    </>
  );
}
