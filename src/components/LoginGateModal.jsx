import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, LogIn } from "lucide-react";

export default function LoginGateModal({ onClose }) {
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
        className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        <style>{`@keyframes modalIn { from{opacity:0;transform:translateY(32px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }`}</style>

        <div className="px-6 pt-6 pb-2">
          <button
            onClick={onClose}
            className="float-right w-6 h-6 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X size={12} />
          </button>
          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mb-4">
            <LogIn size={18} className="text-white" strokeWidth={2} />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            Diperlukan Login
          </p>
          <h3 className="text-base font-black text-gray-900 mb-1.5">
            Masuk dulu, Pekerja.
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Kamu perlu masuk untuk ikut berinteraksi bersama komunitas.
          </p>
        </div>

        <div className="px-6 pb-6 pt-4 flex flex-col gap-2">
          <Link
            to="/masuk"
            className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-3 rounded-xl transition-colors"
          >
            Masuk Sekarang
          </Link>
          <button
            onClick={onClose}
            className="w-full text-gray-400 hover:text-gray-600 font-semibold text-xs py-2 rounded-xl transition-colors"
          >
            Nanti dulu
          </button>
        </div>
      </div>
    </div>
  );
}
