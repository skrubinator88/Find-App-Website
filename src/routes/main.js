import React, {Component, useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import HomePage from "../home-page/home-page";
import SubmissionRouter from "../submission-page/submission-page";
import SignUp from "../sign-up/sign-up";
import UploadForm from "../upload-form/upload-form";

class MainRouter extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path='/signup' component={SignUp}/>
                    <Route exact path='/upload' component={UploadForm}/>
                    <Route path='/' component={HomePage}/>
                </Switch>
            </Router>
        );
    }
}
export default MainRouter;
