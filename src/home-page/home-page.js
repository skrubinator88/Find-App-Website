import React, {useState, useEffect, useRef} from 'react';
import './home-page.css';
import {Layout, Menu, Breadcrumb, Row, Modal} from 'antd';
import HomePageHeader from "../home-page-header/home-page-header";
import SearchBox from "../search-box/search-box";
import debounce from "lodash.debounce";

import { Card } from 'antd';
import {FetchServiceModule} from "../App";
const { Content, Footer } = Layout;
const { Meta } = Card;

function MediaList(props) {
    const media = props.items;
    const handleCancel = () => {

    }
    const listItems = media.map((mediaItem) =>
        <Card
            hoverable
            style={{ width: 350, margin: 10 }}
            cover={<img alt="example" src={mediaItem.url} />}
            onClick={() => {props.handleModalClicked(mediaItem)}}
        >
            <Meta title={mediaItem.location} description={mediaItem.description} />
        </Card>
    );
    return (
        <>
        {listItems}
        </>
    );
}

function HomePage() {
    const [gems, setGems] = useState(null);
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

    const searchGems = async () => {
        setGems(null)
        await fetchGems()
    }

    const activateModal = (mediaItem) => {
        changeShownMediaItem(mediaItem)
        changeModalOpen(true)
    }
    return (
        <Layout>
            <HomePageHeader/>
            <Content className="site-layout" style={{ padding: '0 50px', marginTop: 64 }}>
                <SearchBox onChangeText={setSearch} onSearch={searchGems}/>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 600 }} ref={myRef}>
                    {shownMediaItem ? <Modal
                        visible={modalOpen}
                        title={shownMediaItem.location}
                        footer={shownMediaItem.description}
                        onCancel={() => {changeModalOpen(false)}}
                    >
                        <img alt="example" style={{ width: '100%' }} src={shownMediaItem.url} />
                    </Modal> : null}
                    {gems ? <MediaList items={gems} handleModalClicked={activateModal}/> : <p>No Media Found</p>}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Find ©2020 Created by Find APP LLC</Footer>
        </Layout>
    );
}

export default HomePage;
