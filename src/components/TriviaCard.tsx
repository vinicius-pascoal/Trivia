'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Props {
  data: {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
    difficulty: string;
  };
  onAnswer: (isCorrect: boolean, difficulty: string) => void;
}

export function TriviaCard({ data, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffled, setShuffled] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setShuffled(
      [...data.incorrect_answers, data.correct_answer].sort(() => 0.5 - Math.random())
    );
    setSelected(null);
    setTimeLeft(30);
  }, [data]);

  useEffect(() => {
    if (selected) return;
    if (timeLeft === 0) {
      setSelected("time_expired");
      setTimeout(() => {
        onAnswer(false, data.difficulty);
      }, 1000);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected]);

  const checkAnswer = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    setTimeout(() => {
      onAnswer(answer === data.correct_answer, data.difficulty);
    }, 1000);
  };

  const decode = (str: string) => {
    return str.replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&amp;/g, "&");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white text-black p-6 rounded-2xl shadow-xl max-w-xl w-full"
    >
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">{decode(data.question)}</h2>
        <div className={`font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-blue-600'}`}>
          ⏳ {timeLeft}s
        </div>
      </div>
      <div className="grid gap-3">
        {shuffled.map((option) => {
          const isCorrect = selected && option === data.correct_answer;
          const isWrong = selected && option === selected && option !== data.correct_answer;

          return (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              disabled={!!selected}
              className={`px-4 py-2 rounded-xl border font-medium transition-colors duration-300
                ${selected
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : isWrong
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200'
                  : 'bg-indigo-100 hover:bg-indigo-200'}
              `}
            >
              {decode(option)}
            </button>
          );
        })}
      </div>
      {selected === "time_expired" && (
        <p className="mt-3 text-red-500 font-semibold">Tempo esgotado!</p>
      )}
    </motion.div>
  );
}
