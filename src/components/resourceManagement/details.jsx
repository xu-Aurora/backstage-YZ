import React from 'react';
import {Input,Select,Button,Switch,Form,message} from 'antd';
import styles from '../common.less';
import {connect} from 'dva';

const Option = Select.Option;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            treeId: null,
            isEdiut: 0,
            isUnPage: false,
            isEdiutx: 0,
            NoContent: false,
            data: {
                name: '',
                url: '',
                eName: '',
                type: ''
            },
            isUp: '0',
            status: 'a',

        };
    }
    componentWillMount() {
        if (this.props.treeId) {
            if (this.props.treeId.id) {
                this.setState({treeId: this.props.treeId.id});
                this.props.queryDetail({
                    id: this.props.treeId.id,
                    userId: JSON.parse(localStorage.getItem('userDetail')).id
                });
            }
        }
    }
    componentDidMount() {
        if (!this.props.match.params.key) {
            this.setState({isEdiut: 1});
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.treeId) {
            if (nextProps.treeId.id == '') {
                this.setState({
                    treeId: '',
                    data:  {
                        name: '',
                        url: '',
                        eName: '',
                        type: ''
                    },
                    isEdiut: 1
                })
            } else if (this.state.treeId !== nextProps.treeId.id) { //当选取新节点时
                this.setState({treeId: nextProps.treeId.id, isEdiut: 1});
                this.props.queryDetail({
                    test: 1,
                    id: nextProps.treeId.id,
                    userId: JSON.parse(localStorage.getItem('userDetail')).id
                });
            }
        }
        if (nextProps.organDeleID && this.props.organDeleID) { //当选择删除节点时

            if (this.props.organDeleID.deleRandom !== nextProps.organDeleID.deleRandom) {
                this.setState({isUnPage: true});
            } else {
                this.setState({isUnPage: false});
            }
        }
        if (nextProps.data !== this.props.data) {
            if (nextProps.data.id) {
                this.setState({data: nextProps.data, isUp: nextProps.data.status.toString(), status: nextProps.data.status.toString()});
            }
        }

        if (nextProps.match) {
            if (!nextProps.match.params.key) {
                let  data =  {
                        name: '',
                        url: '',
                        eName: '',
                        type: ''
                    }
                this.setState({NoContent: false, isEdiut: 1, isEdiutx: 1, data: data});
            } else {
                this.setState({NoContent: true, isEdiut: 0, isEdiutx: 0});
            }
        }
    }
    handelClck() {
        let self = this;
        if (this.state.isEdiutx === 1) {
            const userData = JSON.parse(localStorage.getItem('userDetail'));
                const data = this.props.data;
                message.destroy();
                if(!this.state.data.name){
                    message.warning("菜单名称不能为空");
                    return false;
                }
                if(!this.state.data.type){
                    message.warning("菜单类型不能为空");
                    return false;
                }
                if(!this.state.data.url){
                    message.warning("url地址不能为空");
                    return false;
                }
                if(!this.state.data.eName){
                    message.warning("参数不能为空");
                    return false;
                }
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {

                        if (this.state.NoContent) {
                            this.props.updatePermis({
                                name: this.state.data.name,
                                url: this.state.data.url,
                                eName: this.state.data.eName,
                                type: this.state.data.type,
                                status: this.state.isUp,
                                composingKey: data.composingKey,
                                parentId: data.parentId || '',
                                userId: userData.id,
                                id: this.state.treeId,
                                seq:'1'
                            });
        
                        } else {
                            this.props.addPermis({
                                name:  this.state.data.name,
                                url: this.state.data.url,
                                eName: this.state.data.eName,
                                type: this.state.data.type,
                                status: this.state.isUp,
                                composingKey: data ? data.composingKey + '-1' : '0',
                                parentId: this.state.treeId || '',
                                userId: userData.id,
                                isAction: data ? data.isAction : '1',
                                seq:'1'
                            })
        
                        }
                    })
                }

            this.setState({isEdiut: 0, isEdiutx: 0});
        } else {
            this.setState({isEdiut: 1, isEdiutx: 1});
        }
    }
    toggle = () => {
        if (this.state.isEdiutx == 1) {
            if (this.state.isUp === '1') {
                this.setState({isUp: '0'});
            } else {
                this.setState({isUp: '1'});
            }
        }

    }
    inputChange (item, ev) {
        let data = this.state.data
        data[item] =  ev.target.value
        this.setState({
            data
        })
    }
    selectChange (item, value) {
        let data = this.state.data
        data[item] =  value
        this.setState({
            data
        })
    }
    render() {
        const data = this.state.data;
        let pageStatus = null;
        if (this.state.status) {
            pageStatus = this.state.status === '0' ? (
                <span>
                    <Switch checked={this.state.isUp == '0' ? true: false} onChange={this.toggle} disabled={this.state.isEdiutx === 0 ? true : false} />
                    <span style={{marginLeft: 10}}>{this.state.isUp === '0' ? '启用' : '禁用'}</span>
                </span>
            ) : (
                <span>
                    <Switch  checked={this.state.isUp == '0' ? true: false} onChange={this.toggle} disabled={this.state.isEdiutx === 0 ? true : false} />
                    <span style={{marginLeft: 10}}>{this.state.isUp === '0' ? '启用' : '禁用'}</span>
                </span>
            );
        }

        return this.state.isUnPage ? (<div></div>) : (
            <div className={styles.commonBox}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <h3 style={{fontWeight: 600}}>菜单信息</h3>
                    <table cellSpacing="0" className={styles.mytable}>
                        <tbody>
                            <tr>
                                <td><span className={styles.red}>*</span>菜单名称</td>
                                <td>
                                    <span>
                                        <Input 
                                            disabled={this.state.isEdiutx === 0 ? true : false} 
                                            value={this.state.data.name} 
                                            maxLength={30}
                                            onChange = {this.inputChange.bind(this, 'name')}/></span>
                                </td>
                                <td><span className={styles.red}>*</span>菜单类型</td>
                                <td>
                                    <span>
                                        <Select style={{width: '100%'}}
                                            disabled={this.state.isEdiutx === 0 ? true : false}
                                            value={this.state.data.type}
                                            onChange = {this.selectChange.bind(this, 'type')}
                                        >
                                            <Option value="0">菜单</Option>
                                            <Option value="1">页面</Option>
                                            <Option value="2">动作</Option>
                                        </Select>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>菜单编号</td>
                                <td style={{paddingLeft:15}}>{this.state.NoContent ? data.id : null}</td>

                                <td><span className={styles.red}>*</span>是否启用</td>
                                <td style={{paddingLeft:15}}>
                                    {pageStatus}
                                </td>
                            </tr>
                            <tr>
                                <td><span className={styles.red}>*</span>url地址</td>
                                <td colSpan={3}>
                                    <span><Input disabled={this.state.isEdiutx === 0 ? true : false}  value={this.state.data.url} onChange = {this.inputChange.bind(this, 'url')}/></span>
                                </td>
                            </tr>
                            <tr>
                                <td><span className={styles.red}>*</span>参数</td>
                                <td colSpan={3}>
                                    <span><Input disabled={this.state.isEdiutx === 0 ? true : false} value={this.state.data.eName} onChange = {this.inputChange.bind(this, 'eName')}/></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p style={{ textAlign: 'center'}}>
                        <Button type="primary"  onClick={this.handelClck.bind(this)}>{this.state.isEdiutx === 1 ? '确定保存' : '编辑'}</Button>
                    </p>
                </Form>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        treeId: state.resourceManagement.organDetailID, 
        data: state.resourceManagement.organDetail, 
        organDeleID: state.resourceManagement.organDeleID, 
        isAddPermis: state.resourceManagement.isAddPermis
    }
}
function dispatchToProps(dispatch) {
    return {
        queryDetail(payload, params) {
            dispatch({type: 'resourceManagement/queryDetail', payload})
        },
        updatePermis(payload, params) {
            dispatch({type: 'resourceManagement/updatePermis', payload})
        },
        addPermis(payload, params) {
            dispatch({type: 'resourceManagement/addPermis', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
