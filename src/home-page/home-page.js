import React, {useState, useEffect, useRef} from 'react';
import './home-page.css';
import {Layout, Menu, Breadcrumb, Row, Modal} from 'antd';
import HomePageHeader from "../home-page-header/home-page-header";
import SearchBox from "../search-box/search-box";
import debounce from "lodash.debounce";
import {Grid} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import { Card } from 'antd';
import {FetchServiceModule} from "../App";
import Paper from "@material-ui/core/Paper";
const { Content, Footer } = Layout;
const { Meta } = Card;

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
    const [gems, setGems] = useState([]);
    const [shownMediaItem, changeShownMediaItem] = useState(null);
    const [modalOpen, changeModalOpen] = useState(false);
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
        try {
            setError(null)
            setIsFetching(true)
            let response = await FetchServiceModule.fetchGems(pageNo, search)
            if(response.status === 200) {
                let data = await response.json();
                console.log(data.rows[0])
                let newGems;
                if(gems) {
                    setHasMore(gems.length < data.count );
                    newGems = [...gems].concat(data.rows);
                } else {
                    newGems = data.rows
                }
                //add new gems to state
                setGems(newGems)
            } else if(response.status === 400) {
                let error = await response.json();
                setError(error)
            } else {
                setError('An error has occurred on the server')
            }
            setIsFetching(false)
        } catch(err) {
            console.log(err)
            setIsFetching(false)
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
            await this.fetchGems();
        } catch(err) {
            console.log(err)
        }
    }, 400);

    const activateModal = (mediaItem) => {
        changeShownMediaItem(mediaItem)
        changeModalOpen(true)
    }

    const classes = useStyles();
    return (
        <Layout>
            <HomePageHeader/>
            <div style={{ padding: '0 50px'}}>
                <SearchBox onChangeText={setSearch} onSearch={searchGems}/>
                {/*<div className="site-layout-background" style={{ padding: 24, minHeight: 600 }} ref={myRef}>*/}
                {/*    {shownMediaItem ? <Modal*/}
                {/*        visible={modalOpen}*/}
                {/*        title={shownMediaItem.location}*/}
                {/*        footer={shownMediaItem.description}*/}
                {/*        onCancel={() => {changeModalOpen(false)}}*/}
                {/*    >*/}
                {/*        <img alt="example" style={{ width: '100%' }} src={shownMediaItem.url} />*/}
                {/*    </Modal> : null}*/}
                {/*    {gems ? <MediaList items={gems} handleModalClicked={activateModal}/> : <p>No Media Found</p>}*/}
                {/*</div>*/}
                <br/>
                <Grid container className={classes.root} spacing={3}>
                    {gems.map((gem, index) => {
                        return (
                            <Grid item xs={12} md={6} lg={4}>
                                <Paper className={classes.mediaCard}>
                                    <span className={[classes.gemTitle]}>{gem.location}</span>
                                    <br/>
                                    <span className={[classes.gemUser]}>Submitted by User Name</span>
                                    <br/>
                                    <span className={[classes.gemCategory]}>Category</span>
                                    <img src={gem.url} className={classes.cardImage}/>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </div>
            <Footer style={{ textAlign: 'center' }}>Find ©2020 Created by Find APP LLC</Footer>
        </Layout>
    );
}

export default HomePage;
