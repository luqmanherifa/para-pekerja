import { EPISODES } from "../../data/episodes";

export default function EpisodeTabs({ activeEpisode, totalQuotes, onSelect }) {
  return (
    <div
      className="flex items-center gap-2 mb-6 overflow-x-auto pb-1"
      style={{ scrollbarWidth: "none" }}
    >
      {EPISODES.map((ep) => {
        const isActive = activeEpisode.id === ep.id;
        const count = totalQuotes[ep.id] ?? 0;
        return (
          <button
            key={ep.id}
            onClick={() => onSelect(ep)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 ${
              isActive
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
            }`}
          >
            {ep.label}
            {count > 0 && (
              <span
                className={`text-xs font-medium px-1.5 py-0.5 rounded-full tabular-nums ${
                  isActive
                    ? "bg-green-500 text-green-100"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
