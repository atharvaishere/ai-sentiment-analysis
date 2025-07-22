import React, { useEffect, useRef } from "react";

const EMOJIS = [
  "😊", "😜", "🤪", "🤨", "🤯", "😡", "🫨", "🙂‍↔️", "🙂‍↕️", "😬", "😳", "🙄", "😯", "😦", "😧", "😶‍🌫️", "😱", "😮", "😨", "😰", "😲", "🥱", "😥", "😓", "😴", "🤗", "🤤", "😪", "🤔", "🫣", "😮‍💨", "😵", "🤭", "🫢", "😵‍💫", "🤐", "🫡", "🤫", "🥴", "😫", "😖", "😣", "☹️", "🙁", "😕", "😟", "😔", "😞", "😒", "😏", "🥳", "🤩", "🥸", "😎", "🤓", "😀", "😃", "😄", "😁", "😆", "🥹", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "🥰", "😝", "😛", "😤", "😭", "😐", "🤧", "🥴", "🤐"
];

function randomEdgePosition(width, height) {
  // Pick a random edge: 0=top, 1=right, 2=bottom, 3=left
  const edge = Math.floor(Math.random() * 4);
  switch (edge) {
    case 0: // top
      return { x: Math.random() * width, y: 0 };
    case 1: // right
      return { x: width, y: Math.random() * height };
    case 2: // bottom
      return { x: Math.random() * width, y: height };
    case 3: // left
      return { x: 0, y: Math.random() * height };
    default:
      return { x: 0, y: 0 };
  }
}

export default function EmojiSpiralBg() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const dropDuration = 5000; // ms
    const concurrentDrops = 6; // 4 emojis at a time

    // Each drop: {emojiIndex, startTime, start, end}
    let drops = Array.from({ length: concurrentDrops }, (_, i) => {
      const start = randomEdgePosition(width, height);
      const end = randomEdgePosition(width, height);
      return {
        emojiIndex: i,
        startTime: performance.now() + Math.random() * 800,
        start,
        end,
      };
    });

    function animate(time) {
      ctx.clearRect(0, 0, width, height);

      drops.forEach((drop, i) => {
        const elapsed = time - drop.startTime;
        const progress = Math.min(Math.max(elapsed / dropDuration, 0), 1);

        // Linear interpolation between start and end
        const x = drop.start.x + (drop.end.x - drop.start.x) * progress;
        const y = drop.start.y + (drop.end.y - drop.start.y) * progress;

        ctx.save();
        ctx.font = "3rem serif"; // Larger emoji
        ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Draw white stroke for contrast
        ctx.lineWidth = 8;
        ctx.strokeStyle = "#fff";
        ctx.strokeText(EMOJIS[drop.emojiIndex % EMOJIS.length], x, y);

        // Draw emoji fill
        ctx.fillStyle = "#fff"; // fallback, but emoji will use color
        ctx.fillText(EMOJIS[drop.emojiIndex % EMOJIS.length], x, y);

        ctx.restore();

        // If finished, reset this drop with next emoji and new random positions
        if (progress >= 1) {
          drop.emojiIndex += concurrentDrops;
          drop.startTime = time + Math.random() * 800;
          drop.start = randomEdgePosition(width, height);
          drop.end = randomEdgePosition(width, height);
        }
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="emoji-spiral-bg"
      style={{ width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
}