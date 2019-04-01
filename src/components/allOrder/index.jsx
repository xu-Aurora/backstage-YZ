import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Card, Avatar,DatePicker,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import $ from 'jquery';

import Detail from './details/detail.jsx';
import ServerOrderDetail from './details/serverOrder.jsx';
import Shipments from './details/shipments.jsx';
import Logistics from './details/logistics.jsx';
import CloseOrder from './details/closeOrder.jsx';
import ServerRefund from './details/serverRefund.jsx';

let pageSize1 = 10;

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { Meta } = Card;

function siblingElems(elem) {
    elem.siblings().css("background-color",'#fff')
};

const columns = [
    {
        title: '商品信息',
        dataIndex: 'content',
        key: 'content',
        width: 450,
        render: (value, record) => {
            let length = record.alldata.orderSkus.length;
            return (
                <div>
                    <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                        <span style={{marginRight:12}}>订单编号 : {record.alldata.orderNo}</span>
                        <span>下单时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                    </div>
                    <div style={{minHeight: 80}}>
                        {
                            record.alldata.orderSkus.map((item,index) => {
                                let status = item.status;
                                switch (status) {
                                    case '1':
                                        status = '未退货'
                                        break;
                                    case '2':
                                        status = '退款中'
                                        break;
                                    case '3':
                                        status = '已同意'
                                        break;
                                    case '4':
                                        status = '已退款'
                                        break;
                                    case '5':
                                        status = '已拒绝'
                                        break;
                                    default:
                                        break;
                                }
                                return (
                                    <Card bordered={false} key={item.id}>
                                        <Meta
                                            avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
                                            title={item.goodName}
                                            description={
                                                <Col>
                                                    <Col span={16}><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
                                                    <Col span={5} style={{display: item.status=='2'||item.status=='4'?'block':'none' }}>
                                                        <div style={{background:'#D2D2D2',padding:'2px 12px',borderRadius:5}}>{ status }</div>
                                                    </Col>
                                                </Col>
                                            }
                                        />
                                        <div style={{height:1,width:'100%',background:'#e8e8e8',marginTop:15,display:length>1?'block':'none'}}></div>
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
        title: '单价',
        dataIndex: 'orderNoss',
        key: 'orderNoss',
        width:180,
        render: (text, record) => {
            let source = record.alldata.source;
            switch (source) {
                case '1':
                    source = '悦站app'
                    break;
                case '2':
                    source = '悦站H5'
                    break;
                default:
                    break;
            }
            return (
                <div>
                    <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                        <span>订单来源 : {source}</span>
                    </div>
                    {
                        record.alldata.orderSkus.map((item) => {
                            return (
                                <div key={item.id} style={{height:92,paddingTop:15}}>
                                    <div style={{marginBottom:10}}>&yen; {item.amount}</div>
                                    <div>粮票 : {item.ticket}元</div>
                                </div>
                            )
                        })
                    }

                </div>
            )
        }
    }, 
    {
        title: '实付款',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 150,
        render: (text, record) => {
            return (
                <div>
                    <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                        <span style={{visibility:"hidden"}}>订单编号 : </span>
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
        title: '客户信息',
        dataIndex: 'phone',
        key: 'phone',
        width: 200,
        render: (text, record) => {
            let receiptName = record.alldata.orderFreight != null ? record.alldata.orderFreight.receiptName : '';
            let receiptPhone = record.alldata.orderFreight != null ? record.alldata.orderFreight.receiptPhone : '';
            return (
                <div>
                    <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                        <span style={{visibility:"hidden"}}>订单编号 : </span>
                    </div>
                    <div>
                        <div style={{marginBottom:10}}>{receiptName}</div>
                        <div>{receiptPhone}</div>
                    </div>
                    
                </div>
            )
        }
    }, 
    {
        title: '支付方式',
        dataIndex: 'userName',
        key: 'userName',
        width: 200,
        render: (text, record) => {
            let paymentMethod = record.alldata.paymentMethod;
            switch (paymentMethod) {
                case '1':
                    paymentMethod = '线上支付-微信'
                    break;
                case '2':
                    paymentMethod = '线上支付-支付宝'
                    break;
                default:
                    break;
            }
            let way = record.alldata.orderFreight != null ? record.alldata.orderFreight.way : '' ;
            switch (way) {
                case '1':
                    way = '商家配送'
                    break;
                case '2':
                    way = '快递'
                    break;
                case '3':
                    way = '用户自取'
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
                        <div style={{marginBottom:10}}>{ paymentMethod }</div>
                        <div>{ way }</div>
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
            let businessType = record.alldata.businessType;
            switch (businessType) {
              case '1':
                  businessType = '商品订单'
                  break;
              case '2':
                  businessType = '服务订单'
                  break;
              default:
                  break;
          }
           return (
            <div>
                <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                    <span style={{visibility:"hidden"}}>订单编号 : </span>
                    <span style={{color:'#3F91D2'}}>{businessType}</span>
                </div>
                <div>
                    <div style={{marginBottom:10}}>{status}</div>
                </div>
            
            </div>
           )
        }
    }
];

let userData;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            orderNo: '',
            phoneNo: '',
            visibleShow: false,
            shipmentsVisible: false,
            logisticsVisible: false,
            closeOrderVisible: false,
            serverOrderDetail: false,
            serverRefundVisible: false,
            type: '',
            optionVal:'orderNo',
            createTimeStart: '',
            createTimeEnd: '',
            wayType: '1'
        };
    }
    componentWillMount() {
        userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id,
            instCode: userData.instCode,
            page: 1, 
            size: 10, 
            type: '1',
            wayType: '1'
        });
    }
    handleSearch = (val) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if(values.type == 'receiptName') {
                this.props.queryList({
                    userId: userData.id, 
                    instCode: userData.instCode,
                    type: '1',
                    page: '1', 
                    size: pageSize1,
                    createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format("YYYY-MM-DD") : '',
                    createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format("YYYY-MM-DD") : '',
                    source: this.state.source,
                    paymentMethod: this.state.paymentMethod,
                    way: this.state.way,
                    status: this.state.status,
                    receiptName: this.state.inputVal,
                    wayType: this.state.wayType
                });
            }
            if(values.type == 'orderNo') {
                let regNum = /^[0-9]*$/;
                if(this.state.inputVal){
                    if(!regNum.test(this.state.inputVal)){
                        message.destroy();
                        message.warning('订单编号只能输入数字');
                        return;
                    }
                }
                this.props.queryList({
                    userId: userData.id, 
                    instCode: userData.instCode,
                    type: '1',
                    page: '1', 
                    size: '10',
                    createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format("YYYY-MM-DD") : '',
                    createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format("YYYY-MM-DD") : '',
                    source: this.state.source,
                    paymentMethod: this.state.paymentMethod,
                    way: this.state.way,
                    status: this.state.status,
                    orderNo: this.state.inputVal,
                    wayType: this.state.wayType
                });
            }
            if(values.type == 'receiptPhone') {
                //手机号码正则
                let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
                if(this.state.inputVal){
                    if(!regPhone.test(this.state.inputVal)){
                        message.destroy();
                        message.warning('客户电话格式不正确');
                        return;
                    }
                }
                this.props.queryList({
                    userId: userData.id, 
                    instCode: userData.instCode,
                    type: '1',
                    page: '1', 
                    size: '10',
                    createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format("YYYY-MM-DD") : '',
                    createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format("YYYY-MM-DD") : '',
                    source: this.state.source,
                    paymentMethod: this.state.paymentMethod,
                    way: this.state.way,
                    status: this.state.status,
                    receiptPhone: this.state.inputVal,
                    wayType: this.state.wayType
                });
            }
        })

    }
    onSelect = (record, e) => {
        $(e.target).parents('tr').css("background-color",'#e6fcff')
        siblingElems($(e.target).parents('tr'));
        this.props.saveSelect(record.alldata);
        if(record.alldata.businessType == '1'){ //商品订单
          this.setState({
            detailVisible: true
          });
        }
        if(record.alldata.businessType == '2'){ //服务订单
          this.setState({
            serverOrderDetail: true
          });
          
        }

    }

    setSelectVal = (val) => {
        this.setState({optionVal: val});
    }
    //下单时间
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
                        type: '1',
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format("YYYY-MM-DD") : '',
                        createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format("YYYY-MM-DD") : '',
                        source: this.state.source,
                        paymentMethod: this.state.paymentMethod,
                        way: this.state.way,
                        status: this.state.status,
                        wayType: this.state.wayType
                    });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        type: '1',
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format("YYYY-MM-DD") : '',
                        createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format("YYYY-MM-DD") : '',
                        source: this.state.source,
                        paymentMethod: this.state.paymentMethod,
                        way: this.state.way,
                        status: this.state.status,
                        wayType: this.state.wayType
                    });
                }
            }
        };
    }

    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
    }
    //展开与收起
    toggleForm = () => {
        this.setState({
          showScreen: !this.state.showScreen,
          createTimeStart: '',
          createTimeEnd: '',
          source: '',
          paymentMethod: '',
          way: '',
          status: ''
        });
    };
    //点击关闭页面
    handleCancel(e)  {
        this.setState({
            [e]: false
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
            type: '1',
            wayType: val
        });
    }
    search(item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({
            [item]: false
        })
        this.props.queryList({
            userId: userData.id,
            instCode: userData.instCode,
            page: 1, 
            size: 10, 
            type: '1',
            wayType: '1'
        });
    }
    //index组件与Detail组件传值
    closeDetail(data){
        let self = this;
        self.setState({detailVisible: false,serverOrderDetail: false},function(){
          setTimeout(() => {
            self.setState({[data]: true})
          }, 500);
        })
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
        const content = data ? this.formart(data) : [];
        const rowSelection = {
            onChange: this.onSelectChange
        }
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row className="flex" style={{marginTop: '15px'}}>
                    <Row>
                        <Col>
                            <FormItem label="订单来源">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'source')}
                                    style={{width: '100%'}}>
                                    <Option value="">全部</Option>
                                    <Option value="1">悦站APP</Option>
                                    <Option value="2">悦站H5</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col>
                          <FormItem label="支付方式">
                              <Select
                                  defaultValue={""}
                                  onChange={this.handleSelectChange.bind(this, 'paymentMethod')}
                                  style={{width: '100%'}}>
                                  <Option value="">全部</Option>
                                  <Option value="1">线上支付-微信</Option>
                                  <Option value="2">线上支付-支付宝</Option>
                              </Select>
                          </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="配送方式">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'way')}
                                    style={{width: '100%'}}>
                                    <Option value="">全部</Option>
                                    <Option value="1">商家配送</Option>
                                    <Option value="2">快递</Option>
                                    <Option value="3">用户自取</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="订单状态">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'status')}
                                    style={{width: '100%'}}>
                                    <Option value="">全部</Option>
                                    <Option value="1">待付款</Option>
                                    <Option value="2">待配送</Option>
                                    <Option value="3">配送中</Option>
                                    <Option value="5">已关闭</Option>
                                    <Option value="7">交易完成</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col>
                            <FormItem label="评价状态">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'status')}
                                    style={{width: 150}}>
                                    <Option value="">全部</Option>
                                    <Option value="4">交易完成-待评价</Option>
                                    <Option value="6">交易完成-已评价</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                      <Col style={{marginTop: '15px'}}>
                          <FormItem label="下单时间">
                              <DatePicker
                                  format="YYYY-MM-DD"
                                  onChange={this.timeRange.bind(this, 'x1')}
                                  />
                              <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                              <DatePicker
                                  format="YYYY-MM-DD"
                                  onChange={this.timeRange.bind(this, 'x2')}
                                  />
                          </FormItem>
                      </Col>
                      <Col style={{marginTop: '15px',textAlign:'center'}}>
                          <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                          <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                          </a>
                      </Col>
                    </Row>


                </Row>
            )
        }
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="商品订单" key="1">
                            <Row className="flex">
                                <Col>
                                  <Col style={{width:110}}>
                                    { this.community() }
                                  </Col>
                                  
                                  <Col>
                                      <InputGroup compact>
                                      {getFieldDecorator('type', {initialValue: 'orderNo'})(
                                          <Select style={{ width: 132}} onChange={this.setSelectVal.bind(this)}>
                                              <Option value="orderNo">订单编号</Option>
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

                                <Col style={{display:showScreen?'none':'',textAlign:'center',width:122}}>
                                    <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                                    <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                                    展开 <Icon type="down" />
                                    </a>
                                </Col>
                            </Row>
                            {selectElemnt}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: "5px 24px 24px 24px", backgroundColor: "#FFF",marginTop: 20}}>
                    <Row>
                        <Table
                            style={{tableLayout:'fixed'}}
                            loading={this.props.loading}
                            columns={columns}
                            rowSelection={rowSelection}
                            dataSource={content.data}
                            rowKey={record => record.alldata.id}
                            onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                            pagination={content.pagination}
                            scroll={{ x: 1650,y: 600 }}
                            />
                    </Row>
                </div>

                <Drawer
                    title="订单详情"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'detailVisible')}
                    maskClosable={false}
                    visible={this.state.detailVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} match={this.props.match}/>
                </Drawer>

                <Drawer
                    title="订单详情"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'serverOrderDetail')}
                    maskClosable={false}
                    visible={this.state.serverOrderDetail}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <ServerOrderDetail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
                </Drawer>

                <Drawer
                    title="发货"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'shipmentsVisible')}
                    maskClosable={false}
                    visible={this.state.shipmentsVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Shipments search={this.search.bind(this)} closeShipments={() => this.setState({shipmentsVisible:false})} />
                </Drawer>

                <Drawer
                    title="修改物流信息"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'logisticsVisible')}
                    maskClosable={false}
                    visible={this.state.logisticsVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Logistics search={this.search.bind(this)} closeLogistics={() => this.setState({logisticsVisible:false})} />
                </Drawer>

                <Drawer
                    title="关闭订单"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'closeOrderVisible')}
                    maskClosable={false}
                    visible={this.state.closeOrderVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <CloseOrder search={this.search.bind(this)} closeOrder={() => this.setState({closeOrderVisible: false})} />
                </Drawer>

                <Drawer
                    title="服务退款"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'serverRefundVisible')}
                    maskClosable={false}
                    visible={this.state.serverRefundVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <ServerRefund search={this.search.bind(this)} closeOrder={() => this.setState({serverRefundVisible: false})} />
                </Drawer>
            </div>
        )
    }
}
App.contextTypes = {
    router: PropTypes.object
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

    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
