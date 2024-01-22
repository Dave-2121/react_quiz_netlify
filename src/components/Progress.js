function Progress({ totalQues, index, points, totalPoints, answer }) {
  return (
    <header className="progress">
      <progress max={totalQues} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong>/{totalQues}
      </p>
      <p>
        <strong>{points}</strong>/{totalPoints}
      </p>
    </header>
  );
}

export default Progress;
