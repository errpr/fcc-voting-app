import React from 'react';
import { Link } from 'react-router-dom';
import MiniPoll from './mini-poll';

export default class FrontPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        fetch("/api/polls/hot", {
            method: "GET",
            credentials: "same-origin"
        }).then(response => response.ok ? response.json() : null)
        .then(json => this.props.updatePollStorage(json));
    }

    render() {
        let storage = this.props.pollStorage;
        let allPolls = [];
        for(let poll in storage) {
            if(storage.hasOwnProperty(poll)) {
                allPolls.push(storage[poll]); // probably some way to sort during this loop but eh..
            }
        }
        if(!(allPolls.length > 0)) {
            return(<div className="body">Loading</div>);
        }
        let polls = allPolls.sort((a, b) => (a.modifiedDate > b.modifiedDate) ? -1 : 1)
                            .slice(0, 10)
                            .map(poll => <MiniPoll key={poll.id} poll={poll} />);
        
        return(
            <div className="body">
                <Link className="big-button" id="create-poll-button" to="/polls/create">Create a Poll</Link>
                <h1>Current Polls</h1>
                <div className="hot-polls">
                    {polls}
                </div>
            </div>
        );
    }
}