import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import {
  collection,
  doc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { EPISODES } from "../data/episodes";

export function useQuotes() {
  const user = useSelector((s) => s.auth.user);

  const [activeEpisode, setActiveEpisode] = useState(EPISODES[0]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalQuotes, setTotalQuotes] = useState({});

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "quotes"),
      where("episodeId", "==", activeEpisode.id),
      orderBy("voteCount", "desc"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (snap) => {
      setQuotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [activeEpisode.id]);

  useEffect(() => {
    const unsubscribes = EPISODES.map((ep) => {
      const q = query(
        collection(db, "quotes"),
        where("episodeId", "==", ep.id),
      );
      return onSnapshot(q, (snap) => {
        setTotalQuotes((prev) => ({ ...prev, [ep.id]: snap.size }));
      });
    });
    return () => unsubscribes.forEach((u) => u());
  }, []);

  const submitQuote = useCallback(
    async ({
      episodeId,
      episodeLabel,
      speakerId,
      speakerName,
      speakerType,
      text,
    }) => {
      if (!user) return;
      setSubmitting(true);
      try {
        await addDoc(collection(db, "quotes"), {
          episodeId,
          episodeLabel,
          speakerId,
          speakerName,
          speakerType,
          text,
          uid: user.uid,
          submittedBy:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          voteCount: 0,
          voters: [],
          createdAt: serverTimestamp(),
        });
        setShowSubmitModal(false);
      } catch (err) {
        console.error(err);
      } finally {
        setSubmitting(false);
      }
    },
    [user],
  );

  const voteQuote = useCallback(
    async (quoteId) => {
      if (!user) return;
      try {
        const quoteRef = doc(db, "quotes", quoteId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(quoteRef);
          if (!snap.exists()) return;
          if (snap.data().voters?.includes(user.uid)) return;
          tx.update(quoteRef, {
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

  const openSubmitModal = () => {
    if (user) setShowSubmitModal(true);
    else setShowLoginGate(true);
  };

  return {
    user,
    activeEpisode,
    quotes,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    totalQuotes,
    isEmpty: !loading && quotes.length === 0,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
    submitQuote,
    voteQuote,
    openSubmitModal,
  };
}
