import React from 'react';
import MiniPoll from './mini-poll';
import { Link } from 'react-router-dom';

export default class UserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: null,
            userId: this.props.match.params.id
        }
    }

    fetchAfterSessionLoginAttempt() {
        if(this.props.hasAttemptedLogin) {
            const { id } = this.props.match.params;
            fetch(`/api/users/${id}/polls`,{
                credentials: "same-origin",
            })
            .then(response => response.ok ? response.json() : null)
            .then(json => {
                if(json) {
                    this.props.updatePollStorage(json.polls);
                    this.setState({ user: json.user });
                };
            });
        } else {
            setTimeout(this.fetchAfterSessionLoginAttempt.bind(this), 100);
        }
    }

    componentDidMount () {
        this.fetchAfterSessionLoginAttempt();
    }

    render() {
        let storage = this.props.pollStorage;
        let userPolls = [];
        for(let pollId in storage) {
            if(storage.hasOwnProperty(pollId)) {
                if(storage[pollId].owner.id == this.state.userId) {
                    if(!storage[pollId].deleted) {
                        userPolls.push(storage[pollId]);
                    }
                }
            }
        }
        let polls = userPolls.sort((a, b) => (a.modifiedDate > b.modifiedDate) ? -1 : 1)
                             .map(poll => <MiniPoll key={poll.id} poll={poll} />);

        let headerstring = "User's polls:";
        if(this.props.user) {
            if(this.state.user) {
                if(this.state.user === this.props.user.id) {
                    headerstring = "Your polls:";
                } else {
                    headerstring = this.state.user.name + "'s polls:";
                }
            }
        } else if (this.state.user) {
            headerstring = this.state.user.name + "'s polls:";
        }

        return(
            <div className="body">
                <h1 className="user-page-title">
                    {headerstring}
                </h1>
                {polls}
            </div>
        );
    }
}