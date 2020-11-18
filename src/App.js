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
  tasks: null,      // will be the array of tasks from Firebase 
  formDisp: false,  // whether to display the form to add or edit tasks
  property: "addedAt", // the property by which to sort the tasks
  order: "desc",      // descending or ascending
  formState: "newTask", // determines whether the form will be editing or adding a task
  id: "",
  taskToEdit: "", 
  searchParams: "",
  showSearch: false, 
  taskDisp: "rows", // displays tasks in "rows" or "boxes" (3 or 4 per row)
  star: ""
}

componentDidMount(){
  this.getTasks();
};

getTasks(){
  tasksCollection
    .orderBy(this.state.property, this.state.order)
    .get()
    .then( snapshot => {
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
    this.setState({property: property, order: order}, () => this.getTasks(property, order))
  }

  updateDisp = () => {
    this.getTasks(this.state.property, this.state.order);
  }

  // toggles the display between boxes and rows
  toggleDisplay = (e) => {
    this.setState({taskDisp: e})
  }

  // opens and closes form for starting new task
  toggleForm = () => {
    this.state.formDisp ? this.setState({formDisp: false, formState: "newTask"}) : this.setState({formDisp: true, formState: "newTask", star: false});
  }

  // opens form to edit existing task:
  editTask = (task, num) => {
    this.setEditForm(task.star);
    this.setState({
      formState: "editTask", 
      taskToEdit: task,
      id: num, 
      star: task.star,
    }, () => this.setState({formDisp: true}));
  }

  setEditForm = (star) => {
    this.refs.form.setEditForm(star)
  }
  
  displaySearch = (filteredList, searchParams) => {
    this.setState({tasks: filteredList, searchParams: searchParams, showSearch: true});
    taskList = filteredList;
  }

  finishSearch = () => {
    this.setState({showSearch: false}, () => this.getTasks());
    document.getElementById("searchInput").value = "";
    }
 
render(){

  var searchDisp = 
    <div>
      <p>Showing results for "{this.state.searchParams}"</p>
      <button className="btn btn-primary" onClick={this.finishSearch}>Close Search</button>
    </div>  
  
  // var cont = this.state.taskdisp === "boxes" ? "taskContainerCols" : "taskContainerRows";
  var cols = this.state.taskDisp === "boxes" ? "taskContainerCols" : "taskContainerRows";

  return (
      <div className="App">
        <Header 
          taskNumber={taskList.length}
          toggleDisplay={(e) => this.toggleDisplay(e)}
          formDisp={this.state.formDisp}
          toggleForm={this.toggleForm}
          taskSort={this.taskSort}
          order={this.state.order}
          />

        <Search 
          taskList={taskList} 
          displaySearch={(fl,sp) => this.displaySearch(fl,sp)}
          />

{/* The new task/edit task form */}
        <div className="formContainer container">
          
         <div style={{display: this.state.formDisp ? 'block' : 'none'}}> 
           <Form 
              ref="form"
              formState={this.state.formState} 
              updateDisp={this.updateDisp} 
              closeForm={this.toggleForm} 
              taskList={this.state.tasks} 
              taskToEdit={this.state.taskToEdit} 
              taskID={this.state.id} 
              taskStar={this.state.star}  // FIX THIS HERE!!!
            />
          </div>
        </div>
{/* The buttons - should change to menu */}
       

      
{/* The complete quick list - bring back as a dropdown */}
          {/* <div className="overView card">
            {taskList.length > 0 ? 
              taskList.map(task =>  <OverView taskNumber={taskList.indexOf(task) + 1} taskTitle={task.title}/>)
            : "No tasks"
            }
          </div> */}

        {this.state.showSearch === false ? null : searchDisp}

        <div className={cols}>
            {taskList.length > 0 ? 
              taskList.map((task)=> ( 
                <div className="taskContainer">
                    <Tasks 
                      taskID={task.id} 
                      taskTitle={task.title} 
                      taskDetails={task.details} 
                      taskStar={task.star} 
                      taskDone={task.done} 
                      updateDisp={this.updateDisp} 
                      dateDue={task.date} 
                      editTask={() => 
                        this.editTask(task,task.id)
                      } 
                      toggleDone={() => {
                        task.done = (task.done === true ? false : true)
                      }} 
                    />
                  </div>
              ))           
              : <Notasks />}
        </div>
        

      </div>
    )
  };
}



export default App;

