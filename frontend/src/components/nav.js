import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(props) {
    return(
        <div className="nav-container">
            <div className="nav">
                <img id="nav-logo" src="/checkthis.png" />
                {
                    props.user && 
                    <div>
                        <h3>Welcome, {props.user.name}</h3>
                        <button id="log-out-button" onClick={props.logout}>Log out.</button>
                    </div>
                }
                {
                    !props.user &&
                    <Link id="sign-in-link" to='/login'>Sign in.</Link>
                }
            </div>
        </div>
    )
}