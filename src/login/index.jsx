import React, { Component} from 'react';
import PropTypes from 'prop-types';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import Md5 from 'js-md5';
import { connect } from 'dva'
import Style from './login.less';


const FormItem = Form.Item;

 const formItemLayout = {
      labelCol: { span: 5},
      wrapperCol: { span: 17 },
    };
 const VerifLayout = {
      labelCol: { span: 5},
      wrapperCol: { span: 6 },
};
const imgLayout = {position: 'absolute',width: '90px',marginLeft: '20px', cursor: 'pointer'};
class ImgElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyNum: this.props.keyNum
    }
  }
  componentWillMount() {
	  this.setState({
      keyNum: Math.random()
    });
  }
  handleClick = () => {
    this.setState({
            keyNum: Math.random()
    });
  }
  render() {
    const addr = `http://${window.location.host}/backstage/authCode/authCode?random=${this.state.keyNum}`;
    return (
       <img className={Style.img1}  src={addr} key={this.state.keyNum} onClick={this.handleClick} />

    );
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userMsg: {},
      keyNum: 1
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          loginAccount: values.name,
          password: Md5(values.password),
          code: values.VerifCode,
          zhuce: (id, name) => {
            this.props.saveUser({ id, name });
            this.context.router.history.push(`/1/app/home`)
          }
        }
        this.props.queryUser({ ...params });
        //this.props.saveUser({ id: '131341313431', user: '蛮王' })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.loginBoxs}>
        <div className={Style.loginBoxs1}>
          <div className={Style.authBoxs}>

            <div className={Style.content}>
              <p>佳优家管理平台</p>

              <div className={Style.inputBox}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <FormItem  {...formItemLayout}>
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: '请输入用户名!' }]
                    })(
                      <Input
                        placeholder="输入用户名"
                        prefix={<Icon type="user" />}
                        />
                    )}
                  </FormItem>
                  <FormItem  {...formItemLayout}>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: '请输入密码!' }]
                    })(
                      <Input
                        type="password"
                        placeholder="输入密码"
                        prefix={<Icon type="lock" />}
                        />
                    )}
                  </FormItem>
                  <FormItem>
                    {getFieldDecorator('VerifCode', {
                      rules: [{ required: true, message: '请输入验证码!' }]
                    })(
                      <Input
                        placeholder="输入验证码"
                        maxLength={4}
                        prefix={<Icon type="safety" />}
                       />
                    )}
                  <ImgElement keyNum={this.state.keyNum} />
                  </FormItem>
                  <FormItem style={{ textAlign: 'center' }}>
                    <Button type="primary"
                      htmlType="submit" className="login-form-button"
                      style={{ width: 140,height: 40,backgroundColor:'rgba(22, 155, 213, 1)',marginTop:30}}>
                      登&nbsp;&nbsp;录
                    </Button>
                  </FormItem>
                </Form>
              </div>
            </div>
          </div>
          <div className={Style.footer}>
            浙ICP9200293939备案  版权所有：嘉兴智源网络科技有限公司  技术服务：杭州卡檬科技有限公司
          </div>
        </div>

      </div>
    )
  }
}
App.contextTypes = {
  router: PropTypes.object
}

function mapStateToProps(state) {
  return {
    userMsg: state.login.userMsg,
    data: state.login.data.data
  }
}
function dispatchToProps(dispatch) {
  return {
    saveUser(payload, params) {
      dispatch({
        type: 'login/saveUser',
        payload
      })
    },
    queryUser(payload, params) {
      dispatch({
        type: 'login/queryUser',
        payload
      })
    }
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
