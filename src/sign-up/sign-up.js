import React from 'react';
import './sign-up.css';
import { Input, Button } from 'antd';
import { MailOutlined, PhoneOutlined} from "@ant-design/icons";

function SignUp(props) {
    return (
        <div className="container">
            <img alt="find-logo" src="/logo.png" className="logo"/>
            <br/>
            <Input size="large" placeholder="Email" prefix={<MailOutlined />} style={{width: "250px"}}/>
            <br/>
            <br />
            <Input size="large" placeholder="Phone" prefix={<PhoneOutlined />} style={{width: "250px"}}/>
            <br/>
            <br />
            <Input size="large" placeholder="First Name" style={{width: "250px"}}/>
            <br/>
            <br/>
            <Input size="large" placeholder="Last Name" style={{width: "250px"}}/>
            <br/>
            <Button type="primary" shape="round" size="large" onClick={() => {props.history.push('/submit/upload')}}>Sign In</Button>
        </div>
    );
}

export default SignUp;
