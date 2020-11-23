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
            <div className="searchDiv">
                <div className="searchDiv-center">
                    <form id="searchContainer" className="form-group" onSubmit={this.handleSearch}> 
                        <input 
                                type="text" 
                                id="searchInput" 
                                className="form-control searchBar" 
                                placeholder="Search for a word or phrase"
                                onChange={(e)=>this.handleChange(e)} 
                                required
                        >
                        </input>
                        {/* <div>
                            <button type="submit" id="searchSubmit" className="form-control taskTitle btn btn-secondary">
                                <img className="searchIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAACiklEQVRoge2XMWtTURSAzysYOpt0SNzajNIq0U2crVb8BYW6CGKRoH+h4JSMbjoUxDgqRK1Ite0/EMFBO0oQo7h0aNL2c3g37ckledze3OR1eN90QnK/c8579537IpKRkZGRJtEoi4G8iCyJyC0RmRWRoogURKQtIi0R2RWRpog0oyj6M1qpAQHKwCvgADe6QAMop114DqgDHcfCbTpADcilUfwMsG0VdAhsAlWgAhRNk0XzuQp8Mr/TbAGFSRf/wyriLTDvuH4BeG+t/z6RJoBz5ir26AIPPV336N9+O2PfTsR7Xu/hxRF9i+Yi9KiFqnVQsllgXyW7H8i7al2U8Uwn4lF5vOcDuzeUuxHS3UuQV7f6ELgc2D/PyXQ6CP5AAyvqCm0GlZ/k2FI5ln0cUwnf6Yf1jY/cgdcqXvIRJDUwp+IdH7kD2ut0ptgkNVBS8U8fuQPaWxr6Kx+s8TmWw4b4teN4nPo4ku5AW8V5H7kDevL89REkNdBS8QUfuQPa+8tHkNTAroqv+cgduK7irz6CpAaaKr7jI3fgtoo/BjUPOIkXAvsrwJF6HyqG9PeSNNSUeBfY/UG510O6dZIy/e/vDwJ5q8rZBS6G8A5LVrOS3RzRd4P+/wNroWodljBnvXR1gVVPV9Uq/jcwHbrmQYlniP/DajaAS47rK9ae1zwDkqZhGICCdScgnk6fgUfAVaBk7lgJuAI8Nt8fWevaaTWRI34m9vGjC6wB06boyTdhGpkDXtK/n5PoAOuoaQNMpdqEKeI8sEx8XnwD/hFvqxbwBXgB3GXIIXUmmhgVIAKeWk08z5qYNFkTZ4UhD3Y97bpOxYAm9tKu6dSYJurAHvAk7XoyMjIyBvMfgIHrSKjbaW0AAAAASUVORK5CYII="/>
                            </button>
                        </div> */}
                    </form>
                </div>
            </div>
        )
    }
}

export default Search;