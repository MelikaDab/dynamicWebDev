import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { useState, useRef } from 'react'
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
        <button className='ml-8' onClick={() => props.deleteItem(props.id)} >
          <FontAwesomeIcon className="text-gray-500" title="delete-button" icon={faTrashCan} />
        </button>
      </li>
    </>
  )

}

const Modal = ({isOpen, headerLabel, children, onCloseRequested}) => {
  if (!isOpen) return null;
  const modalRef = useRef(null); // Create a reference for the inner div

  const handleOverlayClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCloseRequested(); // Close modal only if click was outside modalRef
    }
  };


  return (
  <div className='fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center' onClick={handleOverlayClick}>
    <div ref={modalRef} className='bg-white p-4 items-center justify-center rounded-md shadow-md'>
      <div className="flex justify-between items-center pb-2 mb-4">
        <h2 className="text-lg font-semibold">{headerLabel}</h2>
        <button onClick={onCloseRequested} aria-label="Close" className="text-gray-600 hover:text-black">
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>)
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
  const [isModalOpen, setIsModalOpen] = useState(false); // Tracks modal state

  const taskList = tasks?.map((task) => (
    <TodoItem id={task.id} name={task.name} completed={task.completed} key={task.id} toggleTaskCompleted={toggleTaskCompleted} deleteItem={handleDelete}/>
  ));

  const addTask = (name) => {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);

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
      {/* <AddTaskForm onNewTask={addTask} /> */}
      <button onClick={() => setIsModalOpen(true)} className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 active:bg-green-800 mb-4">
        Add Task
      </button>
      <Modal isOpen={isModalOpen} onCloseRequested={() => setIsModalOpen(false)} headerLabel="Add New Task"><AddTaskForm onNewTask={addTask}/></Modal>
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