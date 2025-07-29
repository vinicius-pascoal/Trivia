'use client';

import { motion } from 'framer-motion';

export function Loader() {
  return (
    <motion.div
      className="text-xl font-semibold"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      Carregando pergunta...
    </motion.div>
  );
}
