import React from 'react';
import MiniPoll from './mini-poll';
import { Link } from 'react-router-dom';

export default class UserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userPolls: null,
            user: null
        }
    }

    fetchAfterSessionLoginAttempt() {
        if(this.props.hasAttemptedLogin) {
            const { id } = this.props.match.params;
            fetch(`/api/users/${id}/polls`,{
                credentials: "same-origin",
            })
            .then(response => response.ok ? response.json() : null)
            .then(json => json && this.setState({ userPolls: json.polls, user: json.user }));
        } else {
            setTimeout(this.fetchAfterSessionLoginAttempt.bind(this), 100);
        }
    }

    componentDidMount () {
        this.fetchAfterSessionLoginAttempt();
    }

    render() {
        let polls = "No polls";
        if(this.state.userPolls) {
            polls = this.state.userPolls.map(poll => <MiniPoll key={poll.id} poll={poll} />);
        }
        return(
            <div className="user-page">
                <h1 className="user-page-title">
                    {this.state.user &&
                     (this.state.user.id === this.props.user.id ? 
                      "Your polls:" :
                      `${this.state.user.name}'s polls:`)}
                </h1>
                <div className="user-page-polls">
                    {polls}
                </div>
            </div>
        )
    }
}