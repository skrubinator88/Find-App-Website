import React, {useState} from 'react';
import './upload-form.css';
import { Input, Button, Upload, Modal } from 'antd';
import { MailOutlined, PhoneOutlined, PlusOutlined} from "@ant-design/icons";
import Autocomplete from 'react-google-autocomplete';
import PicturesWall from "./pictures-wall/pictures-wall";
import {PostServiceModule} from "../App";
const { TextArea } = Input;

function UploadForm() {
    const [files, changeFiles] = useState([]);
    const [location, changeLocation] = useState('');
    const [description, changeDescription] = useState('');

    const handleFilesChanged = (newFiles) => {
        console.log(newFiles)
        changeFiles(newFiles);
    }

    const submitForm = async () => {
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            let f = files[i].originFileObj;
            formData.append('gem-media', f, f.name);
        }
        formData.append('location', location.formatted_address);
        formData.append('description', description);
        try {
            await PostServiceModule.postGem(formData)
        } catch(err) {
            console.error(err)
        }
    }
    return (
        <div className="container">
            <h3>Submit a New Gem</h3>
            <Autocomplete
                className="text-input"
                onPlaceSelected={(place) => {
                    changeLocation(place)
                }}
                // types={}
                componentRestrictions={{country: "us"}}
            />
            <br/>
            <TextArea onChange={e => changeDescription(e.target.value)} value={description} rows={4} placeholder="Write a short description" className="text-input"/>
            <br/>
            <PicturesWall onFilesChanged={handleFilesChanged}/>
            <br/>
            <Button type="danger" shape="round" size="large" onClick={submitForm}>Submit Gem</Button>
        </div>
    );
}

export default UploadForm;
