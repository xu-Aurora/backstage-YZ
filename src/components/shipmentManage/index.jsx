import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Card, Avatar,DatePicker,Modal,Layout, Menu} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import $ from 'jquery';

import Detail from './details/detail.jsx';
import Shipments from './details/shipments.jsx';    //发货

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { Meta } = Card;
const { Header, Content, Sider} = Layout;

function siblingElems(elem) {
    elem.siblings().css("background-color",'#fff')
};

let pageSize1 = 10;
let userData;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            modalShow: false,
            orderNo: '',
            inputVal: '',
            // wayType: '1',
            way: '',
            createTimeStart: '',
            createTimeEnd: '',
            visibleShow: false,
            shipmentsVisible: false,
            optionVal:'orderNo',
            selectedKey: '',
            tabKey: '0',
            freightTime: '',
            freightTime: '',
            comId: ''
        };
    }
    componentWillMount() {
        userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            instCode: userData.instCode,
            page: 1, 
            size: 10, 
            status: '2',
            type: '1',
            userId: userData.id,
            // wayType: '1',
            institutionalTop: userData.institutionalTop
        });
        this.props.queryTime({
            instCode: userData.instCode,
            userId: userData.id,
            dates: 14,
            institutionalTop: userData.institutionalTop
        });
        this.props.queryCom({
            instCode: userData.instCode,
            userId: userData.id,
            institutionalTop: userData.institutionalTop
        });
    }

    handleSearch = () => {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id, 
            instCode: userData.instCode,
            institutionalTop: userData.institutionalTop,
            status: '2',
            type: '1',
            page: '1', 
            size: pageSize1,
            [`${self.state.optionVal}`]: self.state.inputVal,
            way: this.state.tabKey == '0' ? '' : this.state.tabKey,
            sources: this.state.source ? this.state.source.join(',') : '',
            comId: this.state.comId,
            createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
            createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
        });
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
                        instCode: userData.instCode,
                        institutionalTop: userData.institutionalTop,
                        status: '2',
                        type: '1',
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        // wayType: this.state.wayType,
                        way: this.state.way,
                        source: this.state.source?this.state.source.join(','):'',
                        createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
                        createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
                    });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        instCode: userData.instCode,
                        institutionalTop: userData.institutionalTop,
                        status: '2',
                        type: '1',
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        // wayType: this.state.wayType,
                        way: this.state.way,
                        source: this.state.source?this.state.source.join(','):'',
                        createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
                        createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
                    });
                }
            }
        };
    }
    setSelectVal = (val) => {
        this.setState({optionVal: val});
    }
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
    //选择小区
    handleSelect(val){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({wayType: val})
        this.props.queryList({
            userId: userData.id,
            institutionalTop: userData.institutionalTop,
            instCode: userData.instCode,
            status: '2',
            page: 1, 
            size: 10, 
            type: '1',
            // wayType: val
        });
    }

    onSelectChange =  (ids, datas) => {
        this.setState({ids});
    }
    //展开与收起
    toggleForm = () => {
        this.setState({
          showScreen: !this.state.showScreen,
          way: '',
          source: '',
          createTimeEnd: '',
          createTimeStart: '',
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
            [item]: false
        })
        this.props.queryList({
            userId: userData.id,
            institutionalTop: userData.institutionalTop,
            instCode: userData.instCode,
            status: '2',
            type: '1', 
            page: 1, 
            size: 10,
            // wayType: '1'
        })
    }
    //index组件与Detail组件传值
    closeDetail(data){
        let self = this;
        self.setState({detailVisible:false},function(){
          setTimeout(() => {
            self.setState({shipmentsVisible:data})
          }, 500);
        })
    }

    tabKey(key){
        this.setState({
            tabKey: key
        })
        this.props.queryList({
            userId: userData.id, 
            instCode: userData.instCode,
            institutionalTop: userData.institutionalTop,
            status: '2',
            type: '1',
            page: '1', 
            size: pageSize1,
            [`${this.state.optionVal}`]: this.state.inputVal,
            comId: this.state.comId,
            way: key == '0' ? '' : key,
            sources: this.state.source ? this.state.source.join(',') : '',
            createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
            createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
        });
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

    handleMenu(type,key){
        if(type == 'comm'){
            this.setState({
                comId: key.key == '100' ? '' : key.key
            })
            this.props.queryList({
                userId: userData.id, 
                instCode: userData.instCode,
                institutionalTop: userData.institutionalTop,
                status: '2',
                type: '1',
                page: '1', 
                size: pageSize1,
                [`${this.state.optionVal}`]: this.state.inputVal,
                // wayType: this.state.wayType,
                way: this.state.tabKey == '0' ? '' : this.state.tabKey,
                sources: this.state.source ? this.state.source.join(',') : '',
                createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
                createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
                comId: key.key == '100' ? '' : key.key,
                freightTime: this.state.freightTime
            });

        }
        if(type == 'time'){
            this.setState({
                selectedKey: key.key,
                freightTime: key.key == '100' ? '' : key.key
            })
            this.props.queryList({
                userId: userData.id, 
                instCode: userData.instCode,
                institutionalTop: userData.institutionalTop,
                status: '2',
                type: '1',
                page: '1', 
                size: pageSize1,
                [`${this.state.optionVal}`]: this.state.inputVal,
                // wayType: this.state.wayType,
                way: this.state.tabKey == '0' ? '' : this.state.tabKey,
                sources: this.state.source ? this.state.source.join(',') : '',
                createTimeStart: this.state.createTimeStart ? Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'',
                createTimeEnd: this.state.createTimeEnd ? Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'',
                freightTime: key.key == '100' ? '' : key.key,
                comId: this.state.comId
            });
            this.props.queryCom({
                instCode: userData.instCode,
                userId: userData.id,
                appointmentTime: key.key == '100' ? '' : key.key
            });

        }

    }

    //确定导出数据
    confirm = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const createTimeStart = this.state.createTimeStart?Moment(this.state.createTimeStart).format('YYYY-MM-DD'):'';
        const createTimeEnd = this.state.createTimeEnd?Moment(this.state.createTimeEnd).format('YYYY-MM-DD'):'';
        let source = this.state.source?this.state.source.join(','):'';
        let ids = this.state.ids ? this.state.ids.join(',') : '';
        let way = this.state.tabKey == '0' ? '' : this.state.tabKey;
        let comId = this.state.comId == '100' ? '' : this.state.comId;
        let freightTime = this.state.freightTime == '100' ? '' : this.state.freightTime;
        let LINK;
        this.props.form.validateFields((err, values) => {
            if (values.type == 'orderNo') {
                LINK = `/backstage/order/mng/deliverGoodsListExcel?orderNo=${this.state.inputVal}&way=${way}&comId=${comId}&freightTime=${freightTime}&ids=${ids}&createTimeStart=${createTimeStart}&createTimeEnd=${createTimeEnd}&way=${this.state.way}&source=${source}&status=2&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
            }else if (values.type == 'receiptName') {
                LINK = `/backstage/order/mng/deliverGoodsListExcel?receiptName=${this.state.inputVal}&way=${way}&comId=${comId}&freightTime=${freightTime}&ids=${ids}&createTimeStart=${createTimeStart}&createTimeEnd=${createTimeEnd}&way${this.state.way}&source=${source}&status=2&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
            }else if(values.type == 'receiptPhone'){
                LINK = `/backstage/order/mng/deliverGoodsListExcel?receiptPhone=${this.state.inputVal}&way=${way}&comId=${comId}&freightTime=${freightTime}&ids=${ids}&createTimeStart=${createTimeStart}&createTimeEnd=${createTimeEnd}&way=${this.state.way}&source=${source}&status=2&userId=${userData.id}&size=${content.total < 1000 ? content.total : ''}&page=1`;
            }
        })
        window.location.href = LINK;
        this.setState({modalShow: false});
    }
      

    render() {
        const { data,comData,timeData } = this.props;
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
                    <Col>
                        <Col>
                            <FormItem label="订单来源">
                                <Select 
                                    mode="multiple"
                                    placeholder="全部"
                                    onChange={this.handleSelectChange.bind(this, 'source')}
                                    style={{width: '100%'}}>
                                    <Option value="1">悦站APP</Option>
                                    <Option value="2">悦站H5</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col>
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
                        {/* <Col>
                            <FormItem label="配送方式">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'way')}
                                    style={{width: '100%'}}>
                                    <Option value="">全部</Option>
                                    <Option value="1">商家配送</Option>
                                    <Option value="2">快递</Option>
                                    <Option value="3">上门自取</Option>
                                </Select>
                            </FormItem>
                        </Col> */}
                    </Col>

                    <Col>
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                        <Button type="primary" style={{marginRight:10}} onClick={() => this.setState({modalShow:true})}>导出</Button>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>收起 <Icon type="up" /></a>
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
                    let length = record.alldata.orderSkus.length;
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{marginRight:12}}>订单编号 : {record.alldata.orderNo}</span>
                                <span>下单时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                            <div>
                                {
                                    record.alldata.orderSkus.map((item,index) => {
                                        let status = item.status;
                                        switch (status) {
                                            case '1':
                                                status = '未退货'
                                                break;
                                            case '2':
                                                status = '退货中'
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
                                                            <Col><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
                                                            <Col style={{display: item.status=='2'||item.status=='4'?'block':'none' }}>
                                                                <div style={{background:'#D2D2D2',padding:'2px 14px',borderRadius:5}}>{ status }</div>
                                                            </Col>
                                                        </Col>
                                                    }
                                                />
                                                <div style={{height:1,width:'88%',background:'#e8e8e8',marginTop:15,display:length>1?'block':'none'}}></div>
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
                width: 150,
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
                            <div>
                                <div style={{marginBottom:10}}>&yen; {record.alldata.amount}</div>
                                <div>粮票 : {record.alldata.ticket}元</div>
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
                    let way = record.alldata.orderFreight.way;
                    switch (way) {
                        case '1':
                            way = '商家配送'
                            break;
                        case '2':
                            way = '快递'
                            break;
                        case '3':
                            way = '上门自取'
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
                title: '发货信息',
                dataIndex: 'phone',
                key: 'phone',
                width: 350,
                render: (text, record) => {
                    let way = record.alldata.orderFreight.way;
                    let freightTimeInfo = record.alldata.orderFreight.freightTimeInfo;
                    let time;
                    if(way == '1'){
                        time = freightTimeInfo ? freightTimeInfo : '尽快配送'
                    }
                    if(way == '2'){
                        time = '尽快配送'
                    }
                    if(way == '3'){
                        time = freightTimeInfo
                    }
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div>
                                    收货人 : {record.alldata.orderFreight.receiptName} , 
                                    {record.alldata.orderFreight.receiptPhone}
                                </div>
                                <div>收货地址 : {record.alldata.orderFreight.address}</div>
                                <div>配送时间 : {time}</div>
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
                render: (i, record) =>{
                    let deliverGoodsStatus = record.alldata.deliverGoodsStatus;
                    let display;
                    if(deliverGoodsStatus == '1'){
                        display = 'block'
                    }
                    if(deliverGoodsStatus == '0'){
                        display = 'none'
                    }
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
                   return (
                    <div>
                        <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                            <span style={{visibility:"hidden"}}>订单编号 : </span>
                        </div>
                        <div>
                            <div style={{marginBottom:10}}>{ status }</div>
                            <div>
                                <Button 
                                    onClick={ (e) => {
                                        e.stopPropagation();
                                        this.setState({shipmentsVisible: true})
                                        this.props.saveSelect({
                                            orderNo: record.alldata.orderNo, 
                                            id: record.alldata.id
                                        })
                                    } }
                                    style={{color:'#1890ff',borderColor:'#1890ff',display:display}}>发货</Button>
                            </div>
                        </div>
                    
                    </div>
                   )
                }
            }
        ];

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="待配送订单" key="1">
                            <Row className="flex">
                                <Col>
                                    <Col style={{width:110}}>
                                        {
                                            this.community()
                                        }
                                    </Col>
                                    <Col>
                                        <InputGroup compact>
                                        {getFieldDecorator('type', {initialValue: 'orderNo'})(
                                            <Select style={{ width: 114}} onChange={this.setSelectVal.bind(this)}>
                                                <Option value="orderNo">订单编号</Option>
                                                <Option value="receiptName">收货人</Option>
                                                <Option value="receiptPhone">收货人电话</Option>
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
                                    <Col className="status">
                                        <Tabs activeKey={ this.state.tabKey } onTabClick={this.tabKey.bind(this)} >
                                            <TabPane tab="全部" key="0"></TabPane>
                                            <TabPane tab="配送" key="1"></TabPane>
                                            <TabPane tab="快递" key="2"></TabPane>
                                            <TabPane tab="上门自取" key="3"></TabPane>
                                        </Tabs>
                                    </Col>
                                </Col>
                                <Col style={{display:showScreen?'none':'',textAlign:'right'}}>
                                    <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                                    <Button type="primary" style={{marginRight:10}} onClick={() => this.setState({modalShow:true})}>导出</Button>
                                    <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                                        展开<Icon type="down" />
                                    </a>
                                </Col>
                            </Row>
                            {selectElemnt}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 8}}>

                    <Layout>
                        <Header className="header">
                            <div className={styles.apponitTime}>预约时间</div>
                            <div className={styles.box}>
                                <Menu
                                    theme="light"
                                    mode="horizontal"
                                    selectedKeys={[this.state.selectedKey ? this.state.selectedKey : '100']}
                                    onClick={ this.handleMenu.bind(this,'time') }
                                >   
                                    {
                                        timeData ? timeData.map((item) => {
                                            return (
                                                <Menu.Item key={ item.date ? item.date : '100' }>
                                                    <div>{ item.time }</div>
                                                    <div>{ item.number ? item.number : 0 }</div>
                                                </Menu.Item>
                                            )
                                        }) : []
                                    }
                                </Menu>
                            </div>

                        </Header>
                        <Layout style={{ background: '#fff',marginTop: 8 }}>
                            <Sider theme="light" width={230} style={{ background: '#fff' }}>
                                <div className={styles.comm}>服务小区</div>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={['100']}
                                    style={{textAlign:'center',height:'65vh' }}
                                    onClick={ this.handleMenu.bind(this,'comm') }
                                >
                                    {
                                        comData ? comData.map((item) => {
                                            return (
                                                <Menu.Item key={ item.comId ? item.comId : '100' }>
                                                    <span>{ item.comName }</span>
                                                    <span>{ item.number }</span>
                                                </Menu.Item>
                                            )
                                        }) : []
                                    }

                                </Menu>
                            </Sider>
                            <Content style={{ paddingLeft:8, minHeight: 280,background:'#F0F0F0' }}>
                                <Table
                                    style={{tableLayout:'fixed'}}
                                    loading={this.props.loading}
                                    columns={columns}
                                    rowSelection={rowSelection}
                                    dataSource={content.data}
                                    rowKey={record => record.alldata.id}
                                    onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                                    pagination={content.pagination}
                                    scroll={{ x: 1650,y: 600 }}/>
                            </Content>
                        </Layout>
                    </Layout>
                </div>

                <Modal
                    title="导出数据"
                    visible={this.state.modalShow}
                    onOk={this.confirm.bind(this,content)}
                    onCancel={ () => this.setState({modalShow:false}) }
                    >
                    <p style={{fontSize:16}}>确定导出全部数据?</p>
                </Modal>

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
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
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
                    <Shipments search={this.search.bind(this)} closeShipments={ () => this.setState({shipmentsVisible: false}) } />
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
        timeData: state.orderList.timeData, //预约时间
        comData: state.orderList.comData,   //小区
        loading: !!state.loading.models.orderList
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'orderList/serch', payload})
        },
        queryTime(payload = {}) {
            dispatch({type: 'orderList/serchTime', payload})
        },
        queryCom(payload = {}) {
            dispatch({type: 'orderList/serchCom', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'orderList/save', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
