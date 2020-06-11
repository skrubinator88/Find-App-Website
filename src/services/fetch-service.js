// import store from "../store/store";
const env = process.env.NODE_ENV || 'production';
const config = require('../config')[env];
let api = config.api;

class FetchService {
    // constructor(store, logoutAction) {
    //     this.store = store;
    //     this.logout = logoutAction;
    // }
    fetchGem = (id) => {
        return fetch(`${api}/gems/${id}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                // 'x-access-token': store.getState().auth.token
            }
        }).then(resp => {
            return resp
        })
    }
    fetchPlace = (placeId) => {
        return fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=%REACT_APP_PLACES_KEY% `, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then(resp => {
            return resp.json()
        })
    }
    fetchGems = (pageNo, search, categories) => {
        let url = `${api}/gems/?pageLimit=15`;
        let page = pageNo ? pageNo : 1;
        url = url + '&pageNo=' + page;
        if(search) url = url + '&search=' + search;
        if(categories) url = url + '&categories=' + categories;
        return fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then(resp => {
            return resp
        })
    }
    static fetchPerson(personId) {
        let url = `${api}/persons/${personId}`;
        return fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            }
        }).then(async resp => resp)
    };
}

export default FetchService;
