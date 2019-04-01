import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
import styles from '../common.less';

import InformMessage from './informMessage.jsx';
import MessageList from './messageList.jsx';

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
        this.props.serchMsg({
            page: 1,
            size: 10,
            userId: userData.id,
            serviceType: '2',
            instCode: userData.instCode
        });
    }

    onTabClick (item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            this.props.serchMsg({
                userId: userData.id,
                page: 1,
                size: 10,
                serviceType: '2',
                instCode: userData.instCode
            });
        } else if(item == '2') {
            this.props.serchSms({
                userId: userData.id,
                page: 1,
                size: 10,
                serviceType: '2',
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
                        <TabPane tab={`消息列表`} key="1">
                          <MessageList />
                        </TabPane>
                        <TabPane tab={`短信列表`} key="2">
                          <InformMessage />
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
        serchMsg(payload, params) { //消息
            dispatch({type: 'messageManage/serchMsg', payload})
        },
        serchSms(payload, params) { //短信
            dispatch({type: 'messageManage/serchSms', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);