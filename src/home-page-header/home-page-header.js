import React, {useState} from 'react';
import './home-page-header.css';
import { Layout, Menu, Modal} from 'antd';
import Button from '@material-ui/core/Button';
import UploadOutlined from "@ant-design/icons/es/icons/UploadOutlined";
import SignUp from "../sign-up/sign-up";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Anchor } from 'antd';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const { Header } = Layout;
const { Link } = Anchor;

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#E80065",
        },
        secondary: {
            main: "#f50057"
        },
    },
    status: {
        danger: 'orange',
    },
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

function HomePageHeader(props) {
    const classes = useStyles();
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" className="appBar">
                <Toolbar>
                    <span className="header">Find</span>
                    <Button className={classes.menuButton} startIcon={<CloudUploadIcon />} color="inherit" href="/submit/signup">Submit a Gem</Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
}

export default HomePageHeader;
