import React, {Component, useEffect} from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import UploadForm from "../upload-form/upload-form";
import SignUp from "../sign-up/sign-up";
import { PageHeader } from 'antd';

class SubmissionRouter extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <Router>
                <Switch>
                </Switch>
            </Router>
        );
    }
}
export default SubmissionRouter;
