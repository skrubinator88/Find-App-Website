import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Autocomplete from 'react-google-autocomplete';
import {FetchServiceModule, PostServiceModule} from "../App";
import TextField from '@material-ui/core/TextField';
import FileDropzone from "./file-dropzone/file-dropzone";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import {PageHeader} from "antd";
import * as QueryString from "query-string"
import {categories, categories_info} from "../Constants"
import PlacesAutocomplete from 'react-places-autocomplete';
import imageCompression from 'browser-image-compression';
import CircularProgress from '@material-ui/core/CircularProgress';


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
        width: "100%",
        minHeight: 20,
        padding: 5
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
        padding: 10,
        margin: 20,
        marginBottom: 50
    },
    suggestion: {
        padding: 10,
        fontSize: 14,
        margin: 5,
        cursor: "pointer"
    },
    circularProgress: {
        margin: 10
    }
}));


function UploadForm(props) {
    const [files, changeFiles] = useState([]);
    const [location, changeLocation] = useState('');
    const [title, changeTitle] = useState('');
    const [description, changeDescription] = useState('');
    const [selectedCategories, changeSelectedCategories] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFilesChanged = (newFiles) => {
        console.log(newFiles)
        changeFiles(newFiles);
    };
    const submitForm = async () => {
        setIsSubmitting(true)
        const formData = new FormData();
        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1500,
        }
        for (let i = 0; i < files.length; i++) {
            let f = files[i];
            try {
                const compressedFile = await imageCompression(f, options);
                formData.append('gem-media', compressedFile, f.name);
            } catch (error) {
                console.log(error);
            }
        }
        //remove the person id from the url query string
        const params = QueryString.parse(props.location.search);
        formData.append('location', location);
        // formData.append('lat', location.geometry.);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('personId', params.pid);

        //get all of the categoryIds of the selected categories and send to server in a stringified array
        let categoryIds = selectedCategories.map(category => {
            return categories[category]
        });
        formData.append('categories', JSON.stringify(categoryIds));
        try {
            await PostServiceModule.postGem(formData)
            props.history.push("/");
            setIsSubmitting(false)
        } catch (err) {
            setIsSubmitting(false);
            console.error(err)
        }
    }

    const handleSelect = (suggestion) => {
        // Do something with address and placeId and suggestion
        changeLocation(suggestion.formattedSuggestion.secondaryText);
        changeTitle(suggestion.formattedSuggestion.mainText);
        setShowSuggestions(false)
    }

    const toggleCategory = (category) => {
        let categoryIndex = selectedCategories.indexOf(category);
        let newCategories = [...selectedCategories];
        if (categoryIndex >= 0) {
            newCategories.splice(categoryIndex, 1);
            changeSelectedCategories(newCategories);
        } else {
            newCategories.push(category);
            changeSelectedCategories(newCategories)
        }
    };

    const classes = useStyles();

    const renderFunc = ({getInputProps, getSuggestionItemProps, suggestions, loading}) => (
        <div className="autocomplete-root">
            <input {...getInputProps({className: classes.textInput})} placeholder="Search for locations"/>
            <div className="autocomplete-dropdown-container">
                {loading && <div>Searching locations...</div>}
                {showSuggestions ? suggestions.map(suggestion => (
                    <Paper className={classes.suggestion} {...getSuggestionItemProps(suggestion)} onClick={() => {
                        handleSelect(suggestion)
                    }}>
                        <strong>
                            {suggestion.formattedSuggestion.mainText}
                        </strong>{' '}
                        <small>
                            {suggestion.formattedSuggestion.secondaryText}
                        </small>
                    </Paper>
                )) : null}
            </div>
        </div>
    );


    const searchOptions = {
        types: ['establishment']
    }
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
                        <PlacesAutocomplete
                            value={location}
                            debounce={300}
                            onChange={address => {
                                setShowSuggestions(true)
                                changeLocation(address)
                            }}
                            searchOptions={searchOptions}
                        >
                            {renderFunc}
                        </PlacesAutocomplete>;
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
                <Button variant="contained" className={classes.submitButton} color="secondary" onClick={submitForm} disabled={isSubmitting}>
                    {isSubmitting ? <><CircularProgress className={classes.circularProgress} size={20}/>
                        Submitting</>: <>Submit</>}

                </Button>
            </Grid>
        </div>
    );
}

export default UploadForm;
