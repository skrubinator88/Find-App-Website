import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from 'react-google-autocomplete';
import {PostServiceModule} from "../App";
import TextField from '@material-ui/core/TextField';
import FileDropzone from "./file-dropzone/file-dropzone";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import {PageHeader} from "antd";
import * as QueryString from "query-string"
import {categories, categories_info} from "../Constants"
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
    dropzone: {
        margin: 20
    },
    textInput: {
        margin: 5,
        width: "100%"
    },
    titleText: {
        textAlign: 'left',
        fontSize: 23
    },
    chip: {
        padding: 20,
        fontSize: 16,
        fontWeight: 600,
        margin: 15
    },
    submitButton: {
        width: 100,
        padding: 10,
        margin: 20,
        marginBottom: 50
    }
}));


function UploadForm(props) {
    const [files, changeFiles] = useState([]);
    const [location, changeLocation] = useState('');
    const [description, changeDescription] = useState('');
    const [selectedCategories, changeSelectedCategories] = useState([]);

    const handleFilesChanged = (newFiles) => {
        console.log(newFiles)
        changeFiles(newFiles);
    }
    const submitForm = async () => {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            let f = files[i];
            formData.append('gem-media', f, f.name);
        }
        //remove the person id from the url query string
        const params = QueryString.parse(props.location.search);
        formData.append('location', location.formatted_address);
        // formData.append('lat', location.geometry.);
        formData.append('title', location.name);
        formData.append('description', description);
        formData.append('personId', params.pid);

        //get all of the categoryIds of the selected categories and send to server in a stringified array
        let categoryIds = selectedCategories.map(category => {
            return categories[category]
        });
        formData.append('categories', JSON.stringify(categoryIds));
        try {
            await PostServiceModule.postGem(formData)
            props.history.push("/")
        } catch(err) {
            console.error(err)
        }
    }

    const toggleCategory = (category) => {
        let categoryIndex = selectedCategories.indexOf(category);
        let newCategories = [...selectedCategories];
        if(categoryIndex >= 0) {
            newCategories.splice(categoryIndex, 1);
            changeSelectedCategories(newCategories);
        } else {
            newCategories.push(category);
            changeSelectedCategories(newCategories)
        }
    };

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <PageHeader
                className="site-page-header"
                onBack={() => {props.history.push('/')}}
                title="Back"
                // subTitle="This is a subtitle"
            />
            <Grid
                direction="column"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12}>
                    <Container maxWidth="md">
                        <h2>Submit a New Gem</h2>
                        <br/>
                        <h3 className={classes.titleText}>Location Name</h3>
                        <Autocomplete
                            className={classes.textInput}
                            onPlaceSelected={(place) => {
                                console.log(place)
                                changeLocation(place)
                            }}
                            types={["establishment"]}
                            componentRestrictions={{country: "us"}}
                        />
                    </Container>
                </Grid>
                <br/>
                <Divider/>
                <br/>
                <Grid item>
                    <Container maxWidth="md">
                        <h3 className={classes.titleText}>Comments</h3>
                        <TextField
                            id="description-field"
                            label="Description"
                            multiline
                            onChange={e => changeDescription(e.target.value)}
                            value={description}
                            className={classes.textInput}
                            rows={3}
                            placeholder="What was your experience like here?"
                            variant="outlined"
                        />
                    </Container>
                </Grid>
                <br/>
                <Divider/>
                <br/>
                <Grid item xs={12}
                      justify="center"
                      alignItems="center"
                      className={classes.dropzone}>
                    <Container maxWidth="md">
                        <h3 className={classes.titleText}>Upload your photos </h3>
                        <FileDropzone onFilesChanged={handleFilesChanged}/>
                    </Container>
                </Grid>
                <br/>
                <Divider/>
                <br/>
                <Grid item xs={12}
                      justify="center"
                      alignItems="center">
                    <Container maxWidth="md">
                        <h3 className={classes.titleText}>Choose a Category (Select all that may apply): </h3>
                        {categories_info.map((category, index) => {
                            return (
                                <Chip
                                    className={classes.chip}
                                    variant={selectedCategories.indexOf(category.name) >= 0 ? "default" : "outlined"}
                                    size="medium"
                                    style={selectedCategories.indexOf(category.name) >= 0 ? {background: category.color, color: "white"} : {color: category.color, background: "white"}}
                                    label={category.name}
                                    onClick={ () => {toggleCategory(category.name)} }
                                />
                            );
                        })}
                    </Container>
                </Grid>
                <br/>
                <Button variant="contained" className={classes.submitButton} color="secondary" onClick={submitForm}>
                    Submit
                </Button>
            </Grid>
        </div>
    );
}

export default UploadForm;
