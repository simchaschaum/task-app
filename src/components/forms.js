import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var star;

class Form extends Component{
    state ={
        // taskID: this.props.taskID,
        // taskToEdit: this.props.taskToEdit,
        title: "",
        details: "", 
        star: this.props.taskStar,
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
            var star = this.state.star;
            var date = this.state.date === "" ? this.props.taskToEdit.date : this.state.date;
            tasksCollection.doc(this.props.taskID)
                .update({
                    title: editTitle,
                    details: editDetails,
                    star: star,
                    date: date
                })
        };
        this.props.updateDisp();
        this.props.closeForm();
        this.clearState();
    }

    toggleStar = (e) => {
        e.preventDefault();
        if(this.state.star === true){
            this.setState({star: false});
            star = "https://img.icons8.com/ios-filled/24/000000/star.png"
        }  else {
            this.setState({star:true});
            star =  "https://img.icons8.com/ios/24/000000/star--v1.png"
        } 
 
    } 

    closeForm = () => {
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
                    <input id="newTaskDetails" className="form-control" name="details" value={this.state.details} type="text" placeholder="Enter Details" onChange={(e) => this.input(e)} ></input>
                </label>
        
        star = this.state.star ? "https://img.icons8.com/ios/24/000000/star--v1.png" : "https://img.icons8.com/ios-filled/24/000000/star.png";
        
        return(
            <div> 
                <form className="taskContainer form form-group" onSubmit={(e)=>this.submitDetails(e)}>
                   {title} <br />
                   
                   {details} <br />

                    <button className="btn" name="star" onClick={this.toggleStar}>
                        <img src={star}/>
                    </button>
                    
                    <label>Due Date:
                        <input id="newTaskDate" className="form-control-sm" type="date" name="date" value={this.state.date} onChange={(e)=>this.input(e)}></input>
                    </label>
                    
                    <input className="btn btn-primary" type="submit"></input> 
                    <button className="btn btn-primary" onClick={this.closeForm}>Cancel</button>

               </form>
            </div>
        )
    }
}


export default Form;
