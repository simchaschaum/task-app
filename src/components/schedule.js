import { render } from '@testing-library/react';
import DropdownButton from 'react-bootstrap/DropdownButton'
import React, { Component } from 'react'; 
import Tasks from './tasks';
import firebase, { db, tasksCollection, firebaseTimestamp, users } from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';
import { Dropdown } from 'bootstrap';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

class Schedule extends React.Component{
    constructor(props){
        super(props);

        this.state={
            time: false,
            done: false,
        }
    }

    schedMove = (upDown) => {
        this.props.schedMove(this.props.index, upDown)
    }

    showTask = () => {
        var bool = this.setState({showTask: this.state.showTask ? false : true})
    }

    schedTime = (e) => {
        e.preventDefault();
        var time = e.target.value;
        var schedule = this.props.schedule;
        var index = this.props.index;
        schedule[index].time = time;
        this.schedUpdate(schedule);
    }
    

    schedDone = () => { 
        var schedule = this.props.schedule;
        var index = this.props.index;
        var bool = this.state.done ? false : true;
        schedule[index].done = bool;
        this.setState({done: bool},()=>{
            this.schedUpdate(schedule)
        })
    }   

    schedUpdate = (schedule) => {
        users.doc(this.props.userID).update({
            "settings.schedule": schedule
        })
        .then(()=>this.props.loadUserSettings())
    }
    
    render(){
                
        return(
            <div id="schedTaskContainer">
                <div id="schedContainer">

                    {/* <div id="schedTimeDiv" className="schedControl">
                    <Dropdown className="schedControl schedButton">
                        <Dropdown.Toggle variant="secondary">
                            Set Time
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <input type="time"></input>
                        </Dropdown.Menu>
                    </Dropdown> 
                    </div>  */}

                    <div id="schedOrderDiv" className="schedControl">
                        <button id="schedUp" className="schedButton" onClick={()=>this.schedMove("up")}>
                            <img src="https://img.icons8.com/ultraviolet/40/000000/sort-up.png" className="arrowImg"/>                    </button>
                        <button id="schedDown" className="schedButton" onClick={()=>this.schedMove("down")}>
                            <img src="https://img.icons8.com/ultraviolet/40/000000/sort-down.png" className="arrowImg"/>
                        </button>
                    </div>
                    <div id="schedDoneDiv" className="schedControl">
                        <input type="checkbox" value={this.state.done} id="schedDone" onChange={this.schedDone}></input>
                    </div>
                </div>
                <div id="title">
                    <h3 className={"taskTitle"}>
                        {this.props.title}
                    </h3>
                </div>
                <div className="btn-group">
                    <button class="btn btn-sm btn-secondary dropdown-toggle" type="button" id="schedTime" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.props.taskTime === "" ? "Time" : this.props.taskTime}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <input id="schedTimeInput" type="time" onChange={(e)=>this.schedTime(e)}></input>
                        <div class="dropdown-divider"></div>
                        <button id="removeTime" value="" onClick={(e)=>this.schedTime(e)} disabled={this.props.taskTime === "" ? true : false}>Remove Time</button>
                    </div>
                </div>
                <button class="btn btn-secondary btn-sm" id="showTask" onClick={()=>this.props.showScheduleTask(this.props.taskID)}>Show Task</button>

            </div>
        )
    }
}
export default Schedule;

 // * - on header have button 'create schedule'.  Only have it active when state.selectedTasks is populated.
    // * - Add state.selectedTasks to state.schedules; then empty selectedTasks;
    // * - clear the selections on <tasks> -- have to change the state in each task; ALSO FOR EXPANDED TO FIX BUG!!
    // * - upload schedule to user settings
    // * - Download schedule in app.js 
    // * - Put it in place of tasklist 
    // * - toggle which to show and which to display:none - tasks or schedules. (Have title "schedules" above schedules)
    // * - Check timing - why doesn't updating the schedule work? 
    // * - on <Schedules>, give option to include time or order.  If order: dropdown?? or drag and drop list? 
    // on Schedules - give option to remove from list 
    // * - on app.js - view mode of that task only in "task mode" (i.e. to edit, etc.) - style button!
    //  add to schedule 
    // * - check off - save if it's checked 
    // include message if all is done (or animation??) 