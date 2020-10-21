import React from 'react';
import './App.css';
import {Header} from './header';
import {Tasks} from './tasks';

var taskList = [
  {
    rank: 1,
    title: "The most important thing",
    details: "no details yet",
    done: false
  },
  {
    rank: 2,
    title: "The second most important thing",
    details: "no details yet",
    done: true
  }
];

class App extends React.Component {
  constructor(props){
    super(props);
    
  // this.toggleDone = this.toggleDone.bind(this);
  }

render(){
  return (
      <div className="App">
        <Header taskNumber={taskList.length}/>
        <div>{taskList.map((task)=> ( 
              <Tasks taskTitle={task.title} taskDetails={task.details} taskRank={task.rank} doneButton={"Mark Done"} toggleDone={() => {
                task.done = (task.done === true ? false : true);}} 
              />
            ))           
          }
        </div>
      </div>
    )
  };
}

export default App;
