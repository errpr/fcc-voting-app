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
        <div className="poll">
            <Link to={`/polls/${props.poll.id}`}>
                <h2 className="mini-poll poll-question">{props.poll.question}</h2>
                <ul className="poll-choices">
                    {displayedChoices.map((choice, i) => 
                        <Choice key={i} 
                                choice={choice} 
                                showResults={true} 
                                totalVotes={props.poll.totalVotes} />)}
                    {mutedChoices > 0 && <li><p className="subtext"> ... And {mutedChoices} more choices.</p></li>}
                </ul>
            </Link>
        </div>
    );
}