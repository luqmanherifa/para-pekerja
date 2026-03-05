import { MOODS } from "../../data/moods";

export default function MoodStats({ dailyStats, totalToday, moodIcons }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
        Suasana Kantor
      </p>
      <div className="space-y-2.5">
        {MOODS.map((m) => {
          const count = dailyStats[m.id] ?? 0;
          const pct =
            totalToday > 0 ? Math.round((count / totalToday) * 100) : 0;
          const Icon = moodIcons[m.icon];
          return (
            <div
              key={m.id}
              className={`flex items-center gap-2.5 transition-opacity ${count === 0 ? "opacity-20" : ""}`}
            >
              <Icon
                size={11}
                className="text-gray-400 shrink-0"
                strokeWidth={2}
              />
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${m.bar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-400 w-4 text-right tabular-nums">
                {count > 0 ? count : ""}
              </span>
            </div>
          );
        })}
      </div>
      {totalToday === 0 && (
        <p className="text-xs font-normal text-gray-300 mt-3 italic">
          Belum ada yang absen hari ini.
        </p>
      )}
    </div>
  );
}
