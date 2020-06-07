import React,{Component} from 'react';
import './file-dropzone.css';
import {DropzoneArea} from 'material-ui-dropzone'

class FileDropzone extends Component {
    state = {
        fileList: [],
    };

    handleChange = (files) => {
        this.setState({ fileList: files });
        this.props.onFilesChanged(files)
    };

    render() {
        return (
            <DropzoneArea
                acceptedFiles={['image/*']}
                dropzoneText={"Drag and drop images here or click"}
                onChange={this.handleChange.bind(this)}
            />
        );
    }
}

export default FileDropzone
