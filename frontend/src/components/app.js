import React from 'react';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.login = (_e) => {
            let username = document.getElementById("username-input").value;
            let password = document.getElementById("password-input").value;
            fetch("/api/login", { 
                method: "POST", 
                headers: {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ username: username, password: password }) 
            }).then(response => console.log(response));
        }
        this.create = (_e) => {
            let username = document.getElementById("username-input").value;
            let password = document.getElementById("password-input").value;
            fetch("/api/user", { 
                method: "POST", 
                headers: {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({ username: username, password: password }) 
            }).then(response => console.log(response));
        }
    }
    render() {
        return (
            <div>
                <input type="text" name="username" id="username-input" />
                <input type="password" name="password" id="password-input" />
                <button onClick={this.login}>Login</button>
                <button onClick={this.create}>Create</button>
            </div>
        );
    }
}