import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import Dropdown from 'react-bootstrap/Dropdown';
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

var starIcon = "https://img.icons8.com/ios/24/000000/star--v1.png";
var cat;

class Form extends Component{
    state = {
        title: "",
        details: "", 
        star: "",
        date: "",
        userID: "",
        category: "Category",
        titleEdited: false,   // checking if these were edited
        detailsEdited: false,
        starEdited: false,
        dateEdited: false,
        categoryEdited: false
    };

    setEditForm = (star, cat) => {
        this.setState({star:star, category: cat === "No Category" ? "Category" : cat});
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
                category: this.state.category,
                addedAt: firebaseTimestamp(),
                userID: this.props.userID
            })
            .then(this.props.updateDisp());
        } else {
            var title = this.state.titleEdited === false ? this.props.taskToEdit.title : this.state.title;
            var details = this.state.detailsEdited === false ? this.props.taskToEdit.details : this.state.details;
            var star = this.state.starEdited === false ? this.props.taskToEdit.star : this.state.star;
            var date = this.state.dateEdited === false ? this.props.taskToEdit.date : this.state.date;
            var catToEnter = this.state.categoryEdited === false ? this.props.taskToEdit.category : this.state.category;
            tasksCollection.doc(this.props.taskID)
                .update({
                    title: title,
                    details: details,
                    star: star,
                    date: date,
                    category: catToEnter
                })
                .then(this.props.updateDisp())
        };
        this.props.closeForm();
        this.clearState();
      }

    toggleStar = (e) => {
        e.preventDefault();
        if(this.state.star === true){
            starIcon = "https://img.icons8.com/ios/24/000000/star--v1.png";
            var cs = false;
            }  else {
            starIcon =  "https://img.icons8.com/ios-filled/24/000000/star.png";
            var cs = true;
        };
        this.setState({star: cs, starEdited: true});
 } 

    categoryInput = (e) => {
        cat = e.target.value;
    }

    addCategory = (e) => {
        e.preventDefault();
        this.setState({category: cat, categoryEdited: true}, ()=>console.log(this.state.category));
        cat = "";
        document.getElementById("categoryInput").value = "";
    }

    categoryInputButton = (e) => {
        e.preventDefault();
        this.setState({category:e.target.outerText, categoryEdited: true}, ()=>console.log(this.state.category))
        document.getElementById("categoryInput").value = "";
    }


    closeForm = (e) => {
        starIcon = "https://img.icons8.com/ios/24/000000/star--v1.png";
        e.preventDefault();
        this.props.closeForm();
        this.clearState();
    }

    clearState = () => {
        this.setState({
            title: "", 
            details: "", 
            priority: "", 
            date: "", 
            category: "Category",
            star: this.props.taskStar,
            titleEdited: false, 
            detailsEdited: false, 
            dateEdited: false, 
            starEdited: false,
            categoryEdited: false
        });
    }

    render(){

        // Input for title - depending on whether you're adding a new task or editing an existing one:
        var title = this.props.formState === "editTask" ? 
                <div className="form-group row">        
                    {/* <label className="col-sm-2 col-form-label">Edit Title:</label> */}
                    <div className="col-sm-12">
                        <textarea id="editTitle" className="editText form-control" 
                            name="title" 
                            contentEditable="true" suppressContentEditableWarning={true}
                            onChange={(e) => this.input(e)}
                            >
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
                        <textArea id="editDetails" className="editText form-control" 
                            name="details" 
                            contentEditable="true" suppressContentEditableWarning={true}
                            onChange={(e) => this.input(e)}
                            >
                                {this.props.taskToEdit.details}
                        </textArea>    
                   </div>
               </div>
           :   
               <div className="form-group row">
                   <div className="col-sm-12">
                       <textarea id="newTaskDetails" className="form-control" 
                       name="details" value={this.state.details} 
                       type="text" placeholder="Enter Details" 
                       rows="5" onChange={(e) => this.input(e)} >
                       </textarea>
                   </div>  
               </div>
                                                                    
        return(
            <div className="d-flex justify-content-center"> 
                <form noValidate className="formContainer form form-group" onSubmit={(e)=>this.submitDetails(e)}>
                   {title} <br />
                   
                   {details} <br />

                    <div className="form-middle-row">
 
                        <label className="form-label">
                            <button className="btn" name="star" onClick={this.toggleStar}>
                                <img id="starIcon" src={starIcon}/>
                            </button>                        
                        </label>

                        <label className="form-label">Due:
                            <input id="newTaskDate" className="form-control-sm" 
                            type="date" 
                            name="date" 
                            value={this.state.date} 
                            onChange={(e)=>this.input(e)}
                            ></input>
                        </label>
  
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
                                {this.state.category}
                            </Dropdown.Toggle>
                            <Dropdown.Menu id="catDropdown"> 
                                <div className="row catInputDiv">
                                    <div className="col-sm-8">
                                        <input id="categoryInput" className="form-control" placeholder="Add a Category" onChange={(e)=>this.categoryInput(e)}></input>
                                    </div>
                                    <div className="col-sm-2">
                                        <button className="btn btn-secondary" onClick={(e)=>this.addCategory(e)}>Press</button>
                                    </div>
                                    <div className="col-sm-2"></div>
                                </div>
                                {this.props.categories.map(category => (
                                    <Dropdown.Item key={category} onClick={(e)=>this.categoryInputButton(e)}>{category}</Dropdown.Item>
                                ))}
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={(e)=>this.categoryInputButton(e)}>No Category</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                   
                    <div className="row form-bottom-row">
                        <input className="btn btn-sm btn-secondary formBtn" type="submit"></input> 
                        <button className="btn btn-sm btn-secondary formBtn" onClick={this.closeForm}>Cancel</button>

                    </div>
                    </div>
               </form>
            </div>
        )
    }
}


export default Form;
