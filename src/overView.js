import React from 'react';

export class OverView extends React.Component{
    render(){
        return (<div>
            {this.props.taskNumber} - {this.props.taskTitle}
        </div>)
    }
}