import React, { Component } from 'react';
import {Button,Row,Form,Input,message,Tabs} from 'antd';
import {connect} from 'dva';
import Style from './index.less';

const TabPane = Tabs.TabPane;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleShow: false,
      isHot: ''
    };
  }

  componentWillMount() {
    if( this.props.data) {
      this.setState({
        isHot: this.props.data.isHot
      })
    }
    
  }

  amend(){
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    const self = this;
    self.props.form.validateFields((err, values) => {
      self.props.goodsUpdateOther({
        params: {
          ...values,
          userId: userData.id,
          isHot: self.state.isHot,
          goodId: self.props.argument.id,
          instCode: userData.instCode
        },
        func: function () {
          message.success('操作成功', 1.5, () => {
            self.props.search('amendElseVisible')
          });
        }
      })
    })
  }

  cancel(){
    this.props.closeAmendElse(false)
  }
  tabsChange(params) {
    this.setState({
      isHot: params
    })
  }
  render() {
    const {data} = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div className={Style.title}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.amend.bind(this)}>确定</Button>
              <Button onClick={this.cancel.bind(this)}>取消</Button>
              <table cellSpacing="0" className={Style.mytable}>
                <tbody>
                  <tr>
                    <td>初始销量</td>
                    <td colSpan={3}>
                      {getFieldDecorator('initialSales', {initialValue: data.initialSales})(
                        <Input placeholder="请输入初始销量"  />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>商品排序</td>
                    <td colSpan={3}>
                      {getFieldDecorator('seq', {initialValue: data.seq})(
                        <Input placeholder="请输入商品排序"  />
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>是否推荐</td>
                    <td colSpan={3}>
                      <Tabs activeKey={this.state.isHot} onChange={this.tabsChange.bind(this)}>
                        <TabPane tab="推荐" key="1"></TabPane>
                        <TabPane tab="不推荐" key="2"></TabPane>
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
    argument: state.goodsManage.saveSeslect,
    data: state.goodsManage.ItemDetail,
  }
}

function dispatchToProps(dispatch) {
  return {
    goodsUpdateOther(payload = {}) {
      dispatch({type: 'goodsManage/goodsUpdateOther', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
