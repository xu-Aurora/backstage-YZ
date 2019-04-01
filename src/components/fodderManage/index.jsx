import React, {Component} from 'react';
import {Tabs,Button,Form,Row,Col,Drawer,Input,Select,Pagination,Modal,Layout, Menu, Icon,Checkbox,Card,Upload,message} from 'antd';
import {connect} from 'dva';
import styles from './index.less';

import EditGroup from './group/editGroup.jsx';
import MoveGroup from './group/moveGroup.jsx';
import AddGroup from './group/addGroup.jsx';
import EditList from './list/edit.jsx';

const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;
const { Header, Content, Footer, Sider } = Layout;

let pageSize1 = 20;

//antd自定义字体图表
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_869860_rkiyrmuammj.js',
});
const props = {
    action: '/backstage/upload/upLoadRKey',
    headers: {authorization: 'picture-card'},
    multiple: true
}


let ids = [];   //选中的图片的id值集合
let names = []; //选中的图片的name值集合
let pictureGroupIds = []; //选中的图片的分组值集合

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editGroupVisible: false,
            moveGroupVisible: false,
            addGroupVisible: false,
            editListVisible: false,
            visibleGroup: false,
            visibleImg: false,
            checkAll: false,
            inputVal: '',
            optionVal: 'name',
            tebKeys: ['1']
        };
    }

    componentWillMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryGroup({
            userId: userData.id,
            instCode: userData.instCode
        });
        this.props.queryMaterial({
            userId: userData.id,
            type: '1',
            page: 1,
            size: 20,
            instCode: userData.instCode
        })
        
    }
    //全选
    singleChecked(id,name,pictureGroupId,e){
        e.stopPropagation();
        if(e.target.checked){
            ids.push(id)
            names.push(name)
            pictureGroupIds.push(pictureGroupId)
        }else{
            ids.splice( ids.indexOf( id ), 1 )
            names.splice( names.indexOf( name ), 1 )
            pictureGroupIds.splice( names.indexOf( pictureGroupId ), 1 )
        }
        const imgList = this.props.listMaterial.list;
        imgList.forEach((item) => {
            if(item.id == id){
                item.status = e.target.checked
            }
        })
        this.setState({
            checkAll: ids.length == this.props.listMaterial.list.length,
        })
    }
    onCheckAllChange = (e) => {
        this.setState({
            checkAll: e.target.checked
        })
        if(e.target.checked){   //全选把返回的数据push进数组
            this.props.listMaterial.list.forEach((item) => {
                if(ids.indexOf(item.id) == -1){
                    ids.push(item.id)
                    names.push(item.name)
                    pictureGroupIds.push(item.pictureGroupId)
                }
                item.status = true
            })
        }else{  //全反选,把数组清空
            this.props.listMaterial.list.forEach((item) => {
                item.status = false
            })
            ids = []
            names = []
            pictureGroupIds = []
        }

    }

    handleSearch () {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.form.validateFields((err, values) => {
            if(values.type == 'name'){
                this.props.queryMaterial({
                    userId: userData.id, 
                    page: '1',
                    size: pageSize1,
                    name: this.state.inputVal,
                    instCode: userData.instCode
                  });
            }
        })
    }


    selectChange (ev) {
        this.setState({
            inputVal: '',
            optionVal: ev
        })
    }


    //清空ids数据
    emptyArr() {
        ids = [];
        this.setState({
            checkAll: false,
        })
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
        this.props.queryGroup({ //分组
            userId: userData.id,
            instCode: userData.instCode
        })
        this.props.queryMaterial({  //列表图片
            userId: userData.id,
            // type: '1',
            page: 1,
            size: 20,
            instCode: userData.instCode,
            pictureGroupId: this.state.pictureGroupId
        })
    }

    handleOk(type){
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(type == 'visibleGroup') {    //删除分组
            this.props.deleteGroup({
                params: {
                    id: self.state.groupDataId,
                    userId: userData.id
                },
                func: function () {
                    message.success('操作成功!', 1.5, function() {
                        self.props.queryGroup({userId: userData.id});
                        self.setState({
                            checkAll: false
                        })
                    });
                }
            })
            this.setState({
                visibleGroup: false,
            });
        }
        if(type == 'visibleImg') {  //删除图片
            this.props.deleteMaterial({
                params: {
                    userId: userData.id,
                    ids: ids.join(','),
                    names: names.join(','),
                    pictureGroupIds: pictureGroupIds[0]
                },
                func: function () {
                    message.success('操作成功!', 2, function() {
                        self.props.queryGroup({userId: userData.id});
                        self.props.listMaterial.list.forEach((item) => {
                            item.status = false
                        })
                        ids = [];
                        names = [];
                        pictureGroupIds = [];
                        self.props.queryMaterial({  //列表图片
                            userId: userData.id,
                            // type: '1',
                            page: 1,
                            size: 20,
                            instCode: userData.instCode,
                            pictureGroupId: this.state.pictureGroupId
                        })
                        // self.props.queryMaterial({
                        //     userId: userData.id,
                        //     type: '1',
                        //     page: 1,
                        //     size: 20,
                        //     instCode: userData.instCode
                        // })
                    });
                }
            })
            this.setState({
                visibleImg: false,
            });
        }
    }

    goEdit(id,e){
        e.stopPropagation();
        this.setState({
            editGroupVisible: true,
            groupDataId: id
        })
    }
    closeGroup(id,e) {
        e.stopPropagation();
        this.setState({
            visibleGroup: true,
            groupDataId: id
        })
    }

    //图片详情弹出框展示
    showEdit(id){
        this.setState({
            editListVisible: true,
            imgListId: id
        })
    }

    //点击分组,展示图片列表
    imgList(id,type){
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if(type){   //全部图片或为分组
            this.props.queryMaterial({
                userId: userData.id,
                type,
                page: 1,
                size: 20,
                instCode: userData.instCode
            })
        }else{
            this.props.queryMaterial({
                userId: userData.id,
                pictureGroupId: id,
                page: 1,
                size: 20,
                instCode: userData.instCode
            })
        }
        this.setState({
            pictureGroupId: id
        })
    }
    //图片上传
    handleImg(info){
        let self = this;
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        if (info.file.status === 'done') {
            if(info.file.response.code){
                message.error('图片上传失败');
            }else{
                self.props.addMaterial({
                    params: {
                        userId: userData.id,
                        ossKey: info.file.response,
                        name: info.file.name,
                    },
                    func:() => {
                        message.destroy();
                        message.success(`图片上传成功`)
                        self.props.queryMaterial({
                            userId: userData.id,
                            type: '1',
                            page: 1,
                            size: 10,
                            instCode: userData.instCode
                        })
                        self.props.queryGroup({
                            userId: userData.id,
                            instCode: userData.instCode
                        });
                    }
                })
            }
        } else if (info.file.status === 'error') {
            message.error(`图片上传失败.`);
        }
    }
    //图片校验
    checkImg(file) {
        if (!/image/.test(file.type)) {
            message.error('文件必须为图片！')
            return false;
        }
        if (file.size > 1000000) {
            message.error('图片不能超过1M！')
            return false;
        }
        if (file.length > 10) {
            message.error('图片一次性上传不能超过10张！')
            return false;
        }
        return true;
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const {listGroup,listMaterial} = this.props;
        const listGroups = listGroup ? listGroup : [];
        const listMaterials = listMaterial ? listMaterial : [];
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const totals = listMaterials.total;
        return (
            <div style={{width: '100%',height: '100%'}} className={styles.imgBox}>
                <div  className={styles.search}>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="图片管理" key="1">
                            <Row style={{display:'flex',alignItems:'center'}}>
                                <InputGroup compact>
                                    {getFieldDecorator('type',{initialValue: 'name'})(
                                        <Select style={{ width: 132 }} onChange={this.selectChange.bind(this)}>
                                            <Option value="name">图片名称</Option>
                                        </Select>
                                    )}
                                    <Input style={{ width: 240 }}
                                        maxLength={50}
                                        value={this.state.inputVal} 
                                        onChange={(e) => this.setState({inputVal: e.target.value})}  
                                        prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                                        placeholder="输入搜索内容" />
                                </InputGroup>
                                <Button type="primary" 
                                    style={{marginRight:15,marginRight:10}}
                                    onClick={this.handleSearch.bind(this)}>确定</Button>
                                <Upload 
                                    style={{marginRight:10}}
                                    beforeUpload={this.checkImg}
                                    onChange={this.handleImg.bind(this)}
                                    {...props}
                                >
                                    <Button type="primary"  
                                        style={{backgroundColor:'#FFF',color:'#1890ff',borderColor:'#1890ff'}}>新增图片</Button>
                                </Upload>

                                <Col span={3}>数量 : { listMaterials.total } / 100000</Col>
                            </Row>
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{width: '100%',padding: '0 24px 24px 0', backgroundColor: "#FFF",marginTop: 20,height:'73vh'}}>
                    <Layout>
                        <Sider theme="light">
                            <h3>图片分组</h3>
                            <Menu theme="light" mode="inline" defaultSelectedKeys={this.state.tebKeys}>
                                {  
                                    listGroups?listGroups.map((item,index) => 
                                        <Menu.Item key={ index+1 } onClick={ this.imgList.bind(this,item.id,item.type) }>
                                            <span className="nav-text">{ item.name } ( { item.pictureNumber } )</span>
                                            {
                                                item.id ? (
                                                    <span>
                                                        <IconFont onClick={this.goEdit.bind(this,item.id)} type="icon-edit" />
                                                        <IconFont onClick={this.closeGroup.bind(this,item.id)} type="icon-delete" />
                                                    </span>
                                                ) : ''
                                            }
                                           
                                        </Menu.Item>
                                    ): null
                                }                
                            </Menu>
                            <div style={{textAlign:'center',marginTop:10,padding:'0 15px'}}>
                                <Button style={{width: '100%',border:'1px dashed'}} onClick={()=>this.setState({addGroupVisible:true})}>
                                <Icon type="plus" />新建分组</Button>
                            </div>
                            
                        </Sider>
                        <Layout>
                        <Header style={{ background: '#fff', paddingLeft: 30 }} >
                            <Checkbox
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                                >
                                全选
                            </Checkbox>
                            <Button 
                                onClick={ () => this.setState({moveGroupVisible: true}) }
                                disabled={ids.length == 0 ? true : false}
                                style={{margin:'0 10px'}}>移动分组</Button >
                            <Button 
                                onClick={ () => this.setState({visibleImg: true}) }
                                disabled={ids.length == 0 ? true : false}>删除</Button>
                        </Header>
                        <Content>
                            <Row>
                                {
                                    listMaterials.list ? listMaterials.list.map((item,index) =>
                                        <Col span={4} key={item.id}>
                                            <Card hoverable 
                                                cover={
                                                    <img alt="图裂" style={{width:'100%'}}
                                                    onClick={ this.showEdit.bind(this,item.id) }
                                                    src={`/backstage/upload/download?uuid=${item.ossKey}&viewFlag=1&fileType=jpg&filename=aa`} />}>
                                                <Checkbox 
                                                    checked={item.status} 
                                                    onChange={this.singleChecked.bind(this,item.id,item.name,item.pictureGroupId)}>
                                                    {item.name}
                                                </Checkbox>
                                            </Card> 
                                        </Col>
                                    ) : null
                                }

                            </Row>
              
                        </Content>
                        <Footer style={{ textAlign: 'right' }}>
                            <Pagination 
                                current={listMaterials.pageNum}
                                total={listMaterials.total} 
                                showTotal={totals => `总共 ${totals} 个项目`}
                                showSizeChanger={true}
                                showQuickJumper={true}
                                pageSize={listMaterials.pageSize ? listMaterials.pageSize : null}
                                pageSizeOptions={['20','40','60','80']}
                                onShowSizeChange={(current, pageSize) => {
                                        pageSize1 = pageSize;
                                        this.props.queryMaterial({
                                            userId: userData.id,
                                            page: current,
                                            size: pageSize,
                                            [`${this.state.optionVal}`]: this.state.inputVal,
                                            instCode: userData.instCode
                                        });
                                    }
                                }
                                onChange={
                                    (current, pageSize) => {
                                        this.props.queryMaterial({
                                            userId: userData.id,
                                            page: current,
                                            size: pageSize,
                                            [`${this.state.optionVal}`]: this.state.inputVal,
                                            instCode: userData.instCode
                                        });
                                    }
                                }
                            />
                        </Footer>
                        </Layout>
                    </Layout>

                </div>

                <Drawer
                    title="编辑分组"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editGroupVisible')}
                    maskClosable={false}
                    visible={this.state.editGroupVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <EditGroup 
                        search={this.search.bind(this)} 
                        groupDataId={this.state.groupDataId} 
                        editGroup={() => this.setState({editGroupVisible: false})} />
                </Drawer>

                <Drawer
                    title="批量移动分组"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'moveGroupVisible')}
                    maskClosable={false}
                    visible={this.state.moveGroupVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <MoveGroup 
                        emptyArr={this.emptyArr.bind(this)}
                        search={this.search.bind(this)} 
                        groupData={[ids,this.state.pictureGroupId]} 
                        editGroup={() => this.setState({moveGroupVisible: false})} />
                </Drawer>

                <Drawer
                    title="新增分组"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'addGroupVisible')}
                    maskClosable={false}
                    visible={this.state.addGroupVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <AddGroup search={this.search.bind(this)} addGroup={() => this.setState({addGroupVisible: false})}  />
                </Drawer>

                <Drawer
                    title="详情"
                    width="45%"
                    destroyOnClose
                    placement="right"
                    onClose={this.handleCancel.bind(this, 'editListVisible')}
                    maskClosable={false}
                    visible={this.state.editListVisible}
                    style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                    >
                    <EditList search={this.search.bind(this)} imgListId={this.state.imgListId} editList={() => this.setState({editListVisible: false})} />
                </Drawer>

                <Modal
                    title="删除分组"
                    visible={this.state.visibleGroup}
                    onOk={this.handleOk.bind(this,'visibleGroup')}
                    onCancel={() => this.setState({visibleGroup: false})}
                    >
                    <p>确定删除分组?</p>
                </Modal>
                <Modal
                    title="删除图片"
                    visible={this.state.visibleImg}
                    onOk={this.handleOk.bind(this,'visibleImg')}
                    onCancel={() => this.setState({visibleImg: false})}
                    >
                    <p>确定删除图片?</p>
                </Modal>

            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        listGroup: state.fodderManage.listGroup,//分组数据
        listMaterial: state.fodderManage.listMaterial,//素材数据
    }
}

function dispatchToProps(dispatch) {
    return {
        //图片分组
        queryGroup(payload = {}) {
            dispatch({type: 'fodderManage/queryGroup', payload})
        },
        // addGroup(payload = {}) {
        //     dispatch({type: 'fodderManage/addGroupLatest', payload})
        // },
        deleteGroup(payload = {}) {
            dispatch({type: 'fodderManage/deleteGroup', payload})
        },
        queryGroup2(payload = {}) {
            dispatch({type: 'fodderManage/queryGroup2', payload})
        },
        //素材管理
        queryMaterial(payload = {}) {
            dispatch({type: 'fodderManage/queryMaterial', payload})
        },
        addMaterial(payload = {}) {
            dispatch({type: 'fodderManage/addMaterial', payload})
        },
        deleteMaterial(payload = {}) {
            dispatch({type: 'fodderManage/deleteMaterial', payload})
        },

    }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
