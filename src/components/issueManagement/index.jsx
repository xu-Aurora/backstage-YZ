import React from 'react';
import Moment from 'moment';
import {Input,Select,Button,Row,Col,Form,Tabs,Table,DatePicker,Icon} from 'antd';
import {connect} from 'dva'
import styles from '../common.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

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

let pageSize1 = 10;

const columns = [
    {
        title: '编号',
        dataIndex: 'keys',
        key: 'keys',
        width: 60
      },
    {
        title: '目录id',
        dataIndex: 'directoryId',
        key: 'directoryId'
    }, {
        title: '问题id',
        dataIndex: 'id',
        key: 'id'
    }, {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
    }, {
        title: '内容',
        dataIndex: 'content',
        key: 'content'
    }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '创建人',
        dataIndex: 'createUserId',
        key: 'createUserId'
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime'
    }, {
        title: '回答时间',
        dataIndex: 'answerTime',
        key: 'answerTime'
    }, {
        title: '回答人',
        dataIndex: 'answerUserId',
        key: 'answerUserId'
    }, {
        title: '答案',
        dataIndex: 'answer',
        key: 'answer'
    }, {
        title: '热门问题',
        dataIndex: 'isHot',
        key: 'isHot',
        render: (text) => text == '0' ? '不是' : '是'
    }, {
        title: '终端类型',
        dataIndex: 'terminal',
        key: 'terminal',
        render: (text) => text == '0' ? '光伏贷' : '壹税通'
    }
];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showScreen: false,
            startTime: '',
            endTime: '',
            title: '',
            directoryId: '',
            terminal: '',
            inputVal: '',
            optionVal: 'directoryId'
        };
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            page: 1,
            size: 10,
            userId: this.props.linkID ? this.props.linkID : userData.id
        });
    }
    onSelect(record, e){
        e.target.parentNode.style.backgroundColor = '#e6fcff';
        siblingElems(e.target.parentNode);
        this.props.saveSelect(record.alldata);
        this.setState({saveSelect: record.alldata});
    }
    formart = (content) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const data = [];
        let self = this
        if (content.list) {
            content.list.forEach((item, index) => {
                data.push({
                    keys: index+1,
                    directoryId: item.directoryId,
                    id: item.id,
                    title: item.title,
                    content: item.content,
                    createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    createUserId: item.createUserId,
                    endTime: item.endTime ? Moment(item.endTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    answerTime: item.answerTime ? Moment(item.answerTime).format("YYYY-MM-DD HH:mm:ss") : '',
                    answerUserId: item.answerUserId,
                    answer: item.answer,
                    isHot: item.isHot,
                    terminal: item.terminal,
                    alldata: item
                })
            });
        }
        const totals = content.total;
        return {
            data,
            pagination: {
                total: content.total,
                showTotal: totals => `总共 ${totals} 个项目`,
                current: content.pageNum,
                showSizeChanger: true,
                showQuickJumper: true,
                onShowSizeChange: (current, pageSize) => {
                    pageSize1 = pageSize;
                    this.props.queryList({
                        userId: this.props.linkID ? this.props.linkID : userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,                       
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        terminal: this.state.terminal
                    });
                },
                onChange: (current, pageSize) => {
                    this.props.queryList({
                        userId: this.props.linkID ? this.props.linkID : userData.id,
                        page: current,
                        size: pageSize,
                        [`${self.state.optionVal}`]: self.state.inputVal,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        terminal: this.state.terminal
                    });
                }
            }
        };
    }
    resetDefault(){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryList({
            page: 1,
            size: 10,
            userId: this.props.linkID ? this.props.linkID : userData.id
        });
    }
    timeRange (type, date, times) {
        if (type === 'x1') {
            this.setState({startTime: times})
        }
        if (type === 'x2') {
            this.setState({endTime: times})
        }
    }
    handleSelectChange = (type, value) => {
        if (type === 'terminal') {
            this.setState({terminal: value})
        }
        if (type === 'status') {
            this.setState({status: value})
        }
    }
    inputChange (ev) {
        this.setState({
          inputVal: ev.target.value
        })
      }
    selectChange (ev) {
    this.setState({
        inputVal: '',
        optionVal: ev
    })
    }
    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
            this.props.form.validateFields((err, values) => {
                if (values.type === 'directoryId') {
                    this.props.queryList({
                        userId: userData.id,
                        directoryId: this.state.inputVal,
                        page: '1',
                        size: pageSize1,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        terminal: this.state.terminal
                    })
                } else if (values.type === 'title') {
                    this.props.queryList({
                        userId: userData.id,
                        title: this.state.inputVal,
                        page: '1',
                        size: pageSize1,
                        startTime: this.state.startTime ? Moment(this.state.startTime).format('x') : '',
                        endTime: this.state.endTime ? Moment(this.state.endTime).format('x') : '',
                        terminal: this.state.terminal
                    })
                }
            })
    }

    //展开与收起
    toggleForm = () => {
      this.setState({
        showScreen: !this.state.showScreen,
        startTime: '',
        endTime: '',
        terminal: ''
      });
    };

    render() {
        const {data} = this.props;
        const {showScreen} = this.state;
        const {getFieldDecorator} = this.props.form;
        const content = data ? this.formart(data) : [];
        let selectElemnt = null;
        if (showScreen) {
            selectElemnt = (
                <Row style={{marginTop: '15px'}}>
                    <Col span={9}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>开始时间</span>)}
                            labelCol={{span: 3}}
                            wrapperCol={{span: 20}}>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x1')}
                                value={this.state.startTime ? Moment(this.state.startTime) : null}                                
                                style={{
                                width: '42%'
                            }}/>
                            <span style={{margin: '0 5px',color: '#7B7B7B'}}>——</span>
                            <DatePicker
                                format="YYYY-MM-DD"
                                onChange={this.timeRange.bind(this, 'x2')}
                                value={this.state.endTime ? Moment(this.state.endTime): null}                                
                                style={{width: '42%'}}/>
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            label={(<span style={{fontSize: 14}}>终端类型</span>)}
                            labelCol={{span: 7}}
                            wrapperCol={{span: 13}}>
                            <Select
                                onChange={this.handleSelectChange.bind(this, 'terminal')}
                                value={this.state.terminal}
                                placeholder="全部"
                                style={{width: '100%'}}>
                                <Option value="">全部</Option>
                                <Option value="0">光伏贷</Option>
                                <Option value="1">壹税通</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={2} offset={9}>
                      <Col span={14}>
                          <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                      </Col>
                      <Col>
                        <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                          收起 <Icon type="up" />
                        </a>
                      </Col>
                    </Col>
                </Row>
            )
        }
        return (
            <div style={{width: '100%', height: '100%'}} className={styles.commonBox}>
                <div style={{width: '100%',padding: '10px 24px',backgroundColor: "#FFF",boxShadow:'5px 5px 5px rgba(0, 0, 0, 0.35)'}}>
                    <Tabs defaultActiveKey="1" onTabClick={this.resetDefault.bind(this)}>
                        <TabPane tab="问题管理" key="1">
                            <Row >
                              <Col span={21} style={{marginRight:'3%'}} key="agment">
                                <Col span={6}>
                                  <InputGroup compact>
                                    {getFieldDecorator('type', {initialValue: 'directoryId'})(
                                      <Select style={{ width: '30%' }}  onChange={this.selectChange.bind(this)}>
                                        <Option value="directoryId">目录id</Option>
                                        <Option value="title">标题</Option>
                                      </Select>
                                    )}
                                    <Input style={{ width: '70%' }}
                                      maxLength={50}
                                      value={this.state.inputVal} 
                                      onChange={this.inputChange.bind(this)} 
                                      prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                      placeholder="输入搜索内容" />
                                  </InputGroup>
                                </Col>
                              </Col>
                              <Col span={2} style={{display:showScreen?'none':''}}>
                                <Col span={14}>
                                    <Button type="primary" onClick={this.handleSearch.bind(this)}>确定</Button>
                                </Col>  
                                <Col>
                                  <a style={{color: '#1890ff',lineHeight:2.3 }} onClick={this.toggleForm}>
                                    展开 <Icon type="down" />
                                  </a>
                                </Col>
                              </Col>
                            </Row>
                            {selectElemnt}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',backgroundColor: "#FFF",padding:24,marginTop: 20}}>
                    
                    <Row>
                        <Table
                        loading={this.props.loading}
                        columns={columns}
                        dataSource={content.data}
                        rowKey={record => record.id}
                        onRow={(record) => ({
                            onClick: this.onSelect.bind(this, record)
                          })
                        }
                        pagination={content.pagination}
                        bordered size="middle" />
                    </Row>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        data: state.issueManagement.list,
        linkID: state.login.userMsg.id,
        loading: !!state.loading.models.issueManagement
    }
}

function dispatchToProps(dispatch) {
    return {
        queryList(payload = {}) {
            dispatch({type: 'issueManagement/serch', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'issueManagement/save', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
