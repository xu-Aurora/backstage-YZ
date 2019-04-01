import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Icon,Table,Select,DatePicker,Modal,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';


const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

let pageSize1 = 10;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            showScreen: false,
            visibleShow: false,
            pickingTimeStart: '',
            pickingTimeEnd: ''
        };
    }
    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({  //自提点列表
            page: 1, 
            size: 10, 
            userId: userData.id,
            selfRaisingId: JSON.parse(localStorage.getItem('selfRaisingValue'))
        });
        this.props.querySelfFetch({  //自提点
            userId: userData.id
        });
    }
    regx(item){
        //正则匹配只能输入数字
        let regNum = /^[0-9]*$/;
        //手机号码正则
        let regPhone = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
        if(!JSON.parse(localStorage.getItem('selfRaisingValue'))){
            message.warning('请选择自取点');
            return false;
        }
        if(item.orderNo){
            if(!regNum.test(item.orderNo)){
                message.warning('订单编号只能输入数字');
                return false;
            }
        }
        if(item.receiptPhone){
            if(!regPhone.test(item.receiptPhone)){
                message.warning('取件人电话只能输入数字');
                return false;
            }
        }
        return true;
    }

    handleSearch = () => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            let reg = this.regx(values);
            if(reg){
                this.props.queryList({
                    userId: userData.id, 
                    page: '1', 
                    size: pageSize1,
                    ...values,
                    status: this.state.status,
                    selfRaisingId: JSON.parse(localStorage.getItem('selfRaisingValue')),
                    pickingTimeStart: this.state.pickingTimeStart?Moment(this.state.pickingTimeStart).format("YYYY-MM-DD"):'',
                    pickingTimeEnd: this.state.pickingTimeEnd?Moment(this.state.pickingTimeEnd).format("YYYY-MM-DD"):'',
                });
            }

        })

    }

    formart = (content) => {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        if (content.list) {
            content.list.forEach((item, keys) => {
                let key = keys + 1;
                if (content.pageNum > 1) {
                    key = (content.pageNum - 1) * content.pageSize + key;
                }
                data.push({
                    keys: key,
                    orderNo: item.orderNo,
                    receiptName: item.receiptName,
                    receiptPhone: item.receiptPhone,
                    receiptAccount: item.receiptAccount,
                    selfRaisingName: item.selfRaisingName,
                    pickUpNo: item.pickUpNo,
                    status: item.status,
                    pickOperator: item.pickOperator,
                    confirmArrivalTime: item.confirmArrivalTime ? Moment(item.confirmArrivalTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    completeTime: item.completeTime ? Moment(item.completeTime).format("YYYY-MM-DD HH:mm:ss") : '',
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
                        selfRaisingId: JSON.parse(localStorage.getItem('selfRaisingValue')),
                        type: this.state.type
                       });
                },
                onChange: (current, pageSize) => {
                 this.props.queryList({
                        userId: userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        selfRaisingId: JSON.parse(localStorage.getItem('selfRaisingValue')),
                        type: this.state.type
                       });
                }
            }
        };
    }
    handleSelect(value){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        localStorage.setItem('selfRaisingValue', JSON.stringify(value));
        this.props.queryList({
            page: 1, 
            size: 10, 
            userId: userData.id,
            selfRaisingId: value
        })
    }

    handleSelectChange(type, value) {
        this.setState({[type]: value})
    }

    //自取时间
    timeRange (type, date) {
        let time;
        if(date){
            time = date._d.getTime();
        }
        if (type === 'x1') {
            this.setState({pickingTimeStart: time})
        }
        if (type === 'x2') {
            this.setState({pickingTimeEnd: time})
        }
    }

    //展开与收起
    toggleForm = () => {
        this.setState({
            showScreen: !this.state.showScreen,
            pickingTimeStart: '',
            pickingTimeEnd: '',
            status: '',
        });
    };
    //点击清空数据
    handleEmpty(){
        this.props.form.setFieldsValue({
            orderNo: '',
            receiptName: '',
            receiptPhone: '',
            pickUpNo: '',
        })
    }
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

    handleOk = () => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(this.state.requestStatus){
            this.setState({requestStatus: false},() => {
                this.props.confirmReceiptPc({
                    params: {
                        userId: userData.id,
                        orderNo: this.state.orderNo,
                        pickOperator: userData.name
                    },
                    func: () => {
                        message.success('操作成功', ()=>{
                            this.props.queryList({  //自提点列表
                                page: 1, 
                                size: 10, 
                                userId: userData.id,
                                selfRaisingId: JSON.parse(localStorage.getItem('selfRaisingValue'))
                            });
                        });
                        this.setState({visibleShow: false})

                    }
                })
            })

        }

    }

    render() {
        const {data,selfFetchData} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xl: { span: 3 },xxl: { span: 2 }},
            wrapperCol: {xl: { span: 21 },xxl: { span: 22 }}
          };
        const content = data ? this.formart(data) : [];
        const contents = selfFetchData ? selfFetchData : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col xl={6} xxl={4}>
                        <FormItem
                            label="状态"
                            labelCol={{span: 4}}
                            wrapperCol={{span: 13}}>
                            <Select
                                defaultValue={""}
                                onChange={this.handleSelectChange.bind(this, 'status')}
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="3">待自取</Option>
                                <Option value="4">已自取</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col xl={12} xxl={14}>
                        <FormItem label="自取时间" {...formItemLayout}>
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

                    <Col span={3} style={{textAlign:'center'}} offset={3}>
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
                title: '编号',
                dataIndex: 'keys',
                key: 'keys',
                width: 60
            }, {
                title: '订单编号',
                dataIndex: 'orderNo',
                key: 'orderNo',
                width: 180
            }, {
                title: '确认到货时间',
                dataIndex: 'confirmArrivalTime',
                key: 'confirmArrivalTime',
                width: 180
            }, {
                title: '取件人',
                dataIndex: 'receiptName',
                key: 'receiptName'
            },{
                title: '取件人电话',
                dataIndex: 'receiptPhone',
                key: 'receiptPhone',
            }, {
                title: '取件人账号',
                dataIndex: 'receiptAccount',
                key: 'receiptAccount'
            }, {
                title: '自提点名称',
                dataIndex: 'selfRaisingName',
                key: 'selfRaisingName'
            }, {
                title: '自取编号',
                dataIndex: 'pickUpNo',
                key: 'pickUpNo',
            }, {
                title: '自取时间',
                dataIndex: 'completeTime',
                key: 'completeTime',
                width: 180
            }, {
                title: '操作人',
                dataIndex: 'pickOperator',
                key: 'pickOperator'
            }, {
                title: '操作',
                dataIndex: 'status',
                key: 'status',
                render: (item,record) => {
                    return item == '3' ? 
                        <Button type="primary" 
                            onClick={ (e) => {
                                e.stopPropagation();
                                this.setState({
                                    visibleShow: true,
                                    orderNo: record.orderNo,
                                })
                            } }>取件确认</Button> : '已自取'
                }
            }
        ];

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="自取订单" key="1">
                            <Row>
                                <Col xl={17} xxl={19}>
                                    <Select 
                                        placeholder="请选择"
                                        style={{ width: '17%',marginRight: 10 }}
                                        defaultValue={ JSON.parse(localStorage.getItem('selfRaisingValue')) }
                                        onChange={ this.handleSelect.bind(this) }>
                                        {
                                            contents ? contents.map((item) => (
                                                <Option key={item.id} value={item.id}>{ item.address }</Option>
                                            )) : ( <Option value={' '}>暂无数据</Option> )
                                        }
                                    </Select>
                                    {getFieldDecorator('orderNo')(
                                        <Input placeholder="订单编号" style={{ width: '14%',marginRight: 10 }} />
                                    )}
                                    {getFieldDecorator('receiptName')(
                                        <Input placeholder="取件人" style={{ width: '14%',marginRight: 10 }} />
                                    )}
                                    {getFieldDecorator('receiptPhone')(
                                        <Input placeholder="取件人电话" style={{ width: '14%',marginRight: 10 }} />
                                    )}
                                    {getFieldDecorator('pickUpNo')(
                                        <Input placeholder="自取编码" style={{ width: '14%' }} />
                                    )}
                                </Col>

                                <Col xl={7} xxl={5} style={{display:showScreen?'none':'',textAlign:'right'}}>
                                    <Button type="primary" style={{marginRight:10}} onClick={this.handleSearch.bind(this)}>确定</Button>
                                    <Button type="primary" style={{marginRight:10}} onClick={ this.handleEmpty.bind(this) }>清空</Button>
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
                            rowKey={record => record.orderNo}
                            pagination={content.pagination}
                            bordered
                            size="middle"/>
                    </Row>
                </div>

                <Modal
                    title="取件确认"
                    visible={this.state.visibleShow}
                    onOk={this.handleOk}
                    onCancel={ () => this.setState({visibleShow: false})}
                    >
                    <p style={{fontSize:16}}>是否确认买家已自取？</p>
                </Modal>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.selfFetchManage.list,
        selfFetchData: state.selfFetchManage.selfFetch,
        loading: !!state.loading.models.selfFetchManage
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'selfFetchManage/serch', payload})
        },
        querySelfFetch(payload = {}) {
            dispatch({type: 'selfFetchManage/querySelfFetch', payload})
        },
        confirmReceiptPc(payload = {}) {
            dispatch({type: 'selfFetchManage/confirmReceiptPc', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'selfFetchManage/save', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
