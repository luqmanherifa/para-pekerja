import { useState } from "react";
import {
  ClipboardCheck,
  Zap,
  Coffee,
  BatteryLow,
  Target,
  Tv2,
  Umbrella,
  AlertTriangle,
  Ghost,
  Palmtree,
  Clock,
  ArrowLeftRight,
} from "lucide-react";
import { useAttendance } from "../../hooks/useAttendance";
import LoginGateModal from "../../components/LoginGateModal";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
} from "../../components/SectionComponents";
import PayslipModal from "./PayslipModal";
import AttendeeStrip from "./AttendeeStrip";
import MoodPicker from "./MoodPicker";
import MoodStats from "./MoodStats";
import FeaturedPayslips from "./FeaturedPayslips";

const MOOD_ICONS = {
  Zap,
  Coffee,
  BatteryLow,
  Target,
  Tv2,
  Umbrella,
  AlertTriangle,
  Ghost,
  Palmtree,
  Clock,
  ArrowLeftRight,
};

export default function AttendanceSection() {
  const {
    user,
    phase,
    selectedMood,
    submitting,
    myPayslip,
    myMood,
    showPayslipModal,
    attendees,
    globalStats,
    globalTotal,
    featuredPayslips,
    slipSort,
    setShowPayslipModal,
    setSlipSort,
    submitAttendance,
    votePayslip,
    handleMoodClick,
  } = useAttendance();

  const [showLoginGate, setShowLoginGate] = useState(false);

  const handleMoodClickWrapped = (moodId) => {
    if (phase === "guest") setShowLoginGate(true);
    else handleMoodClick(moodId);
  };

  const handleVotePayslip = (slipId) => {
    if (!user) {
      setShowLoginGate(true);
      return;
    }
    votePayslip(slipId);
  };

  return (
    <>
      {showPayslipModal && myPayslip && (
        <PayslipModal
          payslip={myPayslip}
          moodId={myMood}
          moodIcons={MOOD_ICONS}
          onClose={() => setShowPayslipModal(false)}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <SeparatorBar />

      <section id="absen" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <SectionHeader icon={ClipboardCheck} label="Absensi Harian">
            {globalTotal > 0 && (
              <SectionCounter label="Sudah absen" value={globalTotal} />
            )}
          </SectionHeader>

          <SectionTitle
            title="Kondisi Kerja Hari Ini"
            subtitle="Pilih kondisi kerja, absen, dan dapatkan slip gaji imajiner kamu hari ini."
          />

          <AttendeeStrip attendees={attendees} moodIcons={MOOD_ICONS} />

          <MoodPicker
            phase={phase}
            selectedMood={selectedMood}
            submitting={submitting}
            myMood={myMood}
            myPayslip={myPayslip}
            moodIcons={MOOD_ICONS}
            onMoodClick={handleMoodClickWrapped}
            onSubmit={submitAttendance}
            onShowPayslip={() => setShowPayslipModal(true)}
          />

          <div className="grid grid-cols-5 gap-10">
            <div className="col-span-3">
              <MoodStats
                globalStats={globalStats}
                globalTotal={globalTotal}
                moodIcons={MOOD_ICONS}
              />
            </div>
            <div className="col-span-2">
              <FeaturedPayslips
                featuredPayslips={featuredPayslips}
                slipSort={slipSort}
                setSlipSort={setSlipSort}
                user={user}
                moodIcons={MOOD_ICONS}
                onVote={handleVotePayslip}
              />
            </div>
          </div>

          {!user && (
            <LoginNudge text="untuk absen dan dapatkan slip gaji imajiner." />
          )}
        </div>
      </section>
    </>
  );
}
