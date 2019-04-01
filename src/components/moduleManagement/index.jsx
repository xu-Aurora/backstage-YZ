import React, {Component} from 'react';
import {Form,Tabs} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import ModuleManage from './moduleManage/index.jsx';
import GroupManage from './groupManage/index.jsx';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            pageSize: 10,
            keys: this.props.key1
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.p_list({
            page: 1,
            size: 10,
            userId: this.props.linkID || userData.id
        });
        this.props.h_list({
            page: 1,
            size: 10,
            userId: this.props.linkID || userData.id
        })
    }
    //Tabs注册点击事件
    tabs(e){ 
        this.setState({
            keys:e
        })
    }
    render() {
        const pageID = this.props.match.params.id;
        return (
            <div className={styles.commonBox}>
            <div className={styles.title}>
                <Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: 24, color: '#999999',marginTop:8}}>
                        <TabPane tab={`模块管理`} key="1">
                            <ModuleManage data={this.props.pendingData} pageID={pageID} />
                        </TabPane>
                        <TabPane tab={`模块分组管理`} key="2">
                            <GroupManage data={this.props.throughData} pageID={pageID} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        pendingData: state.moduleManagement.pendingData, 
        throughData: state.moduleManagement.throughData, 
        linkID: state.login.userMsg.id,
        // key1: state.paymentManage.key
    }
}
function dispatchToProps(dispatch) {
    return {
        p_list(payload, params) {
            dispatch({type: 'moduleManagement/p_list', payload})
        },
        h_list(payload, params) {
            dispatch({type: 'moduleManagement/h_list', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));