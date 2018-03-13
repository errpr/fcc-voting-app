import React from 'react';
import { Redirect } from 'react-router-dom';

export default class EditPollPage extends React.Component {
    constructor(props) {
        super(props);

        let id = props.match.params.id; 
        console.log(id);

        this.state = {
            id: id,
            question: "", 
            choices: ["",""], 
            pollRedirect: null
        }

        if(props.pollStorage[id]) {
            this.state.question = props.pollStorage[id].question;
            this.state.choices = props.pollStorage[id].choices.map(choice => choice.name);
        }

        this.handleChangeQ = (e) => {
            this.setState({ question: e.target.value });
        }

        this.handleChoiceChange = (e) => {
            let i = e.target.getAttribute("data-i");
            let choices = this.state.choices;
            choices[i] = e.target.value;
            this.setState({ choices: choices });
        }

        this.addChoice = (_e) => {
            let choices = this.state.choices;
            choices.push("");
            this.setState({ choices: choices });
        }

        this.handleSubmit = (_e) => {
            let choices = this.state.choices.filter(choice => choice != "");
            this.setState({ choices: choices });
            fetch(`/api/polls/${this.state.id}`, { 
                method: "PUT",
                credentials: "same-origin",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    id: this.state.id,
                    question: this.state.question,
                    choices: choices.map(c => { return { name: c } } )
                })
            }).then(response => response.ok ? response.json() : null)
            .then(json => {
                if(json) {
                    this.props.updatePollStorage(json);
                    this.setState({ pollRedirect: "/polls/" + json.id });
                }
            });
        }

        this.deletePoll = (_e) => {
            fetch(`/api/polls/${this.state.id}`, { 
                method: "DELETE",
                credentials: "same-origin",
            }).then(response => response.ok ? response.json() : null)
            .then(json => {
                if(json) {
                    this.props.updatePollStorage(json);
                    this.setState({ pollRedirect: "/" });
                }
            });
        }
    }

    updateLocalState(poll) {
        if(!poll) { return; }
        this.setState({
            question: poll.question,
            choices: poll.choices.map(choice => choice.name)
        });
    }

    componentDidMount() {
        fetch(`/api/polls/${this.state.id}`, {
            credentials: "same-origin"
        }).then(response => response.ok ? response.json() : null)
        .then(json => {
            this.props.updatePollStorage(json);
            this.updateLocalState(json);
        });
    }

    render() {
        if(!this.props.user && this.props.hasAttemptedLogin) {
            return(<Redirect to="/login" />)
        }

        if(this.state.pollRedirect) {
            return(<Redirect to={this.state.pollRedirect} />)
        }

        const choiceInputs = this.state
                                .choices
                                .map((choice, i) => <input 
                                                        className="create-poll-input" 
                                                        onChange={this.handleChoiceChange}
                                                        data-i={i}
                                                        key={i} 
                                                        type="text" 
                                                        value={choice} />)

        return(
            <div className="body">
                <h1>Edit Poll</h1>
                <label htmlFor="question">Question</label>
                <input type="text" className="create-poll-input" name="question" onChange={this.handleChangeQ} value={this.state.question} />
                <div className="spacer"></div>
                <label>Choices <button className="small-button" onClick={this.addChoice}>+</button></label>
                {choiceInputs}
                <p className="subtext">Note: changing a poll option will delete the votes for that choice.</p>
                <div>
                    <button className="big-button" onClick={this.handleSubmit}>Submit</button>
                    <button className="big-button danger-button" onClick={this.deletePoll}>Delete Poll</button>
                </div>
            </div>
        )
    }
}