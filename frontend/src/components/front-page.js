import React from 'react';
import { Link } from 'react-router-dom';
import Poll from './poll';

export default class FrontPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hotPolls: null
        }
    }

    componentDidMount() {
        fetch("/api/polls/hot", {
            method: "GET",
            credentials: "same-origin"
        }).then(response => response.ok ? response.json() : null)
        .then(json => this.setState({ hotPolls: json }));
    }

    render() {
        let polls;
        if(this.state.hotPolls) {
            polls = this.state.hotPolls.map(poll => <Poll key={poll.id} poll={poll} />)
        }
        return(
            <div className="body">
                <Link id="create-poll-button" to="/polls/create">Create a Poll</Link>
                <div className="spacer"></div>
                <h1>Current Polls</h1>
                <div className="hot-polls">
                    {polls}
                </div>
            </div>
        )
    }
}