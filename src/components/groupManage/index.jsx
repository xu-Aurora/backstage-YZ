import React, {Component} from 'react';
import {Tabs} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import GoodsGroup from './goodsGroup/index.jsx';
import ServeGroup from './serveGroup/index.jsx';
import HealthGroup from './healthGroup/index.jsx';

const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: '1',
            groupList1:[],
            groupList2:[],
            groupList3:[],
        };
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            params:{
                userId: userData.id,
                businessType: '1',
                instCode: userData.instCode
            },
            func: () => {
                this.setState({
                    groupList1: this.props.groupList
                })
            }
        });
    }
    onTabClick (item) {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(item == '1') {
            this.props.queryList({
                params:{
                    userId: userData.id,
                    businessType: '1',
                    instCode: userData.instCode
                },
                func: function() {
                    self.setState({
                        groupList1: self.props.groupList
                    })
                }
            });
        } else if(item == '2') {
            this.props.queryList({
                params:{
                    userId: userData.id,
                    businessType: '2',
                    instCode: userData.instCode
                },
                func: function() {
                    self.setState({
                        groupList2: self.props.groupList
                    })
                }
            });
        }else if(item == '3') {
            this.props.queryList({
                params:{
                    userId: userData.id,
                    businessType: '3',
                    instCode: userData.instCode
                },
                func: function() {
                    self.setState({
                        groupList3: self.props.groupList
                    })
                }
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
                        <TabPane tab={'商品分组'} key="1">
                            <GoodsGroup groupList = { this.state.groupList1 } />
                        </TabPane>
                        <TabPane tab={'服务分组'} key="2">
                            <ServeGroup groupList = { this.state.groupList2 } />
                        </TabPane>
                        <TabPane tab={'健康分组'} key="3">
                            <HealthGroup groupList = { this.state.groupList3 } />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        groupList: state.groupManage.groupList,
    }
}
function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'groupManage/getList', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);