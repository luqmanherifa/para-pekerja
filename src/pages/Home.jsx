import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { logoutUser } from "../store/authSlice";

export default function Home() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logoutUser());
  };

  return (
    <div>
      <h1>Para Pekerja</h1>
      <p>Selamat datang di ruang pura-pura produktif.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
