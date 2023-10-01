import './App.css'

const Course = ({ courses }) => {
  const exercises0 = courses[0].parts.reduce((sum, part) => sum + part.exercises, 0);
  const exercises1 = courses[1].parts.reduce((sum, part) => sum + part.exercises, 0);
  const kurssit0 = courses[0];
  const kurssit1 = courses[1];
  return (
    <div>
      <div key={courses.id}>
        <h1>{kurssit0.name}</h1>
        {kurssit0.parts.map(part => (
          <div key={part.id}>
            {part.name} - {part.exercises}
          </div>
        ))}
        <h3>total of {exercises0} exercises </h3>
      </div>
      <div>
        <div key={courses.id}>
          <h1>{kurssit1.name}</h1>
          {kurssit1.parts.map(part => (
            <div key={part.id}>
              {part.name} - {part.exercises}
            </div>
          ))}
          <h3>total of {exercises1} exercises </h3>
        </div>
      </div>
    </div>
  );
};
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <Course courses={courses} />
    </div>
  )
}

export default App