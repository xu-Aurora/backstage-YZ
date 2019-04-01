import React, {Component} from 'react';
import {Input,Select,Tabs,Button,Row,Form,message,TreeSelect} from 'antd';
import {connect} from 'dva';
import Style from './style.less';

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const userData = JSON.parse(localStorage.getItem('userDetail'));

const treeData = [
    {
      title: '普通通道',
      value: '00',
      key: '00',
      disabled: true,
      children: [{title: '下单',value: '0000',key: '0000'}]},
    {
      title: '支付通道',
      value: '01',
      key: '01',
      disabled: true,
      children: [
        {title: '提现',value: '0101',key: '0101'}, 
        {title: '充值',value: '0102',key: '0102'}, 
        {title: '冲退',value: '0103',key: '0103'}, 
        {title: '退票',value: '0104',key: '0104'}, 
        {title: '支付',value: '0105',key: '0105'}, 
        {title: '对账',value: '0106', key: '0106'}
      ]
    }, 
    {
      title: '收单通道',
      value: '02',
      key: '02',
      disabled: true,
      children: [
        {title: '下单',value: '0201',key: '0201'}, 
        {title: '查询',value: '0202',key: '0202'}, 
        {title: '关闭',value: '0203',key: '0203'}, 
        {title: '撤销',value: '0204',key: '0204'}, 
        {title: '退款',value: '0205',key: '0205'}, 
        {title: '对账',value: '0206',key: '0206'}
      ]
    }, 
    {
      title: '解绑卡通道',
      value: '03',
      key: '03',
      disabled: true,
      children: [
        {title: '新增',value: '0301',key: '0301'}, 
        {title: '解绑',value: '0302',key: '0302'}, 
        {title: '获取短信',value: '0303',key: '0303'}
      ] 
    }
]

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestStatus: true,
            isBatch: '',
            status: ''
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
       
        this.props.queryDetails({
                id: this.props.argument.id,
                userId: userData.id
        });
    }
    update() {
        const self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            let rex = this.regx()
            if (rex) {
                if(this.state.requestStatus){
                    self.setState({requestStatus: false},() => {
                            this.props.update({
                                params: {
                                    id: this.props.argument.id,
                                    userId: userData.id,
                                    isBatch: self.state.isBatch,
                                    status: self.state.status,
                                    ...values
                                },
                                func: function () {
                                    message.success('操作成功', 1.5, ()=>{
                                        self.props.search('editVisible')
                                        
                                    });
                                }
                            })
                    })
                }
            }


        })
        
    }
    regx () {
        let value = (this.props.form.getFieldsValue())

        if (!value.apiCode) {
            message.error('api编码不能为空')
            return false
        }
        if (!value.apiName) {
            message.error('api名称不能为空')
            return false
        }
        if (!value.apiVersion) {
            message.error('api版本不能为空')
            return false
        }
        if (value.cardTypeList === undefined) {
            message.error('请选择卡类型')
            return false
        }
        if (!value.channelCode) {
            message.error('通道编码不能为空')
            return false
        }
        if (value.channelType === undefined) {
            message.error('请选择调用类型')
            return false
        }
         if (!value.instCode) {
            message.error('机构编码不能为空')
            return false
        }
        if (value.type === undefined) {
            message.error('请选择通道类型')
            return false
        }
        if (!value.preUrl) {
            message.error('前置服务地址不能为空')
            return false
        }
         if (value.settleType === undefined) {
            message.error('请选择清算类型')
            return false
        }
        return true
    }
    tabChange (type,item) {
        this.setState({
          [type]: item
        })
    }
    render() {
        const {data} = this.props;
        const {getFieldDecorator} = this.props.form;
        const content = data || {};
       
        
        return (
            <div className={Style.userBox}>
                <div style={{width: '100%',backgroundColor: "#FFF"}}>
                    {
                        this.state.requestStatus ? <Button type="primary" onClick={this.update.bind(this)}>保存</Button> :
                        <Button type="primary">保存</Button>
                    }
                    
                    <Row>
                        <table cellSpacing="0" className={Style.mytable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>api编码</td>
                                    <td>
                                        <span>{getFieldDecorator('apiCode', {
                                                initialValue: content.apiCode || null
                                            })(<Input  />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>api名称</td>
                                    <td>
                                        <span>{getFieldDecorator('apiName', {
                                                initialValue: content.apiName || null
                                            })(<Input  />)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>api版本</td>
                                    <td>
                                        <span>{getFieldDecorator('apiVersion', {
                                                initialValue: content.apiVersion || null
                                            })(<Input  />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>卡类型</td>
                                    <td>
                                        <span>{getFieldDecorator('cardTypeList', {
                                                initialValue: `${content.cardTypeList}` || null
                                            })(
                                                <Select style={{width:'100%'}} placeholder="请选择">
                                                    <Option value="0">借记卡</Option>
                                                    <Option value="1">贷记卡</Option>
                                                </Select>
                                            )}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>通道编码</td>
                                    <td>
                                        <span>{getFieldDecorator('channelCode', {
                                                initialValue: content.channelCode || null
                                            })(<Input  />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>调用类型</td>
                                    <td>
                                        <span>{getFieldDecorator('channelType', {
                                                initialValue: `${content.channelType}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择">
                                                <Option value="0">同步调用</Option>
                                                <Option value="1">异步调用</Option>
                                            </Select>
                                        )}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td><span className={Style.red}>*</span>机构编码</td>
                                    <td>
                                        <span>{getFieldDecorator('instCode', {
                                                initialValue: content.instCode || null
                                            })(<Input  />)}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>批量接口</td>
                                    <td>
                                        <Tabs activeKey={this.state.isBatch?this.state.isBatch:String(content.isBatch)} onTabClick={this.tabChange.bind(this,'isBatch')}>
                                            <TabPane tab="启用" key="0"></TabPane>
                                            <TabPane tab="禁用" key="1"></TabPane>
                                        </Tabs>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span className={Style.red}>*</span>通道类型</td>
                                    <td>
                                        <span>{getFieldDecorator('type', {
                                                initialValue: `${content.type}` || null
                                            })(
                                            <Select style={{width:'100%'}} placeholder="请选择" >
                                                <Option value="00">普通通道</Option>
                                                <Option value="01">支付通道</Option>
                                                <Option value="02">收单通道</Option>
                                                <Option value="03">解绑卡通道</Option>                                                   
                                            </Select>
                                        )}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>前置服务地址</td>
                                    <td>
                                        <span>{getFieldDecorator('preUrl', {
                                                initialValue: content.preUrl || null
                                            })(<Input  />)}</span>
                                    </td>
                                </tr>
                                    <tr>
                                    <td>
                                        <span className={Style.red}>*</span>清算类型</td>
                                    <td>
                                        <span>{getFieldDecorator('settleType', {
                                                initialValue: `${content.settleType}` || null
                                            })(
                                        <TreeSelect
                                            style={{width:'100%'}} placeholder="请选择"
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={treeData}
                                            treeDefaultExpandAll
                                        />
                                        )}</span>
                                    </td>
                                    <td>
                                        <span className={Style.red}>*</span>状态</td>
                                    <td>
                                        <Tabs activeKey={this.state.status?this.state.status:String(content.status)} onTabClick={this.tabChange.bind(this,'status')}>
                                            <TabPane tab="启用" key="0"></TabPane>
                                            <TabPane tab="禁用" key="1"></TabPane>
                                        </Tabs>

                                    </td>
                                </tr>
                                <tr>
                                    <td>备注</td>
                                    <td style={{borderRight:'1px solid #A2A2A2'}}>
                                        <div>
                                            {getFieldDecorator('memo', {
                                                initialValue: content.memo || null
                                            })(<Input  />)}
                                        </div>
                                    </td>
                                    <td colSpan='2'></td>
                                </tr>
                            </tbody>
                        </table>
                    </Row>
                </div>
              
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {data: state.channelAPI.ItemDetail, argument: state.channelAPI.saveSeslect, linkID: state.login.userMsg.id}
}

function dispatchToProps(dispatch) {
    return {
        queryDetails(payload = {}) {
            dispatch({type: 'channelAPI/instDetail', payload})
        },
        update(payload = {}) {
            dispatch({type: 'channelAPI/update', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));