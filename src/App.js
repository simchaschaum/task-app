import React from 'react';
import './App.css';
import firebase, { users } from './utils/firebase';
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
var settings, currentUser, loggedIn, userEmail, userID;

class App extends React.Component {

state = {
  loggedIn: false,  
  userID: "",   // the user ID of whoever's logged in
  userEmail: "",   // their email
  tasks: [],      // will be the array of tasks from Firebase 
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
  categories: [],   // array of all the categories
  showCategory: false,  // determines whether to show all categories (false) or just one (true)
  currentCategory: ""  // the current category, if any, to show
}

componentDidMount(){
  firebase.auth().onAuthStateChanged( user => {
    if (user) {
      console.log("Just checked - you're logged in!")
      console.log(user)
      userEmail = user.email;
      userID = user.uid;
    }
  this.checkUser();
})
};

// checkUser checks the current user AND toggles the sign in form!
checkUser = () => {
  categories.length = 0;
  currentUser = firebase.auth().currentUser;
  if(currentUser){
    userID = currentUser.uid;
    // console.log("I'm signed in!!")
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(error => console.log(error))
      .then(()=>console.log("persistence set"))
    this.setState({loggedIn: true, userEmail: currentUser.email, userID: userID}, ()=>{
      console.log(this.state.userEmail);
      this.setState({
        background: null, 
        signInDisp: false
      }, ()=>{
        this.loadUserSettings();
      } );
    } )
  } else {
    console.log("I'm signed out!!")
    this.setState({
      loggedIn: false,
      signInDisp: true,
      tasks: [],
      background: "white"}, ()=>
        console.log("no user at all :( " + this.state.signInDisp)
        );
  }
}

loadUserSettings = () => {
  users.get()
    .then(response => {
      var sc = firebaseArrMaker(response)[0].settings.showCategory;
      var cc = firebaseArrMaker(response)[0].settings.currentCategory;
      var sd = firebaseArrMaker(response)[0].settings.showDone;
      var pr = firebaseArrMaker(response)[0].settings.property;
      var or = firebaseArrMaker(response)[0].settings.order;
      this.setState({
        showCategory: sc,
        currentCategory: cc,
        showDone: sd,
        property: pr,
        order: or
      }, ()=>{
        this.getTasks()
      } )
    })
} 

getTasks(){
  tasksCollection
    .where("userID","==",this.state.userID)
    .orderBy(this.state.property, this.state.order)
    .get()
    .then( snapshot => {
      taskList = firebaseArrMaker(snapshot);
      console.log(taskList);
      if(this.state.property === "date"){
        this.dateFirst(taskList);
      }
      this.setState({
        tasks: taskList,
        noTasks: taskList.length > 0 ? "loading" : "noTasks"
      }, ()=> this.getCategories(this.state.tasks));
    } 
  
    ).catch( error => console.log(error));
  // }
}

dateFirst = () => {
  var datedTasks = taskList.filter(item => item.date !== "");
  var allTasks = [... datedTasks];
  taskList.map(item => item.date === "" && allTasks.push(item));
  taskList = allTasks;
  }

  getCategories = (tasks) => {
    var catRawArray = this.state.tasks.map(item => item.category).forEach(item=> {
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
      this.setState({showDone: false}, ()=>{
        this.showNotDone();
        this.updateUserSettings();
      } );
    } else {
      this.setState({property: e.target.name, showDone: true, order: e.target.name === "date" ? "asc" : "desc"},() => {
        this.getTasks();
        this.updateUserSettings();
      }  );
    }
  }

  showCategory = (cat) => {
    if(cat === "all"){
      this.setState({showCategory: false}, ()=>{
        this.getTasks();
        this.updateUserSettings();
      } )
    } else {
      this.setState({showCategory: true, currentCategory: cat},()=>{
        this.getTasks();
        this.updateUserSettings();
      } )
    }
  }

  updateUserSettings = () => {
    users.doc(this.state.userID).update({
      settings: {
        showCategory: this.state.showCategory,
        currentCategory: this.state.currentCategory,
        showDone: this.state.showDone,
        property: this.state.property,
        order: this.state.order
      }
    })
  }

  // toggles the display between boxes and rows
  toggleDisplay = (e) => {
    this.setState({taskDisp: e})
  }

  // opens and closes form for starting new task
  toggleForm = () => {
    if(this.state.formDisp){
      this.setState({formState: "newTask", background: null},()=>this.setState({formDisp: false})) 
    } else {
      this.setState({formState: "newTask", star: false, background: "dim"}, ()=>this.setState({formDisp: true}));
    }
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
      this.setState({searchParams: searchParams}, ()=>this.setState({tasks: filteredList, searchParams: searchParams}, ()=>this.setState({showSearch: true, noTasks: "search"}, ()=>
      console.log(this.state.searchParams))) )  
    }

  finishSearch = () => {
    this.setState({showSearch: false, noTasks: "loading"}, () => this.getTasks());
    document.getElementById("searchInput").value = "";
    }
 
  toggleDeets = () => {
    this.setState({showDeets: this.state.showDeets ? false : true})
  }

  signOut = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            console.log("signed out");
            this.checkUser();
        } )
        .catch(error => console.log(error))
  }

render(){
  
  var searchDisp = 
    <div id="searchDispDiv">
      <p id="searchParamsDisp">Showing results for "{this.state.searchParams}"</p>
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

  var tasksToShow = !this.state.showCategory ? this.state.tasks
      : this.state.tasks.filter(item => item.category === this.state.currentCategory);

  return (
    <>
      <header>
        <div>
          <h1 id="title">Stay Organized!</h1>
        </div>
        <div className="loginMessage">
          {loginMessage}
          <button className="logOut btn btn-sm btn-secondary" onClick={this.signOut}>Log out</button>
        </div>
      </header>
        
      {/* The form is outside 'app' - to avoid inheriting lower opacity when the form is displayed*/}
      <div style={{display: this.state.formDisp ? 'block' : 'none'}}> 
          <Form 
             ref="form"
             formState={this.state.formState} 
             updateDisp={this.checkUser} 
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
              getUser={()=>this.checkUser()}
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
            getUser={()=>this.checkUser()}
            formDisp={this.state.formDisp}
            toggleForm={this.toggleForm}
            order={this.state.order}
            showDone={this.state.showDone}
            showDeets={this.state.showDeets}
            toggleDeets={this.toggleDeets}
            loggedIn={loggedIn}
            categories={this.state.categories}
            taskSort={this.taskSort}
            showCategory={this.showCategory}
            />
        </div>

        {/* main body: */}
        <div className="main-body">
       
                <Search 
                  taskList={taskList} 
                  displaySearch={(fl,sp) => this.displaySearch(fl,sp)}
                  className="headerButton"
                  />

        {this.state.showSearch === false ? null : searchDisp}

        <div className={cols}>
            {tasksToShow.length > 0 ? 
              tasksToShow.map((task)=> ( 
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
                      updateDisp={this.checkUser} 
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
//     console.log(user)
//     userEmail = user.email;
//     loggedIn = true;
//   } else {
//     console.log("no user");
//     loggedIn = false;
//   }
// })

// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
//   .then(()=>console.log("persistence"))
//   .catch(error => console.log(error));