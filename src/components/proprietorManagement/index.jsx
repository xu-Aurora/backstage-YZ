import React, {Component} from 'react';
import { Button, Form, Row, Col, Icon, Tree, Drawer, message,Menu} from 'antd';
import {connect} from 'dva'
import styles from './style.less';

import Touseholder from './householder/list';
import Tenant from './tenant/list';
import TreeList from './tree.jsx';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            pageSize: 10,
            keys: "1",
            status: true,
            rightType: '1'
        };
    }
    componentDidMount() {
    }

    //Tabs注册点击事件
    tabs(item){
        if(item) {
            this.setState({
                status: true,
                rightType: '1'
           })
           this.props.setRoleType('户主')
        } else{
            this.setState({
                status: false,
                rightType: '2'
           })
           this.props.setRoleType('租户')
        }
    }
    tabStatus() {
        let type = this.state.rightType
        this.setState({
            rightType: '3'
        }, () =>{
           this.setState({
                rightType: type
           })
        })
    }
    loop(self, item) {
        if(item == 1) {
            return <Touseholder skip = {this.props.location.search}/>
        } else if(item == 2){
            return <Tenant />
        } else {
            return <div></div>
        }
    }
    render() {
        // const pageID = this.props.match.params.id;
        return (
           
            <div className={styles.organxBox}>
                <Col className={styles.header}>
                    <div className={this.state.status ? `${styles.title} ${styles.title_in}`: `${styles.title}`} onClick={this.tabs.bind(this, 1)}>户主列表</div>
                    <div className={this.state.status ? `${styles.title}`: `${styles.title}  ${styles.title_in}`} style={{marginLeft:20}} onClick={this.tabs.bind(this, 0)}>租户列表</div>
                </Col>
                <div  style={{backgroundColor: 'rgb(255, 255, 255)', overflow: 'hidden',height:"81vh"}}>
                    <Col span={5} className={styles.menubox}>
                    {/* <div onClick={this.setStatus.bind(this)}>123</div> */}
                      <TreeList tabStatus = {this.tabStatus.bind(this)}/>
                    </Col>
                    <Col span={19} className={styles.contentbox}>
                        {this.loop(this, this.state.rightType)}                        
                    </Col>
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
        setRoleType(payload, params) {
            dispatch({type: 'proprietorManagement/setRoleType', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);