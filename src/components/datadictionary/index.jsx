import React, {Component} from 'react';
import {Tabs,Input,Button,Form,Row,Col,Table,message,Drawer} from 'antd';
import Moment from 'moment';
import {connect} from 'dva';
import styles from '../common.less';

import Add from './add.jsx';
import Detail from './details';
import Edit from './edit.jsx';

const TabPane = Tabs.TabPane;
const Search = Input.Search;
const FormItem = Form.Item;

let pageSize1 = 10;

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



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      detailVisible: false,
      editVisible: false,
      onNumber: '',
      nextNumber: '',
      isSelect: false,
      code:'',
      showBtn: true,
    };
  }
  handleSearch = (val) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.form.validateFields((err, values) => {
      if (values.type === 'code') {
        this.props.queryList({
          userId: userData.id, 
          code: val, 
          parentId: this.state.onNumber, 
          id: this.state.nextNumber,
          page: '1', 
          size: pageSize1
        });
      } else {
        this.props.queryList({
          userId: userData.id, 
          name: val, 
          parentId: this.state.onNumber, 
          id: this.state.nextNumber,
          page: '1', 
          size: pageSize1
        });
      }
    })
  }
  componentWillMount() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({id: userData.id});
    this.props.queryList({userId: userData.id, page: 1, size: 10});
  }
  onSelect = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect(record.alldata);
    this.setState({isSelect: true})
  }

  formart = (content) => {
    const data = [];
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * content.pageSize + key;
        }
        data.push({
          keys: key,
          code: item.code,
          name: item.name,
          status: item.status,
          createUserId: item.createUserId,
          companyId: item.companyId,
          defaults: item.defaults,
          parentName: item.parentName,
          level: item.level,
          updateTime: Moment(item.updateTime || item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          sort: item.sort,
          id: item.id,
          alldata: item
        })
      });
    }
    const totals = content.total;
    return {
      data,
      pagination: {
        showTotal: totals => `总共 ${totals} 个项目`,
        total: content.total,
        current: content.pageNum,
        showSizeChanger: true,
        showQuickJumper: true,
        onShowSizeChange: (current, pageSize) => {
          pageSize1 = pageSize;
          this.props.queryList({
            userId: userData.id, 
            page: current, 
            size: pageSize, 
            parentId: this.state.onNumber, 
            id: this.state.nextNumber
          });
        },
        onChange: (current, pageSize) => {
          this.props.queryList({
            userId: userData.id, 
            page: current, 
            size: pageSize, 
            parentId: this.state.onNumber, 
            id: this.state.nextNumber
          });
        }
      }
    };
  }
  resetDefault() {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.props.queryList({userId: userData.id, page: 1, size: 10});
  }
  handelSubPage = (type) => {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    if (this.state.isSelect) {
      if (type === 's') { //上一节点
        this.props.queryList({
          page: 1,
          size: 10,
          userId: userData.id,
          parentId: this.state.saveSelect.parentId
        });
        this.setState({onNumber: this.state.saveSelect.parentId, nextNumber: false});
      } else {
        this.props.queryList({
          page: 1,
          size: 10,
          userId: userData.id,
          parentId: this.state.saveSelect.id
        });
        this.setState({
          onNumber: false,
          nextNumber: this.state.saveSelect.id,
          code:''
        });
      }
    } else {
      message.error('未选择表中数据!', 1.5)
    }

  }


  //点击关闭页面
  handleCancel(e)  {
    this.setState({
        [e]: false
    })
  }

  search(item) {
    const userData = JSON.parse(localStorage.getItem('userDetail'));
    this.setState({
        [item]: false
    })
    this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode})
  }

  //index组件与Detail组件传值
  DetailData(data){
    let self = this;
    self.setState({detailVisible:false},function(){
      setTimeout(() => {
        self.setState({editVisible:data})
      }, 500);
    })
  }

  goEdit(){
    if(this.state.isSelect){
      this.setState({editVisible: true})
    }else{
      message.error('未选择表中数据!', 1.5)
    }
  }



  render() {
    const { data} = this.props;
    const content = data ? this.formart(data) : [];

    const columns = [
      {
        title: '序号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
      }, {
        title: '字段编码',
        dataIndex: 'code',
        key: 'code'
      }, {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name'
      }, {
        title: '参数',
        dataIndex: 'defaults',
        key: 'defaults'
      }, {
        title: '父节点名称',
        dataIndex: 'parentName',
        key: 'parentName'
      }, {
        title: '层级',
        dataIndex: 'level',
        key: 'level'
      }, {
        title: '子层级',
        dataIndex: 'childrenLevel',
        key: 'childrenLevel'
      },{
        title: '字段状态',
        key: 'status',
        dataIndex: 'status',
        render: (value) => {
          if(value == '1'){
            return "启用"
          }
          if(value == '0'){
            return "禁用"
          }
        }
      },{
        title: '排序',
        key: 'seq',
        dataIndex: 'seq',
        width: 200,
        render: (value,record) => {
          if(this.state.showBtn){
            return <Button type="primary" onClick={ () => this.setState({showBtn: false}) }>修改排序</Button>
          }else{
            return (
              <div>
                <Input 
                  style={{width:'60%',height:33}} 
                  placeholder="请输入排序" />
                <Button type="primary">确定</Button>
              </div>
            )
          }
          
        }
      }
    ];

    return (
      <div style={{width: '100%',height: '100%'}} className={styles.commonBox}>
        <div style={{width: '100%',padding: 24,backgroundColor: "#FFF"}}>
          <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
            <TabPane tab="数据字典" key="1">
              <Row style={{lineHeight:'39.44px'}}>
                <Col xxl={5} xl={8}>
                  <Col span={22}>
                    <FormItem
                        label="字段名称"
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}>
                      <Search
                        maxLength={50}
                        placeholder="输入字段名称"
                        onSearch={this.handleSearch}
                        enterButton
                        onChange={(e)=>this.setState({name:e.target.value})}
                      />
                    </FormItem>
                  </Col>
                </Col>
                <Col span={13}>
                  <Button type="primary" style={{marginRight: 10}} 
                    onClick={()=>this.setState({addVisible: true})}>新增字段</Button>
                  <Button type="primary" style={{marginRight: 10,width:98}} 
                    onClick={ this.goEdit.bind(this) }>编辑</Button>
                  <Button type="primary" style={{marginRight: 10}}
                    onClick={this.handelSubPage.bind(this, 's')}>上一节点</Button>
                  <Button type="primary"
                    onClick={this.handelSubPage.bind(this, 'x')}>下一节点</Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </div>
        <div style={{width: '100%',padding: 24,backgroundColor: "#FFF",marginTop: 20}}>
          <Row>
            <Table
              loading={this.props.loading}
              columns={columns}
              dataSource={content.data}
              rowKey={record => record.id}
              onRow={(record) => ({onClick: this.onSelect.bind(this, record)})}
              pagination={content.pagination}
              bordered
              size="middle"/>
          </Row>
        </div>


        <Drawer
          title="新增字段"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'addVisible')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.addVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Add search={this.search.bind(this)}/>
        </Drawer>

        <Drawer
          title="详情"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'detailVisible')}
          maskClosable={false}
          destroyOnClose
          visible={this.state.detailVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Detail search={this.search.bind(this)} goEdit={this.DetailData.bind(this)} />
        </Drawer>

        <Drawer
          title="编辑"
          width="45%"
          placement="right"
          onClose={this.handleCancel.bind(this, 'editVisible')}
          destroyOnClose
          maskClosable={false}
          visible={this.state.editVisible}
          style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
          >
          <Edit search={this.search.bind(this)} />
        </Drawer>

      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    data: state.Dictionary.list.data,
    loading: !!state.loading.models.Dictionary
  }
}
function dispatchToProps(dispatch) {
  return {
    queryList(payload, params) {
      dispatch({type: 'Dictionary/queryList', payload})
    },
    saveSelect(payload = {}) {
      dispatch({type: 'Dictionary/save', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
