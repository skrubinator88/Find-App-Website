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
import GemList from "../search-results/gem-list";
const { Footer } = Layout;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    mediaCard: {
        textAlign: "left",
        maxWidth: "100%",
        padding: 20
    },
    cardImage: {
        width: "100%"
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

    useEffect(()=>{
        fetchGems()
    },[])
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
            await fetchGems(pageNo)
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

    return (
        <div style={{ padding: '0 50px'}}>

            <SearchBox onChangeText={setSearch} onSearch={searchGems}/>
            <br/>
            <GemList gems={gems} isFetching={isFetching} hasMore={hasMore} loadMore={loadMore}/>
        </div>
    );
}

export default HomePage;
