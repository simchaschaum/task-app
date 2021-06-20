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
import Schedule, { ScheduleDone } from './components/schedule';
import Button from 'react-bootstrap/Button';
import { all } from 'core-js/fn/promise';


var taskList = [];
var categories = [];
var settings, currentUser, loggedIn, userEmail, userID;

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
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
      filteredList: [],  // holds the list of tasks that result from the most recent search
      showSearch: false, 
      taskDisp: "rows", // displays tasks in "rows" or "boxes" (3 or 4 per row)
      star: "",
      showDeets: false,  // on change, turns on/off detail view for all tasks 
      showDone: true,  // determines whether it shows tasks that are done 
      noTasks: "loading", // determines what the NoTasks component says when there are no tasks (search/loading/no tasks)
      categories: [],   // array of all the categories
      showCategory: false,  // determines whether to show all categories (false) or just one (true)
      currentCategory: "", // the current category, if any, to show
      menuShow: false,   // toggles menu open and closed in mobile mode
      tasksDetailsExpanded: true, // when false closes all details in tasks 
      selectedTasks: [],  // array of tasks that were selected with a checkbox
      selectedTasksCleared: false, // when true, clears all selection 
      schedule: [],  // array of daily schedule
      showSchedule: false,   // shows schedule in Schedule component
      showScheduleTask: false, // shows only task that you chose from the schedule
      scheduleTaskToShow: [], // when in schedule mode, you click "show task", this is the task you see
      scheduleTaskToShowId: 0,  // the task ID of the task you see 
      wait: false
    }

  }

// Step 1: listens for signin state change, sets some variables -> checkUser function
componentDidMount(){
  firebase.auth().onAuthStateChanged( user => {
    if (user) {
      userEmail = user.email;
      userID = user.uid;
    }
    this.checkUser();
  })
};

// Step 2: checkUser checks the current user; 
// No user -> opens signin form
// User -> set persistence, sets states: userEmail, userID, logged in; then sets display; then --> loadusersettings function
checkUser = () => {
  categories.length = 0;
  currentUser = firebase.auth().currentUser;
  if(currentUser){
    userID = currentUser.uid;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .catch(error => console.log(error))
    this.setState({loggedIn: true, userEmail: currentUser.email, userID: userID}, ()=>{
      this.setState({
        background: null, 
        signInDisp: false
      }, ()=>{
        this.loadUserSettings();
      } );
    } )
  } else {
    this.setState({
      loggedIn: false,
      signInDisp: true,
      tasks: [],
      background: "white"}, ()=>
        console.log("no user at all :( " + this.state.signInDisp)
        );
  }
}

// Step 3: loads user settings from database, including display settings; also loads current schedule. Sets states.
loadUserSettings = () => {
  users.get()
    .then(response => {
      var user = firebaseArrMaker(response).filter(user => user.id === this.state.userID);
      if(typeof user[0].settings != "undefined"){
        var settings = user[0].settings;
          // var sc = settings.hasOwnProperty("showCategory") ? settings.showCategory : this.state.showCategory;
          var cc = settings.hasOwnProperty("currentCategory") ? settings.currentCategory : this.state.currentCategory;
          var pr = settings.hasOwnProperty("property") ? settings.property : this.state.property;
          var or = settings.hasOwnProperty("order") ? settings.order : this.state.order;
          var ss = settings.hasOwnProperty("showSchedule")? settings.showSchedule : this.state.showSchedule;
          var sc = settings.hasOwnProperty("schedule") ? settings.schedule : []; 
          this.setState({
            // I have no idea why this has to be like this and doesn't work with the variable above:
            showCategory: settings.hasOwnProperty("showCategory") ? settings.showCategory : this.state.showCategory,
            currentCategory: cc,
            property: pr,
            order: or,
            showSchedule: ss,
            schedule: sc,
            }, ()=>{
            this.getTasks()
          } )
        } else {
          this.getTasks();
        }
      }).catch(error => console.log("error loading settings" + error.message) )
    } 

// Step 4: gets tasks from database, sets them in state.tasks.  If state.showschedueltask is true
getTasks(){
  tasksCollection
    .where("userID","==",this.state.userID)
    .orderBy(this.state.property, this.state.order)
    .get()
    .then( snapshot => {
      taskList = firebaseArrMaker(snapshot);
      // Testing:
      console.log(taskList);
      if(this.state.property === "date"){
        this.dateFirst(taskList);
      }
      this.setState({
        // if state.showsearch is true - still showing searched for task, not the whole list
        tasks: this.state.showSearch ? this.state.filteredList : taskList,
        // tasks: taskList,
        noTasks: taskList.length === 0 ? "noTasks"  
          : this.checkAllDone(taskList) ? "loading" 
            : "allDone"
      }, ()=> {
        this.getCategories(this.state.tasks);
        this.updateSchedule(this.state.tasks); 
      } );
    })
    .then(()=>{
      if(this.state.showScheduleTask){
        var task = this.state.tasks.filter(task => task.id === this.state.scheduleTaskToShowId);
        this.setState({scheduleTaskToShow: task})
      };
    })
    .catch( error => console.log(error));
}

// Step 5 - updating the schedule 
updateSchedule = (tasks) => {
  var sched = this.state.schedule;
  var newSched = [];
  sched.forEach(schedTask => {
    tasks.forEach(task => {
      if(schedTask.id===task.id){
        newSched.push({
          id:task.id,            // for most of these, use task because that's from the list that's been updated.
          title:task.title,
          details:task.details,
          star:task.star,
          category:task.category,
          date:task.date, 
          done: schedTask.done,    // here, use schedTask because we are using the 'done' from the schedule, not from the task
          time: schedTask.time,   // same for time 
          order: schedTask.order  // same for order
        })
       }
    }
    )
    } 
  )  
    users.get()
    .then(response => {
      var selectedTasks = this.state.selectedTasks;
      var user = firebaseArrMaker(response).filter(user => user.id === this.state.userID);
      users.doc(user[0].id).update(
        {
          "settings.schedule": newSched
        }
      )
      })
      .then(()=>{
        this.setState({
          schedule: newSched,
          selectedTasks: [],
          selectedTasksCleared: true,
        });
      }
    )
      .then(()=>{
        this.setState({wait: false})
      })
}

checkAllDone(taskList){    // returns true if there is at least one task that isn't done yet
  var done = false;
  taskList.map(task => {
    if(task.done === false){ 
        done = true;
        return;
      } 
    });
    return done;
};

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
         });
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

  tasksDetailsToggle = (bool) => {
      this.setState({tasksDetailsExpanded: bool});
  }

  showCategory = (cat) => {
    if(cat === "all"){
      this.setState({showCategory: false}, ()=>{
        // this.getTasks();
        this.updateUserSettings();
      } )
    } else {
      this.setState({showCategory: true, currentCategory: cat},()=>{
        // this.getTasks();
        this.updateUserSettings();
      } )
    }
  }

  updateUserSettings = () => {
    users.doc(this.state.userID).update({
      "email": this.state.userEmail,
      "id": this.state.userID,
      "settings.showCategory" : this.state.showCategory,
      "settings.currentCategory" : this.state.currentCategory,
      "settings.showDone" : this.state.showDone,
      "settings.property": this.state.property,
      "settings.order" : this.state.order,
      "settings.schedule" : this.state.schedule,
      "settings.showSchedule" : this.state.showSchedule
    })
    .then((response)=>{
      console.log("settings updated");
    })
    .catch(error => console.log(error))
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
      this.setState({searchParams: searchParams, filteredList: filteredList, showSchedule: false}, 
        ()=>this.setState({tasks: filteredList, searchParams: searchParams}, 
          ()=>this.setState({showSearch: true, noTasks: "search"})))  
    }

  finishSearch = () => {
    this.setState({showSearch: false, noTasks: "loading"}, () => this.loadUserSettings());
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

  deleteDone = () => {
    if(window.confirm("Are you sure you want to delete all messages that are marked 'done'?")){
        var delArr = this.state.tasks.filter(task => task.done);
        delArr.forEach(task => {
          tasksCollection.doc(task.id).delete()
            .then(()=>{
              this.getTasks();
            })
            .catch(error => console.log(error))
        })
    }
  };
// UPDATING DISPLAY:
// updates the done status of the task in the display (happens concurrently to database updating)
toggleDone = (done, id) => {
  let allTasks = this.state.tasks;
  allTasks.forEach(task => {
    if(task["id"] === id){
      task["done"] = task["done"]? false : true;
    }
  } )
  this.setState({tasks: allTasks})
}
// deleteTask = (id) => {
//   let allTasks = this.state.tasks.filter(task => task["id"] !== id)
//   console.log(allTasks)
// }

menuShow = () => {
  this.setState({menuShow: this.state.menuShow ? false : true});  
};

toggleSelected = (id,title,details,star,cat,date) => {
  if(this.state.selectedTasksCleared){
    this.setState({selectedTasksCleared: false})
  }
  var selectedTasks = this.state.selectedTasks;
  var found = false;
  var index;
  selectedTasks.forEach(task => {
    if (task.id === id){
      index = selectedTasks.indexOf(task);
      found = true;
      selectedTasks.splice(index,1);
    }
  });
  if(!found) {
    selectedTasks.push({
      id:id,
      title:title,
      details:details,
      star:star,
      category:cat,
      date:date, 
      done: false,
      time: "",
      order: ""
    });
  }
  this.setState({selectedTasks:selectedTasks});
}

addToSchedule = () => {
  var selectedTasks = this.state.selectedTasks;
  var schedule = this.state.schedule;
  selectedTasks.forEach(selTask => {
    var exists = false;
    schedule.forEach(task => {
      if(task.id === selTask.id){
        exists = true;
      }
    })
    if(!exists){
      schedule.push(selTask);
    }
  })
  this.setState({selectedTasks: schedule}, ()=>{
    this.makeSchedule();
  });
}

verifyNewSchedule = () => {
  // Only create new schedule if EITHER there is no pre-existing schedule OR user confirms it's OK to overrwrite. 
  // separated the two conditions so confirmation doesn't pop pu when there's no pre-existing schedule.
  let ok = false;
  if (this.state.schedule.length === 0){
    ok = true;
  };
  if(ok===false){
    if( window.confirm("Creating a new schedule will overwrite the existing one.  Should we continue?")){
      ok=true
    }
  }
    if(ok){
      this.makeSchedule();
    }
}
waitChange = (tf) => {
  this.setState({wait: true})
}

makeSchedule = () => {
    var selectedTasks = this.state.selectedTasks;
    this.setState({showSchedule: true});
    users.doc(this.state.userID).update(
      {
        "settings.schedule": this.state.selectedTasks,
        "settings.showSchedule": true
      }
        )
      .then(()=>{
        if(this.state.selectedTasks.length !== 0){
          this.setState({
            schedule: this.state.selectedTasks
          }, ()=>{
              this.setState({
                selectedTasks: [],
                selectedTasksCleared: true
              }
          )
              })                                                                                                            
        };  

          })
      //   .then(()=>{
      //     this.setState({
      //       selectedTasks: [],
      //       selectedTasksCleared: true
      //     })
      //   }
      // )
      // .then(()=>{
        // ** NEED THIS AT ALL?
        // this.loadUserSettings(); 
        // this.updateSchedule(); 
      // })
    // }) // ** 
}

schedMove = (index, upDown) => {
  var num = upDown === "up" ? index-1 : index+1;
  var schedule = this.state.schedule;
  var task = schedule.splice(index,1);
  schedule.splice(num, 0, ...task);
  this.setState({selectedTasks: schedule}, ()=>{
    this.makeSchedule();
  })
}

schedUpdate = (schedule) => {
  this.setState({schedule: schedule})
}

showHideSchedule = () => {
  var bool = this.state.showSchedule ? false : true;
  this.setState({
    showSchedule: bool,
    selectedTasks: []
  });
  users.get().then(response => {
    var user = firebaseArrMaker(response).filter(user => user.id === this.state.userID);
    users.doc(user[0].id).update(
      {
        "settings.showSchedule": bool
      }
    )
  })
}

// When "show task" is clicked on a task when in schedule mode or back to schedule is clicked 
showScheduleTask = (id) => {
  var bool = this.state.showScheduleTask ? false : true;
  var task = this.state.tasks.filter(task => task.id === id)
  this.setState({scheduleTaskToShow: this.state.showScheduleTask ? [] : task}, ()=> {
    this.setState({showScheduleTask: bool, scheduleTaskToShowId: id});
    if(bool){
      window.scrollTo(0,0)
    } else {
      this.loadUserSettings();
    }
  } )
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

  const loginMessage = this.state.loggedIn? "Hello, " + this.state.userEmail + "!" : null;

  const tasksOfCategory = !this.state.showCategory ? this.state.tasks
      : this.state.tasks.filter(item => item.category === this.state.currentCategory);

  const tasksDone = tasksOfCategory.filter(task => task.done === true);
  const tasksNotDone = tasksOfCategory.filter(task => task.done === false);

  var selectedTrueFalse = this.state.selectedTasks.length > 0 ? false : true;

  const taskDisplay = 
    <div className={cols}>
      <div id="schedBtnDiv">
        {/* To display if a task is selected: */}
      {this.state.selectedTasks.length > 0 ? 
       <div id="schedBtnInnerDiv">
          {/* Create Schedule Button */}
            <Button id="dropdown-basic-button" className="schedBtn" onClick={this.verifyNewSchedule} > 
              <span className="btnDisText">Create Schedule</span>
              <img className="headerBtnImg" src="https://img.icons8.com/metro/26/ffffff/overtime.png"/>
              <img className="headerBtnImg" src="https://img.icons8.com/pastel-glyph/64/ffffff/edit--v1.png"/>                               
            </Button>
            <Button id="dropdown-basic-button" className="schedBtn" onClick={this.addToSchedule} > 
              <span className="btnDisText">Add To Existing Schedule</span>
              <img className="headerBtnImg" src="https://img.icons8.com/metro/26/ffffff/overtime.png"/>
              <img className="searchIcon" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUuOCwyNS44KSBzY2FsZSgwLjcsMC43KSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNODYsMTQuMzMzMzNjLTM5LjU4MTUsMCAtNzEuNjY2NjcsMzIuMDg1MTcgLTcxLjY2NjY3LDcxLjY2NjY3YzAsMzkuNTgxNSAzMi4wODUxNyw3MS42NjY2NyA3MS42NjY2Nyw3MS42NjY2N2MzOS41ODE1LDAgNzEuNjY2NjcsLTMyLjA4NTE3IDcxLjY2NjY3LC03MS42NjY2N2MwLC0zOS41ODE1IC0zMi4wODUxNywtNzEuNjY2NjcgLTcxLjY2NjY3LC03MS42NjY2N3pNMTE0LjY2NjY3LDkzLjE2NjY3aC0yMS41djIxLjVjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd2MGMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YtMjEuNWgtMjEuNWMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YwYzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N2gyMS41di0yMS41YzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N3YwYzMuOTU2LDAgNy4xNjY2NywzLjIxMDY3IDcuMTY2NjcsNy4xNjY2N3YyMS41aDIxLjVjMy45NTYsMCA3LjE2NjY3LDMuMjEwNjcgNy4xNjY2Nyw3LjE2NjY3djBjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd6Ij48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+"/>
            </Button>
       </div> 
        : null}
      </div>
          {tasksNotDone.length > 0 ? 
              tasksNotDone.map((task)=> ( 
                <div key={task.id} className="taskContainer">
                   <Tasks 
                      tasks={this.state.tasks}
                      updateSchedule={this.updateSchedule}
                      loadUserSettings={this.loadUserSettings}
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
                      toggleDone={(done, id) => {
                        this.toggleDone(done, id)
                      }} 
                      tasksDetailsExpanded = {this.state.tasksDetailsExpanded}
                      tasksDetailsToggle = {this.tasksDetailsToggle}
                      selectTask={this.toggleSelected}
                      selectedTasks={this.state.selectedTasks}
                      clearTasks={this.state.selectedTasksCleared}
                      deleteTask={(id)=>this.deleteTask(id)}
                    />
                  </div>
              ))           
              : 
              <Notasks 
                      noTasks={this.state.noTasks}
                />}
                <hr />
              {tasksDone.map((task)=> ( 
                  <div key={task.id} className="taskContainer">
                    <Tasks 
                      tasks={this.state.tasks}
                      updateSchedule={this.updateSchedule}
                      loadUserSettings={this.loadUserSettings}
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
                      selectTask={()=>alert("yup")}
                      editTask={() => 
                        this.editTask(task,task.id)
                      } 
                      toggleDone={(done, id) => {
                        this.toggleDone(done, id)
                      }} 
                      tasksDetailsExpanded = {this.state.tasksDetailsExpanded}
                      tasksDetailsToggle = {this.tasksDetailsToggle}
                      selectTask={this.toggleSelected}
                      selectedTasks={this.state.selectedTasks}
                      clearTasks={this.state.selectedTasksCleared}
                      />
                  </div>
              ))
              }
    </div>

// Displays when the schedule isn't populated with any tasks 
  const noScheduleTasks = 
  <div>
    <h6 id="noSchedleTasks">There are no tasks in your schedule.</h6>
    <p>Go to task view to create a schedule.</p>
  </div>

// returns true if all the tasks on the schedule are marked 'done'
  const scheduleAllDone = () => {
    var done = false;
    var schedule = this.state.schedule;
    if(schedule.length > 0){
      done = true;
      this.state.schedule.forEach(task => {
        if(task.done==false){
          done = false;
        }
      })
    }
    return done;
  } 

 const backToSchedule = <button id="backToSchedule1" onClick={this.showScheduleTask}>Back to Schedule</button>;

  // The schedule of tasks - what will display if the schedule view is chosen 
  const scheduleDisplay = 
  // state.showScheduleTask:true - shows you the task view of any task from the schedule you choose.  You can then see details, modify, etc.
    this.state.showScheduleTask ? 
      <div className={cols}>
       {this.state.scheduleTaskToShow.length !== 1 ? backToSchedule : 
       this.state.scheduleTaskToShow.map(task => 
        (<div key={task.id} className="taskContainer">
          <Tasks 
            tasks={this.state.tasks}
            updateSchedule={this.updateSchedule}
            loadUserSettings={this.loadUserSettings}
            userID={this.state.userID}
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
            selectTask={()=>alert("yup")}
            editTask={() => 
              this.editTask(task,task.id)
            } 
            toggleDone={(done, id) => {
              this.toggleDone(done, id)
            }} 
            tasksDetailsExpanded = {this.state.tasksDetailsExpanded}
            tasksDetailsToggle = {this.tasksDetailsToggle}
            selectTask={this.toggleSelected}
            selectedTasks={this.state.selectedTasks}
            clearTasks={this.state.selectedTasksCleared}
            schedule={this.state.schedule}
            showScheduleTask={this.state.showScheduleTask}
            scheduleTaskToShow={this.state.scheduleTaskToShowId}
            loadUserSettings={this.loadUserSettings}
            reloadSchedule={this.reloadSchedule}
            />
            <button id="backToSchedule" onClick={this.showScheduleTask}>Back to Schedule</button>
      </div>
    ))}
      </div>
    : 
    // The standard schedule view: 
    <div className={cols}>
    {scheduleAllDone() ? <ScheduleDone /> : <h4>Today's Schedule:</h4>}
      {this.state.schedule.length > 0 ? 
      this.state.schedule.map(task => 
      <div key={task.id} id="schedTaskContainerApp">
        <Schedule 
          schedule={this.state.schedule}
          task={task}
          title={task.title}
          index={this.state.schedule.indexOf(task)}
          schedMove={this.schedMove}
          schedUpdate={(schedule)=>this.schedUpdate(schedule)}
          taskID={task.id}
          taskDate={task.date}
          taskCategory={task.category}
          taskDetails={task.details}
          taskStar={task.star}
          taskDone={task.done}
          taskTime={task.time}
          tasksDetailsToggle={this.tasksDetailsToggle}
          showSchedTask={this.showSchedTask}
          userID={this.state.userID}
          showScheduleTask={this.showScheduleTask}
          loadUserSettings={this.loadUserSettings}
          waitChange={this.waitChange}
          wait={this.state.wait}
        />
      </div>
    )
      : noScheduleTasks
    }
  
  </div>
  
 return (
    <>
      <header id="pageHeader">

        <div className="titleHeader">
          <div className="titleHeader1">
            <h1>Stay Organized!</h1>
            <p>Organizing Your Life, One Task At A Time</p>    
          </div>
          <div className="titleHeader2">
            <button id="hamburger" onClick={this.menuShow}>
              <img src="https://img.icons8.com/android/24/ffffff/menu.png"/>
            </button>
          </div>
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
             updateDisp={this.loadUserSettings} 
             getTasks={this.getTasks}
             closeForm={this.toggleForm} 
             taskList={this.state.tasks} 
             taskToEdit={this.state.taskToEdit} 
             taskID={this.state.id} 
             taskStar={this.state.star}  
             userID={this.state.userID}
            categories={this.state.categories}
            updateSchedule={this.updateSchedule}
            loadUserSettings={this.loadUserSettings}
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
        <div className="cover" id={background}>
          {this.state.background === "white"? 
          <div className="titleHeader">
            <div className="titleHeader1">
              <h1>Stay Organized!</h1>
              <p>Organizing Your Life, One Task At A Time</p>
            </div> 
          </div>
          : null}
        </div>

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
            deleteDone={this.deleteDone}
            tasksDone={tasksDone}
            menuShow={this.state.menuShow}
            menuClose={this.menuShow}
            tasksDetailsExpanded = {this.state.tasksDetailsExpanded}
            tasksDetailsToggle = {this.tasksDetailsToggle}
            makeSchedule={this.makeSchedule}
            selectedTasks={this.state.selectedTasks}
            showSchedule={this.state.showSchedule}
            showHideSchedule={this.showHideSchedule}
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

        {this.state.showSchedule ? scheduleDisplay : taskDisplay}
        
        </div>
      </div>
    </>
    )
  };
}



export default App;