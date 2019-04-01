import React, { Component} from 'react';
import Md5 from 'js-md5';
import {
    message,
    Tabs
} from 'antd';
import {connect} from 'dva'
import styles from './index.less';

const TabPane = Tabs.TabPane;

import Already from './already'
import Await from './await'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1'
        }
    }
    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id,
            page: 1,
            status: '1',
            size: 10,
            instCode: userData.instCode
        });
    }
    onTabClick (item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            this.props.queryList({
                userId: userData.id,
                page: 1,
                status: '1',
                size: 10,
                instCode: userData.instCode
            });
        } else if(item == '2') {
            this.props.queryList({
                userId: userData.id,
                page: 1,
                status: '2',
                size: 10,
                instCode: userData.instCode
            });
        }
        this.setState({
            activeKey: item
        })
    }

    render() {
        return (
            <div className={styles.commonBox}>
                <div className={styles.title}>
                    <Tabs activeKey={this.state.activeKey} onTabClick={this.onTabClick.bind(this)}  tabBarStyle={{paddingLeft: 24, color: '#999999'}}>
                        <TabPane tab={`待处理列表`} key="1">
                            <Await/>
                        </TabPane>
                        <TabPane tab={`已处理列表`} key="2">
                            <Already/>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
    }
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'adviceManage/serch', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);
