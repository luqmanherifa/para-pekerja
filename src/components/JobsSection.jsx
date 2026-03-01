import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Plus,
  X,
  ArrowRight,
  LogIn,
  Send,
} from "lucide-react";
import { useJobs } from "../hooks/useJobs";
import LoginGateModal from "./LoginGateModal";

const formatRelativeTime = (ts) => {
  if (!ts?.toDate) return "";
  const diff = (Date.now() - ts.toDate().getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} hari lalu`;
  return ts.toDate().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function SubmitModal({ onClose, onSubmit, submitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 px-7 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase
              size={13}
              className="text-yellow-900"
              strokeWidth={2.5}
            />
            <span className="text-yellow-900 text-xs font-extrabold uppercase tracking-widest">
              Submit Kerjaan
            </span>
          </div>
          <h3 className="text-gray-900 font-extrabold text-xl leading-tight">
            Kerjaan apa hari ini?
          </h3>
          <p className="text-yellow-800 text-xs mt-1.5">
            Biarkan komunitas yang menilai — layak atau gaji ditahan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim() || !description.trim()) return;
            onSubmit({ title: title.trim(), description: description.trim() });
          }}
          className="px-7 py-7 flex flex-col gap-6 bg-white"
        >
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Nama Pekerjaan
            </label>
            <input
              type="text"
              placeholder="Contoh: Penjaga Tombol Elevator"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              required
              autoFocus
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <p className="text-[10px] text-gray-300 mt-1.5 text-right tabular-nums">
              {title.length}/80
            </p>
          </div>
          <div>
            <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2.5">
              Deskripsi Singkat
            </label>
            <textarea
              placeholder="Jelaskan apa yang dikerjakan. 1–3 kalimat sudah cukup."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none leading-relaxed"
            />
            <p className="text-[10px] text-gray-300 mt-1.5 text-right tabular-nums">
              {description.length}/240
            </p>
          </div>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || submitting}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-sm py-4 rounded-2xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Mengirim...
              </>
            ) : (
              <>
                <Send size={14} /> Kirim ke Komunitas
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function JobCard({ job, user, onVote, isNew }) {
  const approvedCount = job.approved ?? 0;
  const rejectedCount = job.rejected ?? 0;
  const totalVotes = approvedCount + rejectedCount;
  const approvedPct =
    totalVotes > 0 ? Math.round((approvedCount / totalVotes) * 100) : 50;

  const hasVotedApproved = job.voters_approved?.includes(user?.uid);
  const hasVotedRejected = job.voters_rejected?.includes(user?.uid);
  const isOwn = user && job.uid === user.uid;

  const verdict =
    totalVotes >= 10
      ? approvedPct >= 60
        ? { label: "Layak ✓", cls: "bg-green-100 text-green-700" }
        : approvedPct <= 40
          ? { label: "Ditahan ✗", cls: "bg-red-100 text-red-600" }
          : { label: "Sengit", cls: "bg-gray-100 text-gray-500" }
      : null;

  const cannotVote = !user || isOwn;

  const approvedBtnCls = hasVotedApproved
    ? "bg-green-600 border-green-600 text-white"
    : cannotVote
      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
      : "border-green-200 bg-green-50 text-green-700 hover:bg-green-600 hover:border-green-600 hover:text-white";

  const rejectedBtnCls = hasVotedRejected
    ? "bg-red-500 border-red-500 text-white"
    : cannotVote
      ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
      : "border-red-200 bg-red-50 text-red-600 hover:bg-red-500 hover:border-red-500 hover:text-white";

  return (
    <div
      className={`bg-white border rounded-3xl transition-colors duration-200 hover:border-gray-300 ${isNew ? "border-green-400" : "border-gray-200"}`}
    >
      <div className="px-6 py-5">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="font-extrabold text-gray-900 text-sm leading-snug flex-1">
            {job.title}
          </h3>
          {verdict && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0 ${verdict.cls}`}
            >
              {verdict.label}
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-gray-500">{job.submittedBy}</span>
          {job.createdAt && (
            <>
              <span>·</span>
              <span>{formatRelativeTime(job.createdAt)}</span>
            </>
          )}
          {isOwn && (
            <span className="text-yellow-600 font-semibold">· milikmu</span>
          )}
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {job.description}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              !cannotVote &&
              onVote(job.id, "approved", hasVotedApproved, hasVotedRejected)
            }
            disabled={cannotVote}
            title={
              isOwn
                ? "Tidak bisa vote kerjaan sendiri"
                : !user
                  ? "Masuk untuk vote"
                  : hasVotedApproved
                    ? "Batalkan vote"
                    : ""
            }
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${approvedBtnCls}`}
          >
            <ThumbsUp size={12} strokeWidth={2.5} />
            <span>Layak</span>
            <span
              className={`tabular-nums ${hasVotedApproved ? "text-green-200" : "text-green-500"}`}
            >
              {approvedCount}
            </span>
          </button>
          <button
            onClick={() =>
              !cannotVote &&
              onVote(job.id, "rejected", hasVotedApproved, hasVotedRejected)
            }
            disabled={cannotVote}
            title={
              isOwn
                ? "Tidak bisa vote kerjaan sendiri"
                : !user
                  ? "Masuk untuk vote"
                  : hasVotedRejected
                    ? "Batalkan vote"
                    : ""
            }
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all duration-150 ${rejectedBtnCls}`}
          >
            <ThumbsDown size={12} strokeWidth={2.5} />
            <span>Ditahan</span>
            <span
              className={`tabular-nums ${hasVotedRejected ? "text-red-200" : "text-red-400"}`}
            >
              {rejectedCount}
            </span>
          </button>
          {!user && (
            <Link
              to="/masuk"
              className="ml-auto text-[11px] text-gray-400 hover:text-green-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <LogIn size={11} />
              Masuk untuk vote
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-3xl px-6 py-5">
      <div className="h-3.5 bg-gray-200 rounded-full w-3/5 mb-2.5 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-1/4 mb-4 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-full mb-2 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-4/5 mb-5 animate-pulse" />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-100 rounded-xl w-24 animate-pulse" />
        <div className="h-8 bg-gray-100 rounded-xl w-24 animate-pulse" />
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

      <section
        id="jobs"
        className="w-full bg-white border-t-4 border-b-4 border-yellow-400"
      >
        <div className="max-w-5xl mx-auto px-8 py-20">
          <div className="flex items-start justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                <Briefcase size={12} strokeWidth={2.5} />
                Kerjaan 5 Juta
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                Pekerjaan Absurd
                <br />
                <span className="text-green-600">Versi Para Pekerja</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs leading-relaxed">
                Layak 5 juta sehari atau gaji ditahan? Komunitas yang
                menentukan.
              </p>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-3">
              {!loading && !isEmpty && (
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-gray-900">
                    {hasMore ? `${PREVIEW_COUNT}+` : jobs.length}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    kerjaan terdaftar
                  </p>
                </div>
              )}
              <button
                onClick={openSubmitModal}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-5 py-2.5 rounded-2xl transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
                Submit Kerjaan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading
              ? [...Array(PREVIEW_COUNT)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-3xl h-44 animate-pulse"
                  />
                ))
              : isEmpty
                ? [...Array(PREVIEW_COUNT)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      user={user}
                      onVote={voteJob}
                      isNew={job.id === newJobId}
                    />
                  ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Link
              to="/kerjaan"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm px-6 py-3 rounded-2xl transition-colors"
            >
              Lihat Semua Kerjaan
              <ArrowRight size={15} />
            </Link>
            {!user && (
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 font-semibold text-sm transition-colors"
              >
                <LogIn size={14} />
                Masuk untuk submit
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
