import React from 'react';

import {Upload, Icon, message} from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: '',
            previewVisible: false,
            uploadImg: false,
            fileList: [],
            defaultFileList: []
        };
        this.timer = null;
    }
    componentWillReceiveProps(nextProps) {
        const self = this;
        if (typeof nextProps.defaultFileList === 'object') {
            self.setState({fileList: nextProps.defaultFileList, uploadImg: true})
        }
    }
    handleChangeImg = ({fileList}) => {
        //  this.props.callback(this.props.uploadType, fileList);
        //  let loadStatus = false;
        //  if (fileList.length > 0) {
        //      loadStatus = true
        //  }
        //  this.setState({fileList, uploadImg: loadStatus})
        if (fileList.length > 0) {
            this.props.callback(this.props.uploadType, fileList);
            this.setState({fileList, uploadImg: true})
        } else {
            this.setState({fileList, uploadImg: false})
        }
    }
    checkImg(file, fileList) {
        if (!/image/.test(file.type)) {
            message.error('文件必须为图片！')
            return false;
        }
        if (file.size > 1000000) {
            message.error('图片不能超过1M！')
            return false;
        }
        return true;
    }
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }
    removeImg = (file) => {
        const data = this.state.fileList;
        data.forEach((item, index) => {
            if (item.url === file.url) {
               data.splice(index, 1);
            };
        })
        this.props.callback(this.props.uploadType, data);
        this.setState({fileList: data, uploadImg: false})
      
        //console.log(file.url);
    }  
    render() {
        const props = {
            action: this.props.url,
            multiple: true,
            listType: 'picture-card',
            className: 'upload-list-inline',
            beforeUpload: this.checkImg,
            onRemove: this.removeImg,
            onChange: this.handleChangeImg,
            key: this.props.uploadType,
            fileList: this.state.fileList.length > 0 ? this.state.fileList : false,
            onPreview: this.handlePreview 
        };
        const uploadImgElemnt = (
            <div>
                <Icon type="plus" style={{fontSize: 30 }}/>
            </div>
        );
        const UploadElemnt = !this.props.multiple ? (
            <Upload
                style={!this.state.uploadImg ? {display: 'inline-block',marginRight: 0} : {display: 'none'}}
                action={this.props.url}
                key={this.props.uploadType}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={this.checkImg}
                onRemove={this.removeImg}
                fileList={this.state.fileList.length > 0 ? this.state.fileList : false}
                onChange={this.handleChangeImg}>
                {this.state.uploadImg ? null : uploadImgElemnt}
            </Upload>
        ) : (
            <Upload {...props} style={{position: 'relative'}}>
                {uploadImgElemnt}
                {this.props.children}
            </Upload>
        );
        return (
            <span>{UploadElemnt}</span>
        )
    }
}

export default App;