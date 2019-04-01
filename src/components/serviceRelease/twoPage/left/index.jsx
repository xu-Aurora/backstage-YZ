import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Select,DatePicker,Modal,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
const TabPane = Tabs.TabPane;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    tableApply() {
        console.log(this.props.data)
        let children = []
        this.props.data.forEach((item, index)=>{
            children.push(
                <tr key={index}>
                    <td>{item.name}</td>
                    <td>{`${item.price}/${item.unitName}`}</td>
                </tr>
            )
        })
        return children
    }
    tableApply1() {
        let children = []
        this.props.data1.forEach((item, index)=>{
            children.push(
                <div className={styles.list} key={index}>
                    <div className={styles.title}>
                        <div className={styles.title_icon}></div>
                        <div className={styles.title_text}>{item.name}</div>
                    </div>
                    {
                        item.children ? this.childrenApply(item.children) : ''
                    }
                   
                </div>
            )
        })
        return children
    }
    childrenApply(data) {
        let children = []
        data.forEach((item, index)=>{
            children.push(
                <div className={styles.lable} key={index}>
                    <div className={styles.lable_name}>{item.name}</div>
                    <div className={styles.lable_text}>{`${item.price}/${item.unitName}`}</div>
                </div>
            )
        })
        return children
      
    }
    render() {
        return (
            <div className={styles.box}>
                <Tabs defaultActiveKey="1" size="default" tabBarStyle={{textAlign: 'center'}}>
                    <TabPane tab="收费标准" key="1">
                        <div  className={styles.content}>
                            <div className={styles.header}>
                                <div className={styles.header_icon}></div>
                                <div className={styles.header_text}>收费标准</div>
                            </div>
                            {
                                this.props.type == '1' ? (
                                    <table cellSpacing="0" className={styles.mytable}>
                                        <tbody>
                                            <tr className={styles.mytable_header}>
                                                <th>服务</th>
                                                <th>价格</th>
                                            </tr>
                                            {this.tableApply()}
        
                                        </tbody>
                                    </table>
                                ) : ''
                            }
                            { 
                                this.props.type == '2' ? (
                                    <div>
                                        {this.tableApply1()}
                                        
                                    </div>
                                ):""
                            }
                        </div>
                        
                    
                    
                    </TabPane>
                    <TabPane tab="服务详情" disabled key="2"></TabPane>
                    <TabPane tab="常见问题" disabled key="3"></TabPane>
                </Tabs>
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
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
