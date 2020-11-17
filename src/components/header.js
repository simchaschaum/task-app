import React from 'react';

class Header extends React.Component {
    
    toggleDisplay = (e) => {
        this.props.toggleDisplay(e.target.value)
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
                </header>
                <hr />
            </div>
            
        )
        }
}

export default Header;