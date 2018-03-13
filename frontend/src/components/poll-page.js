import React from 'react';
import Poll from './poll';

export default class PollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pollId: this.props.match.params.id,
            showResults: false
        }

        if(this.props.pollStorage[this.state.pollId] && 
           this.props.pollStorage[this.state.pollId].hasVoted) {
            this.state.showResults = true;
        }

        this.handleVote = (e) => {
            fetch(`/api/polls/${this.state.pollId}/vote/${e.target.getAttribute("data-choice-id")}`, {
                method: "POST",
                headers: {
                    "Content-Length": 0,
                },
                credentials: "same-origin"
            }).then(response => response.ok ? response.json() : null)
            .then(json => this.props.updatePollStorage(json));
        }

        this.showResults = (_e) => {
            this.setState({showResults: true});
        }

        this.showVoteButtons = (_e) => {
            this.setState({showResults: false});
        }
    }

    fetchAfterSessionLoginAttempt() {
        if(this.props.hasAttemptedLogin) {
            let { id } = this.props.match.params;
            fetch(`/api/polls/${id}`, {
                credentials: "same-origin"
            })
            .then(response => response.ok ? response.json() : null)
            .then(json => {
                if(json) {
                    this.props.updatePollStorage(json);
                    this.setState({showResults: json.hasVoted });
                }
            });
        } else {
            setTimeout(this.fetchAfterSessionLoginAttempt.bind(this), 100);
        }
    }

    componentDidMount() {
        this.fetchAfterSessionLoginAttempt();
    }

    render() {
        let poll = null;
        if(this.props.pollStorage[this.state.pollId]) {
            poll = this.props.pollStorage[this.state.pollId];
        }
        if(!poll) {
            return(<div className="body">Loading</div>);
        }
        return(
            <div className="body">
                <Poll poll={poll} 
                        showResults={this.state.showResults}
                        handleVote={this.handleVote} />
                {
                    this.state.showResults && 
                    <button onClick={this.showVoteButtons} className="big-button">
                        {poll.hasVoted ? "Change My Vote" : "Place My Vote"}
                    </button> 
                }
                {
                    !this.state.showResults && 
                    <button onClick={this.showResults} className="big-button">Show Results</button>
                }
            </div>
        );
    }
}