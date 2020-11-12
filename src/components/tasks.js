import React, { Component } from 'react';
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var expanded = "Show Details"

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded: true,
            taskID: this.props.taskID,
            done: this.props.taskDone,
            };
        this.expand = this.expand.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
};
    
    expand = () => {
        if(this.state.expanded===false){
            this.setState({expanded:true});
            expanded = "Hide Details"
        } else {
            this.setState({expanded:false});
            expanded = "Show Details"
        }
    };

    toggleDone = () => {
        if(this.state.done === true){
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
        this.props.updateDisp();
    }

    editTask = () => {
        this.props.editTask(this.props.taskID);
    }

    render(){
        switch (this.props.taskPriority) {
                case "1":
                    var priority = "Priority: High";
                    break;
                case "2":
                    var priority = "Priority: Medium";
                    break;
                case "3":
                    var priority = "Priority: Low";
                    break;
                default:
                    var priority = "";
                    break;
            }

        return(
            <div className="taskContainer card">
                <div className="card-body">
                    <div className="taskTitle">
                        <h2 className="card-title"> {this.props.taskTitle} 
                        </h2>  {this.state.done ? "**DONE!!**" : null}
                    </div>
                    <div className="detailsParagraph" style={{display: this.state.expanded ? 'block' : 'none'}}>
                        {this.props.taskDetails}
                    </div>
                    <div className="taskPriority"> 
                        <h3 className="card-subtitle">{priority}
                        </h3>
                    </div>
                    <div className="dateDue">
                        {this.props.dateDue == "" ? null : "Due: " + this.props.dateDue}
                    </div>
                    <button className="doneButton btn btn-primary" onClick={this.toggleDone}>
                        Mark as {this.state.done ? "Undone" : "Done"}
                    </button>
                    <button className="expandButton btn btn-primary" onClick={this.expand}>
                        {expanded}
                    </button>
                    <button className="editButton btn btn-primary" onClick={this.editTask}>
                        Edit Task
                    </button>
                    <button className="deleteButton btn btn-primary" onClick={this.deleteTask}>
                        Delete Task
                    </button>
                </div>
            </div>
        )
    }
}


export class Notasks extends Component{
    render(){
        return(
            <div id="noTasksDiv" className="taskContainer">
                You have no tasks! *Whew!* 
            </div>
        )
    }
}

export default Tasks;