import React from 'react';

class Header extends React.Component {
    render(){
        return (
            <div>
                <header>
                    <h1>Stay on Top of Your Stuff!</h1>
                    <h2>You have {this.props.taskNumber} task(s) left.</h2>
                </header>
                <hr />
            </div>
            
        )
        }
}

export default Header;