import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {categories_colors} from "../Constants";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    chip: {
        padding: 10,
        fontSize: 12,
        fontWeight: 600,
        margin: 10
    },
}));

function GemCategories(props) {
    const classes = useStyles();
    return (
        <>
        {props.categories.map((category, index) => {
                return (
                    <Chip
                        className={classes.chip}
                        size="small"
                        style={{background: categories_colors[category], color: "white"}}
                        label={category}
                    />
                );
            })}
            </>
    );
}

export default GemCategories;
