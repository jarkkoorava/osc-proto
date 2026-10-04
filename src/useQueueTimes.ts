import { useEffect, useState } from "react";
import { skydivers, members } from "./data/manifest";

export const useQueueTimes = () => {
  const [startedAt] = useState(() => {
    const now = Date.now();
    return Object.fromEntries(
      members.map((person) => [
        person.id,
        now - Math.floor(Math.random() * 151) * 60_000,
      ]),
    );
  });
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return Object.fromEntries(
    skydivers.map((person) => [
      person.id,
      Math.max(0, Math.floor((now - startedAt[person.id]) / 60_000)),
    ]),
  );
};
