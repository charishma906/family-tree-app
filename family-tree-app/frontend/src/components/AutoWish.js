import { useEffect } from "react";

export default function AutoWish({ events = [] }) {
  useEffect(() => {
    const today = new Date();

    events.forEach((event) => {
      const key = `wish_${event.type}_${event.memberId}_${today.toDateString()}`;

      if (!localStorage.getItem(key)) {
        let message = "";

        if (event.type === "birthday") {
          message = `🎂 Happy Birthday ${event.memberName}! Wishing you a wonderful year ahead.`;
        }

        if (event.type === "anniversary") {
          message = `💍 Happy Anniversary ${event.memberName} & ${event.partnerName}!`;
        }

        if (event.type === "engagement") {
          message = `💕 Happy Engagement Anniversary ${event.memberName} & ${event.partnerName}!`;
        }

        if (message) {
          alert(message);
          localStorage.setItem(key, "sent");
        }
      }
    });
  }, [events]);

  return null;
}