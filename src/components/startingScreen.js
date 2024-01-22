function StartScreen({ totalQues, dispatch, highscore, options }) {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz!</h2>
      <h3>{totalQues} questions to test your react mastery</h3>
      <div className="startscreengrid">
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "startQuiz" })}
          disabled={options === null ? true : false}
        >
          Let's start
        </button>
        <select
          id="dropdown"
          value={options}
          onChange={(e) =>
            dispatch({ type: "setOption", payload: +e.target.value })
          }
          defaultValue={"DEFAULT"}
        >
          <option disabled selected={true} value="DEFAULT">
            select no. of questions
          </option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
        <p id="highscore">
          <span>🥇</span>Highscore:{highscore}
        </p>
      </div>
    </div>
  );
}

export default StartScreen;
