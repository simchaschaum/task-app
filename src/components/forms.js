import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var starIcon;

class Form extends Component{
    state = {
        title: "",
        details: "", 
        star: "",
        date: "",
        titleEdited: false,   // checking if these were edited
        detailsEdited: false,
        starEdited: false,
        dateEdited: false        
    };

    setEditForm = (star) => {
        this.setState({star:star});
        star ? 
            starIcon = "https://img.icons8.com/ios-filled/24/000000/star.png"
            : starIcon =  "https://img.icons8.com/ios/24/000000/star--v1.png";
    }

    input = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({
            [name]:value
        });
        switch(name){
            case "title":
                this.setState({titleEdited: true})
                break;
            case "details":
                this.setState({detailsEdited: true})
                break;
            case "star":
                this.setState({starEdited: true})
                break;
            default:
                this.setState({dateEdited: true})
                break;
        }
    }

    submitDetails = (event) => {
        event.preventDefault();
        if(this.props.formState === "newTask"){
            tasksCollection.add({
                title: this.state.title,
                details: this.state.details,
                date: this.state.date,
                star: this.state.star,
                done: false,
                addedAt: firebaseTimestamp()
            });
        } else {
            var title = this.state.titleEdited === false ? this.props.taskToEdit.title : this.state.title;
            var details = this.state.detailsEdited === false ? this.props.taskToEdit.details : this.state.details;
            var star = this.state.starEdited === false ? this.props.taskToEdit.star : this.state.star;
            var date = this.state.dateEdited === false ? this.props.taskToEdit.date : this.state.date;
            tasksCollection.doc(this.props.taskID)
                .update({
                    title: title,
                    details: details,
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
        if(this.props.taskStar === true){
            starIcon = "https://img.icons8.com/ios/24/000000/star--v1.png";
            var cs = false;
            }  else {
            starIcon =  "https://img.icons8.com/ios-filled/24/000000/star.png";
            var cs = true;
        } 
        this.setState({star: cs, starEdited: true});
 } 

    closeForm = () => {
        this.props.closeForm();
        this.clearState();
    }

    clearState = () => {
        this.setState({
            title: "", 
            details: "", 
            priority: "", 
            date: "", 
            star: this.props.taskStar,
            titleEdited: false, 
            detailsEdited: false, 
            dateEdited: false, 
            starEdited: false
        }, ()=>console.log("star = " + this.state.star));
    }

    render(){

        // Input for title - depending on whether you're adding a new task or editing an existing one:
        var title = this.props.formState === "editTask" ? 
                <div className="form-group row">        
                    {/* <label className="col-sm-2 col-form-label">Edit Title:</label> */}
                    <div className="col-sm-12">
                        <textarea id="editTitle" className="editText form-control" 
                            name="title" 
                            contentEditable="true" 
                            onChange={(e) => this.input(e)}>
                                {this.props.taskToEdit.title}
                        </textarea> 
                    </div>
                </div>
            :   <div className="form-group row">
                    <div className="col-sm-12">
                        <input id="newTaskTitle" className="form-control" 
                            name="title" 
                            value={this.state.title} 
                            type="text" placeholder="Enter Title" 
                            onChange={(e) => this.input(e)} 
                            required>
                        </input>
                    </div>
                </div>
               // Input for details - depending on whether you're adding a new task or editing an existing one:
               var details = this.props.formState === "editTask" ?
               <div className="form-group row">
                   <div className="col-sm-12">
                       <textArea id="editDetails form-control" className="editText" 
                           name="details" contentEditable="true" 
                           rows="5" 
                           onChange={(e) => this.input(e)}
                       >
                       {this.props.taskToEdit.details}
                       </textArea> 
                   </div>
               </div>
           :   
               <div className="form-group row">
                   <div className="col-sm-1"></div>
                   <div className="col-sm-10">
                       <textArea id="newTaskDetails" className="form-control" 
                       name="details" value={this.state.details} 
                       type="text" placeholder="Enter Details" 
                       rows="5" onChange={(e) => this.input(e)} >
                       </textArea>
                   </div>  
               </div>
   
                                                            
        return(
            <div className="d-flex justify-content-center"> 
                <form className="formContainer form form-group" onSubmit={(e)=>this.submitDetails(e)}>
                   {title} <br />
                   
                   {details} <br />

                    <button className="btn" name="star" onClick={this.toggleStar}>
                        <img src={starIcon}/>
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
