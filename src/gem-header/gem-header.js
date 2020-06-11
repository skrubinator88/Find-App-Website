import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GemCategories from "../gem-categories/gem-categories"
import {Grid} from "@material-ui/core";

import {
    FacebookIcon,
    FacebookShareButton,
    FacebookShareCount, PinterestIcon,
    PinterestShareButton, PinterestShareCount, TumblrIcon, TumblrShareButton, TumblrShareCount,
    TwitterIcon,
    TwitterShareButton
} from "react-share";
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
    },
    socialMediaIcon: {
        margin: 5,
        textAlign: "center"
    }
}));

function GemHeader(props) {
    const classes = useStyles();
    const hashTag = "#FINDchallenge";
    console.log(props.gem)
    return (
        <Grid className={classes.root}>
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
            <Grid container className="Demo__container">
                <Grid item className={classes.socialMediaIcon}>
                    <FacebookShareButton
                        url={`https://thefindapp.com/${props.gem.id}`}
                        quote={`Discovered this Gem using Find: \n${props.gem.title}\n${props.gem.description? props.gem.description: null}...\n#SupportBlackBusiness`}
                        hashtag={[hashTag]}
                        className="Demo__some-network__share-button"
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <FacebookShareCount url={`https://thefindapp.com/${props.gem.id}`} className="Demo__some-network__share-count">
                        {count => count}
                    </FacebookShareCount>
                </Grid>
                    <Grid item className={classes.socialMediaIcon}>
                        <TwitterShareButton
                            url={`https://thefindapp.com/${props.gem.id}`}
                            title={props.gem.title + " - Discovered on Find"}
                            hashtags={["FINDchallenge", "SupportBlackBusinesses"]}
                            related={["thefindapp_"]}
                            className="Demo__some-network__share-button"
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                    </Grid>
                    <Grid item className={classes.socialMediaIcon}>
                        <PinterestShareButton
                            url={`https://thefindapp.com/${props.gem.id}`}
                            description={`Discovered this Gem using Find: \n${props.gem.title}\n${props.gem}...\n#SupportBlackBusiness` + " " + hashTag}
                            media={props.gem.url}
                            className="Demo__some-network__share-button"
                        >
                            <PinterestIcon size={32} round />
                        </PinterestShareButton>
                        <br/>
                        <PinterestShareCount url={`https://thefindapp.com/${props.gem.id}`} className="Demo__some-network__share-count">
                            {count => count}
                        </PinterestShareCount>
                    </Grid>
                    <Grid item className={classes.socialMediaIcon}>
                        <TumblrShareButton
                            url={`https://thefindapp.com/${props.gem.id}`}
                            description={`Discovered this Gem using Find: \n${props.gem.title}\n${props.gem}...\n#SupportBlackBusiness`}
                            tags={["FINDchallenge", "SupportBlackBusiness"]}
                            className="Demo__some-network__share-button"
                        >
                            <TumblrIcon size={32} round />
                        </TumblrShareButton>

                        <div>
                            <TumblrShareCount url={`https://thefindapp.com/${props.gem.id}`} className="Demo__some-network__share-count">
                                {count => count}
                            </TumblrShareCount>
                        </div>
                    </Grid>
            </Grid>
        </Grid>
    );
}

export default GemHeader;
