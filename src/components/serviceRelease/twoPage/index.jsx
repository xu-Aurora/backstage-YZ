import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Select,DatePicker,Modal,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';

import Left from './left'
import Right from './right'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '1',
            tableList:[
                {
                    name:'',
                    price: '',
                    unit: '',
                    unitName: '',
                    type: '1'
                },
                {
                    name:'',
                    price: '',
                    unit: '',
                    unitName: '',
                    type: '1'
                },{
                    name:'',
                    price: '',
                    unit: '',
                    unitName: '',
                    type: '1'
                }
            ], //单条编辑
            tableList1:[
                {
                    name:'',
                    type: '2',
                    children:[
                        {
                            name:'',
                            price: '',
                            unit: '', 
                            unitName: '',
                        },
                        {
                            name:'',
                            price: '',
                            unit: '',
                            unitName: '',
                        }
                    ]
                },
                {
                    name:'',
                    type: '2',
                    children:[
                        {
                            name:'',
                            price: '',
                            unit: '',
                            unitName: '',
                        },
                        {
                            name:'',
                            price: '',
                            unit: '',
                            unitName: '',
                        }
                    ]
                },{
                    name:'',
                    type: '2',
                    children:[
                        {
                            name:'',
                            price: '',
                            unit: '',
                            unitName: '',
                        },
                        {
                            name:'',
                            price: '',
                            unit: '',
                            unitName: '',
                        }
                    ]
                }
            ] //组合编辑
        };
    }
    componentDidMount() {

        let twoData= JSON.parse(localStorage.getItem('twoData'));
        if(twoData) { //缓存
            this.setState({
                type: twoData.type,//编辑类型
                tableList: twoData.tableList,//单条编辑
                tableList1: twoData.tableList1//组合编辑
            })
        }
        //向父组件传this
        this.props.onRef('twoPage', this)
    }
    // valName 改变的值， index 改变的下标， data 数据源, parentIndex 组合编辑子级的父级下表
    valChange(valName, index, data, parentIndex,  ev) {
        let list = []
        this.state[data].forEach(item=>{
            list.push(Object.assign({},item))
        })
        if(parentIndex == 'exist') { //不存在
            if(ev.target) {
                list[index][valName] = ev.target.value// 处理下拉
            } else {
                list[index][valName] = ev.key// 处理下拉
                list[index].unitName = ev.label// 处理下拉
            }
            this.setState({
                [data]: list
            })
        } else {
            if(ev.target) {
                 list[parentIndex].children[index][valName] = ev.target.value// 处理下拉
            } else {
                list[parentIndex].children[index][valName] = ev.key// 处理下拉
                list[parentIndex].children[index].unitName = ev.label// 处理下拉
            }
            this.setState({
                [data]: list
            })
            
        }
       
    }
    //  index 改变的下标， data 数据源, parentIndex 组合编辑子级的父级下表
    delData(index, data, parentIndex) {
        let list = []
        this.state[data].forEach(item=>{
            list.push(Object.assign({},item))
        })
        if(parentIndex == 'exist') { //不存在
            list.splice(index, 1)
            this.setState({
                [data]: list
            })
        } else {
            list[parentIndex].children.splice(index, 1)
            this.setState({
                [data]: list
            })
            
        }
     
    }
    // 单条新增
    addData() {
        let list = []
        this.state.tableList.forEach(item=>{
            list.push(Object.assign({},item))
        })
        list.push({
            name:'',
            price: '',
            unit: '',
            unitName: '',
            type: '1'
        })
        if(list.length > 30) {
            message.error('最多可添加30行')
        } else {
            this.setState({
                tableList: list
            })
        }
       
    }
     // 新增 parentIndex 组合编辑子级的父级下表
    addData1(data, parentIndex) {
        let list = []
        this.state[data].forEach(item=>{
            list.push(Object.assign({},item))
        })
        if(parentIndex == 'exist') { //不存在
            list.push({
                name:'',
                type: '2',
                children:[
                    {
                        name:'',
                        price: '',
                        unit: '',
                        unitName: '',
                    },
                    {
                        name:'',
                        price: '',
                        unit: '',
                        unitName: '',
                    }
                ]
            })
            if(list.length > 10) {
                message.error('最多可添加10个主项目')
            } else {
                this.setState({
                    [data]: list
                })
            }
        } else {
            list[parentIndex].children.push({
                name:'',
                price: '',
                unit: '', 
                unitName: '',
            })
            if(list[parentIndex].children.length > 10) {
                message.error('最多可添加10个子项目')
            } else {
                this.setState({
                    [data]: list
                })
            }
        }
    }
    //单条组合切换
    typeChage(ev) {
        this.setState({
            type: ev.target.value
        })
    }
    uploading(info) { 
        let rex = this.checkImg(info.file)
        if(rex) {
            if (info.file.status === 'done') {
                if(info.file.response.code != 200){
                    message.error(info.file.response.message);
                }else{
                    let {type} = this.state
                    if (type == 1) {
                        let list = []
                        this.state.tableList.forEach(item=>{
                            list.push(Object.assign({},item))
                        })
                        info.file.response.data.forEach(item=>{
                            list.push(Object.assign(item, {type: '1'}))
                        })
                        this.setState({
                            tableList: list
                        })
                    } else if(type ==2) {
                        let list = []
                        this.state.tableList1.forEach(item=>{
                            list.push(Object.assign({},item))
                        })
                        info.file.response.data.forEach(item=>{
                            list.push(Object.assign(item, {type: '2'}))
                        })
                        this.setState({
                            tableList1: list
                        })
                    }
                }
            } else if (info.file.status === 'error') {
                message.error(`文件上传失败`);
            }
        } 
    }
    //校验上传图片
    checkImg(info) {
        return true
    } 
    render() {
        return (
            <div className={styles.box}>
                <div className={styles.header}>
                    收费标准
                </div>
                <div className={styles.content}>
                    <div className={styles.content_left}>
                        <Left data={this.state.tableList} type={this.state.type} data1={this.state.tableList1}/>
                    </div>
                    <div className={styles.content_right}>
                        <Right 
                            data={this.state.tableList} 
                            data1= {this.state.tableList1}
                            valChange={this.valChange.bind(this)} 
                            delData={this.delData.bind(this)} 
                            addData={this.addData.bind(this)}
                            addData1={this.addData1.bind(this)}
                            typeChage={this.typeChage.bind(this)}
                            type={this.state.type}
                            uploading={this.uploading.bind(this)}
                        />
                    </div>
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
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
