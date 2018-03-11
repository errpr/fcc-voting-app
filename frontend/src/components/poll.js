import React from 'react';
import Choice from './choice';

export default function Poll(props) {
    let choiceItems = props.poll.choices.map(choice => <Choice key={choice._id} 
                                                                choice={choice} 
                                                                totalVotes={props.poll.totalVotes}
                                                                showResults={true} />);
    return(
        <div className="poll">
            <h2 className="poll-question">{props.poll.question}</h2>
            <ul className="poll-choices">
                {choiceItems}
            </ul>
        </div>
    )
}