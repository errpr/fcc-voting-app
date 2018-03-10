import React from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';

const LoginPage = (props) => {
    if(props.user) {
        return <Redirect to='/' />
    }
    return(
        <div>
            <h3>Log in</h3>
            <input name="username" type="text" id="username-input" />
            <input name="password" type="password" id="password-input" />
            <button onClick={props.login}>Submit</button>
            <Link to='/user/create'>New user? Click here</Link>
        </div>
    )
}

export default LoginPage;