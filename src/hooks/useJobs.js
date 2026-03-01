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

  useEffect(() => {
    const q = query(
      collection(db, "jobs"),
      orderBy("approved", "desc"),
      limit(PREVIEW_COUNT + 1),
    );
    return onSnapshot(q, (snap) => {
      setJobs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

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
          rejected: 0,
          voters_approved: [],
          voters_rejected: [],
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
    async (jobId, type, hasVotedApproved, hasVotedRejected) => {
      if (!user) return;
      const opposite = type === "approved" ? "rejected" : "approved";
      const alreadyVotedThis =
        type === "approved" ? hasVotedApproved : hasVotedRejected;
      const alreadyVotedOpposite =
        type === "approved" ? hasVotedRejected : hasVotedApproved;

      try {
        const jobRef = doc(db, "jobs", jobId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(jobRef);
          if (!snap.exists()) return;

          if (alreadyVotedThis) {
            tx.update(jobRef, {
              [type]: increment(-1),
              [`voters_${type}`]: arrayRemove(user.uid),
            });
          } else if (alreadyVotedOpposite) {
            tx.update(jobRef, {
              [type]: increment(1),
              [`voters_${type}`]: arrayUnion(user.uid),
              [opposite]: increment(-1),
              [`voters_${opposite}`]: arrayRemove(user.uid),
            });
          } else {
            tx.update(jobRef, {
              [type]: increment(1),
              [`voters_${type}`]: arrayUnion(user.uid),
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
    setShowSubmitModal,
    setShowLoginGate,
    submitJob,
    voteJob,
    openSubmitModal,
  };
}
