import React, { Component } from 'react';
import {Input,Button,Form,Row,Table,Select,Card,Modal,message} from 'antd';

import {connect} from 'dva';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Style from './detail.less';

const { Meta } = Card;

const columns = [
  {
      title: '序号',
      dataIndex: 'keys',
      key: 'keys',
      width: 60
  }, {
      title: '商品编号',
      dataIndex: 'code',
      key: 'code',
  }, {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name'
  }, {
      title: '总销量',
      dataIndex: 'num',
      key: 'num',
      render: (text, record)=>{
        return record.initialSales + record.actualSales
     }
  },{
      title: '本月销量',
      dataIndex: 'nums',
      key: 'nums'
     
  }
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      delVisibleShow: false,
      caption: '',
      title: '',
      status: ''
    };
  }

  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id,
      instCode: userData.instCode
    });
    this.props.getInstitutions({userId : userData.id, code: userData.instCode});
  }

  handleOk = (e) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));


  }
  handleOk1 = (e) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));


  }


  //点击跳转编辑页面
  goEdit(){
    this.props.goEdit(true)
  }
  show(params, data) {
    let caption = ''
    if(data == 'end') {
      caption = '禁用'
    } else if(data == 'start') {
      caption = '启用'
    }
    this.setState({
      caption, 
      [params]: true
    })
  }
  handleCancel(params) {
    this.setState({
      [params]: false
    })
  }
  setting (data) {
 
    let status
    let title = ''
    if(data == 'start') {
      status = true
      title='启用'
    } else if(data == 'end') {
      status = false
      title='禁用'
    }
    this.setState({
      title,
      status,
      visibleShow: true
    })


  }
  //删除
  delOk() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.setState({
      delVisibleShow: false
    })
    self.props.deleteSupplier({
      params:{
        userId: userData.id, 
        id: this.props.argument.id,
      },
      func:function() {
        message.success('操作成功!', 1.5, function() {
          self.props.search('detailVisible')
        });
      }
    });
  }
  // 启用禁用
  handelClck() { 
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
    self.setState({
      visibleShow: false
    })
    self.props.updateSupplier({
      params:{
        userId: userData.id, 
        id: this.props.argument.id,
        status: this.state.status,
      },
      func:function() {
        message.success('操作成功!', 1.5, function() {
          self.props.search('detailVisible')
        });
      }
    });
  }
  formart = (content) => {
    let self = this;
    const data = [];
    content.forEach((item, keys) => {
        data.push({
            keys: keys+1,
            id: item.id,
            code: item.code,
            name: item.name,
            actualSales: item.actualSales,
            initialSales: item.initialSales,
        })
    });
    return data
}
  render() {
    const {data} = this.props
    const content = data ? data.supplier : {}
    const dataSource = data ? this.formart(data.good) : []
    const { getFieldDecorator } = this.props.form
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
            <Row>
              <Button type="primary" onClick={this.goEdit.bind(this)}>编辑</Button>
              <Button type="primary" 
                  onClick={this.show.bind(this, 'delVisibleShow')}
                  style={{backgroundColor:'#EB000E',borderColor:'#EB000E'}}>删除</Button>
              {content.status ? 
                (<Button onClick={this.setting.bind(this, 'end')}>禁用</Button>):
                (<Button onClick={this.setting.bind(this,'start')}>启用</Button>)
              }    
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>供应商编号</td>
                    <td>
                      {getFieldDecorator('code', {initialValue: content.code})(
                        <Input placeholder="请输入供应商名称" disabled/>
                      )}
                    </td>
                    <td><span className={Style.red}>*</span>供应商名称</td>
                    <td>
                      {getFieldDecorator('name', {initialValue: content.name})(
                        <Input placeholder="请输入供应商名称" disabled/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>负责人</td>
                    <td>
                      {getFieldDecorator('responsiblePerson', {initialValue: content.responsiblePerson})(
                        <Input placeholder="请输入负责人名称" disabled/>
                      )}
                    </td>
                    <td><span className={Style.red}>*</span>联系电话</td>
                    <td>
                      {getFieldDecorator('mobile', {initialValue: content.mobile})(
                        <Input placeholder="请输入负责人电话" disabled/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>供应商类型</td>
                    <td>
                      {getFieldDecorator('type', {initialValue: content.type})(
                        <Select placeholder="请选择供应商类型" style={{width: '100%'}} disabled>
                          <Option value="1">商城合作商-生鲜类</Option>
                          <Option value="2">服务合作商-家电维修类</Option>
                        </Select>
                      )}
                    </td>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td>
                      {getFieldDecorator('instData', {initialValue:`${content.institutionsId},${content.institutionsName}`})(
                        <Select 
                        disabled
                        maxLength={30}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        placeholder="请选择所属机构"
                        style={{width: '100%'}}
                        >
                        {this.props.institutionsData ? this.props.institutionsData.map(item => (
                              <Option value={`${item.id},${item.name}`} key={item.id}>{item.name}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>编辑人</td>
                    <td>
                      {content.updateUserId}
                    </td>
                    <td>编辑时间</td>
                    <td>{content.updateTime ? Moment(content.updateTime).format('YYYY-MM-DD') : ''}</td>
                  </tr>
                  <tr>
                    <td>状态</td>
                    <td>{content.status ? '启用':'禁用'}</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </Row>
            <Row className='info'>
              <h4 style={{fontWeight: 600,marginBottom:10,marginTop:10}}>供应商品</h4>
              <Table
                columns={columns}
                dataSource={dataSource}
                rowKey={record => record.id}
                bordered
                size="middle" />
            </Row>
        </div>

        {/* 删除 提示框 */}
        <Modal
            title="删除供应商"
            visible={this.state.delVisibleShow}
            onOk={this.delOk.bind(this)}
            onCancel={this.handleCancel.bind(this, 'delVisibleShow')}
            >
            <p style={{fontSize:16}}>是否确定删除该供应商?</p>
        </Modal>

        {/* 启用禁用 提示框 */}
        <Modal
            title={this.state.title}
            visible={this.state.visibleShow}
            onOk={this.handelClck.bind(this)}
            onCancel={this.handleCancel.bind(this, 'visibleShow')}
            >
            <p style={{fontSize:16}}>是否确定{this.state.title}该供应商?</p>
        </Modal>
      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state, ownProps) {
  return {
    argument: state.providerManage.saveSeslect,
    data: state.providerManage.detail,
    institutionsData: state.providerManage.institutionsData
  }
}

function dispatchToProps(dispatch) {
  return {
    queryDetail(payload = {}) {
      dispatch({type: 'providerManage/detailSupplier', payload})
    },
    getInstitutions(payload, params) {
      dispatch({
        type: 'providerManage/getInstitutions',
        payload
      })
    },
    updateSupplier(payload = {}) {
      dispatch({type: 'providerManage/updateSupplier', payload})
    },
    deleteSupplier(payload = {}) {
      dispatch({type: 'providerManage/deleteSupplier', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
