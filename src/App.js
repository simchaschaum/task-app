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
import Login from './components/users/login';
import 'bootstrap/dist/css/bootstrap.min.css';

var taskList = [];
var property;

class App extends React.Component {

state = {
  loggedIn: false,  // if a user is logged in
  tasks: null,      // will be the array of tasks from Firebase 
  formDisp: false,  // whether to display the form to add or edit tasks
  signInDisp: false, // whether to display sign in/ register form 
  bgDim: false, // dims the background when form is displayed
  property: "addedAt", // the property by which to sort the tasks
  order: "desc",      // descending or ascending
  formState: "newTask", // determines whether the form will be editing or adding a task
  id: "",
  taskToEdit: "", 
  searchParams: "",
  showSearch: false, 
  taskDisp: "rows", // displays tasks in "rows" or "boxes" (3 or 4 per row)
  star: "",
  showDeets: false,  // on change, turns on/off detail view for all tasks 
  showDone: true  // determines whether it shows tasks that are done 
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

  showNotDone = () => {
    tasksCollection
      .where("done","==",false)
      .get()
      .then( snapshot => {
        taskList = firebaseArrMaker(snapshot);
        this.setState({
          tasks: taskList, showDone: false
      }, ()=> console.log(this.state.tasks));
      }
    ).catch( error => console.log(error));
  }

  taskSort = (e) => {
    if(e.target.name === "done" && this.state.showDone){
      this.setState({showDone: false}, ()=>this.showNotDone());
    } else {
      this.setState({property: e.target.name, showDone: true},() => this.getTasks() );
    }
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
    console.log(this.state.bgDim)
    this.state.formDisp ? 
      this.setState({formDisp: false, formState: "newTask", bgDim: false}) 
      : this.setState({formDisp: true, formState: "newTask", star: false, bgDim: true});
  }

  // opens form to edit existing task:
  editTask = (task, num) => {
    this.setEditForm(task.star);
    this.setState({
      formState: "editTask", 
      taskToEdit: task,
      id: num, 
      star: task.star,
      bgDim: true,
    }, () => this.setState({formDisp: true}));
  }

  toggleSignIn = () => {
    alert("works");
    this.state.signInDisp ? 
      this.setState({bgDim: false}, ()=> this.setState({signInDisp: false}))
      : this.setState({bgDim: true}, ()=> this.setState({signInDisp: true}));
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
 
  toggleDeets = () => {
    this.setState({showDeets: this.state.showDeets ? false : true})
  }

render(){

  var loggedIn = this.state.loggedIn ? "Logged In" : "Logged Out";
  
  var searchDisp = 
    <div>
      <p>Showing results for "{this.state.searchParams}"</p>
      <button className="btn btn-primary" onClick={this.finishSearch}>Close Search</button>
    </div>  
  
  var cols = this.state.taskDisp === "boxes" ? "taskContainerCols" : "taskContainerRows";
  var bgDim = this.state.bgDim === true ? "bgDim" : null;

  return (
    <>
        <div>
          {loggedIn}
        </div>
      {/* The form is outside 'app' - to avoid inheriting lower opacity when the form is displayed*/}
      <div style={{display: this.state.formDisp ? 'block' : 'none'}}> 
          <Form 
             ref="form"
             formState={this.state.formState} 
             updateDisp={this.updateDisp} 
             closeForm={this.toggleForm} 
             taskList={this.state.tasks} 
             taskToEdit={this.state.taskToEdit} 
             taskID={this.state.id} 
             taskStar={this.state.star}  
           />
      </div>
      <div style={{display: this.state.signInDisp ? 'block' : 'none'}}>
         <Login 
         toggleSignIn={this.toggleSignIn}/>
      </div>

      <div className="app" id={bgDim}>

      {/* along the left-side, non scrolling */}
       <div className="left-side">
          <Header 
            toggleDisplay={(e) => this.toggleDisplay(e)}
            toggleSignIn={()=>this.toggleSignIn()}
            formDisp={this.state.formDisp}
            toggleForm={this.toggleForm}
            taskSort={this.taskSort}
            order={this.state.order}
            showDone={this.state.showDone}
            showDeets={this.state.showDeets}
            toggleDeets={this.toggleDeets}
            />
        </div>

        {/* main body: */}
        <div className="main-body">
          {/* The new task/edit task form */}
       
{/* The complete quick list - bring back as a dropdown */}
          {/* <div className="overView card">
            {taskList.length > 0 ? 
              taskList.map(task =>  <OverView taskNumber={taskList.indexOf(task) + 1} taskTitle={task.title}/>)
            : "No tasks"
            }
          </div> */}

                <Search 
                  taskList={taskList} 
                  displaySearch={(fl,sp) => this.displaySearch(fl,sp)}
                  className="headerButton"
                  />

        {this.state.showSearch === false ? null : searchDisp}

        <div className={cols}>
            {taskList.length > 0 ? 
              taskList.map((task)=> ( 
                <div className="taskContainer">
                    <Tasks 
                      taskID={task.id} 
                      taskCols={this.state.taskDisp === "boxes" ? "taskCols" : null}
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
        
      </div>
    </>
    )
  };
}



export default App;

firebase.auth().onAuthStateChanged( user => {
  if (user) {
    console.log("user signed in: " + user.email);
    console.log("user signed in: " + user.uid);
  } else {
    console.log("no user");
  }
})

