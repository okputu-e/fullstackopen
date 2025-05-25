const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ part }) => {
  const partsEl = part.map((part, index) => (
    <Part key={index} part={part.name} exercises={part.exercise} />
  ));
  return <div>{partsEl}</div>;
};

const Total = ({ exercises }) => {
  const totalExercise = exercises
    .map((part) => part.exercise)
    .reduce((sum, curr) => sum + curr);
  return <p>Number of exercises {totalExercise}</p>;
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercise: 10,
      },
      {
        name: "Using props to pass data",
        exercise: 7,
      },
      {
        name: "State of a component",
        exercise: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total exercises={course.parts} />
    </div>
  );
};

export default App;
