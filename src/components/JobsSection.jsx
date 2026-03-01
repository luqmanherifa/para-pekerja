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
        className="w-full max-w-md bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(24px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="bg-yellow-400 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg bg-yellow-300/60 text-yellow-900 hover:bg-yellow-300 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-1.5">
            <Briefcase
              size={12}
              className="text-yellow-800"
              strokeWidth={2.5}
            />
            <span className="text-yellow-800 text-[10px] font-bold uppercase tracking-widest">
              Submit Kerjaan
            </span>
          </div>
          <h3 className="text-gray-900 font-black text-lg leading-tight">
            Kerjaan apa hari ini?
          </h3>
          <p className="text-yellow-700 text-[11px] mt-1">
            Biarkan komunitas yang menilai — layak atau gaji ditahan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim() || !description.trim()) return;
            onSubmit({ title: title.trim(), description: description.trim() });
          }}
          className="px-6 py-6 flex flex-col gap-5"
        >
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
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
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
            <p className="text-[10px] text-gray-300 mt-1 text-right tabular-nums">
              {title.length}/80
            </p>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Deskripsi Singkat
            </label>
            <textarea
              placeholder="Jelaskan apa yang dikerjakan. 1–3 kalimat sudah cukup."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={240}
              required
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none leading-relaxed"
            />
            <p className="text-[10px] text-gray-300 mt-1 text-right tabular-nums">
              {description.length}/240
            </p>
          </div>
          <button
            type="submit"
            disabled={!title.trim() || !description.trim() || submitting}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-bold text-xs py-3 rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />{" "}
                Mengirim...
              </>
            ) : (
              <>
                <Send size={12} /> Kirim ke Komunitas
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
  const cannotVote = !user || isOwn;

  const verdict =
    totalVotes >= 10
      ? approvedPct >= 60
        ? {
            label: "Layak ✓",
            cls: "text-green-600 bg-green-50 border-green-200",
          }
        : approvedPct <= 40
          ? { label: "Ditahan ✗", cls: "text-red-500 bg-red-50 border-red-200" }
          : { label: "Sengit", cls: "text-gray-500 bg-gray-50 border-gray-200" }
      : null;

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
      className={`bg-white border rounded-xl p-4 transition-colors duration-200 ${isNew ? "border-green-400" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug flex-1">
          {job.title}
        </h3>
        {verdict && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide shrink-0 ${verdict.cls}`}
          >
            {verdict.label}
          </span>
        )}
      </div>

      <p className="text-[11px] text-gray-400 mb-2.5 flex items-center gap-1.5 flex-wrap">
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

      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
        {job.description}
      </p>

      {totalVotes > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold text-green-600 tabular-nums w-7">
            {approvedPct}%
          </span>
          <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${approvedPct}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-red-400 tabular-nums w-7 text-right">
            {100 - approvedPct}%
          </span>
        </div>
      )}

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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 ${approvedBtnCls}`}
        >
          <ThumbsUp size={11} strokeWidth={2.5} />
          Layak
          <span className="tabular-nums">{approvedCount}</span>
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
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all duration-150 ${rejectedBtnCls}`}
        >
          <ThumbsDown size={11} strokeWidth={2.5} />
          Ditahan
          <span className="tabular-nums">{rejectedCount}</span>
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
  );
}

function SkeletonCard() {
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="h-3 bg-gray-100 rounded-full w-3/5 mb-2 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-1/4 mb-3 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-full mb-1.5 animate-pulse" />
      <div className="h-2.5 bg-gray-100 rounded-full w-4/5 mb-4 animate-pulse" />
      <div className="flex gap-2">
        <div className="h-7 bg-gray-100 rounded-lg w-20 animate-pulse" />
        <div className="h-7 bg-gray-100 rounded-lg w-20 animate-pulse" />
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

      <div className="w-full h-1 bg-yellow-400" />

      <section id="jobs" className="w-full bg-white">
        <div className="max-w-5xl mx-auto px-8 py-14">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2.5">
              <Briefcase
                size={13}
                className="text-green-600"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Kerjaan 5 Juta
              </span>
            </div>
            <div className="flex items-center gap-3">
              {!loading && !isEmpty && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                      Terdaftar
                    </span>
                    <span className="text-sm font-black text-gray-900 tabular-nums">
                      {hasMore ? `${PREVIEW_COUNT}+` : jobs.length}
                    </span>
                  </div>
                  <div className="w-px h-3.5 bg-gray-200" />
                </>
              )}
              <button
                onClick={openSubmitModal}
                className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors"
              >
                <Plus size={12} strokeWidth={2.5} />
                Submit Kerjaan
              </button>
            </div>
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium text-gray-400 mb-1 italic">
              Layak 5 juta sehari atau gaji ditahan? Komunitas yang menentukan.
            </p>
            <h2 className="text-[36px] font-black text-gray-900 leading-[1.05] tracking-tight">
              Pekerjaan Absurd{" "}
              <span className="text-green-600">Versi Para Pekerja.</span>
            </h2>
          </div>

          <div className="w-full h-px bg-gray-100 mb-8" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loading
              ? [...Array(PREVIEW_COUNT)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl h-36 animate-pulse bg-gray-50"
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

          <div className="mt-6 flex items-center justify-between gap-4">
            <Link
              to="/kerjaan"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors"
            >
              Lihat semua kerjaan
              <ArrowRight size={13} />
            </Link>
            {!user && (
              <Link
                to="/masuk"
                className="inline-flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 font-semibold transition-colors"
              >
                <LogIn size={12} />
                Masuk untuk submit
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
