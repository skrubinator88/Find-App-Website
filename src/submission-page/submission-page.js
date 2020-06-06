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
                <PageHeader
                    className="site-page-header"
                    onBack={() => {this.props.history.goBack()}}
                    title="Submit a Gem"
                    // subTitle="This is a subtitle"
                />
                <Switch>
                    <Route exact path='/submit/signup' component={SignUp}/>
                    <Route exact path='/submit/upload' component={UploadForm}/>
                </Switch>
            </Router>
        );
    }
}
export default SubmissionRouter;
