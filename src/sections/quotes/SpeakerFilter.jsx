import { HOSTS, GUESTS, getSpeakerColor } from "../../data/speakers";

export default function SpeakerFilter({ quotes }) {
  return (
    <div className="flex items-center gap-2 mb-4 flex-wrap">
      <span className="text-xs font-medium text-gray-300 uppercase tracking-widest mr-1">
        Dalam episode ini:
      </span>
      {[...HOSTS, ...GUESTS].map((s) => {
        const color = getSpeakerColor(s.id);
        const count = quotes.filter((q) => q.speakerId === s.id).length;
        if (count === 0) return null;
        return (
          <span
            key={s.id}
            className={`inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest px-2.5 py-1 rounded-lg border ${color.light}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
            {s.name}
            {s.type === "guest" && (
              <span className="opacity-50 font-medium normal-case tracking-normal">
                · tamu
              </span>
            )}
            <span className="opacity-50">({count})</span>
          </span>
        );
      })}
    </div>
  );
}
