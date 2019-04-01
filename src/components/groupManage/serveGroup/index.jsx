import React, {Component} from 'react';
import {Tabs,Card,Button,Form,Row,Col,Switch,Avatar,Drawer,Pagination,Modal, message} from 'antd';
import {connect} from 'dva';
import styles from '../style.less';

import Edit from './edit/index.jsx';
import Add from './add/index.jsx';

const TabPane = Tabs.TabPane;
const { Meta } = Card;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editVisible: false,
            addVisible: false,
            visible: false,
            groupList: this.props.groupList,
            id: ''
        };
    }


    //点击关闭页面
    handleCancel(e)  {
        this.setState({
            [e]: false
        })
    }
    search(item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        this.setState({
            [item]: false
        })
        this.props.getList({
            params:{
                userId: userData.id,
                businessType: '2',
                instCode: userData.instCode
            },
            func: function() {
                // self.setState({
                //     groupList: self.props.groupList
                // })
            }
        });
    }

 



    handleCancel1 = (e) => {
        this.setState({
            visible: false,
        });
    }
    groupApply() {
        let children = []
        this.props.groupList.forEach((item, index)=>{
           children.push(
            <Card style={{marginBottom: 10}} key={index}>
                <Col span={5}>
                    <Card bordered={false}>
                        <Meta
                        avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`}/>}
                        description={item.name}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <p>商品数量 : &ensp;{item.count}</p>
                </Col>
                <Col span={5} style={{display:'flex',alignItems:'center'}}>
                    {item.isStop ? '禁用' : '启用'}&ensp;&ensp;&ensp;
                    <Switch onChange={this.handleChecked.bind(this, item)} checked={!item.isStop} />
                </Col>
                <Col span={4}>
                    <Row gutter={12}>
                        <Col span={8} onClick={this.goEdit.bind(this, item)}>编辑</Col>
                        {index == 0 ? (
                            <Col span={8} onClick={this.moveDown.bind(this, item)}>下移</Col>
                            ):
                            <Col span={8} onClick={this.moveup.bind(this, item)}>上移</Col>
                        }
                        
                        <Col span={8} onClick={this.godel.bind(this, item)}>删除</Col>
                    </Row>
                   
                </Col>
            </Card>
           )
        })
        return children
    }
    moveDown(params) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
       
        this.props.moveDownGroup({
            params:{
                userId: userData.id,
                goodGroupId: params.id,
            },
            func: function() {
                self.props.getList({
                    params:{
                        userId: userData.id,
                        businessType: '2'
                    },
                    func: function() {
                        self.setState({
                            groupList: self.props.groupList
                        })
                    }
                });
            }
        });
    }
    moveup(params) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
       
        this.props.moveUpGroup({
            params:{
                userId: userData.id,
                goodGroupId: params.id,
                businessType: '2'
            },
            func: function() {
                self.props.getList({
                    params:{
                        userId: userData.id,
                        businessType: '2'
                    },
                    func: function() {
                        self.setState({
                            groupList: self.props.groupList
                        })
                    }
                });
            }
        });
    }
    handleChecked(params){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
       
        this.props.updateStateGroup({
            params:{
                userId: userData.id,
                goodGroupId: params.id,
                type: params.isStop ? 1:2,
            },
            func: function() {
                self.props.getList({
                    params:{
                        userId: userData.id,
                        businessType: '2'
                    },
                    func: function() {
                        self.setState({
                            groupList: self.props.groupList
                        })
                    }
                });
            }
        });
       
    }
    goEdit(params){
        this.props.saveSelect(params)
        this.setState({editVisible: true})
    }
    godel(params) {
        this.setState({
            visible: true,
            id: params.id
        })
    }
    delSure = (e) => {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        this.props.deleteGroup({
            params: {
                id: this.state.id,
                userId: userData.id,
                businessType: '2'
            },
            func: function () {
                message.success('删除成功!', function() {
                    self.setState({
                        visible: false,
                    }, function() {
                        self.props.getList({
                            params:{
                                userId: userData.id,
                                businessType: '2'
                            },
                            func: function() {
                                self.setState({
                                    groupList: self.props.groupList
                                })
                            }
                        });
                    });
                });
              
            }
        }) 
    }
    render() {
        const {data} = this.props;
        // const content = data ? this.formart(data) : [];
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.organxBoxs}>
                <div className={styles.search}>

                            <Row>
                                <Col span={5}>
                                    <Button type="primary" 
                                        onClick={ () => this.setState({addVisible: true}) } 
                                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新建分组</Button>
                                </Col>

                            </Row>

                </div>
                <div style={{width: '100%',padding: 24, backgroundColor: "#FFF",marginTop: 20}}>
                    {this.groupApply()}
                </div>

                <Drawer
                    title="编辑"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editVisible')}
                    maskClosable={false}
                    visible={this.state.editVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Edit search={this.search.bind(this)}  />
                </Drawer>

                <Drawer
                    title="新增分组"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'addVisible')}
                    maskClosable={false}
                    visible={this.state.addVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <Add search={this.search.bind(this)}  />
                </Drawer>

                <Modal
                    title="删除分组"
                    visible={this.state.visible}
                    onOk={this.delSure}
                    onCancel={this.handleCancel1}
                    >
                    <p>确定删除分组?</p>
                </Modal>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        groupList: state.groupManage.groupList
    }
}

function dispatchToProps(dispatch) {
    return {
        getList(payload = {}) {
            dispatch({type: 'groupManage/getList', payload})
        },
        updateStateGroup(payload = {}) {
            dispatch({type: 'groupManage/updateStateGroup', payload})
        },
        moveUpGroup(payload = {}) {
            dispatch({type: 'groupManage/moveUpGroup', payload})
        },
        moveDownGroup(payload = {}) {
            dispatch({type: 'groupManage/moveDownGroup', payload})
        },
        deleteGroup(payload = {}) {
            dispatch({type: 'groupManage/deleteGroup', payload})
        },
        saveSelect(payload = {}) {
            dispatch({type: 'groupManage/save', payload})
        }
    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
