import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FrontPage from './front-page';
import LoginPage from './login-page';
import CreateUserPage from './create-user-page';
import Avacado from './avacado';

export default function Body(props) {
    return(
        <Switch>
            <Route exact path="/" component={FrontPage} />
            <Route exact path="/avacado" component={Avacado} />
            <Route exact path="/login" render={() => <LoginPage login={props.login} />} />
            <Route exact path="/user/create" render={() => <CreateUserPage create={props.create} />} />
        </Switch>
    );
}