import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Card, Avatar,DatePicker,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';

import Detail from './detail.jsx';
let pageSize1 = 10;

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
const { Meta } = Card;

function siblingElems(elem) {

    var _elem = elem;
    while ((elem = elem.previousSibling)) {
        if (elem.nodeType == 1) {
            elem.removeAttribute('style');
        }
    }
    var elem = _elem;
    while ((elem = elem.nextSibling)) {
        if (elem.nodeType == 1) {
            elem.removeAttribute('style');
        }
    }

};

const columns = [
    {
        title: '序号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
    },{
        title: '评论内容',
        dataIndex: 'content',
        key: 'content'
    }, {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
    }, {
        title: '评论时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '客户姓名',
        dataIndex: 'userName',
        key: 'userName'
    },{
        title: '客户手机号码',
        dataIndex: 'userPhone',
        key: 'userPhone',
    },{
        title: '评论状态',
        dataIndex: 'status',
        key: 'status',
        render: function (index, record) {
            if(record.status == 1)  {
                return '隐藏'
            } else if(record.status == 2) {
                return '正常'
            } else if(record.status == 3) {
                return '精选'
            }
        }
    }, {
        title: '评论商品',
        dataIndex: 'contents',
        key: 'contents',
        width: '20%',
        render: function(index, record) {
            return ( <Card bordered={false}>
                <Meta
                  avatar={<Avatar src={`/backstage/upload/download?uuid=${record.alldata.goodPic}&viewFlag=1&fileType=jpg&filename=aa`}/>}
                  title={record.alldata.goodName}
                  description={record.alldata.skuName}
                />
              </Card>)
        }
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            orderNo: '',
            phoneNo: '',
            visibleShow: false,
            selectedRows: '',
            // type: '',
            optionVal:'content',
            status: '',
            detailOrderNo: ''
        };
    }
    handleSearch = (val) => {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
       this.setState({
            detailOrderNo: undefined
       })
        this.props.form.validateFields((err, values) => {
            if(values.type == 'content') {
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    content: this.state.inputVal,
                    instCode: userData.instCode,
                    status: this.state.status,
                    createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
                    createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
                });
            }
            if(values.type == 'orderNo') {
                //正则匹配只能输入数字
                let regNum = /^[0-9]*$/;
                if(this.state.inputVal){
                    if(!regNum.test(this.state.inputVal)){
                        message.destroy();
                        message.warning("订单编号只能输入数字");
                        return false;
                    }
                }
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    orderNo: this.state.inputVal,
                    instCode: userData.instCode,
                    status: this.state.status,
                    createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
                    createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
                });
            }
            if(values.type == 'userName') {
                this.props.queryList({
                    userId: userData.id,  
                    page: '1', 
                    size: pageSize1,
                    userName: this.state.inputVal,
                    instCode: userData.instCode,
                    status: this.state.status,
                    createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
                    createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
                });
            }
            if(values.type == 'userPhone') {
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    userPhone: this.state.inputVal,
                    instCode: userData.instCode,
                    status: this.state.status,
                    createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
                    createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
                });
            }
            if(values.type == 'goodName') {
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    goodName: this.state.inputVal,
                    instCode: userData.instCode,
                    status: this.state.status,
                    createTimeStart: this.state.createTimeStart?Moment(this.state.createTimeStart).format("YYYY-MM-DD"):'',
                    createTimeEnd: this.state.createTimeEnd?Moment(this.state.createTimeEnd).format("YYYY-MM-DD"):''
                });
            }
        })

    }
    onSelect = (record, e) => {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        });
    }
    componentWillMount() {
        let orderNo = this.props.match.params.orderNo
        if(orderNo) {
            this.setState({
                detailOrderNo: orderNo
            })
        }
       const userData = JSON.parse(localStorage.getItem('userDetail'));
       this.props.queryList({page: 1, size: 10, userId: userData.id,instCode: userData.instCode, orderNo: orderNo});
      
    }
    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this;
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys + 1,
                    id: item.id,
                    content: item.content,
                    orderNo: item.orderNo,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    userName: decodeURI(item.userName),
                    userPhone: item.userPhone,
                    status: item.status,
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
                        orderNo: self.state.detailOrderNo,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        createTimeEnd: self.state.createTimeEnd ? Moment(self.state.createTimeEnd).format("YYYY-MM-DD"):'',
                        createTimeStart: self.state.createTimeStart ? Moment(self.state.createTimeStart).format("YYYY-MM-DD"): '',
                        status: self.state.status,
                       });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        createTimeEnd: self.state.createTimeEnd ? Moment(self.state.createTimeEnd).format("YYYY-MM-DD"):'',
                        createTimeStart: self.state.createTimeStart ? Moment(self.state.createTimeStart).format("YYYY-MM-DD"):'',
                        status: self.state.status
                       });
                }
            }
        };
    }
    //评论时间
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
    setSelectVal = (val) => {
        this.setState({optionVal: val});
    }

    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }

    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
    }
    //展开与收起
    toggleForm = () => {
    this.setState({
        showScreen: !this.state.showScreen,
        type: ''
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
    this.props.queryList({page: 1, size: 10, userId: userData.id, instCode: userData.instCode});
    }
    //index组件与Detail组件传值
    DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
        setTimeout(() => {
        self.setState({editVisible:data})
        }, 500);
    })
    }

    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col span={8}>
                        <FormItem label={(<span style={{fontSize: 14}}>评论时间</span>)}
                            labelCol={{ span: 3}}
                            wrapperCol={{span: 19}}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x1')}
                                style={{width: '44%'}}/>
                            <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x2')}
                                style={{width: '45%'}}/>
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>评论状态</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">隐藏 </Option>
                                <Option value="2">正常</Option>
                                <Option value="3">精选 </Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={10}>
                      <Col span={14}>
                          <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                      </Col>
                      <Col>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          收起 <Icon type="up" />
                        </a>
                      </Col>
                    </Col>
                </Row>
            )
        }
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="商品评论" key="1">
                            <Row>
                                <Col span={13} style={{marginRight:'4%'}} key="agment">
                                    <Col span={10}>
                                        <InputGroup compact>
                                        {getFieldDecorator('type', {initialValue: 'content'})(
                                            <Select style={{ width: '30%' }} onChange={this.setSelectVal.bind(this)}>
                                                <Option value="content">评论内容</Option>
                                                <Option value="orderNo">订单号</Option>
                                                <Option value="userName">客户姓名</Option>
                                                <Option value="userPhone">客户手机</Option>
                                                <Option value="goodName">评论商品</Option>
                                            </Select>
                                        )}
                                        <Input style={{ width: '70%' }} 
                                            maxLength={50}
                                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                            value={this.state.inputVal} 
                                            onChange={(e)=> this.setState({inputVal:e.target.value})}
                                            placeholder="输入搜索内容" />
                                        </InputGroup>
                                    </Col>
                                </Col>
                                <Col span={2}  offset={8} style={{display:showScreen?'none':''}}>
                                    <Col span={14}>
                                        <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                                    </Col> 
                                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                                        展开 <Icon type="down" />
                                        </a>
                                </Col>
                            </Row>
                            {selectElemnt}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: 24, backgroundColor: "#FFF",marginTop: 20}}>
                    <Row>
                        <Table
                            loading={this.props.loading}
                            columns={columns}
                            dataSource={content.data}
                            rowKey={record => record.id}
                            onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                            pagination={content.pagination}
                            bordered
                            size="middle"/>
                    </Row>
                </div>

                <Drawer
                    title="详情"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'detailVisible')}
                    maskClosable={false}
                    visible={this.state.detailVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
                </Drawer>

                {/* <Drawer
                    title="新增/编辑"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editVisible')}
                    maskClosable={false}
                    visible={this.state.editVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Edit search={this.search.bind(this)} />
                </Drawer> */}
            </div>
        )
    }
}
App.contextTypes = {
    router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
    return {
        data: state.goodsComment.list,
        loading: !!state.loading.models.goodsComment
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'goodsComment/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'goodsComment/save', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
