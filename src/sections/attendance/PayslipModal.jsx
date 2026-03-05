import { X } from "lucide-react";
import { getMoodById, formatRupiah } from "../../data/moods";

export default function PayslipModal({ payslip, moodId, moodIcons, onClose }) {
  const mood = getMoodById(moodId);
  const Icon = moodIcons[mood.icon];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slipIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`
          @keyframes slipIn {
            from { opacity: 0; transform: translateY(24px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        <div className="bg-green-600 px-6 py-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg bg-green-500/40 text-green-100 hover:bg-green-500/70 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md bg-yellow-400 flex items-center justify-center">
              <Icon size={11} className="text-gray-900" strokeWidth={2.5} />
            </div>
            <span className="text-green-200 text-xs font-medium uppercase tracking-widest">
              Slip Gaji Imajiner
            </span>
          </div>
          <p className="text-white font-bold text-lg leading-tight">
            PT. Para Pekerja Indonesia
          </p>
          <p className="text-green-300 text-xs font-normal mt-1">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex h-4 bg-gray-50 items-center overflow-hidden">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full bg-white shrink-0 border border-gray-200"
              style={{ marginLeft: i === 0 ? 0 : "-2px" }}
            />
          ))}
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center py-3 border-b border-dashed border-gray-200">
            <span className="text-xs font-medium text-gray-500">
              Gaji Pokok
            </span>
            <span className="text-xs font-bold text-gray-900">
              {formatRupiah(payslip.base)}
            </span>
          </div>
          {payslip.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-start py-2.5 border-b border-dashed border-gray-100 gap-4"
            >
              <span className="text-xs font-normal text-gray-500 leading-snug flex-1">
                {item.label}
              </span>
              <span
                className={`text-xs font-semibold shrink-0 ${item.amount >= 0 ? "text-green-600" : "text-red-500"}`}
              >
                {item.amount >= 0 ? "+" : ""}Rp{" "}
                {Math.abs(item.amount).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
            <p className="text-xs font-medium text-yellow-600 uppercase tracking-widest mb-1">
              Catatan HRD
            </p>
            <p className="text-xs font-normal text-yellow-800 leading-relaxed italic">
              "{payslip.hrNote}"
            </p>
          </div>
          <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-dashed border-gray-300">
            <span className="text-xs font-semibold text-gray-900">
              Total Diterima
            </span>
            <span className="text-xl font-bold text-green-600">
              {formatRupiah(payslip.total)}
            </span>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors"
          >
            Tutup Slip
          </button>
        </div>
      </div>
    </div>
  );
}
