"use client";

import { useEffect, useState } from "react";
import { TriviaCard } from "../components/TriviaCard";
import { Loader } from "../components/Loader";

type GameState = "start" | "playing" | "finished";

export default function HomePage() {
  const [questionData, setQuestionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [gameState, setGameState] = useState<GameState>("start");
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 5;

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}&type=multiple`
      );
      const data = await res.json();

      if (data.response_code === 0 && data.results.length > 0) {
        setQuestionData(data.results[0]);
      } else {
        console.warn("Nenhuma pergunta encontrada. Tentando novamente...");
        await fetchQuestion(); // Recursão: tenta de novo
      }
    } catch (error) {
      console.error("Erro ao buscar pergunta:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean, diff: string) => {
    if (isCorrect) {
      const points = diff === "easy" ? 10 : diff === "medium" ? 20 : 30;
      setScore((prev) => prev + points);
    }

    if (questionCount + 1 >= maxQuestions) {
      setTimeout(() => {
        setGameState("finished");
        localStorage.setItem(
          "anime_trivia_score",
          String(
            score +
              (isCorrect
                ? diff === "easy"
                  ? 10
                  : diff === "medium"
                  ? 20
                  : 30
                : 0)
          )
        );
      }, 1000);
    } else {
      setQuestionCount((prev) => prev + 1);
      fetchQuestion();
    }
  };

  const startGame = () => {
    setScore(0);
    setQuestionCount(0);
    setGameState("playing");
    fetchQuestion();
  };

  const restartGame = () => {
    setGameState("start");
  };

  useEffect(() => {
    if (gameState === "playing") {
      fetchQuestion();
    }
  }, [difficulty]);

  return (
    
      <main className="text-center text-white p-4">
        <h1 className="text-4xl font-bold mb-6">Trivia</h1>

        {gameState === "start" && (
          <>
            <div className="mb-4">
              <label className="mr-2">Dificuldade:</label>
              <select
                className="text-black rounded-lg px-2 py-1"
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value as "easy" | "medium" | "hard")
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <button
              onClick={startGame}
              className="bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Jogar
            </button>
          </>
        )}

        {gameState === "playing" && (
          <>
            <div className="mb-4 flex items-center gap-4">
              <span className="text-lg">
                Pontuação: <strong>{score}</strong>
              </span>
              <span className="text-lg">
                Pergunta: {questionCount + 1}/{maxQuestions}
              </span>
            </div>
            {loading || !questionData ? (
              <Loader />
            ) : (
              <TriviaCard data={questionData} onAnswer={handleAnswer} />
            )}
          </>
        )}

        {gameState === "finished" && (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">🏁 Fim de jogo!</h2>
            <p className="text-xl">Sua pontuação final foi:</p>
            <p className="text-5xl font-bold">{score}</p>
            <button
              onClick={restartGame}
              className="mt-4 bg-white text-black px-6 py-2 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              Jogar Novamente
            </button>
          </div>
        )}
      </main>
    
  );
}
