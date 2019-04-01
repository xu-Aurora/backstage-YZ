import React from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import ApiManage from './apiManage/index.jsx';
import FieldsManage from './fieldsManage/index.jsx';
import ErrorCode from './errorCode/index.jsx';

const TabPane = Tabs.TabPane;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 10
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.p_list({
            page: 1,
            size: 10,
            userId: this.props.linkID || userData.id
        })
        this.props.h_list({
            page: 1,
            size: 10,
            userId: this.props.linkID || userData.id
        })
        this.props.t_list({
            page: 1,
            size: 10,
            userId: this.props.linkID || userData.id
        })
    }

    render() {
        return (
            <div className={styles.commonBox}>
            <div className={styles.title}>
                <Tabs defaultActiveKey="1" tabBarStyle={{paddingLeft: 24, color: '#999999',marginTop:8}}>
                        <TabPane tab={`接口管理`} key="1">
                            <ApiManage data={this.props.pendingData} paramsId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab={`接口字段管理`} key="2">
                            <FieldsManage data={this.props.throughData} paramsId={this.props.match.params.id}/>
                        </TabPane>
                        <TabPane tab={`接口错误码管理`} key="3">
                            <ErrorCode data={this.props.rejectData} paramsId={this.props.match.params.id}/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state, ownProps) {
    return {
        pendingData: state.apiManagement.pendingData, 
        rejectData: state.apiManagement.rejectData, 
        throughData: state.apiManagement.throughData, 
        linkID: state.login.userMsg.id,
        key1: state.apiManagement.key
    }
}
function dispatchToProps(dispatch) {
    return {
        p_list(payload, params) {
            dispatch({type: 'apiManagement/p_list', payload})
        },
        h_list(payload, params) {
            dispatch({type: 'apiManagement/h_list', payload})
        },
        t_list(payload, params) {
            dispatch({type: 'apiManagement/t_list', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);