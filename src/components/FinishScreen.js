import { useEffect, useState } from "react";

function FinishScreen({ points, maxPossiblePoints, highscore, dispatch }) {
  const percentage = (points / maxPossiblePoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🥳";
  if (percentage >= 50 && percentage < 80) emoji = "🎉";
  if (percentage >= 0 && percentage < 50) emoji = "😞";
  if (percentage === 0) emoji = "😭";
  const [existingScore, setExistingScore] = useState(null);
  useEffect(() => {
    async function existingHS() {
      const resp = await fetch(`http://localhost:8000/highscore/sd69`);
      const data = await resp.json();
      setExistingScore(data.highscore);
    }
    existingHS();
  }, []);

  useEffect(() => {
    async function changeArray() {
      fetch(`http://localhost:8000/highscore/sd69`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          highscore: existingScore > highscore ? existingScore : highscore,
        }),
      });
    }
    changeArray();
  }, [highscore, existingScore]);

  return (
    <>
      <p className="result">
        <span>{emoji}</span>
        You scored <strong>{points}</strong> out of {maxPossiblePoints} (
        {Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Score: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
