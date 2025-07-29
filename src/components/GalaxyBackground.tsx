"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
}

interface Planet {
  size: number;
  color: string;
  distance: number;
  orbitDuration: number;
  hasMoon: boolean;
}

export default function GalaxyBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const starList: Star[] = Array.from({ length: 150 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      opacity: Math.random(),
    }));
    setStars(starList);

    const planetList: Planet[] = Array.from({ length: 7 }, (_, i) => ({
      size: 20 + Math.random() * 20,
      color: `linear-gradient(135deg, hsl(${
        Math.random() * 360
      }, 70%, 60%), hsl(${Math.random() * 360}, 80%, 40%))`,
      distance: 80 + i * 70,
      orbitDuration: 30 + i * 20,
      hasMoon: Math.random() > 0.5,
    }));
    setPlanets(planetList);
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 z-[-1] bg-black overflow-hidden">
      {/* Camada de nebulosa focada no centro */}
      <div
        className="absolute inset-0 scale-[2] blur-3xl opacity-70"
        style={{
          background: `radial-gradient(circle at center, rgba(99,102,241,0.3) 0%, rgba(55,48,163,0.15) 30%, rgba(0,0,0,0.85) 70%, #000000 100%)`,
        }}
      />

      {/* Camada animada de profundidade */}
      <motion.div
        className="absolute inset-0 scale-[2.5] blur-2xl opacity-30"
        style={{
          background: `radial-gradient(circle at center, rgba(147,197,253,0.2), rgba(59,130,246,0.1), transparent 70%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
      />

      {/* Lens flare central */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0.15, scale: 1 }}
        animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full blur-3xl"
          style={{
            width: 600,
            height: 600,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%)",
          }}
        />
        <div
          className="absolute left-1/2 top-1/2 rounded-full blur-2xl"
          style={{
            width: 300,
            height: 300,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(147,197,253,0.35), transparent 80%)",
          }}
        />
      </motion.div>

      {/* Estrelas */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
        />
      ))}

      {/* Planetas e luas */}
      {planets.map((planet, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{ width: 0, height: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: planet.orbitDuration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div
            className="absolute rounded-full shadow-lg"
            style={{
              width: planet.size,
              height: planet.size,
              backgroundImage: planet.color,
              backgroundSize: "cover",
              transform: `translate(${planet.distance}px, -50%)`,
            }}
          >
            {/* Lua com órbita elíptica */}
            {planet.hasMoon && (
              <motion.div
                className="absolute"
                style={{
                  width: 0,
                  height: 0,
                  top: "50%",
                  left: "50%",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="absolute rounded-full bg-gray-300"
                  style={{
                    width: 8,
                    height: 8,
                    transform: `translate(25px, -15px)`,
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Nave em órbita */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: 0, height: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute"
          style={{
            transform: "translate(300px, -50%) rotate(45deg)",
            width: 28,
            height: 28,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M2 12L22 2L14 22L11 13L2 12Z"
              fill="white"
              stroke="white"
              strokeWidth="1"
            />
            <circle cx="13.5" cy="8.5" r="1.5" fill="#60a5fa" />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
