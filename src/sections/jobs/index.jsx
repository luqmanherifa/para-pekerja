import { Briefcase, Plus } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
  SectionButton,
} from "../../components/SectionComponents";
import { useJobs } from "../../hooks/useJobs";
import LoginGateModal from "../../components/LoginGateModal";
import SubmitModal from "./SubmitModal";
import JobCard from "./JobCard";
import JobSortToggle from "./JobSortToggle";

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const ts =
    typeof timestamp.toMillis === "function"
      ? timestamp.toMillis()
      : typeof timestamp === "number"
        ? timestamp
        : now;
  const diff = Math.floor((now - ts) / 1000);
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
  return `${Math.floor(diff / 604800)} minggu lalu`;
}

export default function JobsSection() {
  const {
    user,
    jobs,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    newJobId,
    hasMore,
    isEmpty,
    PREVIEW_COUNT,
    jobSort,
    setShowSubmitModal,
    setShowLoginGate,
    setJobSort,
    submitJob,
    voteJob,
    openSubmitModal,
  } = useJobs();

  return (
    <>
      {showSubmitModal && (
        <SubmitModal
          onClose={() => setShowSubmitModal(false)}
          onSubmit={submitJob}
          submitting={submitting}
        />
      )}
      {showLoginGate && (
        <LoginGateModal onClose={() => setShowLoginGate(false)} />
      )}

      <SeparatorBar />

      <section id="kerjaan" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <SectionHeader icon={Briefcase} label="Kerjaan 5 Juta">
            {jobs.length > 0 && (
              <SectionCounter
                label="Usul masuk"
                value={`${jobs.length}${hasMore ? "+" : ""}`}
              />
            )}
          </SectionHeader>

          <SectionTitle
            title="Kerjaan Absurd Gaji 5 Juta"
            subtitle="Usulkan pekerjaan paling absurd. Komunitas vote layak atau nggak."
          >
            <SectionButton onClick={openSubmitModal} icon={Plus}>
              Usul Kerjaan
            </SectionButton>
          </SectionTitle>

          {!isEmpty && (
            <div className="flex justify-end mb-4">
              <JobSortToggle value={jobSort} onChange={setJobSort} />
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl p-5 animate-pulse flex flex-col gap-4"
                >
                  <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
                  <div className="space-y-2">
                    <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                    <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="h-2.5 bg-gray-100 rounded-full w-20" />
                    <div className="w-14 h-7 bg-gray-100 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : isEmpty ? (
            <div className="border border-dashed border-gray-200 rounded-2xl px-8 py-14 text-center">
              <Briefcase
                size={26}
                className="text-gray-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-xs font-bold text-gray-400 mb-1">
                Belum ada usul kerjaan.
              </p>
              <p className="text-xs font-normal text-gray-300 mb-5">
                Jadilah yang pertama usul kerjaan paling absurd.
              </p>
              <button
                onClick={openSubmitModal}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus size={12} />
                Usul Pertama
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  user={user}
                  onVote={voteJob}
                  onLoginGate={() => setShowLoginGate(true)}
                  isNew={job.id === newJobId}
                  timeAgo={timeAgo}
                />
              ))}
            </div>
          )}

          {hasMore && !loading && (
            <p className="text-center text-xs font-normal text-gray-300 mt-5">
              Menampilkan {PREVIEW_COUNT} usul terbaru.
            </p>
          )}

          {!user && <LoginNudge text="untuk usul kerjaan dan ikut vote." />}
        </div>
      </section>
    </>
  );
}
