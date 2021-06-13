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
        this.props.waitChange(true);
        this.props.schedMove(this.props.index, upDown);
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
        var bool = this.props.taskDone ? false : true;
        schedule[index].done = bool;
        this.schedUpdate(schedule);
        }   

    removeTask = () => {
        var schedule = this.props.schedule;
        var newSched = schedule.filter(task => task !== this.props.task);
        this.schedUpdate(newSched);
    }

    schedUpdate = (schedule) => {
        users.doc(this.props.userID).update({
            "settings.schedule": schedule
        })
        .then(()=>this.props.loadUserSettings());
    }
   
    render(){

        // let wait = this.props.wait ? true : false;  // keeps the delay until after first move is complete
        let wait = false;
                
        return(
            <div id="schedTaskContainer">
                <div id="schedContainer">

                    <div id="schedOrderDiv" className="schedControl">
                        <button id="schedUp" className="schedButton" onClick={()=>this.schedMove("up")} disabled={wait}>
                            <img src="https://img.icons8.com/ultraviolet/40/000000/sort-up.png" className="arrowImg"/>                    </button>
                        <button id="schedDown" className="schedButton" onClick={()=>this.schedMove("down")} disabled={wait}>
                            <img src="https://img.icons8.com/ultraviolet/40/000000/sort-down.png" className="arrowImg"/>
                        </button>
                    </div>
                    <div id="schedDoneDiv" className="schedControl">
                        <input type="checkbox" value={this.state.done} id="schedDone" onChange={this.schedDone} checked={this.props.taskDone ? true : false}></input>
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
                <button class="btn btn-secondary btn-sm" id="removeTask" onClick={this.removeTask}>Remove Task</button>
            </div>
        )
    }
}
export default Schedule;

export const ScheduleDone = () => {
    return(
        <div id="scheduleDoneDiv">
            <img className="scheduleDone" src="https://img.icons8.com/wired/40/000000/confetti.png" alt="confetti icon" />
            <h4 className="scheduleDone">You did everything on your schedule!</h4>
            <img className="scheduleDone" src="https://img.icons8.com/wired/40/000000/confetti.png" alt="confetti icon"/>
        </div>)
}
