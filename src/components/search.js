import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

class Search extends Component{
    state = {
        searchParams: ""
    }

    handleChange = (params) => {
        this.setState({searchParams: params.target.value})
    }

    handleSearch = (e) => {
        e.preventDefault();
        var filteredList = [];
        this.props.taskList.forEach( item => {
            if(item.title.search(this.state.searchParams) != -1 || item.details.search(this.state.searchParams) != -1){
                filteredList.push(item);
                }   
        }
        );
        console.log(filteredList);
        this.props.displaySearch(filteredList, this.state.searchParams);
    }

    render(){
        return(
            <div>
                <form className="form-group" onSubmit={this.handleSearch}> 
                    <input type="text" className="form-control" placeholder="Search for... (this doesn't work yet)" onChange={(e)=>this.handleChange(e)}></input>
                    <input type="submit" className="form-control btn btn-primary"></input>
                </form>
                
            </div>
        )
    }
}

export default Search;