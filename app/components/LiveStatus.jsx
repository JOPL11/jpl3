import { useEffect, useState } from "react";
import styles from "../css/LiveStatus.module.css";

const SLOTS = [
  {
    from: 5, // morning
    texts: [
      "Morning coffee in hand. Drop me a line and I'll reply soon.",
      "Early bird mode. Say hi and I'll get back to you today.",
      "Just booted up for the day. Living inside Blender this morning.",
      "Fuelled by turkish coffee and ready to read your message.",
    ],
  },
  {
    from: 12, // afternoon
    texts: [
      "I'm at the beach but I'll get right back to you.",
      "Out getting some sun. Leave a message and I'll reply shortly.",
      "Knee deep in work, drop a line and I'll get back to you.",
      "Currently somewhere with sand between my toes. I'll reply soon.",
    ],
  },
  {
    from: 17, // evening
    texts: [
      "Sunset o'clock. I'll get back to you tonight or first thing tomorrow.",
      "Winding down for the day. Your message will get my attention soon.",
      "Dinner time. I'll reply as soon as I'm done eating.",
      "Golden hour vibes. Leave a note and I'll be in touch.",
    ],
  },
  {
    from: 21, // night (also covers 00:00–05:00)
    texts: [
      "Offline and (hopefully) asleep. Leave a message and I'll reply in the morning.",
      "Probably dreaming. I'll get back to you when the sun's up.",
      "Lights out on my end. Your message will be waiting for me tomorrow.",
      "It's late. It's quiet. Code time.",
    ],
  },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function getSlotIndex(hour) {
  let idx = -1;
  SLOTS.forEach((s, i) => {
    if (hour >= s.from) idx = i;
  });
  // before 5am falls through to the last slot (night)
  return idx === -1 ? SLOTS.length - 1 : idx;
}

function getHour(timeZone) {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hourCycle: "h23",
      ...(timeZone && { timeZone }),
    }).format(new Date())
  );
}

export default function LiveStatus({ timeZone }) {
  const [text, setText] = useState(null);

  useEffect(() => {
    let currentSlot = -1;

    const update = () => {
      const slot = getSlotIndex(getHour(timeZone));
      // only re-roll when the time slot actually changes,
      // otherwise the text would swap randomly every minute
      if (slot !== currentSlot) {
        currentSlot = slot;
        setText(pick(SLOTS[slot].texts));
      }
    };

    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [timeZone]);

  // render nothing until mounted, avoids SSR/hydration mismatch
  if (!text) return null;

  return (
    <div className={styles.status} role="status">
      <span className={styles.dot} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}