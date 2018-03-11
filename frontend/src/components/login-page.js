import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

const LoginPage = (props) => {
    if(props.user) {
        return <Redirect to='/' />
    }
    return(
        <div className="body">
            <h3>Log in</h3>
            <div className="spacer"></div>
            <label htmlFor="username">User name</label>
            <input className="login-input" name="username" type="text" id="username-input" />
            <div className="spacer"></div>
            <label htmlFor="username">Password</label>
            <input className="login-input" name="password" type="password" id="password-input" />
            <div className="spacer"></div>
            <button id="login-submit-button" className="big-button" onClick={props.login}>Submit</button>
            <Link to='/users/create'>New user? Click here</Link>
        </div>
    )
}

export default LoginPage;