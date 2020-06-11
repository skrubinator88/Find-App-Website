import React, {Component} from 'react';
import './home-page.css';
import {Layout, PageHeader} from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import {Route, Switch} from 'react-router-dom';
import HomePageHeader from "../home-page-header/home-page-header";
import SearchBox from "../search-box/search-box";
import debounce from "lodash.debounce";
import {Container} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import {FetchServiceModule} from "../App";
import Paper from "@material-ui/core/Paper";
import FindPage from "../find-page/find-page";
import {GemCategoriesSelect} from "../gem-categories/gem-categories";
import GemList from "../search-results/gem-list";
import {categories} from "../Constants";

const { Footer } = Layout;

const useStyles = makeStyles((theme) => ({
    titleText: {
        textAlign: 'left',
        fontSize: 16,
        fontWeight: 700
    },
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

class SearchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            gems: [],
            search: '',
            pageNo: 1,
            hasMore: false,
            isFetching: false,
            selectedCategories: []
        };
    }

    componentDidMount = async () => {
        try {
            await this.fetchGems(this.state.pageNo)
        } catch(err) {
            console.log(err)
        }
    };
    fetchGems = async (pageNo, providedSearch, categoryIds) => {
        console.log(this.state.selectedCategories, " Fetching gems");
        this.setState({error: '', isFetching: true});
        try {
            let response = await FetchServiceModule.fetchGems(pageNo, providedSearch, categoryIds);
            if (response.status === 200) {
                let data = await response.json();
                let newGems = (pageNo > 1) ? [...this.state.gems].concat(data.rows) : data.rows;
                this.setState({hasMore: newGems.length < data.count, gems: newGems})
            } else if (response.status === 400) {
                let error = await response.json();
                this.setState({error: error.error});
            } else {
                this.setState({error: 'An error has occurred on the server'});
            }
            this.setState({isFetching: false});
        } catch (err) {
            console.error(err);
            this.setState({error: 'An error has occurred'});
        }
    }

    loadMore = async () => {
        this.setState({pageNo: this.state.pageNo + 1});
        try {
            await this.fetchGems(this.state.pageNo, this.state.search)
        } catch(err) {
            console.log(err)
        }
    };

    searchGems = async (search) => {
        try {
            this.setState({search: search, gems: [], pageNo: 1})
            await this.fetchGems(1, search);
        } catch(err) {
            console.log(err)
        }
    };

    toggleCategory = async (category) => {
        let categoryIndex = this.state.selectedCategories.indexOf(category);
        let newCategories = [...this.state.selectedCategories];
        if (categoryIndex >= 0) {
            newCategories.splice(categoryIndex, 1);
        } else {
            newCategories.push(category);
        }
        this.setState({selectedCategories: newCategories});
        this.setState({gems: [], pageNo: 1})
        let categoryIds = newCategories.map(category => {
            return categories[category]
        });
        let categoriesFinal = categoryIds.length > 0 ? JSON.stringify(categoryIds) : null;
        await this.fetchGems(1, this.state.search, categoriesFinal)
    };
    render () {
        return (
            <div style={{padding: '0 50px'}}>

                <SearchBox onSearch={this.searchGems}/>
                <br/>
                {this.state.search.length > 0 ? <PageHeader
                    className="site-page-header"
                    onBack={() => {this.searchGems('')}}
                    title={this.state.search}
                />: null}
                <Container>
                    <span style={{fontSize: 16, fontWeight: 700}}>Filter By Category:</span>
                    <GemCategoriesSelect selectedCategories={this.state.selectedCategories} toggleCategory={this.toggleCategory}/>
                </Container>
                <br/>
                <GemList gems={this.state.gems} isFetching={this.state.isFetching} hasMore={this.state.hasMore} loadMore={this.loadMore}/>
            </div>
        )
    }
}

export default HomePage;
