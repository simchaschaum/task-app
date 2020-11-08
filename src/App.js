import React from 'react';
import './App.css';
import firebase from './utils/firebase';
import { db, tasksCollection, firebaseTimestamp } from './utils/firebase';
import { firebaseArrMaker } from './utils/tools';
import Header from './components/header';
import Tasks, { Notasks } from './components/tasks';
import OverView from './components/overView';
import Form from './components/forms';


var taskList = [];

class App extends React.Component {

state = {
  tasks: null,
  formDisp: false,
  property: "addedAt",
  order: "desc"
}

componentDidMount(){
  this.showTasks();
};

showTasks(){
  tasksCollection.get().then( snapshot => {
    taskList = firebaseArrMaker(snapshot);
    this.setState({
      tasks: taskList
    }, ()=> console.log(this.state.tasks));
    }
    ).catch( error => console.log(error));
}

  taskSort = (e) => {
    switch(e.target.value){
      case "priority":
        var property = "priority";
        break;
      case "dateEntered":
        var property = "addedAt";
        break;
      case "dateDue":
        var property = "date";
        break;
    }
    var order = this.state.order == "desc" ? "asc" : "desc";
    this.setState({property: order, order: order}, () => this.taskDisplay(property, order))
  }

  taskDisplay = (property,order) => {
    tasksCollection
    .orderBy(property, order)
    .get()
    .then( snapshot => {
      taskList = firebaseArrMaker(snapshot);
      this.setState({
        tasks: taskList
      }, ()=> console.log(this.state.tasks));
    })
    .catch( error => console.log(error));
  }

  updateDisp = () => {
    this.taskDisplay(this.state.property, this.state.order)
  }

  toggleForm = () => {
    this.state.formDisp ? this.setState({formDisp: false}): this.setState({formDisp: true});
  }
 
render(){

  return (
      <div className="App">
        <Header taskNumber={taskList.length}/>
        <div className="formContainer">
          <button onClick={this.toggleForm}>{this.state.formDisp ? "Close Form" : "Add New Task"}</button>
          <div className="form" style={{display: this.state.formDisp ? 'block' : 'none'}}> 
           <Form updateDisp={this.updateDisp} />
          </div>
        </div>
        <div className="buttonContainer"> Display: 
          <button value="priority" onClick={this.taskSort}>By Priority ({this.state.order == "desc" ? "Ascending" : "Descending"})</button>
          <button value="dateEntered" onClick={this.taskSort}>By Date Entered</button>
          <button value="dateDue" onClick={this.taskSort}>By Date Due</button>
        </div>
        <div className="completeContainer">
          <div>{taskList.length > 0 ? 
            taskList.map((task)=> ( 
              <Tasks taskID={task.id} taskTitle={task.title} taskDetails={task.details} taskPriority={task.priority} taskDone={task.done} taskDelete={this.updateDisp} dateDue={task.date} toggleDone={() => {
                task.done = (task.done === true ? false : true)}} />
            ))           
            : <Notasks />}
          </div>
          <div className="overView">
            {taskList.length > 0 ? 
              taskList.map(task =>  <OverView taskNumber={taskList.indexOf(task) + 1} taskTitle={task.title}/>)
            : "No tasks"
            }
          </div>
        </div>

      </div>
    )
  };
}



export default App;
