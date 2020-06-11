import React from 'react';
import './search-box.css';
import { Input } from 'antd';
const { Search } = Input;

function SearchBox(props) {
    const handleSearch = (value) => {
        props.onSearch(value)
    }
    return (
        <div className="container">
            <Search
                placeholder="Search places"
                onSearch={value => handleSearch(value)}
                size="large"
                allowClear={true}
                enterButton />
        </div>
    );
}

export default SearchBox;
