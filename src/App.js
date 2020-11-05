import React from 'react';
import './App.css';
import firebase from './utils/firebase';
import { db, tasksCollection, firebaseTimestamp } from './utils/firebase';
import { firebaseArrMaker } from './utils/tools';
import Header from './components/header';
import Tasks from './components/tasks';
import OverView from './components/overView';
import Form from './components/forms';


var taskList = [];

class App extends React.Component {
  constructor(props){ 
    super(props);
    this.state ={
      tasks: null,
      newTaskTitle: "",
      newTaskDetails: ""
    }

  }

componentDidMount(){
  this.showTasks();
};

showTasks(){
  tasksCollection.get().then( snapshot => {
    taskList = firebaseArrMaker(snapshot);
    this.setState({
      tasks: taskList
    });
    console.log(taskList);
    }).catch( error => console.log(error))
}

submitDetails(event){
    event.preventDefault(); // prevents the page from reloading after 'submit' is pressed. 
    taskList.push( {
      title: this.state.newTaskTitle,
      details: this.state.newTaskDetails,
      done: false
    } )
    alert(taskList[taskList.length-1].title);
}

render(){
  return (
      <div className="App">
        <Header taskNumber={taskList.length}/>
        <Form />
       <div className="completeContainer">
          <div>{taskList.map((task)=> ( 
              <Tasks taskTitle={task.title} taskDetails={task.details} taskRank={task.rank} doneButton={"Mark Done"} toggleDone={() => {
                task.done = (task.done === true ? false : true)}} />
            ))           
            }
          </div>
          <div className="overView">
            {taskList.map(task =>  <OverView taskNumber={taskList.indexOf(task) + 1} taskTitle={task.title}/>)}
          </div>
       </div>

      </div>
    )
  };
}



export default App;
