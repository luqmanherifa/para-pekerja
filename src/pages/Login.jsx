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
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-green-600 to-green-700 flex-col justify-between p-14 relative overflow-hidden shrink-0">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-green-500 opacity-30" />
        <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-yellow-400 opacity-20" />
        <div className="absolute top-1/3 right-0 w-40 h-40 rounded-full border border-green-400 opacity-20" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center shrink-0">
            <span className="text-gray-900 text-[10px] font-extrabold tracking-tight leading-none select-none">
              PP
            </span>
          </div>
          <span className="text-white font-bold text-base tracking-tight">
            Para Pekerja
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-yellow-400 text-gray-900 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-5">
            Komunitas Pendengar · ABG Siniar
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Ruang pura-pura
            <br />
            <span className="text-yellow-400">produktif.</span>
          </h2>
          <p className="text-green-100 text-sm leading-relaxed mb-8 max-w-xs">
            Bergabung dan nikmati semua fitur komunitas yang dibangun oleh para
            pekerja, untuk para pekerja.
          </p>
          <ul className="flex flex-col gap-2.5">
            {FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center shrink-0">
                  <Icon size={12} className="text-white" strokeWidth={2} />
                </div>
                <span className="text-green-100 text-xs font-medium">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-l-2 border-yellow-400 pl-4">
          <p className="text-green-100 text-sm italic">
            "Kerjaan apa yang gajinya 5 juta sehari?"
          </p>
          <p className="text-yellow-400 text-xs font-semibold mt-1 uppercase tracking-wide">
            — ABG Siniar, setiap episode
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-12 py-14">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-green-600 transition-colors duration-150 mb-8"
          >
            <ArrowLeft size={13} />
            Kembali ke beranda
          </Link>

          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-extrabold tracking-tight leading-none select-none">
                PP
              </span>
            </div>
            <div>
              <span className="text-green-600 font-bold text-sm tracking-tight block">
                Para Pekerja
              </span>
              <span className="text-gray-400 text-xs">
                Komunitas Pendengar · ABG Siniar
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-8">
            <button
              onClick={() => switchTab("login")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                activeTab === "login"
                  ? "bg-white text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                activeTab === "register"
                  ? "bg-white text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Daftar
            </button>
          </div>

          <div className="flex items-center gap-2 mb-8">
            <Lock size={11} className="text-green-500 shrink-0" />
            <p className="text-xs text-gray-400">
              Kata sandi dienkripsi oleh{" "}
              <span className="font-semibold text-gray-500">
                Firebase Authentication
              </span>
            </p>
          </div>

          {activeTab === "login" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
                  Masuk dulu, <span className="text-green-600">Pekerja.</span>
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                  Setelah masuk, kamu otomatis tercatat hadir hari ini.
                </p>
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="pekerja@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors duration-150 mt-1"
                >
                  {loading ? (
                    "Sedang masuk..."
                  ) : (
                    <>
                      {" "}
                      Masuk & Absen <ArrowRight size={15} />{" "}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-1">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Daftar sekarang
                  </button>
                </p>
              </form>
            </>
          )}

          {activeTab === "register" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-gray-900 leading-snug">
                  Bergabung,{" "}
                  <span className="text-green-600">Para Pekerja Baru.</span>
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                  Daftar gratis dan langsung ikut berinteraksi bersama
                  komunitas.
                </p>
              </div>

              <form onSubmit={handleRegister} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Nama Panggilan
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Nama kamu di komunitas"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      placeholder="pekerja@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-xl pl-11 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegisterPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle size={14} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-xl transition-colors duration-150 mt-1"
                >
                  {loading ? (
                    "Mendaftarkan..."
                  ) : (
                    <>
                      {" "}
                      Daftar & Masuk <ArrowRight size={15} />{" "}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-gray-400 mt-1">
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="text-green-600 font-semibold hover:underline"
                  >
                    Masuk di sini
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
