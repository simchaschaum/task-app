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
            <div>
                <header>
                    <h1>Stay on Top of Your Stuff!</h1>
                    <h2>You have {this.props.taskNumber} task(s) left.</h2>
                    <div className="btn-group" role="group" aria-label="Toggle Boxes or Rows">
                        <button className="btn btn-secondary" value="boxes" onClick={this.toggleDisplay}>Boxes</button>
                        <button className="btn btn-secondary" value="rows" onClick={this.toggleDisplay}>Rows</button>
                    </div>

                    <div className="buttonContainer btn-group" role="group">
                        <button className="btn btn-secondary btn-sm" type="button" value="priority" onClick={this.props.taskSort}>By Priority ({this.props.order === "desc" ? "Descending" : "Ascending"})</button>
                        <button className="btn btn-secondary btn-sm" type="button" value="dateEntered" onClick={this.props.taskSort}>By Date Entered</button>
                        <button className="btn btn-secondary btn-sm" type="button" value="dateDue" onClick={this.props.taskSort}>By Date Due</button>
                    </div>

                    {this.props.formDisp ? null 
                    : 
                    <div className="toolTipContainer">
                        <button className="btn btn-sm newTaskBtn" onClick={this.toggleForm}>
                            <img className="searchIcon" src="https://img.icons8.com/pastel-glyph/64/000000/plus--v1.png"/>
                        </button>
                        <span className="toolTip">New task</span>
                    </div>
                    }   
                </header>
               
                <hr />
            </div>
            
        )
        }
}

export default Header;