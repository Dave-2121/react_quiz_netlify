import { useEffect, useReducer } from "react";
import Header from "./Header.js";
import Main from "./main.js";
import Loader from "./Loader.js";
import Error from "./Error.js";
import StartScreen from "./startingScreen.js";
import Question from "./Question.js";
import NextButton from "./NextButton.js";
import Progress from "./Progress.js";
import FinishScreen from "./FinishScreen.js";
import Footer from "./Footer.js";
import Timer from "./Timer.js";
const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };

    case "dataFailed":
      return { ...state, status: "error" };

    case "startQuiz":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case "newAnswer":
      const CurQuestion = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          CurQuestion.correctOption === action.payload
            ? state.points + CurQuestion.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index:
          state.index < state.questions.length - 1
            ? state.index++
            : state.index,
        answer: null,
      };

    case "Finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case "restart":
      return {
        ...state,
        status: "ready",
        index: 0,
        points: 0,
        answer: null,
        secondsRemaining: null,
        highscore: 0,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "highScoreFetch":
      return { ...state, highscores: action.payload };
    case "setOption":
      return { ...state, option: action.payload };
    case "resetHS":
      return { ...state, highscores: [] };
    default:
      throw new Error("action is unknown");
  }
}
const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  option: null,
  secondsRemaining: null,
  highscores: [],
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    status,
    questions,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    highscores,
    option,
  } = state;

  useEffect(() => {
    async function FetchData() {
      try {
        const resp = await fetch("http://localhost:8000/questions");
        const data = await resp.json();
        dispatch({ type: "dataRecieved", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    FetchData();
  }, []);
  useEffect(() => {
    async function FetchHs() {
      try {
        const resp = await fetch("http://localhost:8000/highscore");
        const data = await resp.json();
        dispatch({ type: "highScoreFetch", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    FetchHs();
  }, [highscore]);

  const DerivedQuestions = questions?.slice(0, option);
  const totalPoints = DerivedQuestions.reduce(
    (acc, ele) => (acc += ele.points),
    0
  );

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "ready" && (
          <StartScreen
            totalQues={DerivedQuestions.length}
            dispatch={dispatch}
            highscore={highscores[0]?.highscore}
            options={option}
          />
        )}
        {status === "error" && <Error />}
        {status === "active" && (
          <>
            <Progress
              totalQues={DerivedQuestions.length}
              index={index}
              points={points}
              totalPoints={totalPoints}
              answer={answer}
            />
            <Question
              question={DerivedQuestions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />

              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                totalQues={DerivedQuestions.length}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={totalPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
