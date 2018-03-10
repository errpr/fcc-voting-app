import React from 'react';

export default class PollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            whatup: "hey",
            poll: null
        }
    }

    componentDidMount() {
        let { id } = this.props.match.params;
        fetch(`/api/polls/${id}`)
            .then(response => response.ok ? response.json() : null)
            .then(json => this.setState({ poll: json }));
    }

    render() {
        return(
            <div className="poll-page">
                { this.state.poll &&
                    <Poll poll={this.state.poll} />
                }
            </div>
        );
    }
}