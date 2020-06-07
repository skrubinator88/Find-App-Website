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
        fontSize: 15,
        margin: 15
    },
    submitButton: {
        width: 100,
        padding: 10,
        margin: 20,
        marginBottom: 50
    }
}));

function UploadForm() {
    const [files, changeFiles] = useState([]);
    const [location, changeLocation] = useState('');
    const [description, changeDescription] = useState('');
    const [categories, changeCategories] = useState([
        {
            name: "Food",
            color: "red"
        },
        {
            name: "Activities",
            color: "green"
        },
        {
            name: "Night Life",
            color: "violet"
        },
        {
            name: "Dating",
            color: "yellow"
        },
        {
            name: "Black Owned",
            color: "black"
        }]);
    const [selectedCategories, changeSelectedCategories] = useState([]);

    const handleFilesChanged = (newFiles) => {
        console.log(newFiles)
        changeFiles(newFiles);
    }

    const submitForm = async () => {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            let f = files[i].originFileObj;
            formData.append('gem-media', f, f.name);
        }
        formData.append('location', location.formatted_address);
        formData.append('description', description);
        try {
            await PostServiceModule.postGem(formData)
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
    }

    const classes = useStyles();

    return (
        <div className={classes.root}>
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
                                changeLocation(place)
                            }}
                            // types={}
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
                        <h3 className={classes.titleText}>Choose a Category: </h3>
                        {categories.map((category, index) => {
                            return (
                                <Chip
                                    className={classes.chip}
                                    variant={selectedCategories.indexOf(category.name) >= 0 ? "default" : "outlined"}
                                    size="medium"
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
