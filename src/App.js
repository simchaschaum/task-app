import React from 'react';
import './App.css';
import firebase from './utils/firebase';
import { db, tasksCollection, firebaseTimestamp } from './utils/firebase';
import { firebaseArrMaker } from './utils/tools';
import Header from './components/header';
import Tasks, { Notasks } from './components/tasks';
import OverView from './components/overView';
import Form from './components/forms';
import Search from './components/search';

var taskList = [];
var property;

class App extends React.Component {

state = {
  tasks: null,
  formDisp: false,
  property: "addedAt",
  order: "desc",
  formState: "newTask",
  id: "",
  taskToEdit: "", 
  searchParams: "",
  showSearch: false
}

componentDidMount(){
  this.getTasks();
};

getTasks(){
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
        property = "priority";
        break;
      case "dateEntered":
        property = "addedAt";
        break;
      default:
        property = "date";
        break;
    }
    var order = this.state.order === "desc" ? "asc" : "desc";
    this.setState({property: order, order: order}, () => this.taskDisplay(property, order))
  }

  updateDisp = () => {
    this.taskDisplay(this.state.property, this.state.order);
  }

  taskDisplay = (property,order) => {
    this.getTasks();
    var num = order === "asc" ? 1 : -1
    this.state.tasks.sort((a, b) => {
      return a.property > b.property ? num : - num
    })
  }

  // toggles form between entering new task and editing existing task:
  toggleForm = () => {
    this.state.formDisp ? this.setState({formDisp: false, formState: "newTask"}): this.setState({formDisp: true, formState: "newTask"});
  }

  // opens form to edit existing task:
  editTask = (task, num) => {
    this.setState({
      formState: "editTask", 
      taskToEdit: task,
      id: num, 
    }, () => this.setState({formDisp: true}));
  }
  
  displaySearch = (filteredList, searchParams) => {
    this.setState({tasks: filteredList, searchParams: searchParams, showSearch: true});
    taskList = filteredList;
  }

  finishSearch = () => {
    this.setState({showSearch: false}, () => this.getTasks())  
    }
 
render(){

  var searchDisp = 
    <div>
      <p>Showing results for "{this.state.searchParams}"</p>
      <button className="btn btn-primary" onClick={this.finishSearch}>Close Search</button>
    </div>  

  return (
      <div className="App">

        <Header taskNumber={taskList.length}/>
        <Search taskList={taskList} displaySearch={(e,p) => this.displaySearch(e,p)}/>

        <div className="formContainer container">
          {this.state.formDisp ? null : <button className="btn btn-primary" onClick={this.toggleForm}>Add Task</button>}
         <div style={{display: this.state.formDisp ? 'block' : 'none'}}> 
           <Form 
            formState={this.state.formState} 
            updateDisp={this.updateDisp} 
            closeForm={this.toggleForm} 
            taskList={this.state.tasks} 
            taskToEdit={this.state.taskToEdit} 
            taskID={this.state.id} 
            />
          </div>
        </div>

        <div className="buttonContainer"> Display: 
          <button className="btn btn-primary" value="priority" onClick={this.taskSort}>By Priority ({this.state.order === "desc" ? "Ascending" : "Descending"})</button>
          <button className="btn btn-primary" value="dateEntered" onClick={this.taskSort}>By Date Entered</button>
          <button className="btn btn-primary" value="dateDue" onClick={this.taskSort}>By Date Due</button>
        </div>

        <div className="completeContainer">
        <div className="overView card">
            {taskList.length > 0 ? 
              taskList.map(task =>  <OverView taskNumber={taskList.indexOf(task) + 1} taskTitle={task.title}/>)
            : "No tasks"
            }
          </div>
          <div>
            {this.state.showSearch === false ? null : searchDisp}
            {taskList.length > 0 ? 
              taskList.map((task)=> ( 
                <Tasks taskID={task.id} taskTitle={task.title} taskDetails={task.details} taskPriority={task.priority} taskDone={task.done} updateDisp={this.updateDisp} editTask={() => this.editTask(task,task.id)} dateDue={task.date} toggleDone={() => {
                  task.done = (task.done === true ? false : true)}} />
              ))           
              : <Notasks />}
          </div>
        </div>

      </div>
    )
  };
}



export default App;


/*
To Do:
1. edit task 
2. search feature
3. Layout... 
4. Buttons - make menus for search, overview, and display order 
*/