import React, {Component} from 'react';
import {Input,Button,Form,Row,Col,Icon,Table,Drawer,Select,DatePicker} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import $ from 'jquery';

import Detail from './detail.jsx';
import Add from './add.jsx';
import Edit from './edit.jsx';
import Area from './area.jsx';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

function siblingElems(elem) {

    elem.siblings().css("background-color",'#fff')
  
};

let pageSize1 = 10;

const columns = [
    {
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text, record)=>{
            if(record.defaultStatus) {
                return (
                    <div>{`${record.templateName}【默认模板】`}</div>
                )
            } else {
                return (
                    <div>{record.templateName}</div>
                )
            }
        }
    }, {
        title: '配送区域',
        dataIndex: 'distributionAreaName',
        key: 'distributionAreaName',
        render: (text, record) => {
            let children = record.freightTemplateAreas.map((item, index)=>
               <div key={index} style={{minHeight: '50px'}}>{item.distributionAreaName}</div>
            )
            return children
        }
    }, {
        title: '运费',
        dataIndex: 'freightTemplateAreas',
        key: 'freightTemplateAreas',
        render: (text, record) => {
            let children = record.freightTemplateAreas.map((item, index)=>
                <Row key={index}>
                <Col span={6}>
                    <div style={{marginBottom:5}}>首件(个)</div>
                    <div>{item.firstPrice}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>运费(元)</div>
                    <div>{item.firstPriceFreight}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>续件(个)</div>
                    <div>{item.continuation}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>续费(元)</div>
                    <div>{item.continuationFreight}</div>
                </Col>
                </Row>
            )
            return children
        }
    }, {
        title: '最后编辑时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    }
];


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            orderNo: '',
            phoneNo: '',
            editVisible: false,
            addVisible: false,
            type: '',
            inputVal: '',
            optionVal:'templateName',
            areaVisible: false,
            visible: true //代表新增还是编辑
        };
    }
    handleSearch() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
          if (values.type == 'templateName') {
            this.props.queryList({
              userId: userData.id, 
              templateName: this.state.inputVal,
              page: '1',
              size: pageSize1,
              setType: 2,
              instCode: userData.instCode
            });
          }
        })
    }
    onSelect = (record, e) => {
        $(e.target).parents('tr').css("background-color",'#e6fcff')
        console.log(e.target)
        siblingElems($(e.target).parents('tr'));
        this.props.saveSelect(record.alldata);
        this.setState({
            detailVisible: true
        });
    }

    formart = (content) => {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                data.push({
                    keys: keys,
                    id: item.id,
                    templateName: item.templateName,
                    defaultStatus: item.defaultStatus,
                    freightTemplateAreas: item.freightTemplateAreas,
                    updateTime: item.updateTime ? Moment(item.updateTime).format("YYYY-MM-DD") : '',
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
                        setType: 2,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        instCode: userData.instCode
                       });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        setType: 2,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        instCode: userData.instCode
                       });
                }
            }
        };
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
            this.setState({startTime: time})
        }
        if (type === 'x2') {
            this.setState({endTime: time})
        }
    }

    handleSelectChange(type, value) {
        this.setState({[type]: value})
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
        this.props.queryList({userId: userData.id, page: 1, size: 10})
    }
    //index组件与Detail组件传值
    closeDetail(){
        let self = this;
        self.setState({detailVisible:false},() => {
          setTimeout(() => {
            self.setState({
              editVisible: true
            })
          },500)
        })
    }
    closeAdd(){
      this.setState({
        addVisible: false
      })
    }
    closeEdit(){
      this.setState({
        editVisible: false
      })
    }
      
    openArea(params) {
        // this.setState({
        //     // [params]: false,
        //     visible: params == 'addVisible' ? true : false
        // },()=>{
            // setTimeout(() => {
                this.setState({
                    areaVisible: true
                })
            // },500)
           
        // })
    }
    closeArea(params) {
        this.setState({
            areaVisible: false
        },()=>{
            // if(this.state.visible) {
            //     this.setState({
            //         addVisible: true
            //     })
            // } else {
            //     this.setState({
            //         editVisible: true
            //     })
            // }
            
        })       
    }
    addFreight() {
        this.props.setList({
            provinceCodeList: [],
            cityCodeList: [],
            allNameList: []
        })
        this.setState({
            addVisible: true
        })

    }
    inputChange (ev) {
        this.setState({
            inputVal: ev.target.value
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
                    <Col span={7}>
                        <FormItem label={(<span style={{fontSize: 14}}>下单时间</span>)}
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
                    <Col span={3}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>订单来源</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'source')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">悦站APP</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>支付方式</span>)}
                            labelCol={{span: 7}}
                            wrapperCol={{span: 14}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'payType')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="1">线上支付-微信</Option>
                                <Option value="2">线上支付-支付宝</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>配送方式</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'deliveryType')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">商家配送</Option>
                                <Option value="1">快递</Option>
                                <Option value="2">用户自取</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={3}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>订单状态</span>)}
                            labelCol={{span: 9}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">待付款</Option>
                                <Option value="1">待配送</Option>
                                <Option value="2">配送中</Option>
                                <Option value="3">交易完成</Option>
                                <Option value="4">已关闭</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={2}>
                      <Col span={13}>
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
            <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
                <div className={styles.search}>
                    <Row>
                        <Col span={2}>
                          <Button type="primary"
                            onClick={this.addFreight.bind(this)} 
                            style={{marginRight: 20,backgroundColor:'#FFF',color:'#377FC2',borderColor:'#377FC2'}}>新增运费模板</Button>
                        </Col>
                        <Col span={6}>
                            <InputGroup compact>
                                {getFieldDecorator('type', {initialValue: 'templateName'})(
                                    <Select style={{ width: 114}} onChange={this.setSelectVal.bind(this)}>
                                        <Option value="templateName">模板名称</Option>
                                    </Select>
                                )}
                                <Input style={{ width: 240}} 
                                    maxLength={50}
                                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                    value={this.state.inputVal} 
                                    onChange={this.inputChange.bind(this)} 
                                    placeholder="输入搜索内容" />
                            </InputGroup>
                        </Col>
                        <Col >
                            <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>                                    
                        </Col>
                    </Row>
                    {selectElemnt}
                </div>
                <div style={{height: 6}}></div>
                <div style={{height: 14,backgroundColor: '#ccc'}}></div>
                <div style={{width: '100%',padding: "5px 24px 24px 24px", backgroundColor: "#FFF"}}>
                    <Row>
                        <Table
                            loading={this.props.loading}
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
                <Drawer
                  title="选择地区"
                  width="45%"
                  placement="right"
                  onClose={this.handleCancel.bind(this, 'areaVisible')}
                  maskClosable={false}
                  destroyOnClose
                  visible={this.state.areaVisible}
                  style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53,zIndex: 9999}}
                  >
                  <Area closeArea={this.closeArea.bind(this)}/>
                  {/* <Edit search={this.search.bind(this)} closeEdit={this.closeEdit.bind(this)} /> */}
                </Drawer>  
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
                    <Detail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)}  openArea={this.openArea.bind(this)}/>
                </Drawer>

                <Drawer
                  title="新增运费模板"
                  width="45%"
                  placement="right"
                  onClose={this.handleCancel.bind(this, 'addVisible')}
                  maskClosable={false}
                  destroyOnClose
                  visible={this.state.addVisible}
                  style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                  >
                  <Add search={this.search.bind(this)} closeAdd={this.closeAdd.bind(this)} openArea={this.openArea.bind(this)} />
                </Drawer>

                <Drawer
                  title="编辑"
                  width="45%"
                  placement="right"
                  onClose={this.handleCancel.bind(this, 'editVisible')}
                  maskClosable={false}
                  destroyOnClose
                  visible={this.state.editVisible}
                  style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                  >
                  <Edit search={this.search.bind(this)} closeEdit={this.closeEdit.bind(this)} openArea={this.openArea.bind(this)}/>
                </Drawer>

                             
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.dispatchSet.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.routerField
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'dispatchSet/serch', payload})
        },
        queryDispatchSet(payload, params) {
            dispatch({type: 'dispatchSet/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'dispatchSet/save', payload})
        },
        setList(payload = {}) {
            dispatch({type: 'area/setList', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
