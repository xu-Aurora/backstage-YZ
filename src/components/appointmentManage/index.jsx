import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Select,Card,Avatar,DatePicker,Layout,Drawer, Menu,Popover} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import $ from 'jquery';

const { Header, Content, Sider} = Layout;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { Meta } = Card;

import Detail from './detail/index';
import AllotOrder from './detail/allotOrder';
import AmendTime from './detail/amendTime';
import CancelOrder from './detail/cancelOrder';

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
            detailVisible: false,
            allotOrderVisible: false,
            amendTimeVisible: false,
            cancelOrderVisible: false,
            orderNo: '',
            inputVal: '',
            selectedKey: '',
            isHasSonOrder: '',
            tabKey: '0',
            visibleShow: false,
            optionVal:'receiptName',
            arrangeTime: '',
            comId: ''
        };
    }
    componentWillMount() {
        userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            instCode: userData.instCode,
            page: 1, 
            size: 10, 
            userId: userData.id,
            status: '0'
        });
        this.props.queryTime({
            instCode: userData.instCode,
            userId: userData.id,
            dates: 14
        });
        this.props.queryCom({
            instCode: userData.instCode,
            userId: userData.id,
        });
    }

    handleSearch = () => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id, 
            instCode: userData.instCode,
            page: '1', 
            size: pageSize1,
            [`${this.state.optionVal}`]: this.state.inputVal,
            isHasSonOrder: this.state.isHasSonOrder,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
            arrangeTime: this.state.arrangeTime,
            comId: this.state.comId,
            status: this.state.tabKey
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
                        status: this.state.tabKey,
                        page: current,
                        size: pageSize,
                        status: this.state.status,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'',
                        endTime: this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'',
                    });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        instCode: userData.instCode,
                        status: this.state.tabKey,
                        page: current,
                        size: pageSize,
                        status: this.state.status,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime?Moment(this.state.startTime).format('YYYY-MM-DD'):'',
                        endTime: this.state.endTime?Moment(this.state.endTime).format('YYYY-MM-DD'):'',
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
            this.setState({startTime: time})
        }
        if (type === 'x2') {
            this.setState({endTime: time})
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
            instCode: userData.instCode,
            status: '2',
            page: 1, 
            size: 10, 
            type: '1',
            status: this.state.tabKey,
            wayType: val
        });
    }

    onSelectChange =  (ids, datas) => {
        this.setState({ids});
    }
    //展开与收起
    toggleForm = () => {
        this.setState({
          showScreen: !this.state.showScreen,
          isHasSonOrder: '',
          endTime: '',
          startTime: '',
        });
    };
    //点击关闭页面
    handleCancel(e)  {
        this.setState({
            [e]: false
        })
    }
    tabKey(key){
        this.setState({
            tabKey: key
        })
        this.props.queryList({
            userId: userData.id, 
            instCode: userData.instCode,
            page: '1', 
            size: pageSize1,
            [`${this.state.optionVal}`]: this.state.inputVal,
            isHasSonOrder: this.state.isHasSonOrder,
            startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
            endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
            arrangeTime: this.state.arrangeTime,
            comId: this.state.comId,
            status: key == '0' ? '' : key
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
            status: this.state.tabKey,
        })
    }
    //index组件与Detail组件传值
    closeDetail(item){
        let self = this;
        self.setState({detailVisible: false},function(){
          setTimeout(() => {
            self.setState({[item]: true})
          }, 500);
        })
    }

    handleMenu(type,key){
        if(type == 'comm'){
            this.setState({
                comId: key.key == '100' ? '' : key.key
            })
            this.props.queryList({
                instCode: userData.instCode,
                page: 1, 
                size: pageSize1, 
                userId: userData.id,
                comId: key.key == '100' ? '' : key.key,
                [`${this.state.optionVal}`]: this.state.inputVal,
                isHasSonOrder: this.state.isHasSonOrder,
                startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
                endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
                arrangeTime: this.state.arrangeTime,
                status: this.state.tabKey
            });

        }
        if(type == 'time'){
            this.setState({
                selectedKey: key.key,
                arrangeTime: key.key == '100' ? '' : key.key
            })
            this.props.queryList({
                instCode: userData.instCode,
                page: 1, 
                size: pageSize1, 
                userId: userData.id,
                arrangeTime: key.key == '100' ? '' : key.key,
                comId: this.state.comId,
                [`${this.state.optionVal}`]: this.state.inputVal,
                isHasSonOrder: this.state.isHasSonOrder,
                startTime: this.state.startTime ? Moment(this.state.startTime).format('YYYY-MM-DD') : '',
                endTime: this.state.endTime ? Moment(this.state.endTime).format('YYYY-MM-DD') : '',
                status: this.state.tabKey
            });
            this.props.queryCom({
                instCode: userData.instCode,
                userId: userData.id,
                appointmentTime: key.key == '100' ? '' : key.key
            });

        }

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

                        <Col>
                            <FormItem label="有筛选订单">
                                <Select
                                    defaultValue={""}
                                    onChange={this.handleSelectChange.bind(this, 'isHasSonOrder')}
                                    style={{width: '100%'}}>
                                    <Option value="">全部</Option>
                                    <Option value="1">是</Option>
                                    <Option value="2">否</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Col>

                    <Col>
                        <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>收起 <Icon type="up" /></a>
                    </Col>
                </Row>
            )
        }

        const columns = [
            {
                title: '服务信息',
                dataIndex: 'content',
                key: 'content',
                width: 250,
                render: (value, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{marginRight:12}}>订单编号 : {record.alldata.serviceOrderNo}</span>
                            </div>
                            <div>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={<Avatar src={`/backstage/upload/download?uuid=${record.alldata.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
                                        title={record.alldata.name}
                                        description={
                                            <Col>
                                                <Col><span>{ record.alldata.serviceCode }</span></Col>
                                            </Col>
                                        }
                                    />
                                </Card>
                            </div>
                        </div>
                    )
                }
            },
            {
                title: '服务项目',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 250,
                render: (text, record) => {
                    if(record.alldata.advanceType == '1' || record.alldata.advanceType == '2'){  //免费预约
                        return (
                            <div>
                                <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                    <span>下单时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                                </div>
                                <div>
                                    <div>上门维修付款</div>
                                </div>
                            </div>
                        )
                    }
                    if(record.alldata.advanceType == null){  //一口价
                        return (
                            <div>
                                <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                    <span>下单时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                                </div>
                                <div>
                                    {
                                        record.alldata.serviceOrderSkuInfoResponses.map((item,index) => {
                                            return (
                                                <div key={index}><span>{item.skuname}</span> * <span></span>{ item.skunum }</div>
                                            )
                                        })
                                    }
                                    
                                </div>
                            </div>
                        )
                    }

                }
            }, 
            {
                title: '预约时间',
                dataIndex: 'userName',
                key: 'userName',
                width: 200,
                render: (text, record) => {
                    let source = record.alldata.source;
                    let sourceName;
                    if(source == '1'){
                        sourceName = '悦站app'
                    }
                    if(source == '2'){
                        sourceName = '悦站H5'
                    }
                    return (
                        
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span>订单来源 : { sourceName }</span>
                            </div>
                            <div>
                                <div>{ record.alldata.freightTimeInfo ? record.alldata.freightTimeInfo : '尽快处理' }</div>
                            </div>
                            
                        </div>
                    )
                }
            },
            {
                title: '客户信息',
                dataIndex: 'phone',
                key: 'phone',
                width: 350,
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div>
                                    {record.alldata.receiptName} , 
                                    {record.alldata.receiptPhone}
                                </div>
                                <div>{record.alldata.address}</div>
                            </div>
                            
                        </div>
                    )
                }
            }, 
            {
                title: '服务状态',
                dataIndex: 'contents',
                key: 'contents',
                width: 200,
                render: (i, record) =>{
                   return (
                    <div>
                        <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                            <span style={{visibility:"hidden"}}>订单编号 : </span>
                        </div>
                        <div>
                            <div style={{marginBottom:10}}>{ record.alldata.serviceStatusName }</div>
                            <div>
                                {
                                    record.alldata.serviceStatus == '3' ?  
                                    record.alldata.salesmanList ? record.alldata.salesmanList.map((item) => {
                                        return (
                                            <Popover 
                                                placement="bottom"
                                                key={item.id}
                                                trigger="hover"
                                                content={(
                                                    <div>
                                                        <p style={{marginBottom:10}}>{ item.salesmanName }({ item.id })</p>
                                                        <p style={{marginBottom:10}}>{ item.salesmanPhone }</p>
                                                        <p>{ item.comNames }</p>
                                                    </div>
                                                )}  
                                            >
                                            <span style={{color:'blue'}}>{ `${item.salesmanName}、` }</span>
                                            </Popover>
                                        )
                                    }) : ''
                                   : ''
                                }
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
                        <TabPane tab="预约管理" key="1">
                            <Row className="flex">
                                <Col>
                                    <Col>
                                        <InputGroup compact>
                                        {getFieldDecorator('type', {initialValue: 'receiptName'})(
                                            <Select style={{ width: 114}} onChange={this.setSelectVal.bind(this)}>
                                                <Option value="receiptName">客户名称</Option>
                                                <Option value="receiptPhone">手机号码</Option>
                                                <Option value="serviceCode">服务编号</Option>
                                                <Option value="serviceName">服务名称</Option>
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
                                            <TabPane tab="待处理" key="1"></TabPane>
                                            <TabPane tab="处理中" key="3"></TabPane>
                                        </Tabs>
                                    </Col>
                                </Col>
                                <Col style={{display:showScreen?'none':''}}>
                                    <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
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
                                    rowKey={record => record.alldata.orderNo}
                                    onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                                    pagination={content.pagination}
                                    scroll={{ x: 1650,y: 600 }}/>
                            </Content>
                        </Layout>
                    </Layout>
                </div>

                <Drawer
                    title="订单详情"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'detailVisible')}
                    maskClosable={false}
                    destroyOnClose
                    visible={this.state.detailVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)}/>
                </Drawer>

                <Drawer
                    title="分配订单"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'allotOrderVisible')}
                    maskClosable={false}
                    destroyOnClose
                    visible={this.state.allotOrderVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <AllotOrder search={this.search.bind(this)} close={ () => this.setState({allotOrderVisible: false}) } />
                </Drawer>

                <Drawer
                    title="修改时间"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'amendTimeVisible')}
                    maskClosable={false}
                    destroyOnClose
                    visible={this.state.amendTimeVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <AmendTime search={this.search.bind(this)} close={ () => this.setState({amendTimeVisible: false}) } />
                </Drawer>

                <Drawer
                    title="取消订单"
                    width="45%"
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'cancelOrderVisible')}
                    maskClosable={false}
                    destroyOnClose
                    visible={this.state.cancelOrderVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <CancelOrder search={this.search.bind(this)} close={ () => this.setState({cancelOrderVisible: false}) } />
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
        data: state.appointmentManage.list,
        timeData: state.appointmentManage.timeData, //预约时间
        comData: state.appointmentManage.comData,   //小区
        loading: !!state.loading.models.appointmentManage
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'appointmentManage/serch', payload})
        },
        queryTime(payload = {}) {
            dispatch({type: 'appointmentManage/serchTime', payload})
        },
        queryCom(payload = {}) {
            dispatch({type: 'appointmentManage/serchCom', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'appointmentManage/save', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
