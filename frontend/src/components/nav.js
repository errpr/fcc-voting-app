import React from 'react';

export default function Nav(props) {
    return(
        <div className="nav">
            {
                props.user && 
                <h3>Welcome, {props.user.name}</h3>
            }
            {
                !props.user &&
                <h3>Please sign in.</h3>
            }
        </div>
    )
}