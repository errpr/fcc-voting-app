import React from 'react';
import Poll from './poll';
import { Link } from 'react-router-dom';

export default class UserPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userPolls: null
        }
    }

    componentDidMount () {
        const { id } = this.props.match.params;
        fetch(`/api/users/${id}/polls`)
        .then(response => response.ok ? response.json() : null)
        .then(json => this.setState({ userPolls: json }));
    }

    render() {
        let polls = "No polls";
        if(this.state.userPolls) {
            polls = this.state.userPolls.map(poll => <Poll key={poll.id} poll={poll} />);
        }
        return(
            <div className="user-page">
                <h1 className="user-page-title">
                    This Dudes Polls
                </h1>
                <div className="user-page-polls">
                    {polls}
                </div>
            </div>
        )
    }
}