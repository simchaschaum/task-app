import React from 'react';

class Header extends React.Component {
    
    toggleDisplay = (e) => {
        this.props.toggleDisplay(e.target.value)
    }

    toggleForm = () => { 
        this.props.toggleForm()
    }
    
    render(){
        return (
            <>
                <header>
                    <div className="headerDiv">
                    <div className="left-side-header">
                        <img alt="Check-mark logo" className="icon logoIcon" src="https://img.icons8.com/ios/100/000000/checked-2--v2.png"/>
                    </div>
                    
                    <div className="middle-header">
                        <div className="btn-group" role="group" aria-label="Toggle Boxes or Rows">
                            <button className="btn btn-secondary" value="boxes" onClick={this.toggleDisplay}>Boxes</button>
                            <button className="btn btn-secondary" value="rows" onClick={this.toggleDisplay}>Rows</button>
                        </div>

                        <div className="buttonContainer btn-group" role="group">
                            <button className="btn btn-secondary btn-sm" type="button" value="priority" onClick={this.props.taskSort}>By Priority ({this.props.order === "desc" ? "Descending" : "Ascending"})</button>
                            <button className="btn btn-secondary btn-sm" type="button" value="dateEntered" onClick={this.props.taskSort}>By Date Entered</button>
                            <button className="btn btn-secondary btn-sm" type="button" value="dateDue" onClick={this.props.taskSort}>By Date Due</button>
                        </div>
                    </div>

                    <div className="right-side-header">
                        {/* new-task button */}
                        {this.props.formDisp ? null 
                        : 
                        <div className="toolTipContainer">
                            <button className="btn btn-sm newTaskBtn" onClick={this.toggleForm}>
                                <img className="searchIcon" src="https://img.icons8.com/pastel-glyph/64/000000/plus--v1.png"/>
                            </button>
                            <span className="toolTip toolTipBelow">New task</span>
                        </div>
                        }
                    </div>
                    </div>
                </header>
               
                <hr />
            </>
            
        )
        }
}

export default Header;