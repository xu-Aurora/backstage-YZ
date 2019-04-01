import React from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
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
            status: ['1','3'].join(','),
            size: 10,
            instCode: userData.instCode
        });
    }
    onTabClick (item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            if (userData.companyId) {
                this.props.queryList({
                    userId: userData.id, 
                    page: 1,
                    status: ['1','3'].join(','),
                    size: 10,
                    instCode: userData.instCode
                })
            }
        } else if(item == '2') {
		    this.props.queryList({
                userId: userData.id, 
                page: 1,
                status: ['2','4'].join(','),
                size: 10,
                instCode: userData.instCode
            })
        }
        this.setState({
            activeKey: item
        })
    }
    loop (data, id) {
	   const userData = JSON.parse(localStorage.getItem('userDetail'));
       let elements;
       if(userData.companyId) {
            if (this.props.isShow) {
                elements = <Deposit data={data} paramsId={id}/>
            } else {
                elements = <Manual data={data} paramsId={id}/>
            }
       } else {
            elements = <Admin data={data} paramsId={id}/>
       }

       return elements
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
            dispatch({type: 'affairManage/serch', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);
