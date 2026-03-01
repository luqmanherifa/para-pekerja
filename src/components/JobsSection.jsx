import { useState } from "react";
import { Briefcase, Plus, X, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  SeparatorBar,
  SectionHeader,
  SectionCounter,
  SectionTitle,
  LoginNudge,
  SectionButton,
  EmptyState,
} from "./SectionComponents";
import { useJobs } from "../hooks/useJobs";
import LoginGateModal from "./LoginGateModal";

function SubmitModal({ onClose, onSubmit, submitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = title.trim().length >= 3 && description.trim().length >= 10;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), description: description.trim() });
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
          <div className="flex items-center gap-2 mb-1.5">
            <Briefcase size={12} className="text-green-200" strokeWidth={2.5} />
            <span className="text-green-200 text-xs font-bold uppercase tracking-widest">
              Usul Kerjaan
            </span>
          </div>
          <p className="text-white font-black text-lg leading-tight">
            Kerjaan 5 Juta
          </p>
          <p className="text-green-300 text-xs mt-1">
            Kasih judul dan deskripsi kerjaan absurd gajinya 5 juta.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 flex flex-col gap-5 bg-white"
        >
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Judul Kerjaan
            </label>
            <input
              type="text"
              placeholder="Contoh: Penjinak Kucing Kantor..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors font-medium"
            />
            <p className="text-xs text-gray-300 mt-1 text-right tabular-nums">
              {title.length}/80
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan tugas dan tanggung jawabnya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              required
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors resize-none leading-relaxed font-medium"
            />
            <p className="text-xs text-gray-300 mt-1 text-right tabular-nums">
              {description.length}/300
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit || submitting}
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-xs py-3 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send size={12} />
                Kirim Usul
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function JobCard({ job, user, onVote, isNew }) {
  const hasVotedApproved = job.voters_approved?.includes(user?.uid);
  const hasVotedRejected = job.voters_rejected?.includes(user?.uid);
  const totalVotes = (job.approved ?? 0) + (job.rejected ?? 0);
  const approvedPct =
    totalVotes > 0 ? Math.round((job.approved / totalVotes) * 100) : 50;

  return (
    <div
      className={`bg-white border rounded-2xl px-6 py-5 transition-all duration-200 hover:border-gray-300 ${
        isNew ? "border-green-400" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <p className="text-xs font-black text-gray-900">{job.title}</p>
            {isNew && (
              <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                baru!
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            {job.description}
          </p>
          <p className="text-xs text-gray-300">oleh {job.submittedBy}</p>
          {totalVotes > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-bold text-green-600 tabular-nums w-7 text-right">
                {approvedPct}%
              </span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${approvedPct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-red-400 tabular-nums w-7">
                {100 - approvedPct}%
              </span>
            </div>
          )}
        </div>
        <div className="shrink-0 flex flex-col gap-1.5">
          <button
            onClick={() =>
              user &&
              onVote(job.id, "approved", hasVotedApproved, hasVotedRejected)
            }
            disabled={!user}
            title={!user ? "Masuk untuk vote" : ""}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 ${
              hasVotedApproved
                ? "bg-green-50 border-green-200 text-green-600"
                : !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50"
            }`}
          >
            <ThumbsUp size={10} />
            <span className="tabular-nums">{job.approved ?? 0}</span>
          </button>
          <button
            onClick={() =>
              user &&
              onVote(job.id, "rejected", hasVotedApproved, hasVotedRejected)
            }
            disabled={!user}
            title={!user ? "Masuk untuk vote" : ""}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 ${
              hasVotedRejected
                ? "bg-red-50 border-red-200 text-red-500"
                : !user
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50"
            }`}
          >
            <ThumbsDown size={10} />
            <span className="tabular-nums">{job.rejected ?? 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
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
    setShowSubmitModal,
    setShowLoginGate,
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

      <section id="jobs" className="w-full bg-white">
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

          <div className="flex flex-col gap-2.5">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-2xl px-6 py-5 animate-pulse"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-gray-100 rounded-full w-40" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-14 h-7 bg-gray-100 rounded-xl" />
                      <div className="w-14 h-7 bg-gray-100 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))
            ) : isEmpty ? (
              <div className="border border-dashed border-gray-200 rounded-2xl px-8 py-14 text-center">
                <Briefcase
                  size={28}
                  className="text-gray-200 mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <p className="text-xs font-black text-gray-400 mb-1">
                  Belum ada usul kerjaan.
                </p>
                <p className="text-xs text-gray-300 mb-5">
                  Jadilah yang pertama usul kerjaan paling absurd.
                </p>
                <button
                  onClick={openSubmitModal}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  <Plus size={12} />
                  Usul Pertama
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  user={user}
                  onVote={voteJob}
                  isNew={job.id === newJobId}
                />
              ))
            )}
          </div>

          {hasMore && !loading && (
            <p className="text-center text-xs text-gray-300 mt-4">
              Menampilkan {PREVIEW_COUNT} usul terbaru.
            </p>
          )}

          {!user && !isEmpty && !loading && (
            <LoginNudge text="untuk usul kerjaan dan ikut vote." />
          )}
        </div>
      </section>
    </>
  );
}
