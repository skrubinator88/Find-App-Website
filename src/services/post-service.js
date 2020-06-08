// import store from "../store/store";

const env = process.env.NODE_ENV || 'production';
const config = require('../config')[env];
let api = config.api;

class PostService {
    // constructor(store, logoutAction) {
    //     this.store = store;
    //     this.logout = logoutAction;
    // }
    postGem(info) {
        return fetch(`${api}/gems/new`, {
            method: "POST",
            headers: {
                // 'x-access-token': store.getState().auth.token
            },
            body: info
        }).then(resp => {
            return resp
        })
    };
    postPerson(info) {
        return fetch(`${api}/persons/new`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(info)
        }).then(resp => {
            return resp
        })
    };
}

export default PostService;
