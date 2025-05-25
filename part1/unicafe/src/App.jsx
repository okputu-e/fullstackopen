import { useState } from "react";

const Button = ({ onClick, name }) => <button onClick={onClick}>{name}</button>;

const StatisticLine = ({ name, number }) => {
  return (
    <>
      <tr>
        <td>{name}</td>
        <td>{number}</td>
      </tr>
    </>
  );
};

const Statistics = ({ good, bad, neutral, total, average, positive }) => {
  return (
    <table>
      <tbody>
        <StatisticLine name="good" number={good} />
        <StatisticLine name="neutral" number={neutral} />
        <StatisticLine name="bad" number={bad} />
        <StatisticLine name="total" number={total} />
        <StatisticLine name="average" number={average} />
        <StatisticLine name="positive" number={positive + "%"} />
      </tbody>
    </table>
  );
};

const App = () => {
  // state values
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  // derived states
  const total = good + neutral + bad;
  const average = total === 0 ? 0 : (good - bad) / total;
  const positive = total === 0 ? 0 : (good / total) * 100;

  const handleGood = () => {
    setGood((prevGood) => prevGood + 1);
  };

  const handleNeutral = () => {
    setNeutral((prevNeutral) => prevNeutral + 1);
  };

  const handleBad = () => {
    setBad((prevBad) => prevBad + 1);
  };

  return (
    <main>
      {/* feedback */}
      <section className="feedback">
        <h1>give feedback</h1>
        <section className="btns">
          <Button onClick={handleGood} name="good" />
          <Button onClick={handleNeutral} name="neutral" />
          <Button onClick={handleBad} name="bad" />
        </section>
      </section>
      {/* stats */}
      <section className="statistics">
        <h2>Statistics</h2>
        {total !== 0 ? (
          <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
            total={total}
            average={average}
            positive={positive}
          />
        ) : (
          "No feedback given"
        )}
      </section>
    </main>
  );
};

export default App;
