import React from 'react';
import Search from './search.js';

class Header extends React.Component {
    render(){
        return (
            <div>
                <header>
                    <h1>Stay on Top of Your Stuff!</h1>
                    <h2>You have {this.props.taskNumber} task(s) left.</h2>
                </header>
                <Search />
            </div>
            
        )
        }
}

export default Header;