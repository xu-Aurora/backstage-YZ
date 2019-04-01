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
    // this.props.queryDetail({
    //   userId: userData.id, 
    //   id: this.props.argument.id,
    //   instCode: userData.instCode
    // });
  }



  loop = (data) => {
    for(let i in data){
      if(i == "status"){
        switch (data[i]) {
          case "4":
            data[i] = "交易完成"
            break;
          case "5":
            data[i] = "交易关闭"
            break;
          case "6":
            data[i] = "已退款"
            break;
        }
      }
      if(i == "terminal"){
        switch (data[i]) {
          case "1":
            data[i] = "APP"
            break;
          case "2":
            data[i] = "微信公众号"
            break;
          case "3":
            data[i] = "支付宝生活号"
            break;
        }
      }
    }
    return data;
  }

  cancel(){
    this.props.closeAdd(false)
  }
  save() {
    const self = this;
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
     
      let rex = this.rex(values)
      if (rex) {
        if(this.state.requestStatus){
          self.setState({requestStatus: false},() => {
            self.props.addSupplier({
              params: {
                ...values,
                organization:  values.organization,
                instCode: userData.instCode,
                // organization:  values.instData.split(',')[1],
                institutionsId: values.instData.split(',')[0],
                institutionsName: values.instData.split(',')[1],
                userId: userData.id
              },
              func: function(){
                message.success('操作成功!', 1.5, function() {self.props.search('addVisible')});
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
    const content = this.loop(data) || {};
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
                      {getFieldDecorator('name', {initialValue:''})(
                        <Input placeholder="请输入供应商名称" maxLength={50}/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>负责人名称</td>
                    <td colSpan={3}>
                      {getFieldDecorator('responsiblePerson', {initialValue:''})(
                        <Input placeholder="请输入负责人名称"  maxLength={50}/>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>联系电话</td>
                    <td colSpan={3}>
                      {getFieldDecorator('mobile', {initialValue:''})(
                        <Input placeholder="请输入负责人电话" />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><span className={Style.red}>*</span>供应商类型</td>
                    <td colSpan={3}>
                      {getFieldDecorator('type', {initialValue:''})(
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
                      {getFieldDecorator('instData', {initialValue:''})(
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
    institutionsData: state.providerManage.institutionsData,
    argument: state.routerField.saveSeslect,
    data: state.routerField.detail,
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
    addSupplier(payload = {}) {
      dispatch({type: 'providerManage/addSupplier', payload})
    },

  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
