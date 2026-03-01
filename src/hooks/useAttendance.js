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
  const [loginNudgeMood, setLoginNudgeMood] = useState(null);

  const [attendees, setAttendees] = useState([]);
  const [dailyStats, setDailyStats] = useState({});
  const [totalToday, setTotalToday] = useState(0);
  const [featuredPayslips, setFeaturedPayslips] = useState([]);
  const [dominantMood, setDominantMood] = useState(null);

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
    return onSnapshot(doc(db, "daily_featured", today), (snap) => {
      if (snap.exists()) setFeaturedPayslips(snap.data().payslips ?? []);
    });
  }, [today]);

  const submitAttendance = useCallback(async () => {
    if (!user || !selectedMood || submitting) return;
    setSubmitting(true);
    try {
      const payslip = buildPayslip(selectedMood);
      const attendanceRef = doc(db, "attendance", `${user.uid}_${today}`);
      const statsRef = doc(db, "daily_stats", today);
      const featuredRef = doc(db, "daily_featured", today);

      await runTransaction(db, async (tx) => {
        const [statsSnap, featuredSnap] = await Promise.all([
          tx.get(statsRef),
          tx.get(featuredRef),
        ]);

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

        const entry = {
          id: `${user.uid}_${today}`,
          uid: user.uid,
          displayName:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          mood: selectedMood,
          hrNote: payslip.hrNote,
          total: payslip.total,
          voteCount: 0,
          voters: [],
        };
        const existing = featuredSnap.exists()
          ? (featuredSnap.data().payslips ?? [])
          : [];
        if (!featuredSnap.exists())
          tx.set(featuredRef, { payslips: [entry], date: today });
        else if (existing.length < 5)
          tx.update(featuredRef, { payslips: [...existing, entry] });
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
        await runTransaction(db, async (tx) => {
          const featuredRef = doc(db, "daily_featured", today);
          const attendanceRef = doc(db, "attendance", slipId);
          const snap = await tx.get(featuredRef);
          if (!snap.exists()) return;
          const updated = (snap.data().payslips ?? []).map((s) =>
            s.id === slipId && !s.voters?.includes(user.uid)
              ? {
                  ...s,
                  voteCount: (s.voteCount ?? 0) + 1,
                  voters: [...(s.voters ?? []), user.uid],
                }
              : s,
          );
          tx.update(featuredRef, { payslips: updated });
          tx.update(attendanceRef, {
            voteCount: increment(1),
            voters: arrayUnion(user.uid),
          });
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user, today],
  );

  const handleMoodClick = (moodId) => {
    if (phase === "guest") setLoginNudgeMood(moodId);
    else if (phase === "pick_mood") setSelectedMood(moodId);
  };

  return {
    user,
    phase,
    selectedMood,
    submitting,
    myPayslip,
    myMood,
    showPayslipModal,
    loginNudgeMood,
    attendees,
    dailyStats,
    totalToday,
    featuredPayslips,
    dominantMood,
    today,
    setShowPayslipModal,
    setLoginNudgeMood,
    submitAttendance,
    votePayslip,
    handleMoodClick,
  };
}
