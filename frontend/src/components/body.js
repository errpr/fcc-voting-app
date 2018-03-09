import React from 'react';
import { Switch, Route } from 'react-router-dom';
import FrontPage from './front-page';
import Avacado from './avacado';

export default function Body(props) {
    return(
        <Switch>
            <Route exact path="/" component={FrontPage} />
            <Route exact path="/avacado" component={Avacado} />
        </Switch>
    );
}