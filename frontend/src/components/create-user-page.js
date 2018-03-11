import React from 'react';
import { Redirect } from 'react-router-dom';

export default function CreateUserPage(props) {
    if(props.user) {
        return <Redirect to='/' />
    }
    return(
        <div className="body">
            <h3>Create a new account</h3>
            <label htmlFor="username">User name</label>
            <input className="login-input" name="username" type="text" id="username-input" />
            <label htmlFor="username">Password</label>
            <input className="login-input" name="password" type="password" id="password-input" />
            <button id="create-submit-button" className="big-button" onClick={props.create}>Submit</button>
        </div>
    )
}