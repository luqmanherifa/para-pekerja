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

export function useBattles() {
  const user = useSelector((s) => s.auth.user);

  const [activeEpisode, setActiveEpisode] = useState(EPISODES[0]);
  const [battles, setBattles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [totalBattles, setTotalBattles] = useState({});
  const [battleSort, setBattleSort] = useState("top");

  useEffect(() => {
    setLoading(true);
    const q =
      battleSort === "top"
        ? query(
            collection(db, "battles"),
            where("episodeId", "==", activeEpisode.id),
            orderBy("totalVotes", "desc"),
            orderBy("createdAt", "desc"),
          )
        : query(
            collection(db, "battles"),
            where("episodeId", "==", activeEpisode.id),
            orderBy("createdAt", "desc"),
          );
    return onSnapshot(q, (snap) => {
      setBattles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [activeEpisode.id, battleSort]);

  useEffect(() => {
    const unsubscribes = EPISODES.map((ep) => {
      const q = query(
        collection(db, "battles"),
        where("episodeId", "==", ep.id),
      );
      return onSnapshot(q, (snap) => {
        setTotalBattles((prev) => ({ ...prev, [ep.id]: snap.size }));
      });
    });
    return () => unsubscribes.forEach((u) => u());
  }, []);

  const submitBattle = useCallback(
    async ({
      episodeId,
      episodeLabel,
      speakerAId,
      speakerAName,
      speakerAType,
      summaryA,
      speakerBId,
      speakerBName,
      speakerBType,
      summaryB,
    }) => {
      if (!user) return;
      setSubmitting(true);
      try {
        await addDoc(collection(db, "battles"), {
          episodeId,
          episodeLabel,
          speakerAId,
          speakerAName,
          speakerAType,
          summaryA,
          speakerBId,
          speakerBName,
          speakerBType,
          summaryB,
          uid: user.uid,
          submittedBy:
            user.displayName || user.email?.split("@")[0] || "Pekerja",
          voteCountA: 0,
          voteCountB: 0,
          totalVotes: 0,
          votersA: [],
          votersB: [],
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

  const voteBattle = useCallback(
    async (battleId, side) => {
      if (!user) return;
      try {
        const battleRef = doc(db, "battles", battleId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(battleRef);
          if (!snap.exists()) return;
          const data = snap.data();
          if (
            data.votersA?.includes(user.uid) ||
            data.votersB?.includes(user.uid)
          )
            return;
          if (side === "A") {
            tx.update(battleRef, {
              voteCountA: increment(1),
              totalVotes: increment(1),
              votersA: arrayUnion(user.uid),
            });
          } else {
            tx.update(battleRef, {
              voteCountB: increment(1),
              totalVotes: increment(1),
              votersB: arrayUnion(user.uid),
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

  return {
    user,
    activeEpisode,
    battles,
    loading,
    showSubmitModal,
    showLoginGate,
    submitting,
    totalBattles,
    battleSort,
    isEmpty: !loading && battles.length === 0,
    setActiveEpisode,
    setShowSubmitModal,
    setShowLoginGate,
    setBattleSort,
    submitBattle,
    voteBattle,
    openSubmitModal,
  };
}
