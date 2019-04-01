import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { Upload, Icon } from 'antd'
import styles from './index.less';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorState: BraftEditor.createEditorState(null), //服务详情
            editorHtml: '', //服务详情
            editorState1: BraftEditor.createEditorState(null),//常见问题
            editorHtml1: ''//常见问题
        };

    }
    componentDidMount () {
        let threeData= JSON.parse(localStorage.getItem('threeData'));
        if(threeData) { //缓存
            this.setState({
                editorState: BraftEditor.createEditorState(threeData.editorHtml),
                editorHtml: threeData.editorHtml,
                editorState1: BraftEditor.createEditorState(threeData.editorHtml1),
                editorHtml1: threeData.editorHtml1
            })
        }
       //向父组件传this
       this.props.onRef('threePage', this)
    }

    handleEditorChange (param, data, ev) {
        this.setState({ 
            [param]: ev,
            [data]:  ev.toHTML()
        })
    }
    uploadHandler(data, param) {
        if (!param.file) {
          return false
        }
        this.props.uploadImg({
            params:{
                file: param.file
            },
            func: () => {
                this.setState({
                    [data]: ContentUtils.insertMedias(this.state[data], [{
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
                  customRequest={this.uploadHandler.bind(this, 'editorState')}
                >
                  {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                  <button type="button" className="control-item button upload-button" data-title="插入图片">
                    <Icon type="picture" theme="filled" />
                  </button>
                </Upload>
              )
            }  
          ]
          const extendControls1 = [
            {
              key: 'antd-uploader',
              type: 'component',
              component: (
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  customRequest={this.uploadHandler.bind(this, 'editorState1')}
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
        const controls = [
        'font-size', 'line-height', 'letter-spacing', 'separator',
        'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
        'text-indent', 'text-align', 'separator',
        'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
        'hr', 'separator',
        'clear' ]

        const { editorState, editorState1 } = this.state
        return (
            <div  className={styles.commonBox}>
                <div className={styles.left}>
                    <div className={styles.header}>服务详情</div>
                    <BraftEditor
                        controls={controls}
                        value={editorState}
                        onChange={this.handleEditorChange.bind(this, 'editorState', 'editorHtml', )}
                        extendControls={extendControls}
                    />
                </div>
                <div  className={styles.right}>
                    <div className={styles.header}>常见问题</div>
                    <BraftEditor
                        controls={controls}
                        value={editorState1}
                        onChange={this.handleEditorChange.bind(this, 'editorState1', 'editorHtml1')}
                        extendControls={extendControls1}
                    />
                </div>   
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