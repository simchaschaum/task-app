import React from 'react';

var expanded = "expand"

export class Tasks extends React.Component{
    constructor(props){
        super(props);
        this.state={
            expanded: false
        };
        this.expand = this.expand.bind(this);
        // this.submitDetails = this.submitDetails.bind(this);
};
    
    expand(){
        if(this.state.expanded===false){
            this.setState({expanded:true});
            expanded = "collapse"
        } else {
            this.setState({expanded:false});
            expanded = "expand"
        }
    };

    render(){
        return(
            <div className="taskContainer">
                <div className="taskTitle">
                    {this.props.taskTitle}
                </div>
                <div className="taskRank">
                    Ranking: {this.props.taskRank}
                </div>
                <button className="doneButton" onClick={this.props.toggleDone}>
                    {this.props.doneButton} 
                </button>
               <button className="expandButton" onClick={this.expand}>
                    {expanded}
                </button>
                <p className="detailsParagraph">
                    {this.props.taskDetails}
                </p>
            </div>
        )
    }
}