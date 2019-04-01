import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva'
import styles from './index.less';

import RuleManage from './ruleManage/index.jsx';
import RuleModule from './ruleModule/index.jsx';

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
                        <TabPane tab={`计算规则管理`} key="1">
                            <RuleManage data={this.props.pendingData} pageID={pageID} />
                        </TabPane>
                        <TabPane tab={`计算规则模板管理`} key="2">
                            <RuleModule data={this.props.throughData} pageID={pageID} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state, ownProps) {
    return {
        pendingData: state.computationManagement.pendingData, 
        throughData: state.computationManagement.throughData, 
        linkID: state.login.userMsg.id,
        // data: state.productManagement.data,
        loading: !!state.loading.models.thresholdManagement,
        // key1: state.paymentManage.key
    }
}
function dispatchToProps(dispatch) {
    return {
        p_list(payload, params) {
            dispatch({type: 'computationManagement/p_list', payload})
        },
        h_list(payload, params) {
            dispatch({type: 'computationManagement/h_list', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);