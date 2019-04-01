import React, {Component} from 'react';
import {Input,Select,Button,Row,Col,Modal,Form,message,Icon,Switch } from 'antd';
import { connect } from 'dva'
import Style from './addStyle.less';


const Option = Select.Option;
const confirm = Modal.confirm;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requestStatus: true,
      visible: false,
      userData: '',
      awards:[],//楼栋数据
      startNum: '',
      endNum: ''
    };
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({userData});
    if(this.props.gardenRight) {
      this.props.detailBuilding({userId: userData.id, comId : this.props.communityRight.id, comCourtId :  this.props.gardenRight.id});
    } else {
      this.props.detailBuilding({userId: userData.id, comId : this.props.communityRight.id, comCourtId: ''});
    }
    // this.props.queryDatas({ userId: userData.id, page: 99999,size:99999 });
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.detailBuildingData.length) {
      let list = []
      nextProps.detailBuildingData.forEach((item)=>{
        list.push(Object.assign({}, item))
      })
      list.forEach((item)=>{
        item.buildingName =  `${item.buildingName}`.replace(/幢/,'')
        item.delStatus = false
        item.minusStatus = false
        item.checkedStatus = true
        item.number = item.unitNumber
        if(item.existenceUnit == 1) {
          item.maxStatus = true
        } else {
          item.maxStatus = false
          item.unitNumber = 0
        }
      })
      
      this.setState({
        awards: Object.assign(this.state.awards, list)
      })
    }
  }
  addUserSub() {
    let list = []
    let self = this
    this.state.awards.forEach(function(item){
      list.push(Object.assign({},item))
    })
    list.forEach((item)=>{
      item.buildingName = `${item.buildingName}幢`
      if(item.number) {
        item.unitNumber = Number(item.unitNumber) - Number(item.number)
      }
    })
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if(this.state.requestStatus){
      self.setState({requestStatus: false},() => {
        if(this.props.gardenRight) {
          this.props.addBuilding({
            params: {
              comCode: this.props.communityRight.code,
              comId: this.props.communityRight.id,
              comCourtId: this.props.gardenRight.id,
              comCourtName: this.props.gardenRight.name,
              comType: 2,
              userId: userData.id,
              data: JSON.stringify(list)
            },
            func: function(){
              message.success('操作成功!', 1.5, function() { 
                self.props.search('addBuilding')
                 
              });
            }
          })
        } else {
          this.props.addBuilding({
            params: {
              comCode: this.props.communityRight.code,
              comId: this.props.communityRight.id,
              comType: 1,
              userId: userData.id,
              data: JSON.stringify(list)
            },
            func: function(){
              message.success('操作成功!', 1.5, function() { 
                self.props.search('addBuilding') 
                
              });
            }
          })
        }
      })
    }

  }
  toggle = () => {
    if (this.state.roloStatus === '1' || !this.state.roloStatus) {
      this.setState({isUp: '0', roloStatus: '0'});
    } else {
      this.setState({isUp: '1', roloStatus: '1'});
    }
  }
  roloOption = (data) => {
    const children = [];

    data.forEach((item) => {
      if(item.status === "0"){
        children.push((
          <Option key={item.id} value={item.id.toString()} >{item.name}</Option>
        ))
      }

    })
    return children;
  }
  loop () {
    let self = this
    let children = []
    self.state.awards.forEach(function(item, index){
        children.push((
            <tr key={index}>
                <td>{`${item.buildingName} 幢`}</td>
                <td style={{paddingLeft:20}}>
                      {item.minusStatus ? (<Icon type="minus-square" onClick={self.minus.bind(self, item, index)} style={{cursor: 'pointer',fontSize:20}}/>):(<Icon type="minus-square" style={{cursor: 'pointer',fontSize:20,color: '#ccc'}}/>)}
                    <span style={{margin: '0 5px',width: '80%'}}>
                        <Input
                          readOnly 
                          value={self.state.awards[index].unitNumber}
                          style={{width:'50%',height:25,textAlign: 'center'}}
                          placeholder="单元数" />
                    </span>
                    {item.maxStatus ? (<Icon type="plus-square" onClick={self.add.bind(self,index)} style={{cursor: 'pointer',fontSize:20}}/>):(<Icon type="plus-square" style={{cursor: 'pointer',fontSize:20,color: '#ccc'}}/>)}
                    
                </td>
                <td>
                  <span>是否有单元:&ensp;<Switch  defaultChecked={item.existenceUnit == 1 ? true:false} disabled={item.checkedStatus}  onChange={self.inElement.bind(self, index)}></Switch></span>
                  {item.delStatus ? (<Button onClick={self.delete.bind(self, index)} style={{marginLeft: 20}}>删除</Button>) : null}
                </td>
            </tr>
        ))
    })
    return children
  }
  //加
  add(index) {
    let list = []
    this.state.awards.forEach((i)=>{
      list.push(Object.assign({}, i))
    })
    list[index].unitNumber = Number(list[index].unitNumber) + 1
    list[index].minusStatus = true
    this.setState({
      awards: list
    })
  }
  //减
  minus (item, index) {
    let list = []
    this.state.awards.forEach((i)=>{
      list.push(Object.assign({}, i))
    })
    if(item.number) {
      list[index].unitNumber = Number(list[index].unitNumber) - 1
      if(list[index].unitNumber == item.number) {
        list[index].minusStatus = false
      }
      this.setState({
        awards: list
      })
    } else {
      if(list[index].unitNumber) {
        list[index].unitNumber = Number(list[index].unitNumber) - 1
        if(list[index].unitNumber == 1) {
          list[index].minusStatus = false
        }
        this.setState({
          awards: list
        })
      } 
     
    }
  }
    //是否有单元
  inElement(index, status) {
    console.log(arguments)
    let list = []
    this.state.awards.forEach((i)=>{
      list.push(Object.assign({}, i))
    })
    if (status) {
      list[index].existenceUnit = '1'
      list[index].unitNumber = 1
      list[index].maxStatus = true
    } else {
      list[index].existenceUnit = '2'
      list[index].unitNumber = 0
      list[index].minusStatus = false
      list[index].maxStatus = false
    }
    this.setState({
      awards: list
    })
  }
  //删除
  delete (val) {
    const data = this.state.awards;
    const self = this;
    confirm({
        title: '是否删除此项?',
        content: '',
        onOk() {
            data.splice(val, 1);
            self.setState({awards: data});
        },
        onCancel() {
            return;
        }
    });
  }
  //确定
  confirm () {
    let re = /^\d+$/
    let self = this
    let awards = self.state.awards
    let data = []
    message.destroy();
    if(!re.test(self.state.startNum)) {
      message.warning('起始楼幢只能为正整数');
    } else {
      if(!re.test(self.state.endNum)) {
        message.warning('新增幢数只能为正整数');
      } else {  
        //新增幢 新增一个数组
        for(let i=1;i<=self.state.endNum;i++) {
          if(data.length == 0) {
            data.push({
              buildingName: Number(self.state.startNum),
              unitNumber: 1,
              buildingCode: '',
              delStatus: true, //删除
              minusStatus: false, //减法
              maxStatus: true, //加法
              existenceUnit: '1', // 1有单元 2无单元
              checkedStatus: false // 是否有的选中状态
            })
          } else {
            data.push({
              buildingName: data[data.length - 1].buildingName + 1,
              unitNumber: 1,
              buildingCode: '',
              delStatus: true,
              minusStatus: false,
              maxStatus: true,
              existenceUnit: '1',
              checkedStatus: false
            })
          }
        }
        
        if(awards.length == 0) {
          // 数组为空直接赋值
          self.setState({
            awards: data
          })
        } else {
          //数组不为空的情况下
          for(let i=0;i<data.length;i++) {
            //先遍历赋值
            awards.push(data[i])
          }
          // 去重
          for(var i = 0; i < awards.length; i++){
            for(var j = i+1; j < awards.length; j++){
              if(awards[i].buildingName == awards[j].buildingName){
                awards.splice(j, 1)
              }
            }
          }
          // 重新排序
          let length = awards.length
          for(var k = 0; k < length-1; k++){
            for(var l = 0; l < length-k-1; l++){
              if(awards[l].buildingName > awards[l+1].buildingName){
                let temp = awards[l]
                awards[l] = awards[l+1]
                awards[l+1] = temp
              }
            }
          }
          self.setState({
            awards
          })
        }
      }
    }  
  }
  InputChange (item, ev) {
    this.setState({
      [item]: ev.target.value
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={Style.userBox}>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
        </div>
        <div style={{width: '100%',backgroundColor: "#FFF"}}>
          <Row>
            <Form>
              {
                this.state.requestStatus ? <Button type="primary" onClick={this.addUserSub.bind(this)}>保存</Button> :
                <Button type="primary">保存</Button>
              }
              
              <h4 style={{marginTop:15}}>新增幢</h4>

              <Row>
                <Col span={22}>
                  <table cellSpacing="0" className={Style.mytable} style={{width:'99%'}}>
                    <tbody>
                      <tr>
                        <td><span className={Style.red}>*</span>起始楼幢</td>
                        <td>
                          <Input style={{width:'90%'}} placeholder="请输入起始楼幢" onChange={this.InputChange.bind(this, 'startNum')}/> 幢
                        </td>
                        <td><span className={Style.red}>*</span>新增幢数</td>
                        <td>
                          <Input style={{width:'90%'}} placeholder="请输入新增总幢数" onChange={this.InputChange.bind(this, 'endNum')}/> 幢
                        </td>
                          
                      </tr>
                      </tbody>
                  </table>
                </Col>
                <Col span={2} style={{lineHeight:5}}>
                  <Button type="primary" style={{height:40,width:70}} onClick={this.confirm.bind(this)}>确定</Button>
                </Col>
              </Row>

              <h4 style={{marginTop:25}}>新增单元</h4>
                  <table cellSpacing="0" className={Style.mytable1}>
                    <tbody>
                      <tr>
                        <td>幢号</td>
                        <td >单元数</td>
                        <td >操作</td>
                      </tr>
                      {this.loop()}
                      </tbody>
                  </table>
            </Form>
          </Row>
        </div>
      </div>
    )
  }
}
function mapStateToProps(state, ownProps) {
  return {
    communityRight: state.houseManagement.communityRight,
    gardenRight: state.houseManagement.gardenRight,
    detailBuildingData: state.houseManagement.detailBuildingData,

    data: state.userManage,
    datas: state.userManage.datas,
    roloList: state.roloManage.data
  }
}
function dispatchToProps(dispatch) {
  return {
    addBuilding(payload, params) {
      dispatch({type: 'houseManagement/addBuilding', payload })
    },
    detailBuilding(payload, params) {
      dispatch({type: 'houseManagement/detailBuilding', payload })
    },

    queryRoloList(payload = {}) {
      dispatch({
        type: 'roloManage/queryList',
        payload
      })
    },
    addUser(payload, params) {
      dispatch({type: 'userManage/addUser', payload })
    },
    bangUserRole(payload, params) {
      dispatch({ type: 'userManage/bangUserRole', payload })
    },
    queryDatas(payload, params) {
      dispatch({ type: 'userManage/queryLists', payload })
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
