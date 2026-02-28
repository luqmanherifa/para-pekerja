import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(
        doc(db, "users", user.uid),
        { lastActiveAt: serverTimestamp(), email: user.email },
        { merge: true },
      );

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName ?? null,
        }),
      );
    } catch (err) {
      setError("Email atau kata sandi salah. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex w-1/2 bg-green-600 flex-col justify-between p-16 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-green-500 opacity-40" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-yellow-400 opacity-25" />
        <div className="absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-green-400 opacity-30" />

        <div className="relative z-10">
          <span className="text-white text-lg font-bold tracking-tight">
            Para Pekerja
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-block bg-yellow-400 text-gray-900 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Komunitas Pendengar · ABG Siniar
          </div>
          <h2 className="text-4xl font-extrabold text-white leading-snug mb-4">
            Ruang pura-pura
            <br />
            <span className="text-yellow-400">produktif.</span>
          </h2>
          <p className="text-green-100 text-sm leading-relaxed max-w-xs">
            Absen, vote, dan tertawa bersama ribuan pekerja lainnya. Semua atas
            nama inside joke ABG Siniar.
          </p>
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

      <div className="flex-1 flex items-center justify-center px-12 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-10">
            <span className="text-green-600 text-xl font-bold tracking-tight">
              Para Pekerja
            </span>
            <p className="text-gray-400 text-sm mt-1">
              Komunitas Pendengar · ABG Siniar
            </p>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-snug">
            Masuk dulu,
            <br />
            <span className="text-green-600">Pekerja.</span>
          </h1>
          <p className="text-gray-400 text-sm mb-10">
            Setelah masuk, kamu otomatis tercatat hadir hari ini.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-green-500 transition-colors duration-150"
                />
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
              className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3.5 rounded-xl transition-colors duration-150 mt-2"
            >
              {loading ? (
                "Sedang masuk..."
              ) : (
                <>
                  Masuk & Absen
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
