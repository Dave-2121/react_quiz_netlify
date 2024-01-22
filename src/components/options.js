function Options({ question, dispatch, answer }) {
  return (
    <div className="options">
      {question.options.map((op, index) => {
        return (
          <button
            className={`btn btn-option ${answer === index ? "answer " : ""} ${
              answer !== null &&
              (index === question.correctOption ? "correct" : "wrong")
            }`}
            key={op}
            disabled={answer !== null}
            onClick={() =>
              dispatch({
                type: "newAnswer",
                payload: index,
              })
            }
          >
            {op}
          </button>
        );
      })}
    </div>
  );
}

export default Options;
