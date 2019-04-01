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
      params: '',
      savelable: '',
      saveParams: ''
    };
  }
  componentDidMount() {
    let goodsId = this.context.router.route.match.params.goodsId
    const userData = JSON.parse(localStorage.getItem('userDetail'))
    let goodsClassify =  JSON.parse(localStorage.getItem('goodsClassify'))
    let self = this
    this.props.getCategory({
      params: {
        userId: userData.id
      },
      func: function(){
        if(goodsId) { //编辑
          let data = self.props.detailList
          if(data.name) {
            let list = []
            let index = 0
            self.props.categoryList.forEach(data => {
              list.push(Object.assign({}, data))
            })
            list.forEach((item, i)=>{
              if(item.id ==  data.categoryId.split(',')[0]){
                item.checked = true
                index = i
              } else {
                item.checked = false
              }
              if(item.categoryVos) {
                item.categoryVos.forEach(element=>{
                  if(element.id ==  data.categoryId.split(',')[1]) {
                    element.checked = true
                  } else {
                    element.checked = false
                  }
                })
              }
            })
            self.setState({
              categoryList: list,
              categoryIndex: index,
              name: data.categoryName.replace(',', '-')
            })
          } else {
            self.setState({
              categoryList: self.props.categoryList
            })
          }
        } else if(goodsClassify) { // 本地存贮
          let list = []
          let index = 0
          self.props.categoryList.forEach(data => {
            list.push(Object.assign({}, data))
          })

          list.forEach((item, i)=>{
            if(item.id ==  goodsClassify.parameterId){
              item.checked = true
              index = i
            } else {
              item.checked = false
            }
            if(item.categoryVos) {
              item.categoryVos.forEach(element=>{
                if(element.id ==  goodsClassify.priceId) {
                  element.checked = true
                } else {
                  element.checked = false
                }
              })
            }
          })
          self.setState({
            categoryList: list,
            categoryIndex: index,
            name: goodsClassify.name
          })
        } else {
          self.setState({
              categoryList: self.props.categoryList
          })
        }
       
      }
    })
    this.props.onRef('classsifySelf', this)
  }
  handleCancel = () => {
    this.props.closeClassify(false)
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
    this.setState({
      savelable: this.state.lable,
      saveParams: this.state.params
    },()=>{
      if (this.state.lable && this.state.params) {
        this.props.closeClassify(false)
      } else {
        message.error('请选择完整的分类')
      }
    })
    console.log(this)
    let classify = {
      name: this.state.name,
      parameterId: this.state.lable.id,
      priceId: this.state.params.id,
    }
    localStorage.setItem('goodsClassify', JSON.stringify(classify))
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
    categoryList:  state.goodsReleased.categoryList,
    detailList: state.goodsReleased.detailList
  }
}

function dispatchToProps(dispatch) {
  return {
    getCategory(payload = {}) {
      dispatch({type: 'goodsReleased/getCategory', payload})
    },

    queryDetail(payload = {}) {
      dispatch({type: 'activityManagement/detail', payload})
    },
    queryArea(payload, params) {
      dispatch({
        type: 'advertisingManagment/area',
        payload
      })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
