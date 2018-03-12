import React from 'react';
import Choice from './choice';
import { Link } from 'react-router-dom';

export default function Poll(props) {
    let choiceItems = props.poll.choices.map(choice => <Choice key={choice._id} 
                                                                choice={choice} 
                                                                totalVotes={props.poll.totalVotes}
                                                                showResults={props.showResults}
                                                                handleVote={props.handleVote} />);
    return(
        <div className="poll">
            <h2 className="poll-question">{props.poll.question}</h2>
            <h3 className="poll-owner">
                Created by <Link className="poll-owner-link" to={`/users/${props.poll.owner.id}`}>{props.poll.owner.name}</Link>
            </h3>
            <ul className="poll-choices">
                {choiceItems}
            </ul>
        </div>
    )
}