import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Row,Col, Input , Icon, Button, Pagination, message, Upload} from 'antd';
import {connect} from 'dva';
import Style from './index.less'
import Tick from '../../../public/img/u24860.png'
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listGroup: [],
            listMaterial: [],
            total: 0,
            pageSize: 0,
            current: 0,
            imgInfo: [],
            type: 1,
            pictureGroupId: 0,
            name: ''
        }
    }
    componentWillMount() {
        let goodsId = this.context.router.route.match.params.goodsId
        let self = this
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.props.queryGroup({
            params:{
                userId: userData.id,
                instCode: userData.instCode
            },
            func: function() {
                self.setState({
                    listGroup: self.props.listGroup
                })
            }
        });
        this.props.queryMaterial({
            params:{
                userId: userData.id,
                type: '1',
                page: 1,
                size: 12,
                instCode: userData.instCode
            },
            func: function(){
                // if(goodsId) {

                // } else {
                    self.props.listMaterial.list.forEach((item, index) =>{
                        item.checked = false
                    })
                    self.setState({
                        listMaterial: self.props.listMaterial.list,
                        total: self.props.listMaterial.total,
                        pageSize: self.props.listMaterial.pageSize,
                        current: self.props.listMaterial.pageNum,
                    })
                // }
            }
        })
        //把此页面this传给父组件
        this.props.onRef('imgSelf',this)
    }
    lableApply() {
        let children = []
        this.state.listGroup.forEach((element, index) => {
            children.push(
                (
                    <li className={element.checked ? `${Style.liBg}` : ''} key={index} onClick={this.lableChange.bind(this, element, index)}>
                        <span className={Style.lable}>{element.name}</span>
                        {element.checked ? (<span className={Style.lable__right}></span>): null}
                    </li>  
                )
            )
        });
        return children
    }
    lableChange(param, index) {
        let self = this
        const userData = JSON.parse(localStorage.getItem('userDetail'))
        let list = []
        this.state.listGroup.forEach(data=>{
            list.push(Object.assign({},data))
        })
        list.forEach((item,i)=>{
            if(i == index) {
                item.checked = true
            } else {
                item.checked = false
            }
        })
        console.log(param)
        this.setState({
            listGroup: list,
            type: param.type,
            pictureGroupId: param.id
        },()=>{
            this.props.queryMaterial({
                params:{
                    userId: userData.id,
                    name: this.state.name,
                    type: param.type ? param.type : undefined,
                    pictureGroupId: param.id,
                    page: 1,
                    size: 12,
                    instCode: userData.instCode
                },
                func: function(){
                    self.props.listMaterial.list.forEach((item, index) =>{
                        item.checked = false
                    })
                    self.setState({
                        listMaterial: self.props.listMaterial.list,
                        total: self.props.listMaterial.total || 0,
                        pageSize: self.props.listMaterial.pageSize  || 0,
                        current: self.props.listMaterial.pageNum  || 0,
                    })
                }
            })
        })
    }
    imgApply() {
        console.log(this.state.listMaterial)
        let children = []
        this.state.listMaterial.forEach((element, index) => {
            children.push(
                (
                    <Col span={6} className={Style.col} style={{marginBottom: 10}} key={index} onClick={this.imgClick.bind(this, element, index)}>
                        <div className={Style.imgDetail}>
                            <img src={`/backstage/upload/download?uuid=${element.ossKey}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>
                        </div>
                        {
                            element.checked ? (<div className={Style.shade} style={{width: "calc(100% - 8px)"}}>
                            <img src={Tick} alt=""/>
                        </div>) : null
                        }
                       
                    </Col>
                )
            )
        });
        return children
    }
    imgClick(params, index) {
        
        let imgInfo = this.state.imgInfo
        if (imgInfo.length > (this.props.selectImgNum - 1)) {
            if(this.state.listMaterial[index].checked) {
                let array = []
                this.state.listMaterial.forEach(data=>{
                    array.push(Object.assign({},data))
                })
                array[index].checked = false
                let list = []
                imgInfo.forEach(data=>{
                    if(params.id != data.id) {
                        list.push(Object.assign({},data))
                    }  
                })
                this.setState({
                    listMaterial: array,
                    imgInfo: list
                })
            } else {
                message.error(`最多可以选择${this.props.selectImgNum}张`);
            }
        } else {
            let list = []
            this.state.listMaterial.forEach(data=>{
                list.push(Object.assign({},data))
            })
            list.forEach((item,i)=>{
                if(i == index) {
                    item.checked = !item.checked
                    if(item.checked) {
                        imgInfo.push(params)
                        this.setState({
                            imgInfo
                        })
                    } else {
                        let array = []
                        imgInfo.forEach(data=>{
                            if(params.id != data.id) {
                                array.push(Object.assign({},data))
                            }  
                        })
                        console.log(array)
                        this.setState({
                            imgInfo: array
                        })
                    }
                }
            })
            this.setState({
                listMaterial: list
            })
        }
       
    }
    searchImg() {
        let self = this
        const userData = JSON.parse(localStorage.getItem('userDetail'))
        this.props.queryMaterial({
            params:{
                userId: userData.id,
                type: this.state.type,
                name: this.state.name,
                pictureGroupId: this.state.pictureGroupId,
                page: 1,
                size: 12,
                instCode: userData.instCode
            },
            func: function(){
                self.props.listMaterial.list.forEach((item, index) =>{
                    item.checked = false
                })
                self.setState({
                    listMaterial: self.props.listMaterial.list,
                    total: self.props.listMaterial.total || 0,
                    pageSize: self.props.listMaterial.pageSize  || 0,
                    current: self.props.listMaterial.pageNum  || 0,
                })
            }
        })
    }
    inputChange(param, e) {
        this.setState({
            [param]: e.target.value
        })
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
        return true;
    }
    handleImg(info) {
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
                        self.props.queryGroup({
                            params:{
                                userId: userData.id,
                                instCode: userData.instCode
                            },
                            func: function() {
                                self.setState({
                                    listGroup: self.props.listGroup
                                })
                            }
                        });
                        self.props.queryMaterial({
                            params:{
                                userId: userData.id,
                                type: '1',
                                page: 1,
                                size: 12,
                                instCode: userData.instCode
                            },
                            func: function(){

                                self.props.listMaterial.list.forEach((item, index) =>{
                                    item.checked = false
                                })
                                self.setState({
                                    listMaterial: self.props.listMaterial.list,
                                    total: self.props.listMaterial.total,
                                    pageSize: self.props.listMaterial.pageSize,
                                    current: self.props.listMaterial.pageNum,
                                })
                            }
                        })
                    }
                })
            }
        } else if (info.file.status === 'error') {
            message.error(`图片上传失败.`);
        }

    }
    customRequest() {
        console.log(arguments)
    }

    save() {
        this.props.closeSelectImg(this.state.imgInfo)
    }
    close() {
        this.props.closeSelectImg()
    }
    pagination(page, size) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        let self = this
        self.props.queryMaterial({
            params:{
                userId: userData.id,
                type: '1',
                page: page,
                size: size,
                instCode: userData.instCode
            },
            func: function(){
               
                    self.props.listMaterial.list.forEach((item, index) =>{
                        item.checked = false
                    })
                    self.setState({
                        listMaterial: self.props.listMaterial.list,
                        total: self.props.listMaterial.total,
                        pageSize: self.props.listMaterial.pageSize,
                        current: self.props.listMaterial.pageNum,
                    })
                
            }
        })
    }
    render() {
        let params = {
            name: 'file',
            action: '/backstage/upload/upLoadRKey',
            multiple: false
          }
        return (
            <div className={Style.contentBox}>
               <Row style={{height: 'calc(100vh - 60px)'}} className={Style.row}>
                   <Col span={5} className={Style.content__left}>
                        <div className={Style.header}>选择图片</div>
                        <div className={Style.classify} style={{height: 'calc(100vh - 120px)'}}>
                            <ul>
                                {this.lableApply()}
                                {/* <li className={Style.liBg}>
                                    <span className={Style.lable}>全部图片</span>
                                    <span className={Style.lable__right}></span>
                                </li>
                                <li>衣服</li>
                                <li>裤子</li>
                                <li>未分组</li> */}
                            </ul>
                        </div>
                   </Col>
                   <Col span={19} className={Style.content__right}>
                    <div className={Style.header}>
                        <Input 
                            className={Style.search}
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.5)' }} />}
                            value={this.state.name}
                            onChange={this.inputChange.bind(this, 'name')}
                            placeholder="搜索图片名称" 
                        />
                        <Button type="primary"  className={Style.btn} onClick={this.searchImg.bind(this)}>确定</Button>
                        <Upload
                            beforeUpload={this.checkImg}
                            onChange={this.handleImg.bind(this)}
                            {...params}
                        >
                            <Button   
                                className={Style.upload}>上传图片</Button>
                        </Upload>

                    </div>
                    <div className={Style.list}>
                        <Row gutter={8} style={{minHeight: 'calc(100vh - 200px)'}}>
                            {this.imgApply()}
                        </Row>       
                        {/* <Row gutter={8}>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>1</div>
                                <div className={Style.shade} style={{width: "calc(100% - 8px)"}}>
                                    <img src={Tick} alt=""/>
                                </div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>2</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>3</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>4</div>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{marginTop: 10}}>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>1</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>2</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>3</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>4</div>
                            </Col>
                        </Row>
                        <Row gutter={8} style={{marginTop: 10}}>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>1</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>2</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>3</div>
                            </Col>
                            <Col span={6} className={Style.col}>
                                <div className={Style.imgDetail}>4</div>
                            </Col>
                        </Row> */}
                        <div className={Style.pagination}>
                            <Pagination  
                                pageSizeOptions={['12','24','36','48']} 
                                pageSize={this.state.pageSize} 
                                current={this.state.current} 
                                total={this.state.total} 
                                showSizeChanger 
                                showQuickJumper
                                onChange={this.pagination.bind(this)}
                            />
                        </div>
                    </div>
                   </Col>
               </Row>
               <div className={Style.footer}>
                    <span style={{marginRight: 10}}>已选择 {this.state.imgInfo.length} 张，最多可以选择 {this.props.selectImgNum} 张</span>
                    <Button type="primary" className={Style.btn}  style={{marginRight: 10}} onClick={this.save.bind(this)}>确定</Button>
                    <Button className={Style.btn} onClick={this.close.bind(this)}>取消</Button>
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
        listGroup: state.selectImg.listGroup,//分组数据
        listMaterial: state.selectImg.listMaterial
    }
}
function dispatchToProps(dispatch) {
    return {
        addMaterial(payload = {}) {
            dispatch({type: 'fodderManage/addMaterial', payload})
        },
        queryGroup(payload = {}) {
            dispatch({type: 'selectImg/queryGroup', payload})
        },
        //素材管理
        queryMaterial(payload = {}) {
            dispatch({type: 'selectImg/queryMaterial', payload})
        },
    }
}

export default connect(mapStateToProps, dispatchToProps)(App);