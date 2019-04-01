import React, { Component } from 'react';
import {Button,Row,Form,Select,Input,message,Col,Tabs,TreeSelect} from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;
const TabPane = Tabs.TabPane;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
      comIds: [],
      status: ''
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getInstitutions({
      userId : userData.id, 
      code: userData.instCode
    });
    this.props.queryArea({
      userId: userData.id,
      instCode: userData.instCode
    });
    this.props.queryDetail({
      params: {
        userId: userData.id, 
        id: this.props.argument.id,
        instCode: userData.instCode
      },
      func: () => {
        this.setState({
          status: this.props.data.status,
          area: this.props.data.scopeType,
          comIds: this.props.data.scopeInfo ? this.props.data.scopeInfo.split(','): '',
        })
      }
    });
  }


  //区域数组组装
  loop = (data) => {
    let newData = [];
    data.forEach((item) => {
      let itemData = [];
      if(item.areas){
        item.areas.forEach((e) => {
          if(e.communitys){
            let children = [];
            e.communitys.forEach((en) => {
              children.push({
                title: en.name,
                value: `${en.id}-${en.code}-3`,
                key: `${en.id}-${en.code}`,
              })
            })
            itemData.push({
              title: e.name,
              value: `${e.id}-${e.code}-2`,
              key: `${e.id}-${e.code}`,
              children
            })

          }else{
            itemData.push({
              title: e.name,
              value:`${e.id}-${e.code}-2`,
              key: `${e.id}-${e.code}`,
            })
          }


        })
      }
      newData.push({
        title: item.name,
        value: `${item.id}-${item.code}-1`,
        key: `${item.id}-${item.code}`,
        children: itemData
      })
    })
    return newData;
  }
  treeSelect(val,name){
    this.setState({
      comIds: val,
      comNames: name
    })
  }
  setcomIds (data) {
    let self = this
    let ids = []
    if(data) {
      data.forEach((item)=>{
        if(item.split('-')[2] == 1) {
          self.props.area.forEach(ele => {
            if(ele.id == item.split('-')[0]) {
              ele.areas.forEach(element=>{
                element.communitys.forEach(e=>{
                  ids.push(e.id)
                })
              })
            }
          });
        } else if(item.split('-')[2] == 2) {

          self.props.area.forEach(ele => {
            ele.areas.forEach(element=>{
              if(element.id == item.split('-')[0]) {
                  element.communitys.forEach(e=>{
                    ids.push(e.id)
                  })
              }
            })

          });
        } else if(item.split('-')[2] == 3) {
          ids.push(item.split('-')[0])
        }
      })
    }
    return ids.join()
  }
  tabKey(type,key){
    if (type == 'area') {
      if(key == 1) {
        this.setState({
          comIds: ''
        })
      }
    }
    this.setState({
      [type]: key
    })
  }

  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.update({
              params: {
                ...values,
                id: self.props.argument.id,
                status: this.state.status,
                scopeType: self.state.comIds ? '2' : '1',
                scopeInfo: self.state.comIds ? self.state.comIds.join() : '',
                comIds: self.setcomIds(self.state.comIds),
                comNames: self.state.comNames?self.state.comNames.join(','):'',
                instCode: values.instData.split(',')[0],
                instName: values.instData.split(',')[1],
                userId: userData.id
              },
              func: function(){
                message.success('操作成功!', 1.5, function() {self.props.search('editVisible')});
              }
            })
          })
        }

      } 
    })
  }

  rex (item) {
    let reg = /^(0|86|17951)?(13[0-9]|14[56]|15[0-9]|16[56]|17[0-9]|18[0-9]|19[189])[0-9]{8}$/;
    message.destroy();
    if(!item.salesmanName){
      message.warning('业务员名称不能为空');
      return false
    }

    if(!item.salesmanPhone){
      message.warning('业务员手机号码不能为空');
      return false
    }
    if(!reg.test(item.salesmanPhone)){
      message.warning('请输入正确的手机号码');
      return false
    }
    
    if(!item.salesmanType){
      message.warning('业务员类型不能为空');
      return false
    }

    if(!item.instData) {
      message.warning('请选择所属机构');
      return false
    }
    return true;
  }

  render() {
    const { data,area } = this.props;
    const treeData = area ? this.loop(area) : [];//小区
    const content = data ? data : {}
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.save.bind(this)}>保存</Button> :
                <Button type="primary">保存</Button>
              }
              <Button onClick={ () => this.props.closeEdit() }>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>业务员名称</td>
                    <td colSpan={3}>
                      {getFieldDecorator('salesmanName', {initialValue: content.salesmanName})(
                        <Input placeholder="请输入业务员名称"  maxLength={50}/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>手机号码</td>
                    <td colSpan={3}>
                      {getFieldDecorator('salesmanPhone', {initialValue:content.salesmanPhone})(
                        <Input placeholder="请输入手机号码" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>业务员类型</td>
                    <td colSpan={3}>
                      {getFieldDecorator('salesmanType', {initialValue:content.salesmanType})(
                        <Select placeholder="请选择业务员类型">
                          <Option value="1">服务人员</Option>
                          <Option value="2">配送人员</Option>
                        </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>服务范围</td>
                    <td colSpan={3} style={{textAlign:'left',padding:'7px 5px 7px 15px'}}>
                      <Tabs activeKey={ this.state.area } onTabClick={this.tabKey.bind(this,'area')}>
                          <TabPane tab="全部区域" key="1">
                            
                          </TabPane>
                          <TabPane tab="指定小区" key="2">
                            <Col>
                              <TreeSelect
                                placeholder='请选择'
                                onChange={ this.treeSelect.bind(this) }
                                allowClear
                                value={ this.state.comIds == "" ? "" : this.state.comIds }
                                showCheckedStrategy={SHOW_PARENT}
                                treeCheckable={true}
                                treeData={treeData}
                              />   
                            </Col>
                          </TabPane>
                        </Tabs>
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td colSpan={3}>
                      {getFieldDecorator('instData', {initialValue: `${content.instCode},${content.instName}`})(
                        <Select 
                          maxLength={30}
                          showSearch
                          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                          placeholder="请选择所属机构">
                          {this.props.institutionsData ? this.props.institutionsData.map(item => (
                            <Option value={`${item.code},${item.name}`} key={item.id}>{item.name}</Option>
                              )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>状态</td>
                    <td colSpan={3} style={{textAlign:'left',paddingLeft:15}}>
                        <Tabs activeKey={ this.state.status } onTabClick={this.tabKey.bind(this,'status')} >
                          <TabPane tab="启用" key="1"></TabPane>
                          <TabPane tab="禁用" key="2"></TabPane>
                        </Tabs>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Row>
          </Form>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    institutionsData: state.providerManage.institutionsData,
    data: state.salesmanManage.detail1,
    argument: state.salesmanManage.saveSeslect,
    area: state.advertisingManagment.area,//小区
  }
}

function dispatchToProps(dispatch) {
  return {
    getInstitutions(payload, params) {
      dispatch({
        type: 'providerManage/getInstitutions',
        payload
      })
    },
    queryArea(payload, params) {
      dispatch({
        type: 'advertisingManagment/area',
        payload
      })
    },
    queryDetail(payload = {}) {
      dispatch({type: 'salesmanManage/queryDetail1', payload})
    },   
    update(payload = {}) {
      dispatch({type: 'salesmanManage/update', payload})
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
