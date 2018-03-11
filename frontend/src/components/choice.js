import React from 'react';

function mapCountToWidth(count, total) {
    if(total === 0) {
        return 50;
    }
    return ((count * 100) / total);
}

export default function Choice(props) {
    if(props.showResults) {
        const barWidth = mapCountToWidth(props.choice.voteSum, props.totalVotes);
        return(
            <li className="choice-container">
                <div className="choice-name">{props.choice.name}</div>
                <div className="choice-result-bar-container">
                    <div className="choice-result-bar" style={{width: barWidth + "%"}}></div>
                </div>
                <div className="choice-result-count">
                    {props.choice.voteSum}
                </div>
            </li> 
        );       
    } else {
        return(
            <li className="choice-container">
                <div className="choice-name">{props.choice.name}</div>
                <button className="choice-vote-button">Vote</button>
            </li>
        );
    }
}