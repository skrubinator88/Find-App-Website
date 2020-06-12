import React, {useState, useEffect, useRef} from 'react';
import debounce from "lodash.debounce";
import {Grid} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from "@material-ui/core/Paper";
import {GemCategories} from "../gem-categories/gem-categories";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mediaCard: {
        textAlign: "left",
        maxWidth: "100%",
        maxHeight: 450,
        padding: 20
    },
    cardImage: {
        maxWidth: "100%",
        maxHeight: 300,
        width: "auto",
        height: "auto"
    },
    gemInfo: {
        fontSize: 14,
        fontWeight: 500
    },
    gemTitle: {
        fontSize: 17,
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
    },
    progress: {
        display: "inline-block",
        margin: 20
    }
}));


const GemList = (props) => {
    const classes = useStyles();
    let myRef = useRef(null);

    const [hasMore, setHasMore] = useState(props.hasMore);
    const [gems, setGems] = useState(props.gems);

    useEffect(() => {
        setHasMore(props.hasMore);
        setGems(props.gems);
        document.addEventListener('wheel', handleScroll, { passive: true });
        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('wheel', handleScroll);
        };
    }, [props.hasMore, props.gems]);

    const handleScroll = debounce(async (e) => {
        if (!hasMore) {
            return
        }
        const node = myRef.current;
        if(node) {
            let scrollTop = node.scrollTop;
            let clientHeight = node.clientHeight;
            let scrollHeight = node.scrollHeight;
            let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight / 2;

            if(scrolledToBottom) {
                await props.loadMore()
            }
        }
    }, 100);

    return (
        <Grid container className={classes.root} spacing={3} ref={myRef}>
            {gems.length > 0 ? gems.map((gem, index) => {
                return (
                    <>
                        {gem ? <Grid item xs={12} sm={6} md={5} lg={4}>
                            <a href={`/${gem.id}`}>
                                <Paper className={classes.mediaCard}>
                                    <span className={[classes.gemTitle]}>{gem.title}</span>
                                    <br/>
                                    <span className={[classes.gemUser]}>Submitted by {gem.username}</span>
                                    <br/>
                                    {gem.categories.length > 0 ? <GemCategories categories={gem.categories}/> : null}
                                    <br/>
                                    <img src={gem.url} className={classes.cardImage}/>
                                </Paper>
                            </a>
                        </Grid> : null}
                    </>
                );
            }) : <h2>Sorry, we couldn't find any gems</h2>}
            {props.isFetching ? <CircularProgress className={classes.progress}/> : null}
        </Grid>
    );
};

export default GemList;
