import React, {useState} from 'react';
import './sign-up.css';
import {Input, Button, PageHeader} from 'antd';
import { MailOutlined} from "@ant-design/icons";
import FacebookLogin from 'react-facebook-login';
import { Divider } from "@material-ui/core";
import {PostServiceModule} from "../App";

function SignUp(props) {
        const [error, setError] = useState('');
        const [email, setEmail] = useState('');
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');

        const responseFacebook = async (response) => {
            console.log(response);
            if(response.email) {
                setEmail(response.email);
                setFirstName(response.first_name);
                setLastName(response.last_name);
                await createUser()
            }
        };

        const createUser = async () => {
            setError('');
            try {
                let response = await PostServiceModule.postPerson({
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                });

                if(response.status === 400){
                    let error = await response.json();
                    setError(error.error)
                } else {
                    setError('An error has occurred on the server');
                }
                response = await response.json()
                props.history.push(`/upload?pid=${response.personId}`)
            } catch(err) {
                console.error(err);
                setError('An error has occurred')
            }
        };
    return (
        <div className="container">
            <PageHeader
                className="site-page-header"
                onBack={() => {props.history.goBack()}}
                title="Back"
                // subTitle="This is a subtitle"
            />
            <img alt="find-logo" src="/logo.png" className="logo"/>
            <br/>
            <Input size="large" placeholder="Email" prefix={<MailOutlined />} onChange={e => setEmail(e.target.value)} value={email} style={{width: "250px"}}/>
            <br/>
            <br />
            <Input size="large" placeholder="First Name" onChange={e => setFirstName(e.target.value)} value={firstName} style={{width: "250px"}}/>
            <br/>
            <br/>
            <Input size="large" placeholder="Last Name" onChange={e => setLastName(e.target.value)} value={lastName} style={{width: "250px"}}/>
            <br/>
            <br/>
            <Button type="primary" shape="round" size="large" onClick={createUser}>Sign In</Button>
            <br/>
            <br/>
            <Divider/>
            <br/>
                <h2>or</h2>
            <FacebookLogin
                appId="432606270709321"
                autoLoad={false}
                fields="email,first_name,last_name"
                scope="public_profile, email"
                callback={responseFacebook}
                icon="fa-facebook" />
            <br/>
        </div>
    );
}

export default SignUp;
