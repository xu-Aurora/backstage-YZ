import React, {Component} from 'react';
import {Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Card, Avatar,DatePicker,message} from 'antd';
import {connect} from 'dva';
import styles from '../style.less';
import Moment from 'moment';
import $ from 'jquery';

import Detail from './detail.jsx';
import RefundCheck from './refundCheck.jsx';    //退款审核
import RefundAffirm from './refundAffirm.jsx';        //退款确认

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { Meta } = Card;

let pageSize1 = 10;
let userData;

function siblingElems(elem) {
    elem.siblings().css("background-color",'#fff')
};


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            detailVisible: false,
            refundVisible: false,
            refundAffirm: false,
            visibleShow1: false,
            visibleShow2: false,
            optionVal:'orderNo',
            inputVal: '',
            orderNos: []
        };
    }

    componentWillMount() {
        userData = JSON.parse(localStorage.getItem('userDetail'));
    }

    regx(){
        message.destroy();
        //正则匹配只能输入数字
        let regNum = /^[0-9]*$/;
        //手机号码正则
        let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
        if(this.state.optionVal == 'receiptPhone') {
            if(this.state.inputVal){
                if(!regPhone.test(this.state.inputVal)){
                    message.warning('客户电话格式不正确');
                    return;
                }
            }

        }
        if(this.state.optionVal == 'origOrderNo') {
            if(!regNum.test(this.state.inputVal)){
                message.warning('退款单号只能输入数字');
                return;
            }
        }
        if(this.state.optionVal == 'orderNo') {
            if(!regNum.test(this.state.inputVal)){
                message.warning('业务单号只能输入数字');
                return;
            }
        }

        return true;
    }

    handleSearch = () => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this;
        this.props.form.validateFields((err, values) => {
            let reg = this.regx(values)
            if(reg) {
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    type: '2',//售后管理
                    refundStateSelect: '2',//售后管理(待处理)
                    [`${self.state.optionVal}`]: self.state.inputVal,
                    createTimeStart: self.state.createTimeStart ? Moment(self.state.createTimeStart).format('YYYY-MM-DD') : '',
                    createTimeEnd: self.state.createTimeEnd ? Moment(self.state.createTimeEnd).format('YYYY-MM-DD') : '',
                    status: self.state.status,
                    refundState: self.state.refundState,
                    instCode: userData.instCode,
                    wayType: this.state.wayType
                });
            }

        })

    }
    onSelect = (record, e) => {
        $(e.target).parents('tr').css("background-color",'#e6fcff')
        siblingElems($(e.target).parents('tr'));
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        });
    }

    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this;
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys,
                    alldata: item
                })
            });
        }
        const totals = content.total;
        return {
            data,
            pagination: {
                total: content.total,
                showTotal: totals => `总共 ${totals} 个项目`,
                current: content.pageNum,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                    pageSize1 = pageSize;
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        type: '2',//售后管理
                        refundStateSelect: '2',//售后管理(待处理)
                        createTimeStart: self.state.createTimeStart ? Moment(self.state.createTimeStart).format('YYYY-MM-DD') : '',
                        createTimeEnd: self.state.createTimeEnd ? Moment(self.state.createTimeEnd).format('YYYY-MM-DD') : '',
                        status: self.state.status,
                        refundState: self.state.refundState,
                        phoneNo: this.state.inputVal,
                        wayType: this.state.wayType,
                        instCode: userData.instCode,
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        type: '2',//售后管理
                        refundStateSelect: '2',//售后管理(待处理)
                        createTimeStart: self.state.createTimeStart ? Moment(self.state.createTimeStart).format('YYYY-MM-DD') : '',
                        createTimeEnd: self.state.createTimeEnd ? Moment(self.state.createTimeEnd).format('YYYY-MM-DD') : '',
                        status: self.state.status,
                        refundState: self.state.refundState,
                        phoneNo: this.state.inputVal,
                        wayType: this.state.wayType,
                        instCode: userData.instCode
                    });
                }
            }
        };
    }
    setSelectVal = (val) => {
        this.setState({optionVal: val});
    }
    //申请时间
    timeRange (type, date) {
        let time;
        if(date){
            time = date._d.getTime();
        }
        if (type === 'x1') {
            this.setState({createTimeStart: time})
        }
        if (type === 'x2') {
            this.setState({createTimeEnd: time})
        }
    }
    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }

    onSelectChange =  (selectedRowKeys, selectedRows) => {
        let orderNos = selectedRows.map((item) => {
            return item.alldata.orderNo
        })

        this.props.saveSelect({
            orderNo: orderNos, 
        })

        this.setState({
            orderNos,
            selectedRowKeys
        });
    }

    //展开与收起
    toggleForm = () => {
        this.setState({
            showScreen: !this.state.showScreen,
            type: '',
            createTimeStart: '',
            createTimeEnd: '',
            status: '',
            refundState: ''
        });
    };
    //点击关闭页面
    handleCancel(e)  {
        this.setState({
            [e]: false
        })
    }
    search(item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({
            [item]: false,
            orderNos: [],
            selectedRowKeys: []
        })
        this.props.queryList({
            userId: userData.id, 
            page: 1, 
            size: 10,
            type: '2',//售后管理
            refundStateSelect: '2',//售后管理(待处理)
            phoneNo: this.state.inputVal,
            wayType: '1',
            instCode: userData.instCode,
        })
    }

    //选择小区
    handleSelect(val){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({wayType: val})
        this.props.queryList({
            userId: userData.id,
            instCode: userData.instCode,
            page: 1, 
            size: 10, 
            type: '2',
            refundStateSelect: '2',
            wayType: val
        });
    }

    //index组件与Detail组件传值
    closeDetail(data){
        let self = this;
        self.setState({detailVisible: false},function(){
            setTimeout(() => {
                self.setState({[data]: true})
            }, 500);
        })
    }

    refundAudit(){
        if(this.state.orderNos.length == 0){
            message.warning('请批量选择列表数据');
            return false;
        }else{
            this.setState({refundVisible: true})
        }
    }
    refundConfirm(){
        if(this.state.orderNos.length == 0){
            message.warning('请批量选择列表数据');
            return false;
        }else{
            this.setState({refundAffirm: true})
        }
    }

    community() {
        if(userData.institutionalTop) {
            return (
                <Select 
                    defaultValue={'1'}
                    onChange={this.handleSelect.bind(this)}>
                    <Option value="1">佳源小区</Option>
                    <Option value="2">其他小区</Option>
                </Select>
            )
        }else{
            return (
                <Select 
                    defaultValue={'1'}
                    onChange={this.handleSelect.bind(this)}>
                    <Option value="1">佳源小区</Option>
                </Select>
            )
        }
    }

    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xl: { span: 4 },xxl: { span: 2 }},
            wrapperCol: {xl: { span: 20 },xxl: { span: 22 }}
          };
        const formItemLayout1 = {
            labelCol: {xl: { span: 7 },xxl: { span: 7 }},
            wrapperCol: {xl: { span: 14 },xxl: { span: 13 }}
          };
        const content = data ? this.formart(data) : [];
        const rowSelection = {
            onChange: this.onSelectChange,
            selectedRowKeys: this.state.selectedRowKeys
        }
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col xl={5} xxl={4}>
                        <FormItem label="订单状态" {...formItemLayout1}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="2">待配送</Option>
                                <Option value="3">配送中</Option>
                            </Select>
                        </FormItem>

                    </Col>
                    <Col xl={5} xxl={4}>
                        <FormItem label="退款状态" {...formItemLayout1}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'refundState')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="2">待审核</Option>
                                <Option value="3">已同意</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xl={9} xxl={13}>
                        <FormItem label="申请时间" {...formItemLayout}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x1')}
                                style={{width: '40%'}}/>
                            <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x2')}
                                style={{width: '40%'}}/>
                        </FormItem>
                    </Col>
                    <Col xl={5} xxl={3}>
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          收起 <Icon type="up" />
                        </a>
                    </Col>
                </Row>
            )
        }

        const columns = [
            {
                title: '商品信息',
                dataIndex: 'content',
                key: 'content',
                width: 450,
                render: (value, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{marginRight:12}}>退款单号 : {record.alldata.orderNo}</span>
                                <span>申请时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                            <div style={{minHeight: 80}}>
                                {
                                    record.alldata.orderSkus.map((item,index) => {
                                        return (
                                            <Card bordered={false} key={item.id}>
                                                <Meta
                                                    avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
                                                    title={item.goodName}
                                                    description={
                                                        <Col>
                                                            <Col span={16}><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
                                                        </Col>
                                                    }
                                                />
                                            </Card>
                                        )
                                    })
                                }
        
                            </div>
                        </div>
                    )
                }
            },
            {
                title: '实付款',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 200,
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span>业务单号 : { record.alldata.origOrderNo }</span>
                            </div>
                            <div>
                                <div style={{marginBottom:10}}>&yen; {record.alldata.amount}</div>
                                <div>粮票 : {record.alldata.ticket}元</div>
                            </div>
                        </div>
                    )
                }
            }, 
            {
                title: '售后类型',
                dataIndex: 'userNameaaa',
                key: 'userNameaaa',
                width: 200,
                render: (text, record) => {
                    let refundType = record.alldata.refundType;
                    let refundReason = record.alldata.refundType;
                    switch (refundType) {
                        case '1':
                            refundType = '仅退款'
                            break;
                        case '2':
                            refundType = '退货退款'
                            break;
                        default:
                            break;
                    }
                    switch (refundReason) {
                        case '1':
                            refundReason = '退运费'
                            break;
                        case '2':
                            refundReason = '收到商品破损'
                            break;
                        case '3':
                            refundReason = '商品发错、漏发'
                            break;
                        case '4':
                            refundReason = '商品需要维修'
                            break;
                        case '5':
                            refundReason = '收到商品与描述不符'
                            break;
                        case '6':
                            refundReason = '商品质量问题'
                            break;
                        case '7':
                            refundReason = '商品需要维修'
                            break;
                        case '8':
                            refundReason = '未按约定时间发货'
                            break;
                        case '9':
                            refundReason = '其他'
                            break;
                        default:
                            break;
                    }
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div style={{marginBottom:10}}>{ refundType } ({ refundReason }) </div>
                                <div>备注 : { record.alldata.refundMemo }</div>
                            </div>
                        </div>
                    )
                }
            },
            {
                title: '退款金额',
                dataIndex: 'userName',
                key: 'userName',
                width: 150,
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div style={{marginBottom:10}}>{ record.alldata.amount }</div>
                                <div>粮票 ：{ record.alldata.ticket }</div>
                            </div>
                            
                        </div>
                    )
                }
            },
            {
                title: '客户信息',
                dataIndex: 'phone',
                key: 'phone',
                width: 200,
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div style={{marginBottom:10}}>{record.alldata.orderFreight.receiptName}</div>
                                <div>{record.alldata.orderFreight.receiptPhone}</div>
                            </div>
                            
                        </div>
                    )
                }
            }, 
            {
                title: '订单状态',
                dataIndex: 'contents',
                key: 'contents',
                width: 200,
                render: (text, record) =>{
                    let status = record.alldata.status;
                    let refundState = record.alldata.refundState;
                    switch (status) {
                        case '1':
                            status = '待付款'
                            break;
                        case '2':
                            status = '待配送'
                            break;
                        case '3':
                            status = '配送中'
                            break;
                        case '4':
                            status = '交易完成-待评价'
                            break;
                        case '5':
                            status = '已关闭'
                            break;
                        case '6':
                            status = '交易完成-已评价'
                            break;
                        case '7':
                            status = '交易完成'
                            break;
                        default:
                            break;
                    }
                    switch (refundState) {
                        case '2':
                            refundState = '待审核'
                            break;
                        case '3':
                            refundState = '已同意'
                            break;
                        case '4':
                            refundState = '已退款'
                            break;
                        case '5':
                            refundState = '已拒绝'
                            break;
                        case '6':
                            refundState = '已取消'
                            break;
                        default:
                            break;
                    }
                    let btn;
                    if(refundState == '待审核'){
                        btn = <Button 
                            onClick={ (e) => {
                                e.stopPropagation();
                                this.setState({refundVisible: true})
                                this.props.saveSelect({
                                    orderNo: record.alldata.orderNo, 
                                })
                            } }
                            style={{color:'#1890ff',borderColor:'#1890ff'}}>退款审核</Button>
                    }
                    if(refundState == '已同意'){
                        btn = <Button 
                            onClick={ (e) => {
                                e.stopPropagation();
                                this.setState({refundAffirm: true})
                                this.props.saveSelect({
                                    orderNo: record.alldata.orderNo, 
                                })
                            } }
                            style={{color:'#1890ff',borderColor:'#1890ff'}}>确认退款</Button>
                    }
                   return (
                    <div>
                        <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                            <span style={{visibility:"hidden"}}>订单编号 : </span>
                        </div>
                        <div>
                            <div style={{marginBottom:10}}>{ status }-{ refundState }</div>
                            <div>{ btn }</div>
                        </div>
                    
                    </div>
                   )
                }
            }
        ];
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div className={styles.search}>
                    <Row>
                        <Col span={2} style={{ width: 115 }}>
                            {
                                this.community()
                            }
                        </Col>
                        <Col span={1} style={{ width: 100}}>
                            <Button type="primary" 
                                onClick={ this.refundAudit.bind(this) }
                                style={{backgroundColor:'#FFF',color: '#1890ff'}}>批量审核</Button>
                        </Col>
                        <Col span={2} style={{ width: 130}}>
                            <Button type="primary" 
                                onClick={ this.refundConfirm.bind(this) }
                                style={{backgroundColor:'#FFF',color: '#1890ff'}}>批量退款确认</Button>
                        </Col>
                        <Col xl={13} xxl={15}>
                            <Col span={22}>
                                <InputGroup compact>
                                {getFieldDecorator('type', {initialValue: 'orderNo'})(
                                    <Select style={{ width: 114}} onChange={this.setSelectVal.bind(this)}>
                                        <Option value="orderNo">退款单号</Option>
                                        <Option value="origOrderNo">业务单号</Option>
                                        <Option value="receiptName">客户姓名</Option>
                                        <Option value="receiptPhone">客户电话</Option>
                                    </Select>
                                )}
                                <Input style={{ width: 240}}
                                    maxLength={50}
                                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                    value={this.state.inputVal} 
                                    onChange={(e)=> this.setState({inputVal:e.target.value})}
                                    placeholder="输入搜索内容" />
                                </InputGroup>
                            </Col>
                        </Col>
                        <Col span={3} style={{display:showScreen?'none':'',textAlign:'right'}}>
                            <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                            <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                            展开 <Icon type="down" />
                            </a>
                        </Col>
                    </Row>
                    {selectElemnt}
                </div>
                <div style={{height: 6}}></div>
                <div style={{height: 14,backgroundColor: '#ccc'}}></div>
                <div style={{width: '100%',padding: '5px 24px 24px 24px', backgroundColor: "#FFF"}}>
                    <Row>
                        <Table
                            loading={this.props.loading}
                            columns={columns}
                            rowSelection={rowSelection}
                            dataSource={content.data}
                            rowKey={record => record.alldata.id}
                            onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                            pagination={content.pagination}
                            scroll={{ x: 1650,y: 600 }}/>
                    </Row>
                </div>

                <Drawer
                    title="售后详情"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'detailVisible')}
                    maskClosable={false}
                    visible={this.state.detailVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
                </Drawer>

                <Drawer
                    title="退款审核"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'refundVisible')}
                    maskClosable={false}
                    visible={this.state.refundVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <RefundCheck 
                        // orderNos={ this.state.orderNos }
                        search={this.search.bind(this)}  
                        closeRefundCheck={() => this.setState({refundVisible: false})} />
                </Drawer>

                <Drawer
                    title="退款确认"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'refundAffirm')}
                    maskClosable={false}
                    visible={this.state.refundAffirm}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <RefundAffirm 
                        // orderNos={ this.state.orderNos }
                        search={this.search.bind(this)} 
                        closeRefundAffirm={() => this.setState({refundAffirm: false})} />
                </Drawer>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.orderList.list,
        loading: !!state.loading.models.orderList
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'orderList/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'orderList/save', payload})
        },
        refundAudit(payload = {}) {   //订单退款审核
            dispatch({type: 'orderList/refundAudit', payload})
        },
        refundConfirm(payload = {}) {   //订单退款确认
            dispatch({type: 'orderList/refundConfirm', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
