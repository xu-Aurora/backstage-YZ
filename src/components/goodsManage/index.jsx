import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,Card, Avatar,DatePicker, message, Modal} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import qs from 'qs';

import Detail from './details/detail.jsx';
import AmendPrice from './amendPrice/index';
import AmendElse from './amendElse/index';
import Group from './group/index';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

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

let pageSize1 = 10;

const columns = [
    {
        title: '商品编号',
        dataIndex: 'code',
        key: 'code'
    }, {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 300,
        render: function(text,record) {
            return (
                <div className={styles.goodNames}>
                    <img src={`/backstage/upload/download?uuid=${record.pic}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>
                    <div>{ record.name }</div>
                </div>
            )
        }
    }, {
        title: '价格',
        dataIndex: 'salesPriceRange',
        key: 'salesPriceRange'
    }, {
        title: '抵用粮票',
        dataIndex: 'ticketRange',
        key: 'ticketRange'
    },{
        title: '库存',
        dataIndex: 'totalStock',
        key: 'totalStock',
    }, {
        title: '实际销量',
        dataIndex: 'actualSales',
        key: 'actualSales'
    }, {
        title: '初始销量',
        dataIndex: 'initialSales',
        key: 'initialSales'
    }, {
        title: '上下架时间',
        dataIndex: 'upDownTime',
        key: 'upDownTime'
    }, {
        title: '上架状态',
        dataIndex: 'status',
        key: 'status',
        render: function(text, record) {
            if(record.status == 1) {
                return '下架'
            } else if(record.status == 2){
                return '上架'
            }else if(record.status == 3){
                return '预售模式'
            }
        }
    }, {
        title: '排序',
        dataIndex: 'seq',
        key: 'seq',
    },{
        title: '是否推荐',
        dataIndex: 'isHot',
        key: 'isHot',
        render: function(text, record) {
            if(record.isHot == 1) {
                return '是'
            } else if(record.isHot == 2){
                return '否'
            }
        }
    }
];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            rowSelection: [],
            code: '',
            phoneNo: '',
            detailVisible: false,
            amendPriceVisible: false,
            amendElseVisible: false,
            groupVisible: false,
            selectedRows: '',
            type: '',
            optionVal:'code',
            checkList: [],
            title: '',
            visibleShow: false,
            editType: '',
            endPrice: '',
            startPrice: '',
            startTime: '',
            endTime: '',
            groupStatus: false,
            modalShow: false
        };
    }
    handleSearch = () => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if(values.type == 'name') {
                this.props.queryList({
                    userId: userData.id, 
                    instCode: userData.instCode,
                    page: '1', 
                    size: pageSize1,
                    status: this.state.status,
                    endPrice: this.state.endPrice,
                    startPrice: this.state.startPrice,
                    endTime: this.state.endTime ? Moment(this.state.endTime).format("YYYY-MM-DD") : '',
                    startTime: this.state.startTime ? Moment(this.state.startTime).format("YYYY-MM-DD") : '',
                    isHot: this.state.isHot,
                    name: this.state.inputVal
                });
            }
            if(values.type == 'code') {
                this.props.queryList({
                    userId: userData.id, 
                    instCode: userData.instCode,
                    page: '1', 
                    size: pageSize1,
                    status: this.state.status,
                    endPrice: this.state.endPrice,
                    startPrice: this.state.startPrice,
                    endTime: this.state.endTime ? Moment(this.state.endTime).format("YYYY-MM-DD") : '',
                    startTime: this.state.startTime ? Moment(this.state.startTime).format("YYYY-MM-DD") : '',
                    isHot: this.state.isHot,
                    code: this.state.inputVal
                });
            }
        })

    }
    onSelect(record, e) {
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({detailVisible: true});
    }
    componentWillMount() {
       const userData = JSON.parse(localStorage.getItem('userDetail'));
       this.props.queryList({
           page: 1, 
           size: 10, 
           userId: userData.id, 
           instCode: userData.instCode
        });
    }
    formart = (content) => {
        let self = this;
       const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys + 1,
                    code: item.code,
                    pic: item.pic ? item.pic.split(',')[0] : '',
                    name: item.name,
                    salesPriceRange: item.salesPriceRange,
                    ticketRange: item.ticketRange,
                    totalStock: item.totalStock,
                    actualSales: item.actualSales,
                    initialSales: item.initialSales,
                    upDownTime: item.upDownTime ? Moment(item.upDownTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    status: item.status,
                    seq: item.seq,
                    isHot: item.isHot,
                    id: item.id,
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
                        status: this.state.status,
                        isHot: this.state.isHot,
                        name: this.state.name,
                        startPrice: self.state.startPrice,
                        endPrice: self.state.endPrice,
                        endTime: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD") : '',
                        startTime: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD") : '',
                    });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        status: this.state.status,
                        isHot: this.state.isHot,
                        name: this.state.name,
                        startPrice: self.state.startPrice,
                        endPrice: self.state.endPrice,
                        endTime: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD") : '',
                        startTime: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD") : '',
                    });
                }
            }
        };
    }
    setSelectVal = (val) => {
        this.setState({
            inputVal: '',
            optionVal: val,
        });
    }

    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }

    //上下架时间
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

    onSelectChange =  (selectedRowKeys, selectedRows) => {
        this.setState({selectedRows});
    }
    //展开与收起
    toggleForm = () => {
        this.setState({
            showScreen: !this.state.showScreen,
            type: '',
            startPrice: '',
            endPrice: '',
            endTime: '',
            startTime: '',
            isHot: '',//是否推荐
            status: '',//上架状态
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
        this.props.queryList({userId: userData.id, page: 1, size: 10, instCode: userData.instCode})
    }
    //index组件与Detail组件传值
    closeDetail(data){
        let self = this;
        self.setState({detailVisible:false},function(){
            setTimeout(() => {
                if(data == 'amendPriceVisible') {
                    self.setState({amendPriceVisible:true})
                }
                if(data == 'amendElseVisible') {
                    self.setState({amendElseVisible:true})
                }
                if(data == 'groupVisible') {
                    self.setState({groupStatus: true, groupVisible:true})
                }
            }, 500);
        })
    }
    //index组件与AmendPrice组件传值
    closeAmendPrice(data){
        this.setState({amendPriceVisible:data},() => {
            setTimeout(() => {
                this.setState({detailVisible:true})
            }, 500)
        })
    }

    //index组件与AmendElse组件传值
    closeAmendElse(data){
        this.setState({amendElseVisible:data},() => {
            setTimeout(() => {
                this.setState({detailVisible:true})
            }, 500)
        })
    }

    //index组件与Group组件传值
    closeGroup(data){
        this.setState({groupVisible:data},() => {
            setTimeout(() => {
                this.setState({detailVisible:true})
            }, 500)
        })
    }
    //表格选中
    checkChange(params) {
        this.setState({
            checkList: params
        })
    }
    //上架 2，下架 1，推荐 3
    edit(params) {
        if(this.state.checkList.length) {
            if(params == '2') {
                this.setState({
                    title: '批量上架',
                    editType: '2',
                    visibleShow: true
                })
            } else if (params == '1') {
                this.setState({
                    title: '批量下架',
                    editType: '1',
                    visibleShow: true
                })
            } else if (params == '3') {
                this.setState({
                    title: '批量推荐',
                    editType: '3',
                    visibleShow: true
                })
            }
        } else {
            message.destroy()
            message.error('请先选择数据')
        }
    }
    amountRange(type,e) {
        if(type == 'x1') {
            this.setState({
                startPrice: e.target.value
            })
        }
        if(type == 'x2') {
            this.setState({
                endPrice: e.target.value
            })
        }
        
    }

    handleOk() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        if(self.state.editType == 4) { //复制
            
            this.props.goodsCopy({
                params: {
                    goodId: self.state.checkList.join(), 
                    userId: userData.id, 
                    instCode: userData.instCode
                },
                func: function() {
                    self.setState({
                        visibleShow: false
                    })
                    message.success('操作成功', function(){
                        self.props.queryList({page: 1, size: 10, userId: userData.id, instCode: userData.instCode});
                    })
                }
            });
        } else {
            this.props.goodsBatchUpdate({
                params: {
                    idsStr: self.state.checkList.join(), 
                    type: self.state.editType, 
                    userId: userData.id, 
                    instCode: userData.instCode
                },
                func: function() {
                    self.setState({
                        visibleShow: false,
                        checkList: []
                    })
                    message.success('操作成功', function(){
                        self.props.queryList({page: 1, size: 10, userId: userData.id, instCode: userData.instCode});
                    })
                }
            });
        }
    }
    //修改分组
    showGroup() {
        if(this.state.checkList.length) {
            this.setState({
                groupStatus: false,
                groupVisible: true
            })
        } else {
            message.destroy()
            message.error('请先选择数据')
        }
    }
    //复制商品
    copyGoods() {
        if(this.state.checkList.length) {
            if(this.state.checkList.length == 1) {
                this.setState({
                    title: '复制商品',
                    editType: '4',
                    visibleShow: true
                })
            } else {
                message.destroy()
                message.error('只能对单条数据进行操作')
            }
        } else {
            message.destroy()
            message.error('请先选择数据')
        }
       
    }
      //确定导出数据
    confirm () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        let url = `/backstage/good/exportGood?`
        let params = {
            userId: userData.id,
            [self.state.optionVal]: self.state.inputVal,
            status: self.state.status,
            isHot: self.state.isHot,
            startPrice: self.state.startPrice,
            endPrice: self.state.endPrice,
            endTime: self.state.endTime ? Moment(self.state.endTime).format("YYYY-MM-DD") : '',
            startTime: self.state.startTime ? Moment(self.state.startTime).format("YYYY-MM-DD") : '',
        }
        console.log(params)
        // 去除为空的参数
        for (let k in params) {
          if(!params[k]) {
            delete params[k]
          }
        }
        window.location.href = `${url}${qs.stringify(params)}`
        self.setState({
            modalShow: false
        })
    }
    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        // 全选
        const rowSelection = {
            selectedRowKeys: this.state.checkList,
            onChange: this.checkChange.bind(this)
        }
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col span={4}>
                        <FormItem label={(<span style={{fontSize: 14}}>价格</span>)}
                            labelCol={{ span: 4}}
                            wrapperCol={{span: 20}}>
                            <Input style={{width:'36%'}} value={this.state.startPrice} onChange={this.amountRange.bind(this,'x1')} />
                            <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                            <Input style={{width:'36%'}} value={this.state.endPrice} onChange={this.amountRange.bind(this,'x2')} />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label={(<span style={{fontSize: 14}}>上下架时间</span>)}
                            labelCol={{ span: 4}}
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
                            label={(<span style={{fontSize: 14}}>上架状态</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 12}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">下架</Option>
                                <Option value="2">上架</Option>
                                <Option value="3">预售模式</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>是否推荐</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 12}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'isHot')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">是</Option>
                                <Option value="2">否</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={3} offset={1}>
                        <Col span={9}>
                            <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                        </Col>
                        <Col span={9}>
                            <Button type="primary" onClick={() => this.setState({modalShow:true})}>导出</Button>
                        </Col>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </Col>
                </Row>
            )
        }
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="全部商品" key="1">
                            <Row>
                                <Col span={8}>
                                    <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2'}}
                                    onClick={this.edit.bind(this, '2')}
                                    >批量上架</Button>
                                    <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2', marginLeft: 10 }}
                                    onClick={this.edit.bind(this, '1')}                                    
                                    >批量下架</Button>
                                    <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2', marginLeft: 10 }}
                                    onClick={this.edit.bind(this, '3')}   
                                    >批量推荐</Button>
                                    <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2', marginLeft: 10 }} 
                                    onClick={this.showGroup.bind(this)}
                                    >批量改分组</Button>
                                    <Button type="primary" 
                                    style={{backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2', marginLeft: 10 }}
                                    onClick={this.copyGoods.bind(this)}                                    
                                    >复制商品</Button>
                                </Col>
                                <Col span={13}>
                                    <InputGroup compact>
                                    {getFieldDecorator('type', {initialValue: 'code'})(
                                        <Select style={{ width: '13%' }} onChange={this.setSelectVal.bind(this)}>
                                            <Option value="code">商品编号</Option>
                                            <Option value="name">商品名称</Option>
                                        </Select>
                                    )}
                                    <Input style={{ width: '31%' }} 
                                        maxLength={50}
                                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        value={this.state.inputVal} 
                                        onChange={(e)=> this.setState({inputVal:e.target.value})}
                                        placeholder="输入搜索内容" />
                                    </InputGroup>
                                </Col>
                                <Col span={3} style={{display:showScreen?'none':''}}>
                                    <Col span={9}>
                                        <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                                    </Col>  
                                    <Col span={9}>
                                        <Button type="primary" onClick={() => this.setState({modalShow:true})}>导出</Button>
                                    </Col>
                                    <Col>
                                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                                        展开 <Icon type="down" />
                                        </a>
                                    </Col>
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
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={content.data}
                            rowKey={record => record.id}
                            onRow={(record) => ({
                                onClick: this.onSelect.bind(this, record)
                              })
                            }
                            pagination={content.pagination}
                            bordered
                            size="middle"/>
                    </Row>
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.visibleShow}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this, 'visibleShow')}
                    >
                    <p style={{fontSize:16}}>确定{this.state.title}商品?</p>
                </Modal>

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
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} match={this.props.match.params.id} />
                </Drawer>

                <Drawer
                    title="修改价格/库存"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'amendPriceVisible')}
                    maskClosable={false}
                    visible={this.state.amendPriceVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <AmendPrice search={this.search.bind(this)} closeAmendPrice={this.closeAmendPrice.bind(this)} />
                </Drawer>

                <Drawer
                    title="其他修改"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'amendElseVisible')}
                    maskClosable={false}
                    visible={this.state.amendElseVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <AmendElse search={this.search.bind(this)} closeAmendElse={this.closeAmendElse.bind(this)} />
                </Drawer>

                <Drawer
                    title="修改分组"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'groupVisible')}
                    maskClosable={false}
                    visible={this.state.groupVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Group search={this.search.bind(this)} closeGroup={this.closeGroup.bind(this)} checkList={this.state.checkList} groupStatus={this.state.groupStatus}/>
                </Drawer>
                <Modal
                    title="导出数据"
                    visible={this.state.modalShow}
                    onOk={this.confirm.bind(this)}
                    onCancel={this.handleCancel.bind(this, 'modalShow')}
                    >
                    <p style={{fontSize:16}}>确定导出全部数据?</p>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.goodsManage.list,
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'goodsManage/goodsList', payload})
        },
        goodsBatchUpdate(payload = {}) {
            dispatch({type: 'goodsManage/goodsBatchUpdate', payload})
        },
        goodsCopy(payload = {}) {
            dispatch({type: 'goodsManage/goodsCopy', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'goodsManage/save', payload})
        },

    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
