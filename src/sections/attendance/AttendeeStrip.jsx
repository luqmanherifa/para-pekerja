import { getMoodById, GHOST_ATTENDEES } from "../../data/moods";

export default function AttendeeStrip({ attendees, moodIcons }) {
  const isGhost = attendees.length === 0;
  const displayAttendees = isGhost ? GHOST_ATTENDEES : attendees;

  return (
    <div className="mb-10 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
      <div className="flex items-center gap-2 pb-1">
        {displayAttendees.map((a) => {
          const mood = getMoodById(a.mood);
          const Icon = moodIcons[mood.icon];
          return (
            <div
              key={a.id}
              className={`flex items-center gap-1.5 border rounded-lg px-2.5 py-1.5 shrink-0 transition-all duration-200 ${
                isGhost
                  ? "opacity-20 border-gray-200 select-none"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${mood.active}`}
              >
                <Icon size={9} strokeWidth={2.5} />
              </div>
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {a.displayName}
              </span>
            </div>
          );
        })}
        <span className="text-xs text-gray-300 whitespace-nowrap pl-1 shrink-0">
          {isGhost ? "Jadilah yang pertama ✦" : "· · ·"}
        </span>
      </div>
    </div>
  );
}
