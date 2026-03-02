import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  increment,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { buildPayslip } from "../data/moods";

const getTodayDate = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

export function useAttendance() {
  const user = useSelector((s) => s.auth.user);
  const today = getTodayDate();

  const [phase, setPhase] = useState("loading");
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [myPayslip, setMyPayslip] = useState(null);
  const [myMood, setMyMood] = useState(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  const [attendees, setAttendees] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [totalToday, setTotalToday] = useState(0);
  const [featuredPayslips, setFeaturedPayslips] = useState([]);
  const [dominantMood, setDominantMood] = useState(null);
  const [slipSort, setSlipSort] = useState("top");

  useEffect(() => {
    if (!user) {
      setPhase("guest");
      return;
    }
    getDoc(doc(db, "attendance", `${user.uid}_${today}`)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMyMood(data.mood);
        setMyPayslip(data.payslip);
        setSelectedMood(data.mood);
        setPhase("done");
      } else {
        setPhase("pick_mood");
      }
    });
  }, [user, today]);

  useEffect(() => {
    const q = query(
      collection(db, "attendance"),
      where("date", "==", today),
      orderBy("createdAt", "desc"),
      limit(40),
    );
    return onSnapshot(q, (snap) =>
      setAttendees(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [today]);

  useEffect(() => {
    return onSnapshot(doc(db, "daily_stats", today), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setDailyStats(data.moods ?? {});
      setTotalToday(data.total ?? 0);
      const top = Object.entries(data.moods ?? {}).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (top) setDominantMood(top[0]);
    });
  }, [today]);

  useEffect(() => {
    const q =
      slipSort === "top"
        ? query(
            collection(db, "attendance"),
            where("date", "==", today),
            orderBy("voteCount", "desc"),
            limit(5),
          )
        : query(
            collection(db, "attendance"),
            where("date", "==", today),
            orderBy("createdAt", "desc"),
            limit(5),
          );
    return onSnapshot(q, (snap) =>
      setFeaturedPayslips(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [today, slipSort]);

  const submitAttendance = useCallback(async () => {
    if (!user || !selectedMood || submitting) return;
    setSubmitting(true);
    try {
      const payslip = buildPayslip(selectedMood);
      const attendanceRef = doc(db, "attendance", `${user.uid}_${today}`);
      const statsRef = doc(db, "daily_stats", today);

      await runTransaction(db, async (tx) => {
        const statsSnap = await tx.get(statsRef);

        tx.set(attendanceRef, {
          uid: user.uid,
          displayName:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          mood: selectedMood,
          payslip,
          date: today,
          createdAt: serverTimestamp(),
          voteCount: 0,
          voters: [],
        });

        statsSnap.exists()
          ? tx.update(statsRef, {
              total: increment(1),
              [`moods.${selectedMood}`]: increment(1),
            })
          : tx.set(statsRef, {
              total: 1,
              moods: { [selectedMood]: 1 },
              date: today,
            });
      });

      setMyMood(selectedMood);
      setMyPayslip(payslip);
      setPhase("done");
      setShowPayslipModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [user, selectedMood, submitting, today]);

  const votePayslip = useCallback(
    async (slipId) => {
      if (!user) return;
      try {
        const attendanceRef = doc(db, "attendance", slipId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(attendanceRef);
          if (!snap.exists()) return;
          if (snap.data().voters?.includes(user.uid)) return;
          tx.update(attendanceRef, {
            voteCount: increment(1),
            voters: arrayUnion(user.uid),
          });
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const handleMoodClick = (moodId) => {
    if (phase === "pick_mood") setSelectedMood(moodId);
  };

  return {
    user,
    phase,
    selectedMood,
    submitting,
    myPayslip,
    myMood,
    showPayslipModal,
    attendees,
    dailyStats,
    totalToday,
    featuredPayslips,
    dominantMood,
    slipSort,
    today,
    setShowPayslipModal,
    setSlipSort,
    submitAttendance,
    votePayslip,
    handleMoodClick,
  };
}
