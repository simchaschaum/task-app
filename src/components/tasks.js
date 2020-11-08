import React, { Component } from 'react';
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var expanded = "expand"

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded: false,
            taskID: this.props.taskID,
            done: this.props.taskDone,
            };
        this.expand = this.expand.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
};
    
    // componentDidMount = () => {
    // }
    
    expand = () => {
        if(this.state.expanded===false){
            this.setState({expanded:true});
            expanded = "collapse"
        } else {
            this.setState({expanded:false});
            expanded = "expand"
        }
    };

    toggleDone = () => {
        if(this.state.done == true){
            this.setState({done: false}, this.updateDone(false));
        } else {
            this.setState({done: true}, this.updateDone(true));
        }; 
    }
    
    updateDone = (done) => {
        tasksCollection.doc(this.state.taskID)
            .update({
                done: done
            })
            .then(()=>console.log(this.props.taskTitle + "  " + this.state.done))
            .catch(error => console.log(error));   
    };
    
    deleteTask = () => {
        tasksCollection.doc(this.state.taskID)
            .delete()
            .then(()=>console.log(this.props.taskTitle + "  Deleted!"))
            .catch(error => console.log(error));
        this.props.taskDelete();
    }

    render(){
        switch (this.props.taskPriority) {
                case "1":
                    var priority = "High";
                    break;
                case "2":
                    var priority = "Medium";
                    break;
                case "3":
                    var priority = "Low";
                    break;
            }

        return(
            <div className="taskContainer">
                <div className="taskTitle">
                    {this.props.taskTitle}  {this.state.done ? "**DONE!!**" : null}
                </div>
                <div className="taskPriority">
                    Priority: {priority}
                </div>
                <div className="detailsParagraph" style={{display: this.state.expanded ? 'block' : 'none'}}>
                    {this.props.taskDetails}
                </div>
                <div className="dateDue">
                    Due Date: {this.props.dateDue == "" ? "No Due Date" : this.props.dateDue}
                </div>
                <button className="doneButton" onClick={this.toggleDone}>
                    Mark as {this.state.done ? "Undone" : "Done"}
                </button>
                <button className="expandButton" onClick={this.expand}>
                    {expanded}
                </button>
                <button className="deleteButton" onClick={this.deleteTask}>
                    Delete Task
                </button>
            </div>
        )
    }
}


export class Notasks extends Component{
    render(){
        return(
            <div id="noTasksDiv" className="taskContainer">
                You have no tasks!
            </div>
        )
    }
}

export default Tasks;