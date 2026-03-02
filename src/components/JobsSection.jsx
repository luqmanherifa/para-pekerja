import { useState } from "react";
import {
  Briefcase,
  Plus,
  X,
  Send,
  Star,
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
import { useJobs } from "../hooks/useJobs";
import LoginGateModal from "./LoginGateModal";

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

function JobSortToggle({ value, onChange }) {
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const canSubmit = title.trim().length >= 3 && description.trim().length >= 10;

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
            <Briefcase size={12} className="text-green-200" strokeWidth={2.5} />
            <span className="text-green-200 text-xs font-medium uppercase tracking-widest">
              Usul Kerjaan
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-tight">
            Kerjaan 5 Juta
          </p>
          <p className="text-green-300 text-xs font-normal mt-1">
            Kasih judul dan deskripsi kerjaan absurd gajinya 5 juta.
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5 bg-white">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Judul Kerjaan
            </label>
            <input
              type="text"
              placeholder="Contoh: Penjinak Kucing Kantor..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors font-medium"
            />
            <p className="text-xs font-normal text-gray-300 mt-1.5 text-right tabular-nums">
              {title.length}/80
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Deskripsi
            </label>
            <textarea
              placeholder="Jelaskan tugas dan tanggung jawabnya..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={300}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors resize-none leading-relaxed font-medium"
            />
            <p className="text-xs font-normal text-gray-300 mt-1.5 text-right tabular-nums">
              {description.length}/300
            </p>
          </div>
          <button
            onClick={() =>
              canSubmit &&
              !submitting &&
              onSubmit({ title: title.trim(), description: description.trim() })
            }
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
                Kirim Usul
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, user, onVote, onLoginGate, isNew }) {
  const hasVoted = job.voters_approved?.includes(user?.uid);
  const voteCount = job.approved ?? 0;
  const isOwn = job.uid === user?.uid;

  const handleVote = () => {
    if (!user) {
      onLoginGate();
      return;
    }
    if (isOwn) return;
    onVote(job.id, hasVoted);
  };

  return (
    <div
      className={`bg-white border rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm ${
        isNew ? "border-green-400" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-2 flex-wrap">
        <p className="text-sm font-bold text-gray-900 leading-snug flex-1">
          {job.title}
        </p>
        {isNew && (
          <span className="text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
            baru!
          </span>
        )}
      </div>

      <p className="text-xs font-normal text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {job.description}
      </p>

      <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 truncate">
            {job.submittedBy}
          </p>
          <p className="text-xs font-normal text-gray-300 mt-0.5">
            {timeAgo(job.createdAt)}
          </p>
        </div>

        <button
          onClick={handleVote}
          disabled={isOwn && !!user}
          title={
            isOwn && user
              ? "Tidak bisa vote sendiri"
              : hasVoted
                ? "Batalkan vote"
                : "Vote layak 5 juta"
          }
          className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-150 ${
            hasVoted
              ? "bg-yellow-50 border-yellow-300 text-yellow-500"
              : isOwn && user
                ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                : "border-gray-200 text-gray-400 hover:border-yellow-300 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer"
          }`}
        >
          <Star
            size={11}
            strokeWidth={2}
            className={hasVoted ? "fill-yellow-400" : ""}
          />
          <span className="tabular-nums">{voteCount}</span>
        </button>
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
