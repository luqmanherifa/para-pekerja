import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

export function SeparatorBar({ color = "yellow" }) {
  return (
    <div
      className={`w-full h-1 ${color === "gray" ? "bg-gray-200" : "bg-yellow-400"}`}
    />
  );
}

export function SectionHeader({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2.5">
        <Icon size={13} className="text-green-600" strokeWidth={2.5} />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}

export function SectionCounter({ label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <span className="text-sm font-extrabold text-gray-900 tabular-nums">
        {typeof value === "number" ? value.toLocaleString("id-ID") : value}
      </span>
    </div>
  );
}

export function SectionTitle({ title, subtitle, children }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-6">
      <div>
        <p className="text-base font-extrabold text-gray-900 leading-tight">
          {title}
        </p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export function LoginNudge({ text }) {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
      <Link
        to="/masuk"
        className="inline-flex items-center gap-1.5 text-green-600 font-bold hover:underline"
      >
        <LogIn size={11} />
        Masuk
      </Link>
      <span>{text}</span>
    </div>
  );
}

export function SectionButton({
  onClick,
  icon: Icon,
  children,
  variant = "dark",
}) {
  const base =
    "flex items-center gap-2 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0";
  const styles = {
    dark: "bg-gray-900 hover:bg-gray-700 text-white",
    green: "bg-green-600 hover:bg-green-700 text-white",
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </button>
  );
}

export function Divider() {
  return <div className="w-full h-px bg-gray-100" />;
}

export function EmptyState({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="border border-dashed border-gray-200 rounded-2xl px-8 py-14 text-center">
      <Icon
        size={28}
        className="text-gray-200 mx-auto mb-3"
        strokeWidth={1.5}
      />
      <p className="text-xs font-extrabold text-gray-400 mb-1">{title}</p>
      {subtitle && <p className="text-xs text-gray-300 mb-5">{subtitle}</p>}
      {children}
    </div>
  );
}
