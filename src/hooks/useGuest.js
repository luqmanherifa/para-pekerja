import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import {
  doc,
  onSnapshot,
  increment,
  arrayUnion,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { GUESTS } from "../data/speakers";

export function useGuest() {
  const user = useSelector((s) => s.auth.user);
  const [guestData, setGuestData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribes = GUESTS.map((g) => {
      const ref = doc(db, "guests", g.id);
      return onSnapshot(ref, (snap) => {
        setGuestData((prev) => ({
          ...prev,
          [g.id]: snap.exists() ? snap.data() : { voteCount: 0, voters: [] },
        }));
        setLoading(false);
      });
    });
    return () => unsubscribes.forEach((u) => u());
  }, []);

  const voteGuest = useCallback(
    async (guestId) => {
      if (!user) return;
      try {
        const ref = doc(db, "guests", guestId);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (snap.exists() && snap.data().voters?.includes(user.uid)) return;
          if (snap.exists()) {
            tx.update(ref, {
              voteCount: increment(1),
              voters: arrayUnion(user.uid),
            });
          } else {
            tx.set(ref, {
              guestId,
              voteCount: 1,
              voters: [user.uid],
              createdAt: serverTimestamp(),
            });
          }
        });
      } catch (err) {
        console.error(err);
      }
    },
    [user],
  );

  const rankedGuests = [...GUESTS].sort((a, b) => {
    const va = guestData[a.id]?.voteCount ?? 0;
    const vb = guestData[b.id]?.voteCount ?? 0;
    return vb - va;
  });

  const totalVotes = Object.values(guestData).reduce(
    (sum, d) => sum + (d?.voteCount ?? 0),
    0,
  );

  return {
    user,
    guestData,
    loading,
    rankedGuests,
    totalVotes,
    voteGuest,
  };
}
