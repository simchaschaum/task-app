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
            if(item.title.toLowerCase().search(this.state.searchParams.toLowerCase()) != -1 || item.details.toLowerCase().search(this.state.searchParams.toLowerCase()) != -1){
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
                <form id="searchContainer" className="form-group inlineGroup" onSubmit={this.handleSearch}> 
                    <input 
                        type="text" 
                        id="searchInput" 
                        className="form-control taskTitle" 
                        onChange={(e)=>this.handleChange(e)} 
                        required
                    ></input>
                    <button type="submit" id="searchSubmit" className="form-control taskTitle btn btn-secondary">
                        <img className="searchIcon" src="https://img.icons8.com/pastel-glyph/64/000000/search--v2.png"/>
                    </button>
                    
                </form>
                
            </div>
        )
    }
}

export default Search;