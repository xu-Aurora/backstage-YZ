import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs} from 'antd';
import {connect} from 'dva'
import styles from './index.less';

const TabPane = Tabs.TabPane;

import Already from './already.jsx'
import Await from './await.jsx'

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
                status: ['2','3'].join(),
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
                        <TabPane tab={`待审核列表`} key="1">
                            <Await match={this.props.match.params.id} />
                        </TabPane>
                        <TabPane tab={`已审核列表`} key="2">
                            <Already match={this.props.match.params.id} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
    return {
    }
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'proprietorManage/serch', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);
