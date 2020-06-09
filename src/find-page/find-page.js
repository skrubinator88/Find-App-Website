import React, {useState, useEffect, useRef} from 'react';
import './find-page.css';
import {Grid} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {Container} from "@material-ui/core";
import {FetchServiceModule} from "../App";
import Paper from "@material-ui/core/Paper";
import { PageHeader } from 'antd';
import Carousel from 'react-material-ui-carousel'
import GemHeader from "../gem-header/gem-header";
import GemCategories from "../gem-categories/gem-categories";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        textAlign: "left"
    },
    carousel: {
        maxWidth: "100%",
        padding: 20
    },
    slide: {
        padding: 15,
        alignItems: "center"
    },
    cardImage: {
        maxWidth: "100%"
    },
    gemInfo: {
        fontSize: 17,
        fontWeight: 500
    },
    gemTitle: {
        fontSize: 23,
        fontWeight: 500
    },
    gemCategory: {
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "black"
    },
    gemUser: {
        fontStyle: "italic"
    }
}));

function FindPage(props) {
    const [gem, setGem] = useState([]);
    const [error, setError] = useState(null)

    useEffect(() => {
        const { id } = props.match.params;
        fetchGem(id)
    }, []);

    const fetchGem = async (id) => {
        setError('');
        try {
            let response = await FetchServiceModule.fetchGem(id);
            if (response.status === 200) {
                let data = await response.json();
                setGem(data);
            } else if (response.status === 400) {
                let error = await response.json();
                setError(error.error)
            } else {
                setError('An error has occurred on the server');
            }
        } catch (err) {
            console.error(err);
            setError('An error has occurred');
        }
    };

    const classes = useStyles();
    return (
        <div>
            <PageHeader
                className="site-page-header"
                onBack={() => {props.history.goBack()}}
                title="Back to Home"
            />
            <Grid container className={classes.root} spacing={3}>
                <Container>
                    <Grid item xs={12} md={6} lg={6}>
                        <GemHeader gem={gem} size="large"/>
                        <Carousel
                            interval={2500}
                            navButtonsAlwaysVisible={true}
                            className={classes.carousel}
                        >
                            {gem.media ? gem.media.map((mediaItem, index) => {
                                return (
                                    <Paper classes={classes.slide}>
                                        <img className={classes.cardImage} src={mediaItem.url} />
                                    </Paper>
                                );
                            }) : <div></div>}
                        </Carousel>
                    </Grid>
                </Container>
            </Grid>
        </div>
    );
}

export default FindPage;
