"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const NUM_STARS = 100;

export default function GalaxyBackground() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: NUM_STARS }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden max-h-screen h-screen bg-black">
      {/* Nebulosa animada */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: [0.6, 0.7, 0.6], scale: [1, 1.05, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(circle at 50% 50%, #1e3a8a55, #000000 70%)`,
        }}
      />

      {/* Estrelas piscando */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}
