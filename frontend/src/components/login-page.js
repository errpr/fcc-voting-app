import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

const LoginPage = (props) => {
    if(props.user) {
        return <Redirect to='/' />
    }
    return(
        <div className="body">
            <h3>Log in</h3>
            <label htmlFor="username">User name</label>
            <input className="login-input" name="username" type="text" id="username-input" />
            <label htmlFor="username">Password</label>
            <input className="login-input" name="password" type="password" id="password-input" />
            <button id="login-submit-button" className="big-button" onClick={props.login}>Submit</button>
            <Link to='/users/create'>New user? Click here</Link>
        </div>
    )
}

export default LoginPage;