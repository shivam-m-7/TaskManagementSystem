import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountDetails from './Modal';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const [duedate, setDate] = useState('');
  const [status, setStatus] = useState();
  const [todos, setTodos] = useState([{task:"babu"},{task:"shiva"},{task:"pillalu"}]);
  var userId=localStorage.getItem("userId");
  const addTask = () => {
   
      axios
        .post('http://localhost:3000/task/tasks', { title, description, duedate, status, userId})
        .then((result) => {
          setTasks([...tasks, result.data]);
          //setTask('');
          alert("Task added successfully")
        })
        .catch((err) => console.log(err));
   
  };
  useEffect(()=>{
    axios
    .get('http://localhost:3000/task/tasks')
    .then((res) => {
      console.log(res.data);
      setTodos(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  },[])
function drag(e){
  e.dataTransfer.setData("text", e.target.id);
}
function allowDrop(ev) {
  ev.preventDefault();
}
function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

  return (
    <div className="task-management-system">
      <nav className="home-navbar">
        <div className="home-profile modal">        
          <AccountDetails />
        </div>
        <div className="home-center">
          <h1>Task Management System</h1>
        </div>
        <div>
          <button className="home-full-rounded" onClick={async() => {
            await axios.post("http://localhost:3000/auth/logout")
            console.log(document.cookie)
            document.cookie=""
            navigate('/')}}>
            <span>Logout</span>
            <div className="home-border home-full-rounded"></div>
          </button>
        </div>
      </nav>
      <div className="board">
        <div className="column pending"   onDrop={(e)=>{drop(e)}} onDragOver={(e)=>{allowDrop(e)}}>
          <h2>Pending</h2>
          <div className="tasks" >
            {todos?.map((t, index) => (
              <div key={index} id={index} draggable={true} className="task" onDragStart={drag}>
                {index + 1}. {t.title}
                <div><p>{t.description}</p>
                </div>
                <div> <input
                      type="date"
                      value={t.duedate?.substring(0, 10)}                      
                      className="input_box"
                      disabled="true"
                    />    
                </div>
                <div><p>{t.status}</p>
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New Task"
            className="input_box"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="input_box"
          />
          <input
            type="date"
            value={duedate}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Due Date"
            className="input_box"
          />    
          <div><label>
            Status:
          <select defaultValue="Open" onChange={(e) => setStatus(e.target.value)} value={status}>
          <option value="Open">Open</option>
          <option value="Inprogress">Inprogress</option>
          <option value="Completed">Completed</option>
        </select>
        </label>
        </div>       
          
         <div><button onClick={addTask}>Add Task</button></div>
          
        </div>
        <div className="column progress" onDrop={(e)=>{drop(e)}} onDragOver={(e)=>{allowDrop(e)}}>
          <h2>Progress</h2>
          {/* Tasks in progress can be shown here */}
        </div>
        <div className="column completed"  onDrop={(e)=>{drop(e)}} onDragOver={(e)=>{allowDrop(e)}}>
          <h2>Completed</h2>
          {/* Completed tasks can be shown here */}
        </div>
      </div>
    </div>
  );
};

export default Main;
