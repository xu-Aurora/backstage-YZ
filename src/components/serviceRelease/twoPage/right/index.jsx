import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Radio,Col,Icon,Table,Select,Upload,Modal,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import qs from 'qs';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        //单位
        this.props.getUnit({
            params:{
                userId: userData.id,
                instCode: userData.instCode,
                code: 'service_common_unit'
            },
            func: () => {
                console.log(this.props.unitList)
            }
        })
    }
    //单条
    tableApply() {
        let children = []
        this.props.data.forEach((item, index)=>{
            children.push(
                <div className={styles.table_list} key={index}>
                    <div>{index + 1}</div>
                    <div><Input type="text"  value={item.name} onChange={this.props.valChange.bind(this, 'name', index, 'tableList', 'exist')}/></div>
                    <div><Input type="text"  value={item.price} onChange={this.props.valChange.bind(this, 'price', index, 'tableList', 'exist')}/></div>
                    <div>  
                        <Select
                            labelInValue 
                            style={{width: '90%'}} value={{key:`${item.unit}`, label: `${item.unitName}`}} onChange={this.props.valChange.bind(this, 'unit', index, 'tableList', 'exist')}>
                           {this.unitApply()}
                        </Select>
                    </div>
                    <div>
                        <span>移动</span>
                        <span onClick={this.props.delData.bind(this, index, 'tableList', 'exist')}>删除</span>
                    </div>
                </div>
            )
        })
        return children
    }
    //组合
    tableApply1() {
        let children = []
        this.props.data1.forEach((item, index)=>{
            children.push(
                <div className={styles.list} key={index}>
                    <div>{index + 1}</div>
                    <div>
                        <div className={styles.list_header}>
                            <Input className={styles.list_input} type="text" prefix={<div className={styles.lable_icon}></div>}  value={item.name} onChange={this.props.valChange.bind(this, 'name', index, 'tableList1', 'exist')}/>
                           {
                               index ? (
                                <div>
                                    <span>移动</span>
                                    <span onClick={this.props.delData.bind(this, index, 'tableList1', 'exist')}>删除</span>
                                </div>
                               ) : ''
                           }
                          
                        </div>

                        {
                            item.children ? (
                                <div>
                                {this.childrenApply(item.children, index)}

                                <p style={{color: '#377FC2', marginLeft: '15px'}} onClick={this.props.addData1.bind(this, 'tableList1', index)}>+ 新增子项目</p>

                                </div>
                                
                            ) : ''
                        }
                    </div>
                </div>
            )
        })
        return children
    }
    childrenApply(data, i) {
        let children = []
        data.forEach((item, index)=>{
            children.push(
                <div className={styles.model} key={index}>
                    <div>
                        <Input type="text"  value={item.name} onChange={this.props.valChange.bind(this, 'name', index, 'tableList1', i)}/>
                    </div>
                   
                    <div><Input type="text"  value={item.price} onChange={this.props.valChange.bind(this, 'price', index, 'tableList1', i)}/></div>
                    <div>  
                        <Select
                            labelInValue 
                            style={{width: '90%'}} value={{key:`${item.unit}`, label: `${item.unitName}`}} onChange={this.props.valChange.bind(this, 'unit', index, 'tableList1', i)}>
                            {this.unitApply()}
                        </Select>
                    </div>
                    <div>
                        {
                            index ? (
                                <span>移动</span>
                            ) : ''
                        }
                        {
                            index ? (
                                 <span onClick={this.props.delData.bind(this, index, 'tableList1', i)}>删除</span>
                            ) : ''
                        }
                    </div>
                </div>
            )
        })
        return children
    }
    //下载模板
    download() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let url = `/backstage/service/exportService?`
        let serviceChargeStandardTypeEnum
        if(this.props.type == '1') {
            serviceChargeStandardTypeEnum = 'SINGLE'

        } else {
            serviceChargeStandardTypeEnum = 'COMBINATION'
        }
        let params = {
            userId: userData.id,
            serviceChargeStandardTypeEnum: serviceChargeStandardTypeEnum
        }
        window.location.href = `${url}${qs.stringify(params)}`
    }
  
     // 单位
    unitApply() {
        let children = []
        this.props.unitList.forEach((data, index)=>{
            children.push(<Option key={index} value={data.codeValue}>{data.name}</Option>)                         
        })
        return children
    }
    render() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let serviceChargeStandardTypeEnum
        if(this.props.type == '1') {
            serviceChargeStandardTypeEnum = 'SINGLE'

        } else {
            serviceChargeStandardTypeEnum = 'COMBINATION'
        }
        const props = {
            name: 'file',
            action: '/backstage/service/importChargeStandardExcel',
            data:{
                userId: userData.id,
                serviceChargeStandardTypeEnum: serviceChargeStandardTypeEnum
            },
            onChange: this.props.uploading.bind(this)
          };
        return (
            <div className={styles.box}>
                <div className={styles.header}>
                    编辑收费标准
                </div>
                <div className={styles.aside}>
                    <div className={styles.aside_left}>
                        <div>编辑类型：</div>
                        <div>
                            <RadioGroup value={this.props.type} onChange={this.props.typeChage.bind(this)}>
                                <Radio value="1">单条编辑</Radio>
                                <Radio value="2">组合编辑</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className={styles.aside_right}>
                    <Upload className={styles.aside_btn} {...props}>
                        <Button>
                            批量上传
                        </Button>
                    </Upload>
                        {/* <button className={styles.aside_btn}>批量上传</button> */}
                        <Button  onClick={this.download.bind(this)}>下载模板</Button>
                    </div>
                </div>
                <div className={styles.table}>
                    <div className={styles.table_header}>
                        <div>序号</div>
                        <div>服务</div>
                        <div>价格</div>
                        <div>单位</div>
                        <div>操作</div>
                    </div>
                    {
                    
                        this.props.type == '1' ? this.tableApply() : this.tableApply1()
                    }
                    
                </div>
                {
                    
                    this.props.type == '1' ? (
                        <p style={{color: '#377FC2'}} onClick={this.props.addData.bind(this, 'tableList')}>+ 新增项目</p>
                    ) :  (
                        <p style={{color: '#377FC2'}} onClick={this.props.addData1.bind(this, 'tableList1', 'exist')}>+ 新增主项目</p>
                    ) 
                }
                
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        unitList: state.serviceRelease.unitList //单位
    }
}

function dispatchToProps(dispatch) {
    return {
        getUnit(payload={}) {
            dispatch({type: 'serviceRelease/getUnit',payload})
        } //单位
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
