import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(props) {
    return(
        <div className="nav-container">
            <div className="nav">
                <Link to="/"><img id="nav-logo" src="/checkthis.png" /></Link>
                {
                    props.user && 
                    <div>
                        <h3>Welcome, <Link to={"/users/" + props.user.id}>{props.user.name}</Link></h3>
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