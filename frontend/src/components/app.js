import React from 'react';
import Nav from './nav.js';
import Body from './body.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
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
            }).then(response => response.ok ? response.json() : null).then(json => this.setState({ user: json }));
        };

        this.create = (_e) => {
            let username = document.getElementById("username-input").value;
            let password = document.getElementById("password-input").value;
            fetch("/api/user", { 
                method: "POST", 
                headers: {
                    "Accept" : "text/html; application/json",
                    "Content-Type" : "application/json"
                },
                credentials: "same-origin",
                body: JSON.stringify({ username: username, password: password }) 
            }).then(response => response.ok ? response.json() : null).then(json => this.setState({ user: json }));
        };

        this.logout = (_e) => {
            fetch("/api/login", {
                method: "DELETE",
                credentials: "same-origin"
            }).then(response => response.ok ? this.setState({ user: null }) : console.log("logout failed"));
        }
    }

    render() {
        return (
            <div>
                <Nav user={this.state.user} />
                <Body />
                { !this.state.user &&
                    <div>
                        <input type="text" name="username" id="username-input" />
                        <input type="password" name="password" id="password-input" />
                        <button onClick={this.login}>Login</button>
                        <button onClick={this.create}>Create</button>
                    </div>
                }
                <button onClick={this.logout}>Logout</button>
            </div>
        );
    }
}