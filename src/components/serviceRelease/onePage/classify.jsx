import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Select,Button,Row,Form,Col,Card, message} from 'antd';
import {connect} from 'dva';
import styles from './DrawerStyle.less';

const Option = Select.Option;
const FormItem = Form.Item;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryList: [],
      categoryIndex: 0,
      name: '',
      lable:'',
      params: ''
    };
  }
  componentDidMount() {
    if(this.props.ids) {
      let list = []
      let index = 0
      let lable = '', params = ''
      this.props.categoryList.forEach(data => {
        list.push(Object.assign({}, data))
      })
      list.forEach((item, i)=>{
        if(item.id ==  this.props.ids.split(',')[0]){
          item.checked = true
          index = i
          lable = item
        } else {
          item.checked = false
        }
        if(item.categoryVos) {
          item.categoryVos.forEach(element=>{
            if(element.id ==  this.props.ids.split(',')[1]) {
              element.checked = true
              params = element
            } else {
              element.checked = false
            }
          })
        }
      })
      this.setState({
        categoryList: list,
        categoryIndex: index,
        name: this.props.name.replace(',', '-'),
        lable,
        params
      })
    } else {
      this.setState({
        categoryList: this.props.categoryList
      })  
    }
    this.props.onRef('classsifySelf', this)
  }
  handleCancel = () => {
    this.props.close('classifyVisible')
  }
  //分组
  categoryApply() {
    let children = []
    this.state.categoryList.forEach((data, index)=>{
        children.push(
          <Card key={index} onClick={this.labelChange.bind(this, index, data)} className={data.checked ? `${styles.highlight}` : ''}>{data.name}</Card>
        )
    })
    return children
  }
  labelChange(index, param) {
    let list = []
    this.state.categoryList.forEach(data=>{
      list.push(Object.assign({}, data))
    })
    list.forEach((data, i)=>{
      if(param.id == data.id) {
        data.checked = true
      } else {
        data.checked = false
      }
    })
    this.setState({
      categoryList: list,
      lable: param,
      params: '',
      categoryIndex: index
    })
  }
  parameterApply() {
    let children = []
    if(this.state.categoryList.length) {
      this.state.categoryList[this.state.categoryIndex].categoryVos.forEach((data, index)=>{
          children.push(
            <Card key={index}  onClick={this.parameterChange.bind(this, index, data)} className={data.checked ? `${styles.highlight}` : ''}>{data.name}</Card>
          )
      })
    }
   
    return children
  }
  parameterChange(index, params) {
    if(this.state.lable.name) {
      let list = []
      this.state.categoryList.forEach(data=>{
        list.push(Object.assign({}, data))
      })
      list.forEach((data, i)=>{
        data.categoryVos.forEach((item, j)=>{
          if(params.id == item.id) {
            item.checked = true
          } else {
            item.checked = false
          }
        })
      })
      this.setState({
        categoryList: list,
        params,
        name: `${this.state.lable.name}-${params.name}`
      })
    } else {
      message.error('请先选择一级分类')
    }
  }
  save() {
      if (this.state.lable && this.state.params) {
        this.props.save(false)
      } else {
        message.error('请选择完整的分类')
      }
  }
  render() {
    const formItemLayout = {
        labelCol: {xs: { span: 24 },sm: { span: 3 }},
        wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 8 }}
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.drawer}>
        <div style={{ width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.save.bind(this)}>确定</Button>
              <Button type="primary" ghost onClick={this.handleCancel}>取消</Button>
            </Row>
            <Card style={{marginTop:20}}>
                <FormItem {...formItemLayout} label="当前选择" style={{marginBottom:10}}>
                    <span>{this.state.name}</span>
                </FormItem>
                {/* <FormItem {...formItemLayout} label="常用类目" style={{marginBottom:18}}>
                    {getFieldDecorator('type')(
                        <Select placeholder="请选择">
                          {this.categoryApply()}
                        </Select>
                    )}
                </FormItem> */}
                <FormItem labelCol={{span: 3}} wrapperCol={{span: 25}} className='cardStyle'>
                    <Col offset={1} span={10}>
                        {this.categoryApply()}
                    </Col>
                    <Col offset={2} span={10}>
                       {this.parameterApply()}
                    </Col>       
                </FormItem>
            </Card>

          </Form>
        </div>
      </div>
    )
  }
}

App.contextTypes = {
  router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
  return {
    categoryList:  state.serviceRelease.categoryList
  }
}

function dispatchToProps(dispatch) {
  return {
    getCategory(payload = {}) {
      dispatch({type: 'serviceRelease/getCategory', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
