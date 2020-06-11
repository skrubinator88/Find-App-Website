import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {categories_colors, categories_info} from "../Constants";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
    staticChip: {
        padding: 10,
        fontSize: 12,
        fontWeight: 600,
        margin: 10
    },
    clickableChip: {
        padding: 10,
        fontSize: 13,
        fontWeight: 600,
        margin: 5
    },
    titleText: {
        textAlign: 'left',
        fontSize: 20
    }
}));

export const GemCategories = (props) => {
    const classes = useStyles();
    return (
        <>
        {props.categories.map((category, index) => {
                return (
                    <Chip
                        className={classes.staticChip}
                        size="small"
                        style={{background: categories_colors[category], color: "white"}}
                        label={category}
                    />
                );
            })}
            </>
    );
}

export const GemCategoriesSelect = (props) => {
    const classes = useStyles();
    return (
        <>
            {categories_info.map((category, index) => {
                return (
                    <Chip
                        className={classes.clickableChip}
                        variant={props.selectedCategories.indexOf(category.name) >= 0 ? "default" : "outlined"}
                        size="medium"
                        style={props.selectedCategories.indexOf(category.name) >= 0 ? {background: category.color, color: "white"} : {color: category.color, background: "white"}}
                        label={category.name}
                        onClick={ () => {props.toggleCategory(category.name)} }
                    />
                );
            })}
        </>
    );
};

export default GemCategories;
