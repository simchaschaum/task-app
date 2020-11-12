import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

class Form extends Component{
    state ={
        // taskID: this.props.taskID,
        // taskToEdit: this.props.taskToEdit,
        title: "",
        details: "", 
        priority: "",
        date: ""
        
    };
  
    input = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]:value
        })
    }

    submitDetails = (event) => {
        event.preventDefault();
        if(this.props.formState === "newTask"){
            tasksCollection.add({
                ...this.state,
                done: false,
                addedAt: firebaseTimestamp()
            });
        } else {
            var editTitle = document.getElementById("editTitle").innerHTML;
            var editDetails = document.getElementById("editDetails").innerHTML; 
            var priority = this.state.priority === "" ? this.props.taskToEdit.priority : this.state.priority;
            var date = this.state.date === "" ? this.props.taskToEdit.date : this.state.date;
            tasksCollection.doc(this.props.taskID)
                .update({
                    title: editTitle,
                    details: editDetails,
                    priority: priority,
                    date: date
                })
        };
        this.props.updateDisp();
        this.props.closeForm();
        this.clearState();
    }

    clearState = () => {
        this.setState({title: "", details: "", priority: "", date: ""});
    }

    render(){

        var title = this.props.formState === "editTask" ? 
                <label>Edit Title:
                    <div id="editTitle" className="editText" contentEditable="true">{this.props.taskToEdit.title}</div> 
                </label>
            :   <label>
                    <input id="newTaskTitle" className="form-control" name="title" value={this.state.title} type="text" placeholder="Enter Title" onChange={(e) => this.input(e)} required></input>
                </label>

        var details = this.props.formState === "editTask" ?
                <label>Edit Details:
                    <div id="editDetails" className="editText" contentEditable="true">{this.props.taskToEdit.details}</div> 
                </label>
            :   <label>
                    <input id="newTaskDetails" className="form-control" name="details" value={this.state.details} type="text" placeholder="Enter Details" onChange={(e) => this.input(e)} required></input>
                </label>
        
        switch (this.props.taskToEdit.priority) {
            case "1":
                var priority = "Previous Priority: High";
                break;
            case "2":
                var priority = "Previous Priority: Medium";
                break;
            case "3":
                var priority = "Priority: Low";
                break;
            default:
                var priority = "";
                break;
        }
        var pri = this.props.formState === "newTask" ? "Select a priority" : priority;

        return(
            <div> 
                <form className="taskContainer form form-group" onSubmit={(e)=>this.submitDetails(e)}>
                   {title} <br />
                   
                   {details} <br />

                    <label>Priority:
                        <select id="newTaskPriority" className="form-control-sm" name="priority" type="select" onChange={(e) => this.input(e)} required>
                            <option selected hidden disabled>{pri}</option>
                            <option value="no priority">No Priority</option>
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                    </label>
                    <label>Due Date:
                        <input id="newTaskDate" className="form-control-sm" type="date" name="date" value={this.state.date} onChange={(e)=>this.input(e)}></input>
                    </label>
                    <input className="btn btn-primary" type="submit"></input> 
                    <button className="btn btn-primary" onClick={this.props.closeForm}>Cancel</button>
                </form>
            </div>
        )
    }
}


export default Form;
