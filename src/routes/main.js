import React, {Component, useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import HomePage from "../home-page/home-page";
import SubmissionRouter from "../submission-page/submission-page";

class MainRouter extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/' component={HomePage}/>
                    <Route path='/submit' component={SubmissionRouter}/>
                </Switch>
            </Router>
        );
    }
}
export default MainRouter;
