import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GemCategories from "../gem-categories/gem-categories";
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        textAlign: "left",
        padding: 15
    },
    gemInfo: {
        fontSize: 17,
        fontWeight: 500
    },
    gemTitle: {
        fontSize: 23,
        fontWeight: 500,
        color: "black"
    },
    gemLocation: {
        fontWeight: 500
    },
    gemCategory: {
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black",
    },
    gemUser: {
        fontStyle: "italic"
    },
    gemDescription: {
        fontSize: 15,
        textColor: 'black'
    }
}));

function GemHeader(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <span className={[classes.gemTitle]}>{props.gem.title}</span>
            <br/>
            <span className={[classes.gemLocation]}>{props.gem.location}</span>
            <br/>
            <span className={[classes.gemUser]}>Submitted by {props.gem.username}</span>
            <br/>
            {props.gem.categories ? <GemCategories categories={props.gem.categories}/> : null}
            <br/>
            <p className={classes.gemDescription}>
                {props.gem.description}
            </p>
        </div>
    );
}

export default GemHeader;
