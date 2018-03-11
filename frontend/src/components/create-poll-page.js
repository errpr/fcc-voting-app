import React from 'react';
import { Redirect } from 'react-router-dom';

export default class CreatePollPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            question: "",
            choices: ["",""],
            pollRedirect: null
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
            fetch("/api/polls", { 
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    question: this.state.question,
                    choices: choices.map(c => { return { name: c } } )
                })
            }).then(response => response.ok ? response.json() : null)
            .then(json => this.setState({ pollRedirect: json }));
        }

    }

    render() {
        if(!this.props.user) {
            return(<Redirect to="/login" />)
        }

        if(this.state.pollRedirect) {
            return(<Redirect to={`/polls/${this.state.pollRedirect.id}`} />)
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
                <h1>Create a Poll</h1>
                <label htmlFor="question">Question</label>
                <input type="text" className="create-poll-input" name="question" onChange={this.handleChangeQ} value={this.state.question} />
                <div className="spacer"></div>
                <label>Choices <button className="small-button" onClick={this.addChoice}>+</button></label>
                {choiceInputs}
                <div className="spacer"></div>
                <button className="big-button" onClick={this.handleSubmit}>Submit</button>
            </div>
        )
    }
}