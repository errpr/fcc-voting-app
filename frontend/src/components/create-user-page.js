import React from 'react';

export default function CreateUserPage(props) {
    return(
        <div>
            <h3>Create a new user</h3>
            <input name="username" type="text" id="username-input" />
            <input name="password" type="password" id="password-input" />
            <button onClick={props.create}>Submit</button>
        </div>
    )
}