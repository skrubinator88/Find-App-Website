import React, {useState, useEffect, useRef} from 'react';
import './home-page.css';
import {Layout} from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import HomePageHeader from "../home-page-header/home-page-header";
import SearchBox from "../search-box/search-box";
import debounce from "lodash.debounce";
import {Grid} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {FetchServiceModule} from "../App";
import Paper from "@material-ui/core/Paper";
import FindPage from "../find-page/find-page";
import GemCategories from "../gem-categories/gem-categories";
const { Footer } = Layout;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mediaCard: {
        textAlign: "left",
        maxWidth: 400,
        padding: 20
    },
    cardImage: {
        width: 350
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
    }
}));

function HomePage() {

    return (
        <Router>
                <HomePageHeader/>

            <Switch>
                <Route exact path='/' component={SearchPage}/>
                <Route exact path='/:id' component={FindPage}/>
            </Switch>
            <br/>
            <Footer style={{ textAlign: 'center' }}>Find ©2020 Created by Find APP LLC</Footer>
        </Router>
    );
}

function SearchPage(props) {
    const [gems, setGems] = useState([]);
    const [pageNo, changePageNo] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [search, setSearch] = useState(false);
    const [isFetching, setIsFetching] = useState(false)
    const [error, setError] = useState(null)

    let myRef = useRef(null);

    useEffect(() => {
        fetchGems()
        document.addEventListener('wheel', handleScroll, { passive: true });
        document.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            document.removeEventListener('scroll', handleScroll);
            document.removeEventListener('wheel', handleScroll);
        };
    }, []);

    const handleScroll = debounce(async (e) => {
        if (!hasMore) {
            return
        }
        const node = myRef.current;
        if (node) {
            let scrollTop = node.scrollTop;
            let clientHeight = node.clientHeight;
            let scrollHeight = node.scrollHeight;
            let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

            if (scrolledToBottom) {
                await loadMore()
            }
        }
    }, 350);

    const fetchGems = async () => {
        setError('');
        setIsFetching(true);
        try {
            let response = await FetchServiceModule.fetchGems(pageNo, search);
            if (response.status === 200) {
                let data = await response.json();
                let newGems = (pageNo > 1) ? [...gems].concat(data.rows) : data.rows;
                setHasMore(newGems.length < data.count );
                setGems(newGems);
            } else if (response.status === 400) {
                let error = await response.json();
                setError(error.error);
            } else {
                setError('An error has occurred on the server');
            }
            setIsFetching(false);
        } catch (err) {
            console.error(err);
            setError('An error has occurred');
        }
    }

    const loadMore = async () => {
        changePageNo(pageNo + 1);
        try {
            await this.fetchGems(pageNo)
        } catch(err) {
            console.log(err)
        }
    };

    const searchGems = debounce(async (search) => {
        try {
            setSearch(search);
            setGems([]);
            changePageNo(1);
            await fetchGems();
        } catch(err) {
            console.log(err)
        }
    }, 400);

    const classes = useStyles();
    return (
        <div style={{ padding: '0 50px'}}>

            <SearchBox onChangeText={setSearch} onSearch={searchGems}/>
            <br/>
            <Grid container className={classes.root} spacing={3}>
                {gems.map((gem, index) => {
                    return (
                        <Grid item xs={12} md={6} lg={4}>
                            <a href={`/${gem.id}`}>
                                <Paper className={classes.mediaCard}>
                                    <span className={[classes.gemTitle]}>{gem.location}</span>
                                    <br/>
                                    <span className={[classes.gemUser]}>Submitted by {gem.username}</span>
                                    <br/>
                                    {gem.categories ? <GemCategories categories={gem.categories}/> : null}
                                    <br/>
                                    <img src={gem.url} className={classes.cardImage}/>
                                </Paper>
                            </a>
                        </Grid>
                    );
                })}
            </Grid>
        </div>
    );
}

export default HomePage;
