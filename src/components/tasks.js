import React, { Component } from 'react';
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var expanded = "Show Details"

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded: false,
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
        if(this.props.taskDone === true){
            this.updateDone(false);
        } else {
            this.updateDone(true);
        }; 
    }
    
    updateDone = (done) => {
        tasksCollection.doc(this.props.taskID)
            .update({
                done: done
            })
            .then(()=>{
                console.log(this.props.taskTitle + "  " + done);
                this.props.updateDisp();
            } )
            .catch(error => console.log(error));   
    };
    
    deleteTask = () => {
        if(window.confirm("Are you sure you want to delete this task?")){
            tasksCollection.doc(this.props.taskID)
                .delete()
                .then(()=>{
                    console.log(this.props.taskTitle + "  Deleted!");
                    this.props.updateDisp();
                })
                .catch(error => console.log(error));
        }
    }

    editTask = () => {
        this.props.editTask();
    }

    render(){
 
        const toolTips = {
            done: "Mark as done",
            undone: "Mark as not done",
            show: "Show details",
            hide: "Hide details",
            editTask: "Edit Task",
            star: "This task is important"
        }

        var expanded = this.state.expanded ? <img className="icon" src="https://img.icons8.com/windows/32/000000/hide.png"/> 
                : <img className="icon" src="https://img.icons8.com/ios-glyphs/60/000000/show-property.png"/>;

        var expandedButton = this.props.taskDetails === "" ? null
            :  <div className="toolTipContainer">
                    <button className="expandButton taskBtn btn btn-sm" onClick={this.expand}>
                        {expanded}
                    </button>
                    <span className="toolTip toolTipAbove">
                        {this.state.expanded ? toolTips.hide : toolTips.show} 
                    </span>
                </div>

        var taskSubcontainer = this.props.taskCols === "taskCols" ? "taskSubcontainer taskTitleAndButtons" : "taskTitleAndButtons";
        var taskBtnGrpCols = this.props.taskCols === "taskCols" ? "taskBtnCols": null;
        var taskTitleAndButtonsCols = this.props.taskCols === "taskCols" ? "taskTitleAndButtonsCols" : null;
        var titleCols = this.props.taskCols === "taskCols" ? "titleCols" : null;

        // due date formatting:
        var year = this.props.dateDue.match(/\d{4}/);
        var monthNum = this.props.dateDue.match(/\-\d{2}\-/);
        var month;
        switch(monthNum){
            case "-01-":
                month = "Jan";
                break;
            case "-02-":
                month = "Jan";
                break;
            case "-03-":
                month = "Jan";
                break;
            case "-04-":
                month = "Jan";
                break;
            case "-05-":
                break;
                month = "Jan";
            case "-06-":
                month = "Jan";
                break;
            case "-07-":
                month = "Jan";
                break;
            case "-08-":
                month = "Jan";
                break;
            case "-09-":
                month = "Jan";
                break;
            case "-10-":
                month = "Oct";
                break;
            case "-11-":
                month = "Nov"
                break;
            default:
                month = "Dec";
                break;
        }
        const fullDay = this.props.dateDue.match(/\d{2}$/);
        const day = String(fullDay).match(/^\d/) == "0" ? String(fullDay).match(/\d$/) : String(fullDay).match(/^\d/);
        const date = day ? month + " " + day + ", " + year : null;
        

        return(
            <>
           <div className={taskSubcontainer} id={taskTitleAndButtonsCols}>
                       
                        <div className="title" id={titleCols}>
                            <div className="titleTop">
                                <div>
                                    <h2 className="taskTitle"> 
                                        {this.props.taskTitle} 
                                    </h2>  
                                </div>

                               <div id="catShowDiv">
                                    {this.props.taskCategory != "No Category" ?
                                        <div className="catShowDiv">
                                            <p className="catShowText">{this.props.taskCategory}</p> 
                                        </div>
                                            : null }
                                </div> 
                                
                                <div className="toolTipContainer">
                                    <span className="taskPriority taskTitle"> 
                                        {this.props.taskStar === true ? <img id="star" className="icon" src="https://img.icons8.com/emoji/48/000000/star-emoji.png"/> : null} 
                                    </span>
                                    <span className="toolTip toolTipAbove">{toolTips.star}</span>
                                </div>

                            </div>   
                                <div className="dateDue">
                                    {date}
                                </div>

                        </div>
                    
                        {/* {this.props.taskDisp != "rows" ? <hr></hr> : null} */}
                       
                        <div className="btn-grp taskBtnGrp" id={taskBtnGrpCols}>

                            {/* Show/Hide details, and details: */}
                                {expandedButton}

                            {/* Edit task button: */}
                                <div className="toolTipContainer">
                                    <button className="editButton taskBtn btn-sm btn" onClick={this.editTask}>
                                        <img className="icon"src="https://img.icons8.com/pastel-glyph/64/000000/edit--v1.png"/>
                                    </button>
                                    <span className="toolTip toolTipAbove">{toolTips.editTask}</span>
                                </div>

                            {/* Delete button: */}
                                <div className="toolTipContainer">
                                    <button className="deleteButton taskBtn btn-sm btn" onClick={()=>this.deleteTask()}>
                                    <img className="icon" src="https://img.icons8.com/metro/52/000000/delete-sign.png"/>
                                    </button>
                                    <span className="toolTip toolTipAbove">Delete This Task</span>
                                </div>

                            {/* Mark as done button: */}
                                <div className="toolTipContainer">
                                    <button className="doneButton taskBtn btn btn-sm" onClick={this.toggleDone}>
                                        {this.props.taskDone ? 
                                            <img className="icon" src="https://img.icons8.com/ios/100/000000/checked-2--v2.png"/> 
                                            : <img className="icon" src="https://img.icons8.com/ios/100/000000/checked-2--v3.png"/> }
                                    </button>
                                    <span className="toolTip toolTipAbove">
                                        {this.props.taskDone ? toolTips.undone : toolTips.done}
                                    </span>
                                </div>
                        </div>
                
            </div>
            <div className="detailsParagraph" style={{display: this.state.expanded ? 'block' : 'none'}}>
                {this.props.taskDetails}
            </div>
                       
                      

        </>
        )
    }
}


export class Notasks extends Component{
    render(){
        var noTasks;
            switch(this.props.noTasks){
                case "search":
                    noTasks = "Your search found no tasks.";
                    break;
                case "noTasks":
                    noTasks = "There are no tasks to do.  *Whew!*";
                    break;
                default:
                    noTasks = "Tasks Loading... "
                    break;
            }
        
        return(
            <div id="noTasksDiv" className="taskContainer">
                {noTasks}
            </div>
        )
    }
}

export default Tasks;