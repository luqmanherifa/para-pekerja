import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";
import HeroSection from "../components/HeroSection";
import { LogOut } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="font-bold text-green-600 text-base tracking-tight">
            Para Pekerja
          </span>

          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors duration-150"
            >
              <LogOut size={14} />
              Keluar
            </button>
          </div>
        </div>
      </nav>

      <HeroSection />

      <div
        id="absensi"
        className="max-w-5xl mx-auto px-8 py-16 border-b border-gray-100"
      >
        <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
          Segera hadir
        </p>
        <h2 className="text-xl font-extrabold text-gray-200 mt-1">
          Absensi & Slip Gaji Imajiner
        </h2>
      </div>
      <div id="kerjaan" className="max-w-5xl mx-auto px-8 py-16">
        <p className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
          Segera hadir
        </p>
        <h2 className="text-xl font-extrabold text-gray-200 mt-1">
          Kerjaan 5 Juta
        </h2>
      </div>
    </div>
  );
}
