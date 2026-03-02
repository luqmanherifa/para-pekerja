import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  runTransaction,
} from "firebase/firestore";

const PREVIEW_COUNT = 4;

export function useJobs() {
  const user = useSelector((s) => s.auth.user);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newJobId, setNewJobId] = useState(null);
  const [jobSort, setJobSort] = useState("top");

  useEffect(() => {
    const q =
      jobSort === "top"
        ? query(
            collection(db, "jobs"),
            orderBy("approved", "desc"),
            limit(PREVIEW_COUNT + 1),
          )
        : query(
            collection(db, "jobs"),
            orderBy("createdAt", "desc"),
            limit(PREVIEW_COUNT + 1),
          );
    return onSnapshot(q, (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [jobSort]);

  const submitJob = useCallback(
    async ({ title, description }) => {
      if (!user) return;
      setSubmitting(true);
      try {
        const ref = await addDoc(collection(db, "jobs"), {
          title,
          description,
          submittedBy:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          uid: user.uid,
          approved: 0,
          voters_approved: [],
          createdAt: serverTimestamp(),
        });
        setNewJobId(ref.id);
        setShowSubmitModal(false);
        setTimeout(() => setNewJobId(null), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [user],
  );

  const voteJob = useCallback(
    async (jobId, hasVoted) => {
      if (!user) return;
      try {
        const jobRef = doc(db, "jobs", jobId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(jobRef);
          if (!snap.exists()) return;
          if (hasVoted) {
            tx.update(jobRef, {
              approved: increment(-1),
              voters_approved: arrayRemove(user.uid),
            });
          } else {
            tx.update(jobRef, {
              approved: increment(1),
              voters_approved: arrayUnion(user.uid),
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const openSubmitModal = () => {
    if (user) setShowSubmitModal(true);
    else setShowLoginGate(true);
  };

  const displayJobs = jobs.slice(0, PREVIEW_COUNT);
  const hasMore = jobs.length > PREVIEW_COUNT;
  const isEmpty = jobs.length === 0 && !loading;

  return {
    user,
    jobs: displayJobs,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    newJobId,
    hasMore,
    isEmpty,
    PREVIEW_COUNT,
    jobSort,
    setShowSubmitModal,
    setShowLoginGate,
    setJobSort,
    submitJob,
    voteJob,
    openSubmitModal,
  };
}
