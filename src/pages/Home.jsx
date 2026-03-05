import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";

import HeroSection from "../components/HeroSection";
import AttendanceSection from "../sections/attendance";
import JobsSection from "../sections/jobs";
import QuoteSection from "../sections/quote";
import BattleSection from "../sections/battle";
import GuestSection from "../sections/guest";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
