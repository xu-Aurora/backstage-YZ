import React, {Component} from 'react';
import {Button,Row,Form,Col,Card,Table,Input,Popconfirm,Icon,Tag, message } from 'antd';
import {connect} from 'dva';
import styles from './DrawerStyle.less';

const FormItem = Form.Item;
const Search = Input.Search;

const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const data = [];
const datas = ['品牌','产地','光年之外'];
datas.forEach((item,index) => {
  data.push({
    key: index.toString(),
    name: item,
  });
})

const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };

  render() {
    const {editing,dataIndex,title,inputType,record,index,...restProps} = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {initialValue: record[dataIndex]})(
                    this.getInput())
                  }
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
function siblingElems(elem) {
  var _elem = elem;
  while ((elem = elem.previousSibling)) {
    if (elem.nodeType == 1) {
      elem.removeAttribute('style');
    }
  }
  var elem = _elem;
  while ((elem = elem.nextSibling)) {
    if (elem.nodeType == 1) {
      elem.removeAttribute('style');
    }
  }

};


//antd自定义字体图表
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_869860_yfo3o79mk4b.js',
});


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data, 
      editingKey: '',
      tags: ["红色","黄色","绿色"],
      inputVisible: false,
      inputValue: '',

      parameterList: [],
      paramsIndex: '0',
      paramsName: '',
      paramsValue: ''
    };
  }

  handleCancel = () => {
    this.props.closeArguments(false)
  }

  isEditing = (record) => {
    return record.key === this.state.editingKey;
  };
  edit(key) {
    this.setState({ editingKey: key });
  }
  //点击从数组里删除一个数
  close(key) {
    this.state.data.splice(key,1)
    this.setState({
      data
    })
  }

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: '' });
  };
  onSelect (record, e) {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
  }


    //参数值
    handleClose = (removedTag) => {
      const tags = this.state.tags.filter(tag => tag !== removedTag);
      this.setState({ tags });
    }
    showInput = () => {
      this.setState({ inputVisible: true }, () => this.input.focus());
    }
    handleInputChange = (e) => {
      this.setState({ inputValue: e.target.value });
    }
    handleInputConfirm = () => {
      const state = this.state;
      const inputValue = state.inputValue;
      let tags = state.tags;
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue];
      }
      let arr = [];
      tags.forEach((item) => {
          arr.push({color:item,image:'',code:'',sellPrice:'',Vouchers:'',costPrice:'',num:'',weight:'',volume:''})
      })
      this.setState({
        tags,
        inputVisible: false,
        inputValue: '',
        goodsData: arr
      });
    }
    saveInputRef = input => this.input = input
    componentDidMount(){
      const userData = JSON.parse(localStorage.getItem('userDetail'));
      let self = this
      this.props.getParameter({
        params: {
          userId: userData.id
        },
        func: function(){
          self.setState({
            parameterList: self.props.parameterList
          })
        }
      })
      this.props.onRef('argumentsSelf', this)
    }
  //渲染属性  
  paramsApply() {
    let children = []
    this.state.parameterList.forEach((data, index) => {
      children.push(
        <div className={data.checked ? `${styles.params} ${styles.params_bg}`:`${styles.params}`} onClick={this.queryValue.bind(this, index)} key={index}>
          <span className={styles.lable}>{data.name}</span>
          {/* <span className={styles.lable_content}>
            <IconFont type="icon-edit" className={styles.icon}/>
            <Icon type="close" className={styles.icon}/>
          </span> */}
        </div>
      )
    })
    return children
  }
  //查询属性值
  queryValue(index) {
    let list = []
    this.state.parameterList.forEach(data=>{
      list.push(Object.assign({},data))
    })

    list.forEach((item, i)=>{
      if(index == i) {
        item.checked = true
      } else {
        item.checked = false
      }
    })
    this.setState({
      parameterList: list,
      paramsIndex: index
    })
  }
   //添加属性
  argumentName(val){
    if(val) {
      let list = []
      this.state.parameterList.forEach(data=>{
        list.push(Object.assign({}, data))
      })
       list.push(
         {
           name: val,
           type: '1',
           templates: []
         }
       )
       this.setState({
         parameterList: list,
         paramsName: ''
       })
    }
  }
  //渲染属性值
  tagApply() {
    let slef = this 
    let children = []
    this.state.parameterList.forEach((data, index) => {
      if(data.templates) {
        data.templates.forEach((item, k) => {
          if (index == slef.state.paramsIndex) {
            children.push(
              <Tag  key={k}>{item.name}</Tag>
            )
          }
        })
      }
    })
    return children
  }
  //添加属性值
  argumentValue(val){
    if(val) {
      let list = []
      this.state.parameterList.forEach(data=>{
        list.push(Object.assign({}, data))
      })
       list[this.state.paramsIndex].templates.push(
         {
           name: val,
           type: '2',
         }
       )
       this.setState({
         parameterList: list,
         paramsValue: ''
       })
    }
  }
  save() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    let self = this
      self.props.addParameter({
        params: {
          userId: userData.id,          
          datas: JSON.stringify(this.state.parameterList)
        },
        func: function () {
          message.success('操作成功',() => {
            self.props.closeArguments(false)
          })
        }
      })
  }
  render() {
    return (
      <div className={styles.drawer}>
        <div style={{ width: '100%',backgroundColor: "#FFF",marginTop: 2}}>
          <Form>
            <Row>
              <Button type="primary" onClick={this.save.bind(this)}>确定</Button>
              <Button type="primary" ghost onClick={this.handleCancel}>取消</Button>
            </Row>
            <Card style={{marginTop:20}} className="arguments">
                <FormItem labelCol={{span: 3}} wrapperCol={{span: 25}} style={{marginBottom:0}}>
                    <Col span={8} style={{borderRight:'1px solid #e8e8e8',padding:'2px 0 3px'}}>
                      <h3>参数名称</h3>
                      {this.paramsApply()}
                      <Col span={24} style={{padding: '0 12px'}}>
                        <Search
                          placeholder="输入参数名称"
                          enterButton="添加"
                          value={this.state.paramsName}
                          onChange={(ev)=>{
                            return this.setState({
                              paramsName: ev.target.value
                            })
                          }}
                          onSearch={this.argumentName.bind(this)}
                        />
                      </Col>
                    </Col>
                    <Col span={15} style={{padding:'2px 0 3px 13px'}}>
                      <h3>参数值</h3>
                      <Col span={24}>
                        {this.tagApply()}
                      </Col>
                      <Col span={11}>
                            <Search
                              placeholder="输入参数值"
                              enterButton="添加"
                              value={this.state.paramsValue}
                              onChange={(ev)=>{
                                return this.setState({
                                  paramsValue: ev.target.value
                                })
                              }}
                              onSearch={this.argumentValue.bind(this)}
                            />
                      </Col>
                    </Col>      
                </FormItem>
            </Card>

          </Form>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    parameterList: state.goodsReleased.parameterList
  }
}

function dispatchToProps(dispatch) {
  return {
    getParameter(payload = {}) {
      dispatch({type: 'goodsReleased/getParameter', payload})
    },
    addParameter(payload = {}) {
      dispatch({type: 'goodsReleased/addParameter', payload})
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
