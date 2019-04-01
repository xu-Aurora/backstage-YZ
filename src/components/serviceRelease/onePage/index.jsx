import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Form,Input,Select,Button,Card,Radio,Row,Col,Icon,Modal,message,Tabs,TreeSelect,Drawer } from 'antd';
import {connect} from 'dva';
import styles from './style.less';

import Classify from './classify.jsx';
import SelectImg from '../../selectImg';
import addImg from '../../../../public/img/u25694.png'
import delImg from '../../../../public/img/u26356.png'


const FormItem = Form.Item;
const { TextArea } = Input;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const Option = Select.Option;


class App extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            classifyVisible: false,
            selectImgVisible: false,
            startIndex: '',
            arrayImg: [
            ],
            comIds: '',
            name: '', // 服务名称
            synopsis: '', //服务介绍
            code: '', //服务编号
            serviceType: '1', //服务类型
            categoryList: [], //服务分类数据源
            categoryIndex: 0,
            categoryId: '', //服务分类
            categoryName: '', //服务分类
            selectImgNum: 0,
            freight: "",
            way: '1',
            tableList: [
                {
                    name: '',
                    price: '',
                    unit: '',
                    minNumber: '',
                }
            ],
            tableList1: [
                {
                    name: '',
                    price: '',
                    unit: '',
                    maxOrder: '',
                }
            ],
            chargeType: '1', //收费类型
            advanceType: '1', //预付类型
            isUseTicket: '1', //允许使用粮票
            ticketProportion: '', //收费类型
            serviceAreaType: '1', //服务区域
            serviceAppointment: '1', //服务预约
            serviceAscription: '1', //服务归属
            merchantId: '' //选择商户
        };
    }
    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));

        //区域
        this.props.getArea({
            userId: userData.id,
            instCode: userData.instCode
        })
        //商户
        this.props.getSupplier({
            params:{
                userId: userData.id,
                instCode: userData.instCode
            },
            func: function() {
            }
        })
        //单位
        this.props.getUnit({
            params:{
                userId: userData.id,
                instCode: userData.instCode,
                code: 'service_common_unit'
            },
            func: function() {
            }
        })
        //分类
        this.props.getCategory({
            params: {
              businessType: '2',
              userId: userData.id
            },
            func: () => {
                this.setState({
                    categoryList: this.props.categoryList,
                })  
            }
        })
        let firstData= JSON.parse(localStorage.getItem('firstData'));
        if(firstData) { //缓存
            let arrayImg = []
            firstData.pic.forEach(item=>{
                arrayImg.push({ossKey: item})
            })
            this.setState({
                name: firstData.name,//服务名称
                synopsis: firstData.synopsis,//服务介绍
                code: firstData.code,//服务编号
                serviceType: firstData.serviceType, //服务类型
                categoryId: firstData.categoryId, //分类
                categoryName:  firstData.categoryName,//分类
                arrayImg: arrayImg,//服务图片
                chargeType: firstData.chargeType, //收费类型
                tableList: firstData.tableList, //一口价模式
                tableList1: firstData.tableList1,//预付款模式
                advanceType: firstData.advanceType, //预付类型
                isUseTicket: firstData.isUseTicket ? '1': '2',//允许使用粮票
                ticketProportion: firstData.ticketProportion, //收费类型
                serviceAreaType: firstData.serviceAreaType, //服务区域类型
                comIds: firstData.serviceArea, //服务区域
                serviceAppointment: firstData.serviceAppointment? '1': '2', //服务预约
                serviceAscription: firstData.serviceAscription, //服务归属
                merchantId: firstData.merchantId //商户
            })
        }
        //向父组件传this
        this.props.onRef('onePage', this)
    }
    inputChange(item, ev) {
        if(item == 'name') { //服务名称
            if(ev.target.value.length <=50) {
                this.setState({
                    [item]: ev.target.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')
                })
            }
        } else if(item == 'synopsis') { //服务介绍
            if(ev.target.value.length <=200) {
                this.setState({
                    [item]: ev.target.value
                })
            }
        } else {
            this.setState({
                [item]: ev.target ? ev.target.value : ev
            })
        }
    }
    onRef (param, ref) {
        this[param] = ref
    }
    search(item) {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        this.setState({
            [item]: false
        })
        this.props.queryList({userId: userData.id, page: 1, size: 10,instCode: userData.instCode})
    }
    //服务分类
    goDrawer(type){
        this.setState({
            [type]: true
        })  
       
    }
    //关闭服务分类
    closeDrawer(type){
        this.setState({
            [type]: false
        })
    }
   
    //index和classify组件传值
    saveClassify(data){
        let state = this.classsifySelf.state
        this.setState({
            classifyVisible: data,
            categoryId: state.lable ? `${state.lable.id},${state.params.id}`:'',
            categoryName: state.lable ?`${state.lable.name},${state.params.name}`:''
        })
    }

    // 图片
    imgLoop() {
        let self =  this
        let children = []
        self.state.arrayImg.forEach((item, index)=>{
            children.push (
                <div key={index} className={styles.checkImg} draggable={true} onDragStart={self.drag.bind(self, index)} onDragOver={self.allowDrop.bind()} onDrop={this.drop.bind(self, index, 'arrayImg')}>
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
    // 拖动的逻辑
    drag(index) {
        this.setState({
            startIndex: index
        })
    }
    allowDrop(ev) {
        ev.preventDefault() //阻止默认事件。否则drop事件不会触发
    }
    //  index 改变的下标， data 数据源
    drop(index, data) {
        let startIndex = this.state.startIndex
        let list = []
        this.state[data].forEach((item, i)=>{
            if(startIndex != i) {
                list.push(Object.assign({}, item))
            }
        })
        list.splice(index, 0, this.state[data][startIndex])
        this.setState({
            [data]: list
        })
    }

    // 服务图片
    showSelectImg () {
        let length = 5-this.state.arrayImg.length
        console.log(length)
        this.setState({
            selectImgNum: length,
            selectImgVisible: true
        })
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

    //一口价模式
    tableApply() {
        let children = []
        this.state.tableList.forEach((item, i)=>{
            children.push(
                <tr key={i}  draggable={true} onDragStart={this.drag.bind(this, i)} onDragOver={this.allowDrop.bind()}>
                    <td>{i+1}</td>
                    <td>
                        <Input type="text" value={item.name} placeholder="请输入服务内容（最多20字）" onChange={this.valChange.bind(this, 'name', i, 'tableList')}/>
                    </td>
                    <td>
                        <Input type="text" value={item.price} placeholder="请输入价格" onChange={this.valChange.bind(this, 'price', i, 'tableList')}/>
                    </td>
                    <td>
                        <Select
                            style={{width: '100%'}} value={item.unit} onChange={this.valChange.bind(this, 'unit', i, 'tableList')}>
                            {
                                this.unitApply()
                            }
                        </Select>
                    </td>
                    <td>
                        <Input type="text" value={item.minNumber} placeholder="请输入最小起订数" onChange={this.valChange.bind(this, 'minNumber', i, 'tableList')}/>
                    </td>
                    <td>
                        <div  className={styles.mytable_model}>
                            <div onClick={this.onOption.bind(this, '1', i, 'tableList')}>清空</div>
                            {
                                i ? (<div onClick={this.onOption.bind(this, '0', i, 'tableList')}>删除</div>) : (<div></div>)
                            }
                        </div>
                    </td>
                    <td>
                        <div     onDrop={this.drop.bind(this, i, 'tableList')}>移动</div>
                    </td>
                </tr>
            )
        })
        return children
    }
    //增加服务项
    addTableList() {
        let list = []
        this.state.tableList.forEach(item=>{
            list.push(Object.assign({},item))
        })
        list.push({
            name: '',
            price: '',
            unit: '',
            minNumber: '',
        })
        this.setState({
            tableList: list
        })
    }
    // valName 改变的值， index 改变的下标， data 数据源
    valChange(valName, index, data, ev) {
        let list = []
        this.state[data].forEach(item=>{
            list.push(Object.assign({},item))
        })
        list[index][valName] = ev.target ? ev.target.value : ev // 处理下拉
        this.setState({
            [data]: list
        })
    }
    // params 0删除1清空 index 改变的下标， data 数据源
    onOption(params, index, data) {
        let list = []
        this.state[data].forEach(item=>{
            list.push(Object.assign({},item))
        })
        if(params == 0) {
            list.splice(index, 1)
        } else {
            list[index].name = ''
            list[index].price = ''
            list[index].unit = ''
            list[index].minNumber = ''
        }
       
       
        this.setState({
            [data]: list
        })
    } 
    //预付款模式
    tableApply1() {
        let children = []
        this.state.tableList1.forEach((item, i)=>{
            children.push(
                <tr key={i}  draggable={true} onDragStart={this.drag.bind(this, i)} onDragOver={this.allowDrop.bind()}>
                    <td>
                        <Input type="text" value={item.name} placeholder="请输入内容" onChange={this.valChange.bind(this, 'name', i, 'tableList1')}/>
                    </td>
                    <td>
                        <Input type="text" value={item.price} placeholder="请输入金额" onChange={this.valChange.bind(this, 'price', i, 'tableList1')}/>
                    </td>
                    <td>
                        <Select
                            style={{width: '100%'}} value={item.unit} onChange={this.valChange.bind(this, 'unit', i, 'tableList1')}>
                            <Option value="17">次</Option>
                        </Select>
                    </td>
                    <td>
                        <Input type="text" value={item.maxOrder} placeholder="请输入最多购买数" onChange={this.valChange.bind(this, 'maxOrder', i, 'tableList1')}/>
                    </td>
                    <td>
                        <div  className={styles.mytable_model}>
                            <div onClick={this.onOption.bind(this, '1', i, 'tableList1')}>清空</div>
                        </div>
                    </td>
                </tr>
            )
        })
        return children
    }
     //商户渲染
    supplierApply(){
        console.log(this.props)
        let children = []
        this.props.supplierList.forEach((data, index)=>{
            if(data.status) {
                children.push(<Option key={index} value={data.id}>{data.name}</Option>)
            }                           
        })
        return children
    }
    // 单位
    unitApply() {
        let children = []
        this.props.unitList.forEach((data, index)=>{
            children.push(<Option key={index} value={data.codeValue}>{data.name}</Option>)                         
        })
        return children
    }
    render() {
        const { getFieldDecorator,getFieldValue } = this.props.form;
        const { areaList} = this.props;

        const treeData = areaList ? this.loop(areaList) : [];//小区
        return (
            <div className={styles.box}>
            {/* 基础信息 */}
                <Card>
                    <h3>基础信息</h3>
                    <Form hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem  label={<span>服务名称 <span className={styles.red}>*</span></span>}>
                                <Input 
                                    onChange={this.inputChange.bind(this,'name')} 
                                    value={this.state.name} style={{width:'33.3%'}} placeholder="请输入服务名称" maxLength={50} />
                                &ensp;<span>{this.state.name.length}/50</span>
                        </FormItem>
                        <FormItem  label="服务介绍">
                                <TextArea
                                    onChange={this.inputChange.bind(this,'synopsis')}
                                    value={this.state.synopsis}
                                    maxLength={200}
                                    style={{ minHeight: 70,width:'33.3%' }}
                                    placeholder="请输入服务介绍"
                                    rows={3}
                                />
                            &ensp;<span>{this.state.synopsis.length}/200</span>
                        </FormItem>
                        <FormItem  label={<span>服务编号<span className={styles.red}>*</span></span>}>
                                <Input 
                                    onChange={this.inputChange.bind(this,'code')} 
                                    value={this.state.code} style={{width:'33.3%'}} placeholder="请输入服务编号" maxLength={8} />
                        </FormItem>
                        <FormItem  label={<span>服务类型 <span className={styles.red}>*</span></span>}>
                            <Radio.Group onChange={this.inputChange.bind(this, 'serviceType')} value={this.state.serviceType}>
                                <Radio value="1">生活服务</Radio>
                                <Radio value="2">社区健康</Radio>
                            </Radio.Group>
                        </FormItem>
                        <FormItem  label={<span>服务分类 <span className={styles.red}>*</span></span>}>
                            <Button type="primary" ghost style={{padding:'0 40px'}} onClick={this.goDrawer.bind(this,'classifyVisible')}>选择</Button>
                        </FormItem>
                        <FormItem  label={<span>服务图片 <span className={styles.red}>*</span></span>}>
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
            {/* 服务/价格设置 */}
                <Card className={styles.set}>
                    <h3>服务/价格设置</h3>
                    <FormItem  label="收费类型">
                        <Radio.Group onChange={this.inputChange.bind(this, 'chargeType')} value={this.state.chargeType}>
                            <Radio value="1">一口价模式</Radio>
                            <Radio value="2">预付款模式</Radio>
                        </Radio.Group>
                    </FormItem>
                    {/*一口价模式*/}
                    {
                        this.state.chargeType == '1' ? (
                        <FormItem>
                            <table cellSpacing="0" className={styles.mytable} style={{margin: 0}}>
                                <tbody>
                                    <tr className={styles.mytable_header}>
                                        <th>序号</th>
                                        <th>服务内容</th>
                                        <th>价格</th>
                                        <th>单位</th>
                                        <th>最小起订数</th>
                                        <th>操作</th>
                                        <th>排序</th>
                                    </tr>
                                    {this.tableApply()}
                                
                                </tbody>
                            </table>
                            <p style={{color: '#377FC2'}} onClick={this.addTableList.bind(this)}>+ 增加服务项</p>
                        </FormItem>
                        ) : ''
                    }
                    {/*预付款模式*/}
                    {
                        this.state.chargeType == '2' ?(
                        <FormItem  label="预付类型">
                            <Radio.Group onChange={this.inputChange.bind(this, 'advanceType')} value={this.state.advanceType}>
                                <Radio value="1">免费预约</Radio>
                                <Radio value="2">预付款</Radio>
                            </Radio.Group>
                        </FormItem>
                        ) : ''
                    }
                    {
                        this.state.chargeType == '2' && this.state.advanceType == '2' ?(
                        <FormItem>
                            <table cellSpacing="0" className={styles.mytable} style={{margin: 0}}>
                                <tbody>
                                    <tr className={styles.mytable_header1}>
                                        <th>预付款名称</th>
                                        <th>金额</th>
                                        <th>单位</th>
                                        <th>最多购买数</th>
                                        <th>操作</th>
                                    </tr>
                                    {this.tableApply1()}
                                   
                                </tbody>
                            </table>
                        </FormItem>
                        ) : ''
                    }
                  
                    <FormItem  label="允许使用粮票">
                        <Radio.Group onChange={this.inputChange.bind(this, 'isUseTicket')} value={this.state.isUseTicket}>
                            <Radio value="1">允许</Radio>
                            <Radio value="2">不允许</Radio>
                        </Radio.Group>
                    </FormItem>
                    {
                        this.state.chargeType == '1' ?(
                        <FormItem  label="收费类型">
                            <Select
                            style={{width: '100%'}} onChange={this.inputChange.bind(this, 'ticketProportion')} value={this.state.ticketProportion}>
                                <Option value="">全部</Option>
                                <Option value="0.95">9.5折</Option>
                                <Option value="0.9">9折</Option>
                                <Option value="0.85">8.5折</Option>
                                <Option value="0.8">8折</Option>
                                <Option value="0.75">7.5折</Option>
                                <Option value="0.7">7折</Option>
                                <Option value="0.65">6.5折</Option>
                                <Option value="0.6">6折</Option>
                                <Option value="0.55">5.5折</Option>
                                <Option value="0.5">5折</Option>
                            </Select>
                        </FormItem>
                        ) : ''
                    }
                </Card>   
            {/* 其他设置 */}
                <Card className={styles.set}>
                    <h3>其他设置</h3>
                    <FormItem label="服务区域">
                        <Radio.Group onChange={this.inputChange.bind(this, 'serviceAreaType')} value={this.state.serviceAreaType}>
                            <Radio value="1">全部区域</Radio>
                            <Radio value="2">指定小区</Radio>
                        </Radio.Group>
                    </FormItem>
                    {
                        this.state.serviceAreaType == '2' ? (
                        <FormItem  label="">
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
                        </FormItem>
                        ) : ''
                    }
                  
                    <FormItem  label="服务预约" >
                        <Radio.Group onChange={this.inputChange.bind(this, 'serviceAppointment')} value={this.state.serviceAppointment}>
                            <Radio value="1">支持预约</Radio>
                            <Radio value="2">不支持预约</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem  label="服务归属">
                        <Radio.Group onChange={this.inputChange.bind(this, 'serviceAscription')} value={this.state.serviceAscription}>
                            <Radio value="1">物业服务</Radio>
                            <Radio value="2">外包服务</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem  label="选择商户">
                        <Select placeholder="请选择" style={{width: '100%'}} onChange={this.inputChange.bind(this, 'merchantId')} value={this.state.merchantId}>
                            {this.supplierApply()}
                        </Select>
                    </FormItem>
                </Card>   

            {/* 服务分类 */}
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
                <Classify categoryList={this.state.categoryList}  ids={this.state.categoryId}  name={this.state.categoryName} save={this.saveClassify.bind(this)} close={this.closeDrawer.bind(this, 'classifyVisible')}  onRef={this.onRef.bind(this)}/>
            </Drawer>
            {/* 选择图片 */}
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
        areaList: state.serviceRelease.areaList,//小区
        categoryList:  state.serviceRelease.categoryList,//分类
        supplierList: state.serviceRelease.supplierList || [],//商户
        unitList: state.serviceRelease.unitList //单位
    }
}
function dispatchToProps(dispatch) {
    return {
        getArea(payload={}) {
            dispatch({type: 'serviceRelease/getArea',payload})
        },
        getCategory(payload = {}) {
            dispatch({type: 'serviceRelease/getCategory', payload})
        }, //分类
        getSupplier(payload={}) {
            dispatch({type: 'serviceRelease/getSupplier',payload})
        }, //商户
        getUnit(payload={}) {
            dispatch({type: 'serviceRelease/getUnit',payload})
        } //单位
    }
}

export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));