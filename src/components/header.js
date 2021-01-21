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
        this.props.showCategory(e.target.name);
        this.props.menuClose();
    }

    toggleForm = () => { 
        this.props.toggleForm();
        this.props.menuClose();
    }
    
    toggleDeets = () => {
       this.props.toggleDeets()
    }

    toggleSignIn = () => {
        this.props.toggleSignIn();
    }

    deleteDone = () => {
        this.props.deleteDone();
        this.props.menuClose();
    }

    closeDetails = () => {
        this.props.tasksDetailsToggle(false);
        this.props.menuClose();
    }

    taskSort = (e) => {
        e.preventDefault();
        this.props.taskSort(e);
        this.props.menuClose();
    }

    render(){
        var showDeets = this.props.showDeets ?  "Hide All Details" : "Show All Details";
        var showDone = this.props.showDone ? "Show Not Done" : "Show All Tasks";
        var trueFalse = this.props.tasksDone.length > 0 ? false : true;

        const toolTip = {
            disabled: "Button disabled - No tasks marked 'done'",
            enabled: "Delete all tasks marked 'done'",
            closeDetails: "Hide details on all tasks"
        }
       
        var menuShow = this.props.menuShow? "headerDiv-open" : null;

        return (
            <>
                <header>
                    <div className="headerDiv" id={menuShow}>

                        <div className="headerItem" id="headerTop">
                            <img alt="Check-mark logo" className="logoIcon" src="https://img.icons8.com/ios/100/000000/checked-2--v2.png"/>
                                <button id="menuClose" onClick={this.props.menuClose}>
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                        width="100" height="100"
                                        viewBox="0 0 172 172"
                                        style={{fill:"#000000"}}><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" ><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#6c757d"><path d="M107.33488,86l46.8872,-70.3308c0.70176,-1.05608 0.77056,-2.41144 0.172,-3.52944c-0.59856,-1.118 -1.76472,-1.81976 -3.03408,-1.81976h-25.2496c-1.12488,0 -2.18096,0.5504 -2.82424,1.47576l-37.28616,53.56424l-37.2896,-53.56424c-0.64328,-0.92536 -1.69592,-1.47576 -2.8208,-1.47576h-25.2496c-1.26936,0 -2.43552,0.69832 -3.03408,1.81632c-0.59856,1.118 -0.52976,2.4768 0.172,3.52944l46.8872,70.33424l-46.8872,70.3308c-0.70176,1.05608 -0.77056,2.41144 -0.172,3.52944c0.59856,1.118 1.76472,1.81976 3.03408,1.81976h25.2496c1.12488,0 2.18096,-0.5504 2.82424,-1.47576l37.28616,-53.56424l37.2896,53.56424c0.64328,0.92536 1.69592,1.47576 2.8208,1.47576h25.2496c1.26936,0 2.43552,-0.69832 3.03408,-1.81632c0.59856,-1.118 0.52976,-2.4768 -0.172,-3.52944z"></path></g></g></svg>
                                </button>
                        </div>
                   
                        <div className="dropdown headerItem">
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.toggleForm}>
                                <span className="btnDisText"> New Task </span>
                                <img className="searchIcon" alt="svgImg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIKdmlld0JveD0iMCAwIDE3MiAxNzIiCnN0eWxlPSIgZmlsbDojMDAwMDAwOyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjUuOCwyNS44KSBzY2FsZSgwLjcsMC43KSI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgZm9udC1mYW1pbHk9Im5vbmUiIGZvbnQtd2VpZ2h0PSJub25lIiBmb250LXNpemU9Im5vbmUiIHRleHQtYW5jaG9yPSJub25lIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTAsMTcydi0xNzJoMTcydjE3MnoiIGZpbGw9Im5vbmUiPjwvcGF0aD48ZyBmaWxsPSIjZmZmZmZmIj48cGF0aCBkPSJNODYsMTQuMzMzMzNjLTM5LjU4MTUsMCAtNzEuNjY2NjcsMzIuMDg1MTcgLTcxLjY2NjY3LDcxLjY2NjY3YzAsMzkuNTgxNSAzMi4wODUxNyw3MS42NjY2NyA3MS42NjY2Nyw3MS42NjY2N2MzOS41ODE1LDAgNzEuNjY2NjcsLTMyLjA4NTE3IDcxLjY2NjY3LC03MS42NjY2N2MwLC0zOS41ODE1IC0zMi4wODUxNywtNzEuNjY2NjcgLTcxLjY2NjY3LC03MS42NjY2N3pNMTE0LjY2NjY3LDkzLjE2NjY3aC0yMS41djIxLjVjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd2MGMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YtMjEuNWgtMjEuNWMtMy45NTYsMCAtNy4xNjY2NywtMy4yMTA2NyAtNy4xNjY2NywtNy4xNjY2N3YwYzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N2gyMS41di0yMS41YzAsLTMuOTU2IDMuMjEwNjcsLTcuMTY2NjcgNy4xNjY2NywtNy4xNjY2N3YwYzMuOTU2LDAgNy4xNjY2NywzLjIxMDY3IDcuMTY2NjcsNy4xNjY2N3YyMS41aDIxLjVjMy45NTYsMCA3LjE2NjY3LDMuMjEwNjcgNy4xNjY2Nyw3LjE2NjY3djBjMCwzLjk1NiAtMy4yMTA2Nyw3LjE2NjY3IC03LjE2NjY3LDcuMTY2Njd6Ij48L3BhdGg+PC9nPjwvZz48L2c+PC9zdmc+"/>
                            </Button>
                        </div>
                                            
                        <DropdownButton id="dropdown-basic-button"  title="Sort" className="headerItem">
                                <Dropdown.Item name="star"  onClick={(e)=>this.taskSort(e)}>Starred First</Dropdown.Item>
                                <Dropdown.Item name="addedAt"  onClick={(e)=>this.taskSort(e)}>Most Recent</Dropdown.Item>
                                <Dropdown.Item name="date"  onClick={(e)=>this.taskSort(e)}>Due Sooner</Dropdown.Item>
                                {/* <Dropdown.Item name="done" onClick={this.props.taskSort}>{showDone}</Dropdown.Item> */}

                        </DropdownButton>
                        <DropdownButton id="dropdown-basic-button"  title="Category" className="headerItem">
                            {this.props.categories.map(cat => (
                                <Dropdown.Item name={cat}  onClick={(e)=>this.showCategory(e)}>{cat}</Dropdown.Item>
                            )
                            )}
                            <Dropdown.Item name="all" onClick={(e)=>this.showCategory(e)}>Show All</Dropdown.Item>
                               
                        </DropdownButton>

                        <div className="dropdown headerItem toolTipContainer">
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.closeDetails}> 
                                    <span className="btnDisText"> Close All </span>
                                    <img className="icon" src="https://img.icons8.com/windows/32/000000/hide.png"/>                            
                                </Button>
                                <span className="toolTip">{toolTip.closeDetails}</span>
                        </div>

                        <div className="dropdown headerItem toolTipContainer">
                            <Button id="dropdown-basic-button" className="headerButton" onClick={this.deleteDone} disabled={trueFalse}> 
                                    <span className="btnDisText"> Delete Done </span>
                                    <img src="https://img.icons8.com/android/24/ffffff/trash.png"/>                            
                                </Button>
                                <span className="toolTip">{this.props.tasksDone.length > 0 ? toolTip.enabled : toolTip.disabled}</span>
                        </div>

                        
                    </div>
                </header>
                        
            </>
            
        )
        }
}

export default Header;