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
import LoginForm from './components/users/loginform';

var taskList = [];
var categories = [];
var property, currentUser, loggedIn, userEmail, userID;

class App extends React.Component {

state = {
  loggedIn: false,  
  userID: "",   // the user ID of whoever's logged in
  userEmail: "",   // their email
  tasks: null,      // will be the array of tasks from Firebase 
  formDisp: false,  // whether to display the form to add or edit tasks
  signInDisp: false, // whether to display sign in/ register form 
  background: null,  // controls cover over background when form/signin is up
  property: "addedAt", // the property by which to sort the tasks
  order: "desc",      // descending or ascending
  formState: "newTask", // determines whether the form will be editing or adding a task
  id: "",
  taskToEdit: "", 
  taskDetailsToEdit: "",
  searchParams: "",
  showSearch: false, 
  taskDisp: "rows", // displays tasks in "rows" or "boxes" (3 or 4 per row)
  star: "",
  showDeets: false,  // on change, turns on/off detail view for all tasks 
  showDone: true,  // determines whether it shows tasks that are done 
  noTasks: "loading", // determines what the NoTasks component says when there are no tasks (search/loading/no tasks)
  categories: []
}

componentDidMount(){
  this.getUser();
};

// getUser checks the current user AND toggles the sign in form!
getUser = () => {
  categories.length = 0;
  currentUser = firebase.auth().currentUser;
  if(currentUser){
    userID = currentUser.uid;
    this.setState({loggedIn: true, userEmail: currentUser.email, userID: userID}, ()=>{
      console.log(this.state.userEmail);
      this.setState({
        background: null, 
        signInDisp: false
      }, ()=>this.getTasks());
    } )
  } else {
    this.setState({
      loggedIn: false,
      signInDisp: true,
      background: "white"}, ()=>{
        console.log("no user at all :( " + this.state.signInDisp);
        taskList.length = 0;}
    );
  }
}

getTasks(){
  tasksCollection
    .where("userID","==",this.state.userID)
    .orderBy(this.state.property, this.state.order)
    .get()
    .then( snapshot => {
      taskList = firebaseArrMaker(snapshot);
      this.setState({
        tasks: taskList,
        noTasks: taskList.length > 0 ? "loading" : "noTasks"
      }, ()=> this.getCategories(taskList));
    } 
  
    ).catch( error => console.log(error));
}

  getCategories = (taskList) => {
    console.log(taskList);
    var catRawArray = taskList.map(item => item.category).forEach(item=> {
        if(!categories.includes(item)&&item!="No Category"){
          categories.push(item)
        }
      }
    )
    this.setState({categories: categories})
  }

  showNotDone = () => {
    tasksCollection
      .where("done","==",false)
      .where("userID","==",this.state.userID)
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

  showCategory = (cat) => {
    tasksCollection
    .where("category","==",cat)
    .where("userID","==",this.state.userID)
    .get()
    .then( snapshot => {
      taskList = firebaseArrMaker(snapshot);
      this.setState({
        tasks: taskList,
        showDone: false,
    }, ()=> console.log(this.state.tasks));
    }
  ).catch( error => console.log(error));
  }

  // toggles the display between boxes and rows
  toggleDisplay = (e) => {
    this.setState({taskDisp: e})
  }

  // opens and closes form for starting new task
  toggleForm = () => {
    this.state.formDisp ? 
      this.setState({formState: "newTask", background: null},()=>this.setState({formDisp: false})) 
      : this.setState({formState: "newTask", star: false, background: "dim"}, ()=>this.setState({formDisp: true}));
  }

  closeForm = () => {
    alert("closing!")
  }

  // opens form to edit existing task:
  editTask = (task, num) => {
    this.setEditForm(task.star, task.category);
    this.setState({
      formState: "editTask", 
      taskToEdit: task,
      taskDetailsToEdit: task.details,
      id: num, 
      star: task.star,
      background: "dim",
    }, () => this.setState({formDisp: true}));
  }

  setEditForm = (star, category) => {
    this.refs.form.setEditForm(star, category)
  }
  
  displaySearch = (filteredList, searchParams) => {
    this.setState({tasks: filteredList, searchParams: searchParams, showSearch: true, noTasks: "search"}, ()=>taskList = filteredList);
  }

  finishSearch = () => {
    this.setState({showSearch: false, noTasks: "loading"}, () => this.getTasks());
    document.getElementById("searchInput").value = "";
    }
 
  toggleDeets = () => {
    this.setState({showDeets: this.state.showDeets ? false : true})
  }

render(){
  
  var searchDisp = 
    <div>
      <p>Showing results for "{this.state.searchParams}"</p>
      <button className="btn btn-secondary" onClick={this.finishSearch}>Close Search</button>
    </div>  
  
  var cols = this.state.taskDisp === "boxes" ? "taskContainerCols" : "taskContainerRows";

  switch(this.state.background){
    case "dim":
      var background = "bgDim";
      break;
    case "white":
      var background = "bgWhite";
      break;
    default:
      var background = null;
      break;
  }

  var loginMessage = this.state.loggedIn? "Hello, " + this.state.userEmail + "!" : null;

  return (
    <>
        <div className="loginMessage">
          {loginMessage}
        </div>
      {/* The form is outside 'app' - to avoid inheriting lower opacity when the form is displayed*/}
      <div style={{display: this.state.formDisp ? 'block' : 'none'}}> 
          <Form 
             ref="form"
             formState={this.state.formState} 
             updateDisp={this.getUser} 
             closeForm={this.toggleForm} 
             taskList={this.state.tasks} 
             taskToEdit={this.state.taskToEdit} 
             taskID={this.state.id} 
             taskStar={this.state.star}  
             userID={this.state.userID}
            categories={this.state.categories}
           />
      </div>

      {this.state.signInDisp ? 
           <div style={{display:'block'}}>
           <LoginForm
              toggleSignIn={()=>this.toggleSignIn()}
              getUser={()=>this.getUser()}
              getTasks={()=>this.getTasks()}
           />
        </div>
        : null
    }
   
      <div className="app">
      <div className="cover" id={background}></div>

      {/* along the left-side, non scrolling */}
       <div className="left-side">
          <Header 
            toggleDisplay={(e) => this.toggleDisplay(e)}
            toggleSignIn={()=>this.toggleSignIn()}
            getUser={()=>this.getUser()}
            formDisp={this.state.formDisp}
            toggleForm={this.toggleForm}
            taskSort={this.taskSort}
            order={this.state.order}
            showDone={this.state.showDone}
            showDeets={this.state.showDeets}
            toggleDeets={this.toggleDeets}
            loggedIn={loggedIn}
            categories={this.state.categories}
            showCategory={this.showCategory}
            getUser={this.getUser}
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
                <div key={task.id} className="taskContainer">
                    <Tasks 
                      taskDisp={this.state.taskDisp}
                      taskID={task.id} 
                      taskCols={this.state.taskDisp === "boxes" ? "taskCols" : null}
                      taskTitle={task.title} 
                      taskDetails={task.details} 
                      taskStar={task.star} 
                      taskDone={task.done} 
                      taskCategory={task.category}
                      updateDisp={this.getUser} 
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
              : 
              <Notasks 
                      noTasks={this.state.noTasks}
                />}
        </div>

        </div>
      </div>
    </>
    )
  };
}



export default App;


// listener for changes 
// firebase.auth().onAuthStateChanged( user => {
//   if (user) {
//     console.log("user signed in: " + user.email);
//     console.log("user signed in: " + user.uid);
//     userEmail = user.email;
//     loggedIn = true;
//   } else {
//     console.log("no user");
//     loggedIn = false;
//   }
// })

