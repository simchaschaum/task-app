import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

class Form extends Component{
    state ={
        title: "",
        details: "", 
        priority: "",
        date: ""
    }

    input = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({[name]:value})
    }

    submitDetails = (event) => {
        event.preventDefault();
        tasksCollection.add({
            ...this.state,
            done: false,
            addedAt: firebaseTimestamp()
        })
        this.props.updateDisp();
        this.props.closeForm();
        this.clearState();
    }

    clearState = () => {
        this.setState({title: "", details: "", priority: "", date: ""});
    }

    render(){
        return(
            <div>
                  <form className="taskContainer form-group" onSubmit={(e)=>this.submitDetails(e)}>
                    <label>New Task Title: 
                        <input id="newTaskTitle" className="form-control-lg" name="title" value={this.state.title} type="text" placeholder="Give it a title" onChange={(e) => this.input(e)} required></input>
                    </label>
                    <label>New Task Details: 
                        <input id="newTaskDetails" className="form-control-lg" name="details" value={this.state.details} type="text" placeholder="What are the details?" onChange={(e) => this.input(e)} required></input>
                    </label>
                    <label>Priority:
                        <select id="newTaskPriority" className="form-control-lg"name="priority" type="select" onChange={(e) => this.input(e)} required>
                            <option value="no priority">No Priority</option>
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                    </label>
                    <label>Due Date:
                        <input id="newTaskDate" className="form-control-lg" type="date" name="date" value={this.state.date} onChange={(e)=>this.input(e)}></input>
                    </label>

                    <input type="submit"></input> <button onClick={this.props.closeForm}>Close Form</button>
                </form>
            </div>
        )
    }
}

export default Form;