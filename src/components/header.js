import React from 'react';

class Header extends React.Component {
    render(){
        return (
            <header>
                <h1>Stay on Top of Your Stuff!</h1>
                <h2>You have {this.props.taskNumber} task(s) left.</h2>
            </header>
        )
        }
}

export default Header;