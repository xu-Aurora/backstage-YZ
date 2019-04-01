import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Form,Input,Select,Button,Card,Radio,Upload,Row,Col,Icon,Modal,message,Tag,Tooltip,Tabs,TreeSelect,Drawer,Table } from 'antd';
import {connect} from 'dva';
import styles from './style.less';
import Moment from 'moment';

import Classify from './classify.jsx';
import Arguments from './arguments';
import SelectImg from '../../selectImg';
import addImg from '../../../../public/img/u25694.png'
import delImg from '../../../../public/img/u26356.png'
import addConfigImg from '../../../../public/img/u25988.png'
import TableMoudle from './table.jsx'


const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Search = Input.Search;

const columns = [
    {
        title: '模板名称',
        dataIndex: 'templateName',
        key: 'templateName',
        render: (text, record)=>{
            if(record.defaultStatus) {
                return (
                    <div>{`${record.templateName}【默认模板】`}</div>
                )
            } else {
                return (
                    <div>{record.templateName}</div>
                )
            }
        }
    }, {
        title: '配送区域',
        dataIndex: 'distributionAreaName',
        key: 'distributionAreaName',
        render: (text, record) => {
            let children = record.freightTemplateAreas.map((item, index)=>
               <div key={index} style={{minHeight: '50px'}}>{item.distributionAreaName}</div>
            )
            return children
        }
    }, {
        title: '运费',
        dataIndex: 'freightTemplateAreas',
        key: 'freightTemplateAreas',
        render: (text, record) => {
            let children = record.freightTemplateAreas.map((item, index)=>
                <Row key={index}>
                <Col span={6}>
                    <div style={{marginBottom:5}}>首件(个)</div>
                    <div>{item.firstPrice}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>运费(元)</div>
                    <div>{item.firstPriceFreight}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>续件(个)</div>
                    <div>{item.continuation}</div>
                </Col>
                <Col span={6}>
                    <div style={{marginBottom:5}}>续费(元)</div>
                    <div>{item.continuationFreight}</div>
                </Col>
                </Row>
            )
            return children
        }
    }, {
        title: '最后编辑时间',
        dataIndex: 'updateTime',
        key: 'updateTime'
    }
];


class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            classifyVisible: false,
            argumentsVisible: false,
            fileList: [],
            fileList1: [],
            InpCount: 0,
            texCount: 0,
            selectImgVisible: false,
            startIndex: '',
            arrayImg: [
            ],
            configList: ['1'], //长度控制规格
            firstConfigName: '',
            firstStatus: true,
            firstVisible: false,
            first:{
                list: [],
                value: '',
                name: ''
            },
            secondConfigName: '',
            secondStatus: true,
            secondVisible: false,
            second:{
                list: [],
                value: '',
                name: ''
            },
            thirdConfigName: '',
            thirdStatus: true,
            thirdVisible: false,
            third:{
                list: [],
                value: '',
                name: ''
            },
            headerLIst: [
                {name: '', isMust: false},
                {name: '', isMust: false},
                {name: '', isMust: false},
                {name: '规格图片', isMust: false},
                {name: '销售价', isMust: true},
                {name: '粮票抵用 ', isMust: true},
                {name: '成本价', isMust: true},
                {name: '库存', isMust: true},
                {name: '重量（kg）', isMust: false},
                {name: '体积（立方米', isMust: false},
                {name: '操作', isMust: false}
            ],
            isTable: false,
            parameterList: [],
            groupList: [],
            comIds: '',
            name: '', // 商品名称
            introduction: '', //商品介绍
            goodGroupId: undefined, //商品分组
            type: '1', //商品类型
            categoryId: '', //商品分类
            categoryName: '', //商品分类
            selectImgNum: 0,
            freight: "",
            way: '1'
        };
    }
    componentDidMount() {
        let goodsId = this.context.router.route.match.params.goodsId
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const firstPage = JSON.parse(localStorage.getItem('firstPage'));
        const firstPage1 = JSON.parse(localStorage.getItem('firstPage1'));

        let self = this
        //参数
        this.props.getParameter({
          params: {
            userId: userData.id
          },
          func: function() {
            self.setState({
                parameterList: self.props.parameterList
            })
          }
        })
        //分组
        this.props.getgroup({
            params: {
              userId: userData.id
            },
            func: function() {
              self.setState({
                  groupList: self.props.groupList
              })
            }
        })
        //区域
        this.props.getArea({
            userId: userData.id,
            instCode: userData.instCode
        })
         //快递模板
        this.props.getFreight({
            params: {
                userId: userData.id,
                setType: 1,
                instCode: userData.instCode
            },
            func: function() {
                
            }
        })
       
        if(goodsId) { //别处跳转过来
                this.props.detailGoods({
                    params: {
                        userId: userData.id,
                        goodId: goodsId
                    },
                    func: function() {
                        if(firstPage1) {
                            let goodlist = firstPage1.goodGroupId.replace(/(^\|*)|(\|*$)/g, "").split('|')
                            self.setState({
                                name: firstPage1.name,
                                introduction: firstPage1.introduction,
                                goodGroupId: goodlist,
                                type: firstPage1.type,
                                arrayImg: firstPage1.arrayImg,
                                configList: firstPage1.configList,
                                first: firstPage1.first,
                                firstConfigName: firstPage1.firstConfigName,
                                firstStatus: firstPage1.firstStatus,
                                firstVisible: firstPage1.firstVisible,
                                second: firstPage1.second,
                                secondConfigName: firstPage1.secondConfigName,
                                secondStatus: firstPage1.secondStatus,
                                secondVisible: firstPage1.secondVisible,
                                third: firstPage1.third,
                                thirdConfigName: firstPage1.thirdConfigName,
                                thirdStatus: firstPage1.thirdStatus,
                                thirdVisible: firstPage1.thirdVisible,
                                headerLIst:  firstPage1.headerLIst,
                                isTable: true,
                                comIds: firstPage1.comIds,
                                categoryId: firstPage1.categoryId,
                                categoryName: firstPage1.categoryName,
                                freight: firstPage1.freight,
                                way: firstPage1.way,
                            })
                            let parameterDetail = firstPage1.parameterIds
                            setTimeout(function(){
                                parameterDetail.forEach(item=>{
                                    for(let i in item) {
                                        self.props.form.setFieldsValue({
                                           [i]: item[i]        
                                        })
                                    }
                                })
                                self.props.form.setFieldsValue({
                                    freightSet: firstPage1.freightSet,
                                    isDeliveryTime: firstPage1.isDeliveryTime,
                                    arrivalDay: firstPage1.arrivalDay,
                                    arrivalTime: firstPage1.arrivalTime,
                                    isPick: firstPage1.isPick,
                                    deliveryAreaType: firstPage1.deliveryAreaType     
                                 })
                            },1000)
                                //快递模板
                                if(firstPage1.way == '1') {
                                    self.props.getFreight({
                                        params: {
                                            userId: userData.id,
                                            setType: '1',
                                            instCode: userData.instCode
                                        },
                                        func: function() {
                                        }
                                    })
                                } else if(firstPage1.way == '2') {
                                    self.props.getFreight({
                                        params: {
                                            userId: userData.id,
                                            setType: '2',
                                            instCode: userData.instCode
                                        },
                                        func: function() {
                                            let list 
                                            self.props.freightList.list.forEach((item, index) => {
                                                if(item.id == firstPage1.freight) {
                                                    list = item
                                                }
                                            })
                                            self.setState({
                                                freightList: list
                                            })
                    
                                        }
                                    })
                                }
                        } else {
                            let data = self.props.detailList
                            let goodlist = data.goodGroupId.replace(/(^\|*)|(\|*$)/g, "").split('|')
                            self.setState({
                                name: data.name,
                                introduction: data.introduction,
                                type: data.type,
                                categoryId: data.categoryId,
                                categoryName: data.categoryName,
                                goodGroupId: goodlist,
                                comIds: data.scopeInfo ? data.scopeInfo.split(',') : '',
                                way: data.freightWay,
                            })
                            if(data.freightWay == 2) {
                                //快递模板
                                self.props.getFreight({
                                    params: {
                                        userId: userData.id,
                                        setType: 2,
                                        instCode: userData.instCode
                                    },
                                    func: function() {
                                        let list 
                                        self.props.freightList.list.forEach((item, index) => {
                                            if(item.id == data.freightId) {
                                                list = item
                                            }
                                        })
                                        self.setState({
                                            freightList: list,
                                            freight: Number(data.freightId)
                                        })
                                    
                                    }
                                })
                            }
                            let imgList = data.pic.split(',')
                            let arrayImg = []
                            imgList.forEach(item=>{
                                arrayImg.push({ossKey: item})
                            })
                            self.setState({
                                arrayImg
                            })

                            let skuDetail = JSON.parse(data.specificationIds)
                            if(skuDetail) {
                                self.setState({
                                    configList: skuDetail.configList,
                                    first: skuDetail.first,
                                    firstConfigName: skuDetail.firstConfigName,
                                    firstStatus: skuDetail.firstStatus,
                                    firstVisible: skuDetail.firstVisible,
                                    second: skuDetail.second,
                                    secondConfigName: skuDetail.secondConfigName,
                                    secondStatus: skuDetail.secondStatus,
                                    secondVisible: skuDetail.secondVisible,
                                    third: skuDetail.third,
                                    thirdConfigName: skuDetail.thirdConfigName,
                                    thirdStatus: skuDetail.thirdStatus,
                                    thirdVisible: skuDetail.thirdVisible,
                                    headerLIst:  skuDetail.headerLIst,
                                    isTable: true
                                })
                            }
                            let parameterDetail = JSON.parse(data.parameterIds)
                            parameterDetail.forEach(item=>{
                                for(let i in item) {
                                    self.props.form.setFieldsValue({
                                    [i]: item[i]        
                                    })
                                }
                            })
                            if(data.freightWay == 1) {
                                self.props.form.setFieldsValue({
                                    isDeliveryTime: data.freightSetup ? data.freightSetup.isDeliveryTime:'',
                                    arrivalDay: data.freightSetup? data.freightSetup.arrivalDay:'',
                                    arrivalTime: data.freightSetup? data.freightSetup.arrivalTime:'',
                                    isPick: data.freightSetup? data.freightSetup.isPick:'',
                                    deliveryAreaType: data.deliveryAreaType,
                                    freightSet: Number(data.freightId)
                                })
                            }
                        }
                    }
                })             
        } else if(firstPage) { //缓存
            let goodlist = firstPage.goodGroupId.replace(/(^\|*)|(\|*$)/g, "").split('|')
            self.setState({
                name: firstPage.name,
                introduction: firstPage.introduction,
                goodGroupId: goodlist,
                type: firstPage.type,
                arrayImg: firstPage.arrayImg,
                configList: firstPage.configList,
                first: firstPage.first,
                firstConfigName: firstPage.firstConfigName,
                firstStatus: firstPage.firstStatus,
                firstVisible: firstPage.firstVisible,
                second: firstPage.second,
                secondConfigName: firstPage.secondConfigName,
                secondStatus: firstPage.secondStatus,
                secondVisible: firstPage.secondVisible,
                third: firstPage.third,
                thirdConfigName: firstPage.thirdConfigName,
                thirdStatus: firstPage.thirdStatus,
                thirdVisible: firstPage.thirdVisible,
                headerLIst:  firstPage.headerLIst,
                isTable: true,
                comIds: firstPage.comIds,
                categoryId: firstPage.categoryId,
                categoryName: firstPage.categoryName,
                freight: firstPage.freight,
                way: firstPage.way,
            })
            let parameterDetail = firstPage.parameterIds
            setTimeout(function(){
                parameterDetail.forEach(item=>{
                    for(let i in item) {
                        self.props.form.setFieldsValue({
                           [i]: item[i]        
                        })
                    }
                })
                self.props.form.setFieldsValue({
                    freightSet: firstPage.freightSet,
                    isDeliveryTime: firstPage.isDeliveryTime,
                    arrivalDay: firstPage.arrivalDay,
                    arrivalTime: firstPage.arrivalTime,
                    isPick: firstPage.isPick,
                    deliveryAreaType: firstPage.deliveryAreaType     
                 })
            },1000)
                //快递模板
                if(firstPage.way == '1') {
                    self.props.getFreight({
                        params: {
                            userId: userData.id,
                            setType: '1',
                            instCode: userData.instCode
                        },
                        func: function() {
                        }
                    })
                } else if(firstPage.way == '2') {
                    self.props.getFreight({
                        params: {
                            userId: userData.id,
                            setType: '2',
                            instCode: userData.instCode
                        },
                        func: function() {
                            let list 
                            self.props.freightList.list.forEach((item, index) => {
                                if(item.id == firstPage.freight) {
                                    list = item
                                }
                            })
                            self.setState({
                                freightList: list
                            })
    
                        }
                    })
                }
                
        }
        //向父组件传this
        this.props.onRef('oneConfig', this)
    }
    onRef (param, ref) {
        this[param] = ref
    }
    handleChange1(type,e){
        if(type == 'Input'){
            this.setState({
                InpCount: e.target.value.length
            })
        }
        if(type == 'TextArea'){
            this.setState({
                texCount: e.target.value.length
            })
        }
        
    }

    search(item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({
            [item]: false
        })
        this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode})
    }

    //点击弹出抽屉框
    goDrawer(type){
        this.setState({
            [type]: true
        })
    }
    //点击关闭抽屉框
    closeDrawer(type){
        this.setState({
            [type]: false
        })
    }
   
    //index和classify组件传值
    closeClassify(data){
        let state = this.classsifySelf.state
        this.setState({
            classifyVisible: data,
            categoryId: state.savelable ? `${state.savelable.id},${state.saveParams.id}`:'',
            categoryName: state.savelable ?`${state.savelable.name},${state.saveParams.name}`:''
        })
    }


    // 图片
    imgLoop() {
        let self =  this
        let children = []
        self.state.arrayImg.forEach((item, index)=>{
            children.push (
                <div key={index} className={styles.checkImg} draggable={true} onDragStart={self.drag.bind(self, index)} onDragOver={self.allowDrop.bind()} onDrop={this.drop.bind(self, index)}>
                    <Icon type="close-circle" theme="filled" onClick={self.delImg.bind(this, index)} style={{fontSize: '16px'}}/>
                    <img src={`/backstage/upload/download?uuid=${item.ossKey}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>
                </div>
            )
        })
        return children
    }
    //删除图片
    delImg(params) {
        let list = []
        this.state.arrayImg.forEach((item, i)=>{
            list.push(Object.assign({}, item))
        })
        list.splice(params, 1)
        this.setState({
            arrayImg: list
        })
    }
    drag(index) {
        this.setState({
            startIndex: index
        })
    }
    allowDrop(ev) {
        ev.preventDefault() //阻止默认事件。否则drop事件不会触发
    }
    drop(index) {
        let startIndex = this.state.startIndex
        let list = []
        this.state.arrayImg.forEach((item, i)=>{
            if(startIndex != i) {
                list.push(Object.assign({}, item))
            }
        })
        list.splice(index, 0, this.state.arrayImg[startIndex])
        this.setState({
            arrayImg: list
        })
    }
    showSelectImg () {
        let length = 5-this.state.arrayImg.length
        console.log(length)
        this.setState({
            selectImgNum: length,
            selectImgVisible: true
        })
    }

    //规格确定
    changeStatus (item, status, visible) {
        if(this.state[item]) {
            this.setState({
                [status]: !this.state[status],
                [visible]: true,
            })
            if(this.state.isTable) {
                 //表格头部数据插入
                 let list = []
                 this.state.headerLIst.forEach((data, index)=>{
                     list.push(Object.assign({},data))
                 })
                 if(item == 'firstConfigName') {
                     if(this.state.first.list.length) {
                        list[0] = {name: this.state.firstConfigName}
                     }
                 } else if(item == 'secondConfigName') {
                    if(this.state.second.list.length) {
                        list[1] = {name: this.state.secondConfigName}                    
                    }
                 }else if(item == 'thirdConfigName') {
                     if(this.state.third.list.length){
                        list[2] = {name: this.state.thirdConfigName}
                     }
                 }
                 this.setState({
                    isTable: false
                 },()=>{
                    this.setState({
                        headerLIst: list,
                        isTable: true
                     })
                 })    
            }
        } else {
            message.error('规格名称不能为空')
        }
    }
    //规格编辑
    changeOnStatus (item) {
        this.setState({
            [item]: !this.state[item],
        })
    }
    // 渲染规格
    firstConfig(item, status) {
        if(this.state[status]) {//编辑状态
            return (<span  className={styles.label__left}>
                <Input  maxLength={50} placeholder="规格名称" value={this.state[item]} onChange={this.valueChange.bind(this, item)}/>
            </span>)
        }else{//非编辑状态
            return <span className={styles.label__content}>{this.state[item]}</span>
        }
       
    }
    // 渲染规格值
    firstContent(params) {
        let children = []
        this.state[params].list.forEach((item,index) => {
            children.push(
                <div key={index} className={styles.tag}>
                    <div>{item}</div>
                    <div className={styles.del} onClick={this.deleteTag.bind(this, params , index)}>
                        <img src={delImg} alt=""/>
                    </div>
                </div>
            )
        })
        return children
    }
    //规格变化
    valueChange(item, ev) {
        this.setState({
            [item]: ev.target.value
        })
    }
    //规格值变化
    contentChange(item, ev) {
        let val=ev.target.value;
        let data = Object.assign({}, this.state[item], { value: val })
        this.setState({
            [item]: data
        })
    }
    //规格值
    addList (item) {
        this.props.setTableStatus(true)
        this.setState({
            isTable: false
        },()=>{  
            if(this.state[item].value) {
                //表格头部数据插入
                let list = []
                let name = ''
                this.state.headerLIst.forEach((data, index)=>{
                    list.push(Object.assign({},data))
                })
                if(item == 'first') {
                    name = this.state.firstConfigName
                    list[0] = {name: this.state.firstConfigName}
                } else if(item == 'second') {
                    name = this.state.secondConfigName
                    list[1] = {name: this.state.secondConfigName}
                }else if(item == 'third') {
                    name = this.state.thirdConfigName
                    list[2] = {name: this.state.thirdConfigName}
                }
                this.setState({
                   headerLIst: list
                },()=>{
                   //规格值
                   let lists = []
                   this.state[item].list.forEach((data, index)=>{
                       lists.push(data)
                   })
                   let status = lists.some((params)=>{
                       return params == this.state[item].value
                   })
                   if(!status) {
                       lists.push(this.state[item].value)
                       let data = Object.assign({}, this.state[item], { list: lists }, {name: name})
                       this.setState({
                           [item]: data,
                           isTable: true
                       })
                   } else {
                       this.setState({
                            isTable: true
                       })
                       message.error('规格值不能相同')
                   }      
                })
              
           } else {
               message.error('规格值不能为空')
           }
        })
       
    }
    // 删除规格值
    deleteTag (item, index) {
        this.props.setTableStatus(true)
        this.setState({
            isTable: false
        },()=>{
            this.setState({
                isTable: true
            })
            
            let list = [...this.state[item].list]
            if(list.length > 1){
                list.splice(index, 1)
                let data = Object.assign({}, this.state[item], { list: list })
                this.setState({
                    [item]: data
                })
            } else{
                message.error('至少存在一个规格值')
            }
            
        })
    }
    // 增加configList的长度
    addConfig() {
        let configList = [...this.state.configList]
        if(configList.length<4) {
            configList.push('1')
        }
        this.setState({
            configList 
        })
    }
    //删除
    delList(index) {
        this.setState({
            isTable: false
        },()=>{
            this.setState({
                isTable: true
            })

            if(index == '1') {
                let list = []
                this.state.headerLIst.forEach((data, index)=>{
                    list.push(Object.assign({},data))
                })
                list[1] = list[2]
                list[2] = {name: ''}
            
                let secondData = Object.assign({}, this.state.third)
                let thirdData = {
                    list: [],
                    value: ''
                }

                this.setState({
                    secondConfigName: this.state.thirdConfigName,
                    thirdConfigName: '',
                    secondStatus: this.state.thirdStatus,
                    thirdStatus: true, 
                    headerLIst: list,
                    second: secondData,
                    third: thirdData
                })
            } else if (index == '2') {
                let list = []
                this.state.headerLIst.forEach((data, index)=>{
                    list.push(Object.assign({},data))
                })
                list[2] = {name: ''}
                let thirdData = {
                    list: [],
                    value: ''
                }
                this.setState({
                    thirdConfigName: '', 
                    thirdStatus: true, 
                    headerLIst: list,
                    third: thirdData
                })
            }
            let configList = [...this.state.configList]
            configList.splice(index,1)
            this.setState({
                configList 
            })
        })
    }
     //参数
    closeArguments(data){
        let self = this
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        self.setState({
            argumentsVisible: data
        }, () => {
            self.props.getParameter({
              params: {
                userId: userData.id
              },
              func: function() {
                self.setState({
                    parameterList: self.props.parameterList
                })
              }
            })
        })
    }
    //渲染参数
    paramsApply() {
        const { getFieldDecorator } = this.props.form;
        let children = []
        let self = this
        this.state.parameterList.forEach((data, index)=>{
            children.push(
                <Col span={5} className={styles.params} key={index}>
                <div className={styles.params_left}>
                    {data.name}
                </div>
                <div className={styles.params_right}>
                {getFieldDecorator(`${data.name}-${data.id}`, {})(
                    <Select
                        labelInValue
                        style={{width: '100%'}}>
                        {data.templates.length ? self.paramChild(data.templates) : null}
                    </Select>
                )}    
                </div>
                </Col>
            )
        })
        return children
    }
    // 渲染参数值
    paramChild(data) {
        let children = []
        data.forEach((item, index) =>{
            children.push(
                    <Option key={index} value={item.id}>{item.name}</Option>
            )
        })
        return children
    }
    // 商品分类
    groupApply() {
        let children = []
        this.state.groupList.forEach((data, index)=>{
            children.push(
                <Option key={index} value={`${data.id}`}>{data.name}</Option>
            )
        })
        return children
    }
    //关闭图片选择
    closeSelectImg(params) {
        this.setState({
            selectImgVisible: false 
        }, ()=>{
            if(params) {
                let arrayImg = this.state.arrayImg
                if(arrayImg.length<5) {
                    let list = arrayImg.concat(params);
                    this.setState({
                        arrayImg: list
                    })
                } else {
                    this.setState({
                        arrayImg: params
                    })
                }
            }
        })
    }
    //适用区域
    TreeSelect(val,name,id){
        this.setState({
          comIds: val
        })
    }
      //区域数组组装
    loop = (data) => {
        let newData = [];
        data.forEach((item) => {
            let itemData = [];
            if(item.areas){
                item.areas.forEach((e) => {
                if(e.communitys){
                    let children = [];
                    e.communitys.forEach((en) => {
                    children.push({
                        title: en.name,
                        value: `${en.id}-${en.code}-3`,
                        key: `${en.id}-${en.code}`,
                    })
                    })
                    itemData.push({
                    title: e.name,
                    value: `${e.id}-${e.code}-2`,
                    key: `${e.id}-${e.code}`,
                    children
                    })

                }else{
                    itemData.push({
                    title: e.name,
                    value:`${e.id}-${e.code}-2`,
                    key: `${e.id}-${e.code}`,
                    })
                }


                })
            }
            newData.push({
                title: item.name,
                value: `${item.id}-${item.code}-1`,
                key: `${item.id}-${item.code}`,
                children: itemData
            })
        })
        return newData;
    }

    inputChange(item, ev) {
        if(item == 'name') { //商品名称
            if(ev.target.value.length <=50) {
                this.setState({
                    [item]: ev.target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')
                })
            }
        } else if(item == 'introduction') { //商品介绍
            if(ev.target.value.length <=200) {
                this.setState({
                    [item]: ev.target.value
                })
            }
        } else {
            this.setState({
                [item]: ev.target.value
            })
        }
    }
    selectChange(item, val) {
        console.log(arguments)
        this.setState({
            [item]: val
        })
    }
    // 快递
    freightApply() {
        let children = []
        if(this.props.freightList) {
            this.props.freightList.list.forEach((item, index) => {
                children.push(
                    <Option value={item.id} key={index}>{item.templateName}</Option>
                )
            })
        }
       
        return children
    }
    formart = (content) => {
        let self = this;
        const data = [];
        data.push({
            id: content.id,
            templateName: content.templateName,
            defaultStatus: content.defaultStatus,
            freightTemplateAreas: content.freightTemplateAreas,
            updateTime: content.updateTime ? Moment(content.updateTime).format("YYYY-MM-DD") : '',
            alldata: content
        })
        return {
            data
        };
    }
    freightChange(item, id) {
        this.setState({
            [item]: id,   
        }, () => {
            let list
            this.props.freightList.list.forEach((item, index) => {
                if(item.id == id) {
                    list = item
                }
            })
            console.log(list)
            this.setState({
                freightList: list
            })
        })
    }
    radioChange(ev) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        let self = this
        if(ev.target.value == 1) {
            self.props.getFreight({
                params: {
                    userId: userData.id,
                    setType: '1',
                    instCode: userData.instCode
                },
                func: function() {
                }
            })
        } else if(ev.target.value == 2) {
            this.setState({
                freight: '',
                freightList: ''
           })
            self.props.getFreight({
                params: {
                    userId: userData.id,
                    setType: '2',
                    instCode: userData.instCode
                },
                func: function() {

                }
            })
        }
        this.setState({
            way: ev.target.value
        })
    }

    render() {
        const formItemLayout = {
            labelCol: {xs: { span: 24 },sm: { span: 3 }},
            wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 8 }}
        };
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const { areaList} = this.props;

        const treeData = areaList ? this.loop(areaList) : [];//小区

        const content = this.state.freightList ? this.formart(this.state.freightList) : []; //快递模板
        return (
            <div className={styles.box}>
            {/* 基础信息 */}
                <Card>
                    <h3>基础信息</h3>
                    <Form hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem labelCol={{span: 3}}  label={<span>商品名称 <span className={styles.red}>*</span></span>}>
                                <Input 
                                    onChange={this.inputChange.bind(this,'name')} 
                                    value={this.state.name} style={{width:'33.3%'}} placeholder="请输入商品名称" maxLength={50} />
                                &ensp;<span>{this.state.name.length}/50</span>
                        </FormItem>
                        <FormItem labelCol={{span: 3}} label="商品介绍">
                                <TextArea
                                    onChange={this.inputChange.bind(this,'introduction')}
                                    value={this.state.introduction}
                                    maxLength={200}
                                    style={{ minHeight: 70,width:'33.3%' }}
                                    placeholder="推荐商品建议设置商品介绍"
                                    rows={3}
                                />
                            &ensp;<span>{this.state.introduction.length}/200</span>
                        </FormItem>
                        <FormItem {...formItemLayout} label={<span>商品分类 <span className={styles.red}>*</span></span>}>
                            <Button type="primary" ghost style={{padding:'0 40px'}} onClick={this.goDrawer.bind(this,'classifyVisible')}>选择</Button>
                        </FormItem>
                        <FormItem {...formItemLayout} label="商品分组">
                            <Select placeholder="请选择" onChange={this.selectChange.bind(this, 'goodGroupId')} value={this.state.goodGroupId} mode="multiple">
                                {this.groupApply()}
                            </Select>
                        </FormItem>
                        <FormItem {...formItemLayout} label={<span>商品类型 <span className={styles.red}>*</span></span>}>
                            <Radio.Group onChange={this.inputChange.bind(this, 'type')} value={this.state.type}>
                                <Radio value="1">实物商品</Radio>
                                <Radio value="2">虚拟商品</Radio>
                            </Radio.Group>
                        </FormItem>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 20}} label="商品参数">
                            <Card>
                                <Row gutter={24}>
                                    {this.paramsApply()}
                                </Row>
                                <Row>
                                    <Col><Button type="primary" icon="plus" ghost onClick={this.goDrawer.bind(this,'argumentsVisible')}>新增参数</Button></Col>
                                </Row>
                            </Card>
                        </FormItem>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 20}} label={<span>商品图片 <span className={styles.red}>*</span></span>}>
                            {
                                this.state.arrayImg.length < 5 ? (
                                    <div className={styles.checkImg} onClick={this.showSelectImg.bind(this, 'both')}>
                                        <div className={styles.addImg}><img src={addImg} alt=""/></div> 
                                        <div className={styles.label}>上传图片</div>
                                    </div>
                                ): null
                            }
                           
                            {this.imgLoop()}
                            {/* <div>尺寸建议750*750（正方形）像素以上，最多上传5张（可拖拽图片调整显示顺序）</div> */}
                        </FormItem>
                    </Form>
                </Card>
            {/* 规格/价格设置 */}
                <Card className={styles.specification}>
                    <h3>规格/价格设置</h3>
                    {/* 第一个规格 */}
                    <Row className={styles.Row}>
                        <Col span={3} className={styles.label}>规格名称：</Col>
                        <Col span={21}>
                        {this.firstConfig('firstConfigName', 'firstStatus')}

                        {this.state.firstStatus ? 
                            (<span onClick={this.changeStatus.bind(this,'firstConfigName', 'firstStatus', 'firstVisible')}   className={styles.label__right}>
                                确定
                            </span> ):
                             (<span onClick={this.changeOnStatus.bind(this, 'firstStatus')}   className={styles.label__edit}>
                                修改
                             </span> )
                        }
                       
                        </Col>
                    </Row>
                    <Row className={styles.Row}>
                        <Col span={3}></Col>
                        {
                            this.state.firstVisible ?  (
                                <Col span={21}>
                                    {this.firstContent('first')}
                                    <span  className={styles.label__left}>
                                        <Input  maxLength={50} placeholder="规格值" onChange={this.contentChange.bind(this, 'first')}/>
                                    </span>
                                    <span onClick={this.addList.bind(this, 'first')}  className={styles.label__right}>
                                        添加
                                    </span>   
                                </Col>
                             ) : null
                        }
                        
                    </Row>
                    {/* 第二个规格 */}

                    {this.state.configList.length >= 2 ? (
                        <div>
                        <Row className={styles.Row}>
                         <Col span={3} className={styles.label}></Col>
                         <Col span={21}>
                         {this.firstConfig('secondConfigName', 'secondStatus')}

                        {this.state.secondStatus ? 
                            (<span onClick={this.changeStatus.bind(this,'secondConfigName', 'secondStatus', 'secondVisible')}   className={styles.label__right}>
                                确定
                            </span> ):
                             (<span onClick={this.changeOnStatus.bind(this, 'secondStatus')}   className={styles.label__edit}>
                                修改
                             </span> )
                        }

                         <span  className={styles.label__edit} onClick={this.delList.bind(this, '1')}>
                                删除
                         </span>     
                         </Col>
                        </Row>
                        <Row className={styles.Row}>
                            <Col span={3}></Col>
                            {
                                this.state.secondVisible ? (
                                    <Col span={21}>
                                        {this.firstContent('second')}
                                        <span  className={styles.label__left}>
                                            <Input  maxLength={50} placeholder="规格值" onChange={this.contentChange.bind(this, 'second')}/>
                                        </span>
                                        <span onClick={this.addList.bind(this, 'second')}  className={styles.label__right}>
                                                添加
                                        </span>   
                                    </Col>
                                ) : null
                            }
                           
                        </Row>
                        </div>
                    ):null}
                   
                    {/* 第三个规格 */}
                    {this.state.configList.length >= 3 ? (
                        <div>
                        <Row className={styles.Row}>
                         <Col span={3} className={styles.label}></Col>
                         <Col span={21}>
                         {this.firstConfig('thirdConfigName', 'thirdStatus')}

                         {this.state.thirdStatus ? 
                            (<span onClick={this.changeStatus.bind(this,'thirdConfigName', 'thirdStatus', 'thirdVisible')}   className={styles.label__right}>
                                确定
                            </span> ):
                             (<span onClick={this.changeOnStatus.bind(this, 'thirdStatus')}   className={styles.label__edit}>
                                修改
                             </span> )
                        }
                         <span  className={styles.label__edit} onClick={this.delList.bind(this, '2')}>
                                删除
                         </span>    
                         </Col>
                        </Row>
                        <Row className={styles.Row}>
                            <Col span={3}></Col>
                            {
                                this.state.thirdVisible ? (
                                    <Col span={21}>
                                    {this.firstContent('third')}
                                    <span  className={styles.label__left}>
                                        <Input  maxLength={50} placeholder="规格值" onChange={this.contentChange.bind(this, 'third')}/>
                                    </span>
                                    <span onClick={this.addList.bind(this, 'third')}  className={styles.label__right}>
                                            添加
                                    </span>   
                                    </Col>
                                ) : null
                            }                           
                        </Row>
                        </div>
                    ):null}
                    {this.state.configList.length < 3 ? (
                    <Row className={styles.Row}>
                        <Col span={3}></Col>
                        <Col span={21}>
                            <span className={styles.add__congfig} onClick={this.addConfig.bind(this)}>
                                <img src={addConfigImg} alt=""/>
                                <span>添加规格</span>
                            </span>
                            <span>
                                最多添加3种规格
                            </span>
                        </Col>
                    </Row>) : null}
                    <Form hideRequiredMark className={styles.specification__form} style={{marginTop: '20px'}}>
                       
                        
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 23}}>
                            <Col offset={2} style={{borderBottom:'1px dashed #ccc'}}></Col>
                        </FormItem>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 23}}>
                            <Col offset={2}>
                                {this.state.isTable? (<TableMoudle headerLIst={this.state.headerLIst} first={this.state.first} second={this.state.second} third={this.state.third} onRef={this.onRef.bind(this)} selectImg={this.showSelectImg.bind(this)}/>) : null}
                            </Col>   

                        </FormItem>
                    </Form>
                </Card>   
            {/* 运费设置 */}
                <Card className={styles.set}>
                    <h3>运费设置</h3>
                    <FormItem {...formItemLayout} label="配送方式" style={{marginBottom:5}}>
                        <Radio.Group onChange={this.radioChange.bind(this)} value={this.state.way}>
                            <Radio value="1">物业配送</Radio>
                            <Radio value="2">快递</Radio>
                        </Radio.Group>
                    </FormItem>
                    <Col offset={2}>
                        <Tabs activeKey={this.state.way}>
                            <TabPane tab="" key="1">
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 8}} style={{marginBottom:10}} label="配送时间">
                                    {getFieldDecorator('isDeliveryTime', {initialValue: '1'})(
                                        <Radio.Group>
                                            <Radio value="1">可选择</Radio>
                                            <Radio value="2">不可选择</Radio>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 8}} style={{marginBottom:10}} label="到货时间">
                                    {getFieldDecorator('arrivalDay')(
                                        <Input  style={{width:'22%'}}  />
                                    )}&nbsp;&nbsp;<span>天</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {getFieldDecorator('arrivalTime')(
                                        <Input  style={{width:'22%'}}  />
                                    )}&nbsp;&nbsp;<span>时</span>
                                </FormItem>
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 8}} style={{marginBottom:10}} label="支持自取">
                                    {getFieldDecorator('isPick', {initialValue: '1'})(
                                        <Radio.Group>
                                            <Radio value="1">是</Radio>
                                            <Radio value="2">否</Radio>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                                <FormItem labelCol={{span: 3}} wrapperCol={{span: 23}} className='partLine'>
                                    <Col offset={1} style={{borderBottom:'1px solid #ccc'}}></Col>
                                </FormItem>
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 7}} style={{marginBottom:5}} label="区域配送">
                                    {getFieldDecorator('deliveryAreaType', {initialValue: '1'})(
                                        <Radio.Group>
                                            <Radio value="1">全部区域</Radio>
                                            <Radio value="2">指定小区</Radio>
                                        </Radio.Group>
                                    )}
                                </FormItem>
                                <FormItem labelCol={{span: 4}} wrapperCol={{span: 9}} style={{display:`${getFieldValue('deliveryAreaType')!='2'?'none':'block'}`}}>
                                    <Col offset={4}>
                                        <TreeSelect
                                            placeholder='请选择'
                                            onChange={ this.TreeSelect.bind(this) }
                                            value={this.state.comIds}
                                            allowClear
                                            showCheckedStrategy={SHOW_PARENT}
                                            treeCheckable={true}
                                            treeData={treeData}
                                            style={{width: '100%'}}
                                            />   
                                    </Col>
                                </FormItem>
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 7}} style={{marginBottom:10}} label="运费设置">
                                    {getFieldDecorator('freightSet',{})(
                                        <Select style={{width:'100%'}}>
                                           {this.freightApply()}
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem labelCol={{span: 3}} wrapperCol={{span: 22}} className="tableLeft">
                                    <Col offset={1}>
                                        <table cellSpacing="0" className={styles.mytable} style={{margin: 0}}>
                                            <tbody>
                                                <tr className='tableTr' style={{backgroundColor:'#F0F0F0'}}>
                                                    <td>配送区域</td>
                                                    <td>首件</td>
                                                    <td>运费(元)</td>
                                                    <td>续件</td>
                                                    <td>续费(元)</td>
                                                </tr>
                                                <tr className='tableTr' style={{backgroundColor:'#F0F0F0'}}>
                                                    <td>所有地区</td>
                                                    <td>1</td>
                                                    <td>0</td>
                                                    <td>1</td>
                                                    <td>0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Col>   
                                </FormItem>
                                
                            </TabPane>
                            <TabPane tab="" key="2">
                                <FormItem labelCol={{span: 2}} wrapperCol={{span: 9}}  label="运费设置">
                                        <Select style={{width:'75%'}} onChange={this.freightChange.bind(this, 'freight')} value={this.state.freight}>
                                           {this.freightApply()}
                                        </Select>
                                    {/* &nbsp;&nbsp;&nbsp;&nbsp;新增运费模板 */}
                                </FormItem>
                                <FormItem labelCol={{span: 3}} wrapperCol={{span: 22}} className="tableLeft">
                                    <Col offset={1}>
                                        <Table
                                            columns={columns}
                                            dataSource={content.data}
                                            pagination={false}
                                            bordered
                                            size="middle"/>

                                    </Col>   
                                </FormItem>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Card>   

            {/* 商品分类弹出框 */}
            <Drawer
                title="商品分类"
                width="45%"
                placement="right"
                onClose={this.closeDrawer.bind(this, 'classifyVisible')}
                maskClosable={false}
                destroyOnClose
                visible={this.state.classifyVisible}
                style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                >
                <Classify search={this.search.bind(this)} closeClassify={this.closeClassify.bind(this)}  onRef={this.onRef.bind(this)}/>
            </Drawer>
            {/* 商品参数/新增参数弹出框 */}
            <Drawer
                title="新增参数"
                width="45%"
                placement="right"
                onClose={this.closeDrawer.bind(this, 'argumentsVisible')}
                maskClosable={false}
                destroyOnClose
                visible={this.state.argumentsVisible}
                style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
                >
                <Arguments search={this.search.bind(this)} closeArguments={this.closeArguments.bind(this)} onRef={this.onRef.bind(this)}/>
            </Drawer>
            <Drawer
                width="45%"
                placement="right"
                maskClosable={false}
                closable={true}
                destroyOnClose
                onClose={this.closeDrawer.bind(this, 'selectImgVisible')}
                visible={this.state.selectImgVisible}
                className="resetStyle"
            >
                <SelectImg onRef={this.onRef.bind(this)} closeSelectImg={this.closeSelectImg.bind(this)} selectImgNum={this.state.selectImgNum}/>   
            </Drawer>    
            </div>
        )
    }
}
App.contextTypes = {
    router: PropTypes.object
}
function mapStateToProps(state) {
    return {
        parameterList: state.goodsReleased.parameterList,
        groupList: state.goodsReleased.groupList,
        areaList: state.goodsReleased.areaList,//小区
        detailList: state.goodsReleased.detailList,
        freightList: state.goodsReleased.freightList //快递模板
    }
}
function dispatchToProps(dispatch) {
    return {
        getParameter(payload = {}) {
            dispatch({type: 'goodsReleased/getParameter', payload})
        },
        getgroup(payload = {}) {
            dispatch({type: 'goodsReleased/getgroup', payload})
        },
        getArea(payload={}) {
            dispatch({type: 'goodsReleased/getArea',payload})
        },
        detailGoods(payload={}) {
            dispatch({type: 'goodsReleased/detailGoods',payload})
        },
        setTableStatus(payload={}) {
            dispatch({type: 'goodsReleased/setTableStatus',payload})
        },
        getFreight(payload = {}) {
            dispatch({type: 'goodsReleased/getFreight', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));