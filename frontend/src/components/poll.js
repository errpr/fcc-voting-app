import React from 'react';

export default function Poll(props) {
    let choiceItems = props.poll.choices.map(choice => <li key={choice._id} className="poll-choice">{choice.name}</li>);
    return(
        <div className="poll">
            <h2 className="poll-question">{props.poll.question}</h2>
            <ul className="poll-choices">
                {choiceItems}
            </ul>
        </div>
    )
}