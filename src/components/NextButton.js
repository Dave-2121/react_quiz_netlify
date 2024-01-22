function NextButton({ dispatch, answer, index, totalQues }) {
  if (answer === null) return null;
  if (index < totalQues - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

  if (index === totalQues - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "Finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
