import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { logoutUser } from "../store/authSlice";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  Hammer,
  Users,
  Search,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Briefcase,
} from "lucide-react";

const ROLES = ["member", "moderator", "admin"];

const ROLE_CONFIG = {
  member: {
    label: "Member",
    icon: Shield,
    pill: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  moderator: {
    label: "Moderator",
    icon: ShieldCheck,
    pill: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-500",
  },
  admin: {
    label: "Admin",
    icon: ShieldAlert,
    pill: "bg-green-50 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
};

function RoleDropdown({ userId, currentRole, currentUserUid, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const isSelf = userId === currentUserUid;
  const config = ROLE_CONFIG[currentRole] ?? ROLE_CONFIG.member;
  const Icon = config.icon;

  const handleSelect = async (role) => {
    if (role === currentRole || isSelf) return;
    setUpdating(true);
    setOpen(false);
    try {
      await updateDoc(doc(db, "users", userId), { role });
      onUpdate(userId, role);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => !isSelf && setOpen((v) => !v)}
        disabled={isSelf || updating}
        title={isSelf ? "Tidak bisa mengubah role sendiri" : ""}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150 ${
          isSelf
            ? "opacity-50 cursor-not-allowed"
            : "hover:border-gray-300 cursor-pointer"
        } ${config.pill}`}
      >
        {updating ? (
          <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <Icon size={11} strokeWidth={2} />
        )}
        {config.label}
        {!isSelf && (
          <ChevronDown
            size={11}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl overflow-hidden z-20 w-36">
            {ROLES.map((role) => {
              const rc = ROLE_CONFIG[role];
              const RIcon = rc.icon;
              return (
                <button
                  key={role}
                  onClick={() => handleSelect(role)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold transition-colors hover:bg-gray-50 ${
                    role === currentRole
                      ? "text-gray-900 bg-gray-50"
                      : "text-gray-500"
                  }`}
                >
                  <RIcon size={11} strokeWidth={2} />
                  {rc.label}
                  {role === currentRole && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function UserRow({ user, currentUserUid, onUpdate }) {
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : (user.email?.[0]?.toUpperCase() ?? "P");

  const roleConfig = ROLE_CONFIG[user.role] ?? ROLE_CONFIG.member;

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
        <span className="text-white text-xs font-bold leading-none">
          {initials}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-extrabold text-gray-900 truncate">
            {user.displayName ?? "(tanpa nama)"}
          </p>
          {user.uid === currentUserUid && (
            <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full shrink-0">
              kamu
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">{user.email}</p>
        {user.jobTitle && (
          <div className="flex items-center gap-1 mt-0.5">
            <Briefcase size={9} className="text-gray-300" strokeWidth={2} />
            <p className="text-xs text-gray-300 truncate">{user.jobTitle}</p>
          </div>
        )}
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-300 mb-1.5">
          {user.createdAt?.toDate
            ? user.createdAt.toDate().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "—"}
        </p>
        <RoleDropdown
          userId={user.uid}
          currentRole={user.role ?? "member"}
          currentUserUid={currentUserUid}
          onUpdate={onUpdate}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(
        snap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        })),
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleRoleUpdate = useCallback((uid, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)),
    );
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
    navigate("/");
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      search.trim() === "" ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const counts = {
    all: users.length,
    member: users.filter((u) => (u.role ?? "member") === "member").length,
    moderator: users.filter((u) => u.role === "moderator").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <Hammer
                size={16}
                className="text-green-600 group-hover:text-green-700 transition-colors"
                strokeWidth={2.5}
              />
              <span className="font-bold text-gray-900 text-sm tracking-tight group-hover:text-green-600 transition-colors">
                Para Pekerja
              </span>
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Dasbor Admin
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-green-600 transition-colors"
            >
              <ArrowLeft size={12} />
              Ke Beranda
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={12} />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
            Manajemen
          </p>
          <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">
            Daftar Pekerja
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Kelola role seluruh anggota komunitas Para Pekerja.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: "all", label: "Semua" },
            { key: "member", label: "Member" },
            { key: "moderator", label: "Moderator" },
            { key: "admin", label: "Admin" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterRole(key)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-bold transition-all duration-150 ${
                filterRole === key
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
              }`}
            >
              <span>{label}</span>
              <span
                className={`tabular-nums font-extrabold ${filterRole === key ? "text-green-200" : "text-gray-400"}`}
              >
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>

          {loading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-3.5 animate-pulse"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-100 rounded-full w-32" />
                    <div className="h-2.5 bg-gray-100 rounded-full w-48" />
                  </div>
                  <div className="w-20 h-7 bg-gray-100 rounded-lg shrink-0" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <Users
                size={28}
                className="text-gray-200 mx-auto mb-3"
                strokeWidth={1.5}
              />
              <p className="text-xs font-extrabold text-gray-400 mb-1">
                Tidak ada hasil.
              </p>
              <p className="text-xs text-gray-300">
                Coba ubah filter atau kata kunci pencarian.
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((u) => (
                <UserRow
                  key={u.uid}
                  user={u}
                  currentUserUid={user?.uid}
                  onUpdate={handleRoleUpdate}
                />
              ))}
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-300">
                Menampilkan{" "}
                <span className="font-bold text-gray-500">
                  {filtered.length}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-gray-500">{users.length}</span>{" "}
                pekerja.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
