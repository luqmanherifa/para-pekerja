import { useState } from "react";
import { Briefcase, X, Send } from "lucide-react";

export default function SubmitModal({ onClose, onSubmit, submitting }) {
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
