import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FrontPage from './front-page';
import LoginPage from './login-page';
import CreateUserPage from './create-user-page';
import CreatePollPage from './create-poll-page';
import UserPage from './user-page';
import PollPage from './poll-page';

export default function Body(props) {
    return(
        <div className="body-container">
            <Switch>
                <Route exact path="/" render={(props2) => <FrontPage {...props2} />} />
                <Route exact path="/login" render={() => <LoginPage
                                                            user={props.user} 
                                                            login={props.login} />} />
                <Route exact path="/users/create" render={() => <CreateUserPage
                                                                    user={props.user} 
                                                                    create={props.create} />} />
                <Route exact path="/polls/create" render={(props2) => <CreatePollPage 
                                                                        hasAttemptedLogin={props.hasAttemptedLogin} 
                                                                        user={props.user} 
                                                                        {...props2} /> } />
                <Route path="/users/:id" render={(props2) => <UserPage 
                                                                user={props.user}
                                                                hasAttemptedLogin={props.hasAttemptedLogin} 
                                                                {...props2} />} />
                <Route path="/polls/:id" render={(props2) => <PollPage 
                                                                hasAttemptedLogin={props.hasAttemptedLogin} 
                                                                user={props.user} 
                                                                {...props2} />} />
            </Switch>
        </div>
    );
}