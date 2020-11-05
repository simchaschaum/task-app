import React from 'react';

class OverView extends React.Component{
    render(){
        return (<div>
            {this.props.taskNumber} - {this.props.taskTitle}
        </div>)
    }
}

export default OverView;