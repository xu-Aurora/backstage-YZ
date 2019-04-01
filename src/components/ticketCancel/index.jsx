import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Table,Card, Avatar,Modal,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';
import Moment from 'moment';
import $ from 'jquery';

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Search = Input.Search;
const { Meta } = Card;

function siblingElems(elem) {
    elem.siblings().css("background-color",'#fff')
};


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleShow: false,
        };
    }
    // componentWillMount() {
    //     const userData = JSON.parse(localStorage.getItem('userDetail'));
    //     this.props.queryList({
    //         instCode: userData.instCode,
    //         page: 1, 
    //         size: 10, 
    //         userId: userData.id,
    //     });
    // }

    //根据核销码查询数据
    handleSearch(){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            userId: userData.id, 
            instCode: userData.instCode,
            writeOffCode: this.state.inputVal,
        });
    }
    onSelect = (record, e) => {
        $(e.target).parents('tr').css("background-color",'#e6fcff')
        siblingElems($(e.target).parents('tr'));
    }

    formart = (content) => {
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
            data
        };
    }

    //确定核销
    handleOk = () => {
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.writeOff({
            params: {
                id: this.state.cancelData.id,
                status: this.state.cancelData.id,
                verificationInstitutionCode: userData.instCode,
                verificationInstitutionName: userData.instName,
                writeOffCode: this.state.cancelData.writeOffCode,
                verificationUserName: userData.name,
                userId: userData.id,
            },
            func: function () {
                message.success('操作成功', 1.5, ()=>{
                  self.props.queryList({
                    userId: userData.id,
                    page: 1,
                    size: 10,
                    instCode: userData.instCode
                  });
                  self.setState({visibleShow: false})
                });
            }
        })
    }

      

    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];

        const columns = [
            {
                title: '卡券信息',
                dataIndex: 'content',
                key: 'content',
                width: 550,
                render: (value, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{marginRight:'18%'}}>卡券编号 : {record.alldata.couponCode}</span>
                                <span>发券时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                            </div>
                            <div>
                                <Card bordered={false}>
                                    <Meta
                                        avatar={<Avatar src={`/backstage/upload/download?uuid=${record.alldata.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
                                        title={ record.alldata.couponName }
                                        description={
                                            <Col>
                                                <Col span={16}>
                                                    { record.alldata.details }
                                                </Col>
                                            </Col>
                                        }
                                    />
                                    <p>{ record.alldata.institutionName }</p>
                                </Card>
                            </div>
                        </div>
                    )
                }
            },
            {
                title: '用户信息',
                dataIndex: 'orderNo',
                key: 'orderNo',
                render: (text, record) => {
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span>券来源：{ record.alldata.userName }</span>
                            </div>
                            <div>
                                <div>{record.alldata.userAccount}</div>
                            </div>
                        </div>
                    )
                }
            }, 
            {
                title: '核销码',
                dataIndex: 'userName',
                key: 'userName',
                render: (text, record) => {
                    let code = record.alldata.writeOffCode;
                    let writeOffCode = `${code.slice(0,4)} ${code.slice(4,8)} ${code.slice(8,12)}`;
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                <div style={{marginBottom:10,fontWeight:700,fontSize:22}}>{ writeOffCode }</div>
                                <div>有效期至 { Moment(record.expireTime).format("YYYY-MM-DD HH:mm:ss") }</div>
                            </div>
                            
                        </div>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'phone',
                key: 'phone',
                width:'10%',
                render: (text, record) => {
                    let status = record.alldata.status;
                    let operation;
                    if(status == '1'){
                        operation = <Button 
                                        type="primary" 
                                        onClick={ () => this.setState({visibleShow: true,cancelData: record.alldata}) }
                                        >确定核销</Button>
                    }
                    if(status == '2'){
                        operation = <div>
                            <p style={{fontWeight:700,fontSize:16,marginBottom:10}}>已核销</p>
                            <p>{ record.alldata.verificationUserId }</p>
                            <p>{ Moment(record.alldata.verificationTime).format("YYYY-MM-DD HH:mm:ss") }</p>
                        </div>
                    }
                    if(status == '3'){
                        operation = <div style={{fontWeight:600}}>已过期</div>
                    }
                    return (
                        <div>
                            <div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
                                <span style={{visibility:"hidden"}}>订单编号 : </span>
                            </div>
                            <div>
                                { operation }
                            </div>
                            
                        </div>
                    )
                }
            }, 
        ];

        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="卡券核销" key="1">
                            <Row>
                                <InputGroup compact>
                                    {getFieldDecorator('type', {initialValue: '核销码'})(
                                        <Input disabled style={{width:75,fontWeight:700,color:'#333333'}} placeholder="请输入核销码" />
                                    )}
                                        <Search
                                        style={{ width: 280 }}
                                        value={this.state.inputVal} 
                                        onChange={(e)=> this.setState({inputVal:e.target.value})}
                                        maxLength={50}
                                        placeholder="请输入核销码"
                                        onSearch={ this.handleSearch.bind(this) }
                                        enterButton
                                        />
                                </InputGroup>
                            </Row>
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: "5px 24px 24px 24px", backgroundColor: "#FFF",marginTop: 20}}>
                    <Row>
                        <Table
                            style={{tableLayout:'fixed'}}
                            columns={columns}
                            dataSource={content.data}
                            rowKey={record => record.alldata.id}
                            onRow={(record) => {return {onClick: this.onSelect.bind(this, record)}}}
                            bordered
                            size="middle"/>
                    </Row>
                </div>


                <Modal
                    title="核销卡券"
                    visible={this.state.visibleShow}
                    onOk={this.handleOk}
                    onCancel={ () => this.setState({visibleShow: false}) }
                    >
                    <p style={{fontSize:16}}>确定核销?</p>
                </Modal>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.ticketDetail.list,
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload, params) {
            dispatch({type: 'ticketDetail/search', payload})
        },
        writeOff(payload, params) {     //核销卡券
            dispatch({type: 'ticketDetail/writeOff', payload})
        },
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
