import { render } from '@testing-library/react';
import React, { Component } from 'react'; 
import firebase, {db, tasksCollection, firebaseTimestamp} from '../utils/firebase';
import { firebaseArrMaker } from '../utils/tools';

class Search extends Component{

    render(){
        return(
            <div>
                <form>
                    <input type="text" placeholder="Search for..."></input>
                    <input type="submit"></input>
                </form>
                
            </div>
        )
    }
}

export default Search;