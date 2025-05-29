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
  const partsEl = part.map((part) => (
    <Part key={part.id} part={part.name} exercises={part.exercises} />
  ));
  return <div>{partsEl}</div>;
};

const Total = ({ exercises }) => {
  const totalExercise = exercises
    .map((part) => part.exercises)
    .reduce((sum, curr) => sum + curr);
  return <h3>total of {totalExercise} exercises</h3>;
};

const Course = ({ course }) => {
  return (
    <div>
      <Header course={course.name} />
      <Content part={course.parts} />
      <Total exercises={course.parts} />
    </div>
  );
};

export default Course;
