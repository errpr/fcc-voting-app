import React from 'react';
import Poll from './poll';

export default class PollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            whatup: "hey",
            poll: null,
            showResults: false
        }

        this.handleVote = (e) => {
            fetch(`/api/polls/${this.state.poll.id}/vote/${e.target.getAttribute("data-choice-id")}`, {
                method: "POST",
                headers: {
                    "Content-Length": 0,
                },
                credentials: "same-origin"
            }).then(response => response.ok ? response.json() : this.state.poll)
            .then(json => this.setState({ poll: json, showResults: true }));
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
            .then(json => json && this.setState({ poll: json, showResults: json.hasVoted }))
        } else {
            setTimeout(this.fetchAfterSessionLoginAttempt.bind(this), 100);
        }
    }

    componentDidMount() {
        this.fetchAfterSessionLoginAttempt();
    }

    render() {
        return(
            <div className="body">
                { this.state.poll &&
                    <Poll poll={this.state.poll} 
                          showResults={this.state.showResults}
                          handleVote={this.handleVote} />
                }
                {   this.state.poll          && 
                    this.state.showResults   && 
                    <button onClick={this.showVoteButtons} className="big-button">
                        {this.state.hasVoted ? "Change My Vote" : "Place My Vote"}
                    </button> 
                }
                {   this.state.poll         && 
                    !this.state.showResults && 
                    <button onClick={this.showResults} className="big-button">Show Results</button>
                }
            </div>
        );
    }
}