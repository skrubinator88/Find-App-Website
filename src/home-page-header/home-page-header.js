import React, {useState} from 'react';
import './home-page-header.css';
import { Layout, Menu, Modal} from 'antd';
import UploadOutlined from "@ant-design/icons/es/icons/UploadOutlined";
import SignUp from "../sign-up/sign-up";
import { Anchor } from 'antd';

const { Header } = Layout;
const { Link } = Anchor;

function HomePageHeader(props) {

    return (
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', float: "right", backgroundColor: "white" }}>
                <Menu theme="light" mode="horizontal" style={{float: "right"}}>
                    <Menu.Item key="upload" icon={<UploadOutlined />}>
                        <a href="/submit/signup">Submit a gem</a>
                    </Menu.Item>
                </Menu>
            </Header>
    );
}

export default HomePageHeader;
