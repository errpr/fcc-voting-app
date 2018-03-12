import React from 'react';
import Choice from './choice';
import { Link } from 'react-router-dom';

export default function MiniPoll(props) {
    let choices = props.poll.choices.sort((a, b) => (a.voteSum > b.voteSum) ? -1 : 1);
    let displayedChoices = choices;
    let mutedChoices = 0;
    if(choices.length > 3) {
        displayedChoices = choices.length > 3 ? choices.slice(0, 2) : choices;
        mutedChoices = choices.length - displayedChoices.length;
    }
    return(
        <Link to={`/polls/${props.poll.id}`}>
            <div className="poll">
                <h2 className="poll-question">{props.poll.question}</h2>
                <ul className="poll-choices">
                    {displayedChoices.map((choice, i) => <Choice key={i} choice={choice} showResults={true} totalVotes={props.poll.totalVotes} />)}
                </ul>
                {mutedChoices > 0 && <p>And {mutedChoices} more choices.</p>}
            </div>
        </Link>
    );
}