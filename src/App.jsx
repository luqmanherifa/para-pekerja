import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "./store/authSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const Spinner = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="w-4 h-4 rounded-full border-2 border-green-500 border-t-transparent animate-spin" />
  </div>
);

function GuestGuard({ children, authLoading }) {
  const user = useSelector((s) => s.auth.user);
  if (authLoading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AdminGuard({ children, authLoading }) {
  const user = useSelector((s) => s.auth.user);
  if (authLoading) return <Spinner />;
  if (!user) return <Navigate to="/masuk" replace />;
  if (user.role !== "admin" && user.role !== "moderator") {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        const firestoreData = snap.exists() ? snap.data() : {};
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName ?? null,
            role: firestoreData.role ?? "member",
            jobTitle: firestoreData.jobTitle ?? null,
          }),
        );
      } else {
        dispatch(setUser(null));
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/masuk"
          element={
            <GuestGuard authLoading={authLoading}>
              <Login />
            </GuestGuard>
          }
        />
        <Route
          path="/dasbor"
          element={
            <AdminGuard authLoading={authLoading}>
              <Dashboard />
            </AdminGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
