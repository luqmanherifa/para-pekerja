import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";
import HeroSection from "../components/HeroSection";
import AttendanceSection from "../components/AttendanceSection";
import JobsSection from "../components/JobsSection";
import QuoteSection from "../components/QuoteSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Scale, Star } from "lucide-react";
import BattleSection from "../components/BattleSection";
import GuestSection from "../components/GuestSection";

export default function Home() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar onLogout={handleLogout} />

      <HeroSection />

      <AttendanceSection />

      <JobsSection />

      <QuoteSection />

      <BattleSection />

      <GuestSection />

      <Footer />
    </div>
  );
}
