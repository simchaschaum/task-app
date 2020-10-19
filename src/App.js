import React from 'react';
import './App.css';
import {Header} from './header';
import {Tasks} from './tasks';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      taskList: [
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
          done: false
        }
      ]
    }
  }
  render(){
    var taskDetails = "";
    var taskRank; 
    this.state.taskList.forEach(item => {
      taskRank = item.rank;
      taskDetails += item.details + ", rank: " + taskRank + "; ";
      });
    
    return (
      <div className="App">
        <Header taskNumber={this.state.taskList.length}/>
        <Tasks taskDetails={taskDetails} taskRank={taskRank}/>
      </div>
    )
  };
}

export default App;
