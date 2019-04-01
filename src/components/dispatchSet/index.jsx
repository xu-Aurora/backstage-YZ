import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';

import ExpressSet from './expressSet/index.jsx';
import DispatchSet from './dispatchSet/index.jsx';
import SelfFetchSet from './selfFetchSet/index.jsx';

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
        this.props.queryDispatchSet({
            userId: userData.id,
            page: 1,
            setType: '1',
            size: 10,
            instCode: userData.instCode
        });
    }
    onTabClick (item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            this.props.queryDispatchSet({
                userId: userData.id,
                page: 1,
                setType: '1',
                size: 10,
                instCode: userData.instCode
            });
        } else if(item == '2') {
            this.props.queryDispatchSet({
                userId: userData.id,
                page: 1,
                setType: '2',
                size: 10,
                instCode: userData.instCode
            });
        } else if(item == '3') {
            this.props.querySelfFetch({
                userId: userData.id,
                page: 1,
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
                <div style={{background:'#fff'}}>
                    <Tabs activeKey={this.state.activeKey} onTabClick={this.onTabClick.bind(this)}  tabBarStyle={{paddingLeft: 24, color: '#999999'}}>
                        <TabPane tab={`配送设置`} key="1">
                          <DispatchSet />
                        </TabPane>
                        <TabPane tab={`快递设置`} key="2">
                          <ExpressSet />
                        </TabPane>
                        <TabPane tab={`自提设置`} key="3">
                          <SelfFetchSet />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
    }
}
function dispatchToProps(dispatch) {
    return {
        querySelfFetch(payload, params) {//自提设置
            dispatch({type: 'selfFetchSet/serch', payload})
        },
        queryDispatchSet(payload, params) {//配送设置和快递设置
            dispatch({type: 'dispatchSet/serch', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);