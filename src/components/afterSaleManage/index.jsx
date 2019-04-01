import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import Already from './already/index.jsx';
import Await from './await/index.jsx';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1'
        };
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id,
            page: 1,
            type: '2',
            size: 10,
            refundStateSelect: '2',
            instCode: userData.instCode,
            wayType: '1'
        });
    }
    onTabClick (item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            this.props.queryList({
                userId: userData.id,
                page: 1,
                type: '2',//售后管理
                refundStateSelect: '2',//售后管理(待处理)
                size: 10,
                instCode: userData.instCode,
                wayType: '1'
            });
        } else if(item == '2') {
            this.props.queryList({
                userId: userData.id,
                page: 1,
                type: '2',//售后管理
                refundStateSelect: '1',//售后管理(已处理)
                size: 10,
                instCode: userData.instCode,
                wayType: '1'
            });
        }
        this.setState({
            activeKey: item
        })
    }

    render() {
        return (
            <div className={styles.commonBox}>
                <div className={styles.title} >
                    <Tabs activeKey={this.state.activeKey} onTabClick={this.onTabClick.bind(this)}  tabBarStyle={{paddingLeft: 24, color: '#999999'}}>
                        <TabPane tab={'待处理订单'} key="1">
                            <Await />
                        </TabPane>
                        <TabPane tab={'已处理订单'} key="2">
                            <Already />
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
        queryList(payload = {}) {
            dispatch({type: 'orderList/serch', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);