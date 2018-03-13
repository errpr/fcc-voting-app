import React from 'react';
import { withRouter } from 'react-router-dom';
import Nav from './nav';
import Body from './body';
import Footer from './footer';

class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            user: null,
            hasAttemptedLogin: false,
            pollStorage: {}
        }

        this.login = (_e) => {
            let username = document.getElementById("username-input").value;
            let password = document.getElementById("password-input").value;
            fetch("/api/login", { 
                method: "POST", 
                headers: {
                    "Accept" : "text/html; application/json",
                    "Content-Type" : "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ username: username, password: password }) 
            }).then(response => response.ok ? response.json() : null)
            .then(json => this.setState({ user: json }));
        };

        this.create = (_e) => {
            let username = document.getElementById("username-input").value;
            let password = document.getElementById("password-input").value;
            fetch("/api/users", { 
                method: "POST", 
                headers: {
                    "Accept" : "text/html; application/json",
                    "Content-Type" : "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ username: username, password: password }) 
            }).then(response => response.ok ? response.json() : null)
            .then(json => this.setState({ user: json }));
        };

        this.logout = (_e) => {
            fetch("/api/login", {
                method: "DELETE",
                credentials: "same-origin"
            }).then(response => response.ok ? this.setState({ user: null }) : console.log("logout failed"));
        };

        this.updatePollStorage = (polls) => {
            let newPolls = this.state.pollStorage;
            if(Array.isArray(polls)) {
                for(let i in polls) {
                    newPolls[polls[i].id] = polls[i];
                }
            } else if(Object.prototype.toString.call(polls) === '[object Object]') { // we javascripting
                newPolls[polls.id] = polls;
            } else {
                return;
            }
            this.setState({ pollStorage: newPolls });
        };
    }

    attemptSessionLogin() {
        fetch("/api/login", {
            method: "GET",
            credentials: "same-origin"
        }).then(response => response.ok ? response.json() : null).then(json => this.setState({ user: json, hasAttemptedLogin: true }));
    }

    componentDidMount() {
        if(this.state.user == null) {
            this.attemptSessionLogin();
        }
    }

    render() {
        return (
            <div className="app">
                <div className="white-bg">
                <Nav user={this.state.user} logout={this.logout} />
                <Body login={this.login} 
                      create={this.create}
                      user={this.state.user}
                      hasAttemptedLogin={this.state.hasAttemptedLogin}
                      pollStorage={this.state.pollStorage}
                      updatePollStorage={this.updatePollStorage} />
                </div>
                <Footer />
            </div>
        );
    }
}

export default withRouter(App);