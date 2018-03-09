import React from 'react';
import { Link } from 'react-router-dom';

export default function Nav(props) {
    return(
        <div className="nav">
            {
                props.user && 
                <h3>Welcome, {props.user.name}</h3>
            }
            {
                !props.user &&
                <Link to='/login'>Sign in.</Link>
            }
        </div>
    )
}