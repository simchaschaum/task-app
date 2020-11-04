import React from 'react';
import './App.css';
import {Header} from './header';
import {Tasks} from './tasks';
import {OverView} from './overView';
// import {FirebaseContext} from './components/Firebase';
// import {SignUpPage} from './components/SignUp'

var taskList = [
  {
    title: "The most important thing",
    details: "no details yet",
    done: false
  },
  {
    title: "The second most important thing",
    details: "no details yet",
    done: true
  }, 
  {
    title: "So so",
    details: "no details yet",
    done: false
  }
];

class App extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      newTaskTitle: "",
      newTaskDetails: ""
    }
  // this.toggleDone = this.toggleDone.bind(this);
  this.submitDetails = this.submitDetails.bind(this);
  this.input = this.input.bind(this);
  }

input = event => this.setState({[event.target.name] : event.target.value})

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
        <form className="taskContainer" onSubmit={this.submitDetails}>
          <label>New Task Title: 
            <input id="newTaskTitle" name="newTaskTitle" value={this.state.newTaskTitle} type="text" placeholder="Give it a title" onChange={this.input}></input>
          </label>
          <label>New Task Details: 
            <input id="newTaskDetails" name="newTaskDetails" value={this.state.newTaskDetails} type="text" placeholder="What are the details?" onChange={this.input}></input>
          </label>
          <input type="submit"></input>
       </form>
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
