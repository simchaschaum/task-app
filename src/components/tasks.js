import React, { Component } from 'react';
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var expanded = "Show Details"

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
    
    expand = () => {
        if(this.state.expanded===false){
            this.setState({expanded:true});
           } else {
            this.setState({expanded:false});
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
 
        var expanded = this.state.expanded ? <img className="taskIcon" src="https://img.icons8.com/windows/32/000000/hide.png"/> : <img className="taskIcon" src="https://img.icons8.com/ios-glyphs/30/000000/show-property.png"/>;

        return(
           <div>
                        <div className="inlineGroup">
                       
                            <h2 className="taskTitle"> {this.props.taskTitle} </h2>  
                           
                       <div className="taskPriority taskTitle"> 
                            {this.props.taskStar === true ? <img src="https://img.icons8.com/emoji/48/000000/star-emoji.png"/> : null} 
                        </div>
                        
                        <div className="btn-group taskBtn taskTitle">
                             <button className="expandButton btn btn-sm" onClick={this.expand}>
                                {expanded}
                            </button>
                            <button className="doneButton taskBtn btn btn-sm" onClick={this.toggleDone}>
                                {this.state.done ? 
                                    <img className="taskIcon" src="https://img.icons8.com/ios/100/000000/checked-2--v2.png"/> 
                                    : <img className="taskIcon" src="https://img.icons8.com/ios/100/000000/checked-2--v3.png"/> }
                            </button>
                            <button className="editButton taskBtn btn-sm btn" onClick={this.editTask}>
                                <img className="taskIcon"src="https://img.icons8.com/pastel-glyph/64/000000/edit--v1.png"/>
                            </button>
                            <button className="deleteButton taskBtn btn-sm btn" onClick={this.deleteTask}>
                                <img className="taskIcon"src="https://img.icons8.com/cute-clipart/64/000000/delete-sign.png"/>
                            </button>
                            {/* {this.state.done ? <h2  className="taskTitle">Done</h2> : null} */}
                        </div>
                    </div>

                        <div className="detailsParagraph" style={{display: this.state.expanded ? 'block' : 'none'}}>
                            {this.props.taskDetails}
                        </div>
                       
                        <div className="dateDue">
                            {this.props.dateDue == "" ? null : "Due: " + this.props.dateDue}
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