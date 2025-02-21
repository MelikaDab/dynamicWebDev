import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { nanoid } from "nanoid"

const INITIAL_DATA = [
  { id: "todo-0", name: "Eat", completed: true },
  { id: "todo-1", name: "Sleep", completed: false },
  { id: "todo-2", name: "Repeat", completed: false },
];

const TodoItem = (props) => {
  return (
    <>
      <li>
        <label htmlFor={props.id}>
          <input id={props.id} type="checkbox"
           defaultChecked={props.completed} 
           onChange={() => props.toggleTaskCompleted(props.id)} />
           {props.name}
        </label>
        <button className='ml-8' onClick={() => props.deleteItem(props.id)} ><FontAwesomeIcon className="text-gray-500" title="delete-button" icon={faTrashCan} /></button>
      </li>
    </>
  )

}

const AddTaskForm = ({ onNewTask }) => {
  const [textField, setTextField] = useState("");

  function handleButtonClicked() {
    onNewTask(textField);
    setTextField("");
  }

  return (
    <div className='mb-4'> {/* Unfortunately comments in JSX have to be done like this */}
      <input value={textField} placeholder="New task name" 
      onChange={(e) => setTextField(e.target.value)} 
      className="border-3 border-black-600 rounded-md p-3 mr-4" />
      <button type='submit' onClick={handleButtonClicked} className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 active:bg-blue-800">Add task</button>
    </div>
  )
}

function App(props) {
  const [tasks, setTasks] = useState(INITIAL_DATA);

  const taskList = tasks?.map((task) => (
    <TodoItem id={task.id} name={task.name} completed={task.completed} key={task.id} toggleTaskCompleted={toggleTaskCompleted} deleteItem={handleDelete}/>
  ));

  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);

  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed }
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function handleDelete(id) {
    setTasks(tasks.filter( task => task.id !== id));
  }

  return (
    <main className="m-4"> {/* Tailwind: margin level 4 on all sides */}
      <AddTaskForm onNewTask={addTask} />
      <section>
        <h1 className="text-xl font-bold">To do</h1>
        <ul>
          {taskList}
        </ul>

      </section>
    </main>
  );

}

export default App