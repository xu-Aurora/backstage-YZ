import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { Upload, Icon } from 'antd'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            editorHtml: ''
        };

    }
    componentDidMount () {
        const editorHtml = JSON.parse(localStorage.getItem('editorHtml'));
        const editorHtml1 = JSON.parse(localStorage.getItem('editorHtml1'));

        let goodsId = this.context.router.route.match.params.goodsId
        if(goodsId) {
            if(editorHtml1) {
                this.setState({
                    editorState: BraftEditor.createEditorState(editorHtml1),
                    editorHtml1
                })
            } else {
                let html = this.props.detailList.goodDetail.content
                this.setState({
                    editorState: BraftEditor.createEditorState(html),
                    editorHtml
                })
            }
            
        } else if(editorHtml) { //缓存
            this.setState({
                editorState: BraftEditor.createEditorState(editorHtml),
                editorHtml
            })
        }
       //向父组件传this
       this.props.onRef('twoConfig', this)
    }
    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = this.state.editorState.toHTML()
        const result = await saveEditorContent(htmlContent)
    }

    handleEditorChange = (editorState) => {
        this.setState({ 
            editorState,
            editorHtml:  editorState.toHTML()
        })
    }
    uploadHandler = (param) => {
        if (!param.file) {
          return false
        }
        this.props.uploadImg({
            params:{
                file: param.file
            },
            func: () => {
                this.setState({
                    editorState: ContentUtils.insertMedias(this.state.editorState, [{
                        type: 'IMAGE',
                        url: `/backstage/upload/download?uuid=${this.props.imgInfo}&viewFlag=1&fileType=jpg&filename=aa`
                    }])
                })
            }
        })
      }
    render() {
        const extendControls = [
            {
              key: 'antd-uploader',
              type: 'component',
              component: (
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  customRequest={this.uploadHandler}
                >
                  {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                  <button type="button" className="control-item button upload-button" data-title="插入图片">
                    <Icon type="picture" theme="filled" />
                  </button>
                </Upload>
              )
            }  
          ]
        // const controls = ['bold', 'italic', 'underline', 'separator', 'separator' ]
        const controls = [ 'separator',
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        'hr', 'separator',
        'clear' ]

        const { editorState } = this.state
        return (
            <div className="my-component">
                <BraftEditor
                    controls={controls}
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    extendControls={extendControls}
                />
            </div>
        )
    }
}
App.contextTypes = {
    router: PropTypes.object
}
function mapStateToProps(state) {
    return {
        imgInfo: state.goodsReleased.imgInfo,
        detailList: state.goodsReleased.detailList
    }
}
function dispatchToProps(dispatch) {
    return {
        uploadImg(payload, params) {
            dispatch({type: 'goodsReleased/uploadImg', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);