import React, { Component } from 'react';
import firebase, {db, users, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';
import { dateFormatter, dateForCompareFormatter } from './dateFormat';

var expanded = "Show Details"
// var selected = false;

class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded: false,
            selected: false
            };
        this.expand = this.expand.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
};  

    componentDidUpdate(prevProps){
        if(this.props.clearTasks && !prevProps.clearTasks){
            this.setState({selected: false})
        }
        if(!this.props.tasksDetailsExpanded && this.state.expanded){
            this.setState({expanded:false})
        }
    }

    clearSelected = () =>{
        this.setState({selected: false})
    }

    expand = () => {
          if(this.state.expanded===false){
            this.setState({expanded:true});
           } else {
            this.setState({expanded:false});
        }
        this.props.tasksDetailsToggle(true);
    };

    tasksExpand = () => {
        this.setState({expanded:true})
    }

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
                this.props.loadUserSettings();
            })
            .catch(error => console.log(error));  
    };
 
    deleteTask = () => {
        if(window.confirm("Are you sure you want to delete this task?")){
            tasksCollection.doc(this.props.taskID)
                .delete()
                .then(()=>{
                    console.log(`${this.props.taskTitle} Deleted!`);
                    this.props.loadUserSettings();
                    // this.props.updateSchedule(this.props.tasks);
                })
                .catch(error => console.log(error));
        };
    }

    editTask = () => {
        this.props.editTask();
    }

    handleSelected = () => {
        this.setState({selected: this.state.selected? false : true});
        var id = this.props.taskID;
        var title = this.props.taskTitle;
        var details = this.props.taskDetails;
        var star = this.props.taskStar;
        var cat = this.props.taskCategory;
        var date = this.props.dateDue;
        this.props.selectTask(id,title,details,star,cat,date);
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

        var expanded = (!this.state.expanded || !this.props.tasksDetailsExpanded) ? <img className="icon" src="https://img.icons8.com/ios-glyphs/60/000000/show-property.png"/> 
            : <img className="icon" src="https://img.icons8.com/windows/32/000000/hide.png"/>;
        

        var expandedButton = this.props.taskDetails === "" ? null
            :  <div className="toolTipContainer" id="expandedButton">
                    <button className="expandButton taskBtn btn btn-sm" onClick={this.expand}>
                        {expanded}
                    </button>
                    <span className="toolTip toolTipAbove">
                        {(!this.state.expanded || !this.props.tasksDetailsExpanded) ? toolTips.show : toolTips.hide} 
                    </span>
                </div>

        var taskSubcontainer = this.props.taskCols === "taskCols" ? "taskSubcontainer taskTitleAndButtons" : "taskTitleAndButtons";
        var taskBtnGrpCols = this.props.taskCols === "taskCols" ? "taskBtnCols": null;
        var taskTitleAndButtonsCols = this.props.taskCols === "taskCols" ? "taskTitleAndButtonsCols" : null;
        var titleCols = this.props.taskCols === "taskCols" ? "titleCols" : null;

        const date = this.props.dateDue != "" ? dateFormatter(this.props.dateDue) : null;
        const dateColor = new Date(dateForCompareFormatter(this.props.dateDue)) < new Date() ? "red" : "black";
        
        const selected = (!this.props.clearTasks && this.state.selected) ? true : false;

        return(
            <>
           <div className={taskSubcontainer} id={taskTitleAndButtonsCols}>
                       
                        <div className="titleDiv" id={titleCols}>
                            <input 
                                checked={selected}
                                className={this.props.showScheduleTask }
                                type="checkbox"
                                id={this.props.showScheduleTask ? "taskSelectNone" : "taskSelect"}
                                name="taskSelect" 
                                onChange={this.handleSelected}
                                style={selected ? {display: "block"} : null}
                                >
                            </input>
                                <div id="title">
                                    <h3 className={this.props.taskDone ? "taskTitle taskTitleDone" : "taskTitle"}> 
                                        {this.props.taskTitle} 
                                    </h3>  
                                </div>

                               <div id="catShowDiv">
                                    {this.props.taskCategory != "No Category" ?
                                        <div className="catShowDiv">
                                            <p className="catShowText">{this.props.taskCategory}</p> 
                                        </div>
                                            : null }
                                </div>      
                                
                               
                                    {this.props.taskStar === true ? 
                                         <div className="toolTipContainer taskPriority taskTitle" id="starShowDiv">
                                            <img id="star" className="icon" src="https://img.icons8.com/ios-filled/24/000000/star.png"/> 
                                            <span className="toolTip toolTipAbove">{toolTips.star}</span>
                                        </div>
                                    : null} 

                            
                                <div className={this.props.taskDone ? "dateDue dateDueDone" : "dateDue"} id="dateDue" style={{color:dateColor}}>
                                    {date}         
                                </div>

                        </div>
                    
                        {/* {this.props.taskDisp != "rows" ? <hr></hr> : null} */}
                       
                        <div className="btn-grp taskBtnGrp" id={taskBtnGrpCols}>

                            {/* Show/Hide details, and details: */}
                                {expandedButton}

                            {/* Edit task button: */}
                                <div className="toolTipContainer" id="editButton">
                                    <button className="editButton taskBtn btn-sm btn" onClick={this.editTask}>
                                        <img className="icon"src="https://img.icons8.com/pastel-glyph/64/000000/edit--v1.png"/>
                                    </button>
                                    <span className="toolTip toolTipAbove">{toolTips.editTask}</span>
                                </div>

                            {/* Delete button: */}
                                <div className="toolTipContainer" id="deleteButton">
                                    <button className="deleteButton taskBtn btn-sm btn" onClick={()=>this.deleteTask()}>
                                    <img className="icon" src="https://img.icons8.com/metro/52/000000/delete-sign.png"/>
                                    </button>
                                    <span className="toolTip toolTipAbove">Delete This Task</span>
                                </div>

                            {/* Mark as done button: */}
                                <div className="toolTipContainer" id="doneButton">
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
            <div className="detailsParagraph" style={{display: (!this.state.expanded || !this.props.tasksDetailsExpanded) ? 'none' : 'block'}}>
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
                    noTasks = "There are no tasks to do.  Click the second button on the left to add something!";
                    break;
                case "allDone":
                    noTasks = "Looks like you're all done! Congratulations.";
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