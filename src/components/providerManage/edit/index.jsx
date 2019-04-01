import React, { Component } from 'react';
import {Button,Row,Form,Select,Input,message} from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const Option = Select.Option;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      requestStatus: true,
    };
  }


  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.getInstitutions({userId : userData.id, code: userData.instCode});
    this.props.queryDetail({
      userId: userData.id, 
      id: this.props.argument.id,
      instCode: userData.instCode
    });
  }
  cancel(){
    this.props.closeEdit(false)
  }
  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
     
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.updateSupplier({
              params: {
                ...values,
                id: self.props.argument.id,
                organization:  values.organization,
                instCode: userData.instCode,
                institutionsId: values.instData.split(',')[0],
                institutionsName: values.instData.split(',')[1],
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
    if(!item.name){
      message.warning('供应商名称不能为空');
      return false
    }

    if(!item.responsiblePerson){
      message.warning('负责人名称不能为空');
      return false
    }

    if(item.mobile) {
      let regPhone =  /^1[34578]\d{9}$/   //手机号码+固定电话
      if(!regPhone.test(item.mobile)) {
        message.warning('联系电话格式不正确');
        return false        
      } 
    } else {
      message.warning('联系电话不能为空');
      return false
    }

    if(!item.type){
      message.warning('请选择供应商类型');
      return false
    }
    if(!item.instData) {
      message.warning('请选择所属机构');
      return false
    }
    return true;
  }
  render() {
    const {data} = this.props;
    const content = data ? data.supplier : {}
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
              
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td><span className={Style.red}>*</span>供应商名称</td>
                    <td colSpan={3}>
                      {getFieldDecorator('name', {initialValue: content.name})(
                        <Input placeholder="请输入供应商名称"  maxLength={50}/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>负责人名称</td>
                    <td colSpan={3}>
                      {getFieldDecorator('responsiblePerson', {initialValue:content.responsiblePerson})(
                        <Input placeholder="请输入负责人名称"  maxLength={50}/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>联系电话</td>
                    <td colSpan={3}>
                      {getFieldDecorator('mobile', {initialValue:content.mobile})(
                        <Input placeholder="请输入负责人电话" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>供应商类型</td>
                    <td colSpan={3}>
                      {getFieldDecorator('type', {initialValue:content.type})(
                        <Select placeholder="请选择供应商类型">
                          <Option value="1">商城合作商-生鲜类</Option>
                          <Option value="2">服务合作商-家电维修类</Option>
                        </Select>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>所属机构</td>
                    <td colSpan={3}>
                      {getFieldDecorator('instData', {initialValue:`${content.institutionsId},${content.institutionsName}`})(
                        <Select 
                        maxLength={30}
                        showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        placeholder="请选择所属机构">
                        {this.props.institutionsData ? this.props.institutionsData.map(item => (
                              <Option value={`${item.id},${item.name}`} key={item.id}>{item.name}</Option>
                            )) : ( <Option value={' '}>暂无数据</Option> )}
                        </Select>
                      )}
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
    argument: state.providerManage.saveSeslect,
    data: state.providerManage.detail,
    institutionsData: state.providerManage.institutionsData
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
    updateSupplier(payload = {}) {
      dispatch({type: 'providerManage/updateSupplier', payload})
    },
    queryDetail(payload = {}) {
      dispatch({type: 'providerManage/detailSupplier', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
