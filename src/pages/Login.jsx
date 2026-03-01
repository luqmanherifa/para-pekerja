import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  Hammer,
  ClipboardCheck,
  Briefcase,
  MessageSquareQuote,
  Scale,
  Star,
} from "lucide-react";

const FEATURES = [
  { icon: ClipboardCheck, label: "Absensi & Slip Gaji Imajiner" },
  { icon: Briefcase, label: "Kerjaan 5 Juta" },
  { icon: MessageSquareQuote, label: "Quote Battle" },
  { icon: Scale, label: "Siapa Paling Benar?" },
  { icon: Star, label: "Peringkat Tamu" },
];

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUserToFirestore = async (user) => {
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email,
        displayName: user.displayName ?? null,
        lastActiveAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const dispatchUser = (user) => {
    dispatch(
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName ?? null,
      }),
    );
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword,
      );
      await saveUserToFirestore(user);
      dispatchUser(user);
    } catch {
      setError("Email atau kata sandi salah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (registerPassword.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    setLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword,
      );
      await updateProfile(user, { displayName: registerName });
      await saveUserToFirestore({ ...user, displayName: registerName });
      dispatchUser({ ...user, displayName: registerName });
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email ini sudah terdaftar. Coba masuk.");
      } else {
        setError("Gagal mendaftar. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex w-[420px] shrink-0 bg-green-600 flex-col justify-between px-10 py-12">
        <div className="flex items-center gap-2">
          <Hammer size={16} className="text-yellow-400" strokeWidth={2.5} />
          <span className="text-white font-black text-sm tracking-tight">
            Para Pekerja
          </span>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-gray-900 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg mb-5">
            Komunitas Pendengar · ABG Siniar
          </span>
          <h2 className="text-3xl font-black text-white leading-tight mb-3">
            Ruang pura-pura
            <br />
            <span className="text-yellow-400">produktif.</span>
          </h2>
          <p className="text-green-200 text-xs leading-relaxed mb-8 max-w-xs">
            Bergabung dan nikmati semua fitur komunitas yang dibangun oleh para
            pekerja, untuk para pekerja.
          </p>

          <ul className="flex flex-col gap-2.5 mb-10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                  <Icon size={11} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-green-100 text-xs font-semibold">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="border-l-2 border-yellow-400 pl-4">
            <p className="text-green-100 text-xs italic leading-relaxed">
              "Kerjaan apa yang gajinya 5 juta sehari?"
            </p>
            <p className="text-yellow-400 text-xs font-bold mt-1.5 uppercase tracking-widest">
              — ABG Siniar
            </p>
          </div>
        </div>

        <p className="text-xs text-green-400 font-medium">
          Fan-made · Bukan afiliasi resmi ABG Siniar
        </p>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-10 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2 lg:hidden">
            <Hammer size={15} className="text-green-600" strokeWidth={2.5} />
            <span className="text-gray-900 font-black text-sm tracking-tight">
              Para Pekerja
            </span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-green-600 transition-colors duration-150 ml-auto"
          >
            <ArrowLeft size={12} />
            Kembali ke beranda
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-10 py-12">
          <div className="w-full max-w-sm">
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8">
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors duration-150 ${
                    activeTab === tab
                      ? "bg-white text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            <div className="mb-7">
              {activeTab === "login" ? (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Selamat datang kembali
                  </p>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">
                    Masuk dulu, <span className="text-green-600">Pekerja.</span>
                  </h1>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Setelah masuk, kamu otomatis tercatat hadir hari ini.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Pekerja baru
                  </p>
                  <h1 className="text-xl font-black text-gray-900 leading-tight">
                    Bergabung,{" "}
                    <span className="text-green-600">Para Pekerja.</span>
                  </h1>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Daftar gratis dan langsung ikut berinteraksi bersama
                    komunitas.
                  </p>
                </>
              )}
            </div>

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="pekerja@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    <AlertCircle size={12} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-xs py-3 rounded-xl transition-colors mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sedang masuk...
                    </>
                  ) : (
                    <>
                      Masuk & Absen
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className="text-green-600 font-bold hover:underline"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}

            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Nama Panggilan
                  </label>
                  <div className="relative">
                    <User
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Nama kamu di komunitas"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="pekerja@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={13}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-gray-900 placeholder-gray-300 bg-white focus:outline-none focus:border-green-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((v) => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={13} />
                      ) : (
                        <Eye size={13} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                    <AlertCircle size={12} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold text-xs py-3 rounded-xl transition-colors mt-1"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      Daftar & Masuk
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="text-green-600 font-bold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            )}

            <div className="flex items-center gap-2 mt-6 pt-5 border-t border-gray-100">
              <Lock size={10} className="text-gray-300 shrink-0" />
              <p className="text-xs text-gray-300">
                Kata sandi dienkripsi oleh{" "}
                <span className="font-semibold text-gray-400">
                  Firebase Authentication
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
