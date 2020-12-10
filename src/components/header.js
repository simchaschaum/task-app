import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Search from './search';
import firebase, {tasksCollection, users} from '../utils/firebase';


class Header extends React.Component {
    
    toggleDisplay = (e) => {
        this.props.toggleDisplay(e.target.name);
    }

    showCategory = (e) => {
        var cat = e.target.name;
        cat === "all" ? this.props.getUser() : this.props.showCategory(cat);
    }

    toggleForm = () => { 
        this.props.toggleForm();
    }
    
    toggleDeets = () => {
       this.props.toggleDeets()
    }

    deleteDone = () => {
        alert("delete done!")
    }

    toggleSignIn = () => {
        this.props.toggleSignIn();
    }

    // signOut = () => {
    //     firebase
    //         .auth()
    //         .signOut()
    //         .then(() => {
    //             console.log("signed out");
    //             this.props.getUser();
    //         } )
    //         .catch(error => console.log(error))
    // }

    render(){
        var showDeets = this.props.showDeets ?  "Hide All Details" : "Show All Details";
        var showDone = this.props.showDone ? "Show Not Done" : "Show All Tasks";
        return (
            <>
                <header>
                    <div className="headerDiv">

                        <div className="headerTop headerItem">
                            <img alt="Check-mark logo" className="logoIcon" src="https://img.icons8.com/ios/100/000000/checked-2--v2.png"/>
                        </div>
                   
                        <div className="dropdown headerItem">
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.toggleForm}>
                                <span className="btnDisText"> New Task </span>
                                <img className="searchIcon" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUuOCwyNS44KSBzY2FsZSgwLjcsMC43KSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNODYsMTQuMzMzMzNjLTM5LjU4MTUsMCAtNzEuNjY2NjcsMzIuMDg1MTcgLTcxLjY2NjY3LDcxLjY2NjY3YzAsMzkuNTgxNSAzMi4wODUxNyw3MS42NjY2NyA3MS42NjY2Nyw3MS42NjY2N2MzOS41ODE1LDAgNzEuNjY2NjcsLTMyLjA4NTE3IDcxLjY2NjY3LC03MS42NjY2N2MwLC0zOS41ODE1IC0zMi4wODUxNywtNzEuNjY2NjcgLTcxLjY2NjY3LC03MS42NjY2N3pNMTE0LjY2NjY3LDkzLjE2NjY3aC0yMS41djIxLjVjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd2MGMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YtMjEuNWgtMjEuNWMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YwYzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N2gyMS41di0yMS41YzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N3YwYzMuOTU2LDAgNy4xNjY2NywzLjIxMDY3IDcuMTY2NjcsNy4xNjY2N3YyMS41aDIxLjVjMy45NTYsMCA3LjE2NjY3LDMuMjEwNjcgNy4xNjY2Nyw3LjE2NjY3djBjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd6Ij48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+"/>
                            </Button>
                        </div>
                        
                        {/* Come back to these later...  */}
                        {/* <div className="headerButtonsDiv">
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.toggleDeets}>
                                {showDeets}
                            </Button>
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.deleteDone}>
                                Delete Done Tasks
                            </Button>
                        </div> */}

                        <DropdownButton id="dropdown-basic-button" title="View" className="headerItem">
                                <Dropdown.Item name="boxes" onClick={(e)=>this.toggleDisplay(e)}>Boxes</Dropdown.Item>
                                <Dropdown.Item name="rows" onClick={(e)=>this.toggleDisplay(e)}>Rows</Dropdown.Item>
                        </DropdownButton>
                        
                        <DropdownButton id="dropdown-basic-button"  title="Show" className="headerItem">
                                <Dropdown.Item name="star"  onClick={this.props.taskSort}>Starred First</Dropdown.Item>
                                <Dropdown.Item name="addedAt"  onClick={this.props.taskSort}>Date Entered</Dropdown.Item>
                                <Dropdown.Item name="date"  onClick={this.props.taskSort}>Due Date</Dropdown.Item>
                                <Dropdown.Item name="done" onClick={this.props.taskSort}>{showDone}</Dropdown.Item>

                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button"  title="Category" className="headerItem">
                            {this.props.categories.map(cat => (
                                <Dropdown.Item name={cat}  onClick={(e)=>this.showCategory(e)}>{cat}</Dropdown.Item>
                            )
                            )}
                            <Dropdown.Item name="all" onClick={(e)=>this.showCategory(e)}>Show All</Dropdown.Item>
                               
                        </DropdownButton>

                        
                    </div>
                </header>
                        
            </>
            
        )
        }
}

export default Header;