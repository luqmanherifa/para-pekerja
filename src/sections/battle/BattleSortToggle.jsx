import { TrendingUp, Clock3 } from "lucide-react";

export default function BattleSortToggle({ value, onChange }) {
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
