import React, {Component} from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {Card,Tabs,Row,Col,Icon,Table, Menu, Dropdown,Drawer,Button,Avatar } from 'antd';
import Styles from './home.less';
import Moment from 'moment';
import $ from 'jquery';

//业主认证
import Audit from './proprietorManage/audit.jsx';	//业主审核
import ProprietorDetail from './proprietorManage/detail.jsx';//业主审核详情

//保修事项
import AffairDetails from './affairManage/detail.jsx';
import Send from './affairManage/send.jsx';  //派单
import Finish from './affairManage/finish.jsx';  //结单
import CloseOrder from './affairManage/close.jsx';  //关闭订单

//投诉建议
import AdviceDetails from './adviceManage/detail.jsx';
import Answer from './adviceManage/answer.jsx';	//答复

//订单发货
import ShipmentsDetail from './shipmentManage/detail.jsx';
import Shipments from './shipmentManage/shipments.jsx';    //发货

//订单售后
import AfterSaleDetail from './afterSaleManage/detail.jsx';
import RefundAffirm from './afterSaleManage/refundAffirm.jsx';    //确认退款
import RefundCheck from './afterSaleManage/refundCheck.jsx';    //退款审核



const TabPane = Tabs.TabPane;
const { Meta } = Card;

//业主认证
const columns1 = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 65
  }, {
    title: '申请人姓名',
    dataIndex: 'applyUserName',
    key: 'applyUserName'
  },{
    title: '手机号码',
    dataIndex: 'applyUserPhone',
		key: 'applyUserPhone',
		width: 120,
  },{
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail'
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName'
  }, {
    title: '申请类型',
    dataIndex: 'type',
    key: 'type',
    render: (text) => {
      let status = '未知类型';
      if(text == 1){
        status = '户主'
      }
      if(text == 2){
        status = '亲属'
      }
      if(text == 3){
        status = '朋友'
      }
      if(text == 4){
        status = '租客'
      }
      return status;
    }
  }, {
    title: '审核状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '未知状态';
      if(text == 1){
        status = '待审核'
      }
      if(text == 2){
        status = '已审核'
      }
      if(text == 3){
        status = '审批拒绝'
      }
      return status;
    }
  }, {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }
];
//保修事项
const columns2 = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 65
  }, {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 200
  },{
    title: '客户姓名',
    dataIndex: 'userName',
    key: 'userName',
    width: 105
  },{
    title: '客户电话',
    dataIndex: 'userPhone',
    key: 'userPhone',
    width: 120
  }, {
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail',
    width: 200
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName',
    width: 180
  }, {
    title: '客户类型',
    dataIndex: 'userType',
    key: 'userType',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == 1){
        status = '户主'
      }
      if(text == 2){
        status = '亲属'
      }
      if(text == 3){
        status = '朋友'
      }
      if(text == 4){
        status = '租客'
      }
      return status;
    }
  }, {
    title: '报事类型',
    dataIndex: 'type',
    key: 'type',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == 0){
        status = '报修'
      }
      return status;
    }
  }, {
    title: '子类型',
    dataIndex: 'subType',
    key: 'subType',
    width: 108,
    render: (text) => {
      let status = '未知类型';
      if(text == '00'){
        status = '紧急报修'
      }
      if(text == '01'){
        status = '室内报修'
      }
      if(text == '02'){
        status = '公共报修'
      }
      if(text == '03'){
        status = '公共卫生'
      }
      if(text == '04'){
        status = '小区绿化'
      }
      if(text == '05'){
        status = '小区安全'
      }
      return status;
    }
  }, {
    title: '报事内容',
    dataIndex: 'content',
    key: 'content',
		width: 200,
    render: (text,record) => {
      return <div className={Styles.contents}>{ record.content }</div>
    }
  }, {
    title: '报事时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 220
  }, {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    width: 108,
    render: (text) => {
      let status = '未知状态';
      if(text == 1){
        status = '待处理'
      }
      if(text == 2){
        status = '已处理'
      }
      if(text == 3){
        status = '处理中'
      }
      if(text == 4){
        status = '已关闭'
      }
      return status;
    }
  }, {
    title: '期望上门时间',
    dataIndex: 'reservationTime',
    key: 'reservationTime',
    width: 220
  }
];
//投诉建议
const columns3 = [
  {
    title: '编号',
    dataIndex: 'keys',
    key: 'keys',
    width: 65
  }, {
    title: '订单编号',
    dataIndex: 'orderNo',
		key: 'orderNo',
		width: 200
  },{
    title: '客户姓名',
    dataIndex: 'userName',
    key: 'userName'
  },{
    title: '客户电话',
    dataIndex: 'userPhone',
    key: 'userPhone'
  }, {
    title: '申请小区',
    dataIndex: 'areaDetail',
    key: 'areaDetail'
  }, {
    title: '申请户号',
    dataIndex: 'addressName',
    key: 'addressName'
  }, {
    title: '客户类型',
    dataIndex: 'userType',
    key: 'userType',
    render: (text) => {
      let status = '未知类型';
      if(text == 1){
        status = '户主'
      }
      if(text == 2){
        status = '亲属'
      }
      if(text == 3){
        status = '朋友'
      }
      if(text == 4){
        status = '租客'
      }
      return status;
    }
  }, {
    title: '订单类型',
    dataIndex: 'type',
    key: 'type',
    render: (item) => {
      if(item == '1'){
        return '投诉'
      }
      if(item == '2'){
        return '建议'
      }
      if(item == '3'){
        return '表扬'
      }
    }
  }, {
    title: '订单时间',
    dataIndex: 'createTime',
    key: 'createTime'
  }, {
    title: '处理状态',
    dataIndex: 'status',
    key: 'status',
    render: (item) => {
      if(item == '1'){
        return '待处理'
      }
      if(item == '2'){
        return '已处理'
      }
    }
  }
];

//antd自定义字体图表
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_869860_t0d83mkm9ms.js',
});

let userData;

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
function siblingElems1(elem) {
	elem.siblings().css("background-color",'#fff')
};

class App extends Component {
	constructor(props) {
			super(props);
			this.state = {
					data: [],
					detailVisible: false,
					auditVisible: false,
					affairVisible: false,
					sendVisible: false,
					finishVisible: false,
					closeVisible: false,
					adviceVisible: false,
					answerVisible: false,
					shipmentsDetail: false, 
					shipmentsVisible: false, 
					afterSaleDetail: false,
					refundVisible: false,
					refundAffirm: false,
					activeKey: '1'
			};
	}
	componentDidMount() {
		//操作DOM,点击添加类,实现高亮
		// let childNodes = this.refs.backlog.childNodes;
		// for (let i = 0; i < childNodes.length; i++) {
		// 	childNodes[i].addEventListener('click',function(){
		// 		//在每次点击后排他,移除高亮的类
		// 		for (let j = 0; j < childNodes.length; j++) {
		// 			childNodes[j].classList.remove("cards-active");
		// 		}
		// 		//添加高亮的类
		// 		this.classList.add("cards-active");
		// 	})
		// }
		userData = JSON.parse(localStorage.getItem('userDetail'));
			this.props.queryProprietor({	//业主认证
					userId: userData.id,
					page: 1,
					status: '1',
					size: 20,
					instCode: userData.instCode
			});
			this.props.queryHomeCount({	
				userId: userData.id,
				instCode: userData.instCode
			});
	}
	onTabClick (item) {
		const userData = JSON.parse(localStorage.getItem('userDetail'));
		if(item == '1') {
			this.props.queryProprietor({	//业主认证
				userId: userData.id,
				page: 1,
				status: '1',
				size: 20,
				instCode: userData.instCode
			});
		}else if(item == '2') {
			this.props.queryAffairManage({	//保修事项
				userId: userData.id, 
				page: 1,
				status: ['1','3'].join(','),
				size: 20,
				instCode: userData.instCode
			})
		}else if(item == '3') {
			this.props.queryAdvice({	//投诉建议
				userId: userData.id,
				page: 1,
				status: '1',
				size: 20,
				instCode: userData.instCode
			})
		}else if(item == '4') {
			this.props.queryShipments({	//订单发货
				instCode: userData.instCode,
				page: 1, 
				size: 20, 
				status: '2',
				type: '1',
				userId: userData.id,
				wayType: '1'
			})
		}else if(item == '5') {
			this.props.queryShipments({	//订单售后
				userId: userData.id,
				page: 1,
				type: '2',//售后管理
				refundStateSelect: '2',//售后管理(待处理)
				size: 20,
				instCode: userData.instCode,
				wayType: '1'
			})
		}
		this.setState({
				activeKey: item
		})
	}

	onSelect1 (record, e) {
		e.target.parentNode.style.backgroundColor = '#e6fcff';
		siblingElems(e.target.parentNode);
		this.props.saveSelect1(record.alldata);
		this.setState({
			detailVisible: true
		})
	}
	onSelect2 = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect2(record);
    this.setState({affairVisible: true});
	}
	onSelect3 = (record, e) => {
    e.target.parentNode.style.backgroundColor = '#e6fcff';
    siblingElems(e.target.parentNode);
    this.props.saveSelect3(record.alldata);
    this.setState({adviceVisible: true});
	}
	onSelect4 = (record, e) => {
		$(e.target).parents('tr').css("background-color",'#e6fcff')
		siblingElems1($(e.target).parents('tr'));
		this.props.saveSelect4(record.alldata);
		this.setState({
			shipmentsDetail: true
		});
	}
	onSelect5 = (record, e) => {
		$(e.target).parents('tr').css("background-color",'#e6fcff')
		siblingElems1($(e.target).parents('tr'));
		this.props.saveSelect4(record.alldata);
		this.setState({
			afterSaleDetail: true
		});
	}

	//点击弹出页面
	sendShow (e) {
		this.setState({
				[e]: true
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
		if(item == 'auditVisible'){
			this.props.queryProprietor({	//业主认证
				userId: userData.id,
				page: 1,
				status: '1',
				size: 20,
				instCode: userData.instCode
			});
		}else if(item == 'sendVisible' || item == 'finishVisible'){
			this.props.queryAffairManage({	//保修事项
				userId: userData.id, 
				page: 1,
				status: ['1','3'].join(','),
				size: 20,
				instCode: userData.instCode
			})
		}else if(item == 'answerVisible'){
			this.props.queryAdvice({	//投诉建议
				userId: userData.id,
				page: 1,
				status: '1',
				size: 20,
				instCode: userData.instCode
			})
		}else if(item == 'shipmentsVisible'){
			this.props.queryShipments({	//订单发货
				instCode: userData.instCode,
				page: 1, 
				size: 20, 
				status: '2',
				type: '1',
				userId: userData.id,
				wayType: '1'
			})
		}else if(item == 'refundVisible' || item == 'refundAffirm'){
			this.props.queryShipments({	//订单售后
				userId: userData.id,
				page: 1,
				type: '2',//售后管理
				refundStateSelect: '2',//售后管理(待处理)
				size: 20,
				instCode: userData.instCode,
				wayType: '1'
			})
		}
		this.props.queryHomeCount({	
			userId: userData.id,
			instCode: userData.instCode
		});

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

	//await和detail组件传值
	closeDetail(data){
		this.setState({
			detailVisible: false,
			affairVisible: false,
			adviceVisible: false,
			shipmentsDetail: false,
			afterSaleDetail: false,
		},() => {
			setTimeout(() => {
				this.setState({
					[data]: true,
				})
			}, 500);
		});
	}

	affairManage() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/affairManage`);
	}
	activityManagement() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/activityManagement`);
	}
	usersManagement() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/usersManagement`);
	}
	proprietorManage() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/proprietorManage`);
	}
	allOrder() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/allOrder`);
	}
	goodsReleased() {
		this.context.router.history.push(`/${this.props.match.params.id}/app/goodsReleased`);
	}
	


	formart1 = (content) => {
		const data = [];
		if (content.list) {
		  content.list.forEach((item, keys) => {
				let key = keys + 1;
				if (content.pageNum > 1) {
					key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
				}
				data.push({
          keys: key,
          id: item.id,
          applyUserName: item.applyUserName,
          status: item.status,
          phoneNo: item.phoneNo,
          applyUserPhone: item.applyUserPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
          type: item.type,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          alldata: item
				})
			});
		}
		return data
	}
	formart2 = (content) => {
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        let key = keys + 1;
        if (content.pageNum > 1) {
          key = (content.pageNum - 1) * (content.pageSize<=10?10:content.pageSize) + key;
        }
        data.push({
          keys: key,
          id: item.id,
          orderNo: item.orderNo,
          userName: item.userName,
          userPhone: item.userPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
          userType: item.userType,
          type: item.type,
          subType: item.subType,
          content: item.content,
          createTime: Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"),
          reservationTime: item.reservationTime,
          status: item.status
        })
      });
    }
    return data
	}
	formart3 = (content) => {
    const data = [];
    if (content.list) {
      content.list.forEach((item, keys) => {
        data.push({
          keys: keys+1,
          id: item.id,
          orderNo: item.orderNo,
          userName: item.userName,
          userPhone: item.userPhone,
          areaDetail: item.areaDetail,
          addressName: item.addressName,
          userType: item.userType,
          type: item.type,
          createTime: item.createTime ? Moment(item.createTime).format("YYYY-MM-DD HH:mm:ss"): '',
          status: item.status,
          alldata: item
        })
      });
    }
    return data
	}
	formart4 = (content) => {
		const data = [];
		if (content.list) {
				content.list.forEach((item, keys) => {
						data.push({
								keys: keys,
								alldata: item
						})
				});
		}
		return 	data

	}
	formart5 = (content) => {
		const data = [];
		if (content.list) {
				content.list.forEach((item, keys) => {
						data.push({
								keys: keys,
								alldata: item
						})
				});
		}
		return data
	}

	render() {
		const { proprietorData,affairData,adviceData,shipmentsData,afterSaleData,homeCount } = this.props;

		const content1 = proprietorData ? this.formart1(proprietorData) : [];
		const content2 = affairData ? this.formart2(affairData) : [];
		const content3 = adviceData ? this.formart3(adviceData) : [];
		const content4 = shipmentsData ? this.formart4(shipmentsData) : [];
		const content5 = afterSaleData ? this.formart5(afterSaleData) : [];


		//订单发货
		const columns4 = [
			{
					title: '商品信息',
					dataIndex: 'content',
					key: 'content',
					width: 465,
					render: (value, record) => {
							let length = record.alldata.orderSkus.length;
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10,paddingLeft:15}}>
													<span style={{marginRight:12}}>订单编号 : {record.alldata.orderNo}</span>
													<span>下单时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
											</div>
											<div style={{minHeight: 80}}>
													{
															record.alldata.orderSkus.map((item,index) => {
																	let status = item.status;
																	switch (status) {
																			case '1':
																					status = '未退货'
																					break;
																			case '2':
																					status = '退货中'
																					break;
																			case '3':
																					status = '已同意'
																					break;
																			case '4':
																					status = '已退款'
																					break;
																			case '5':
																					status = '已拒绝'
																					break;
																			default:
																					break;
																	}
																	return (
																			<Card bordered={false} key={item.id}>
																					<Meta
																							avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
																							title={item.goodName}
																							description={
																									<Col>
																											<Col><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
																											<Col style={{display: item.status=='2'||item.status=='4'?'block':'none' }}>
																													<div style={{background:'#D2D2D2',padding:'2px 14px',borderRadius:5}}>{ status }</div>
																											</Col>
																									</Col>
																							}
																					/>
																					<div style={{height:1,width:'88%',background:'#e8e8e8',marginTop:15,display:length>1?'block':'none'}}></div>
																			</Card>
																	)
															})
													}
	
											</div>
									</div>
							)
					}
			},
			{
					title: '实付款',
					dataIndex: 'orderNo',
					key: 'orderNo',
					width: 200,
					render: (text, record) => {
							let source = record.alldata.source;
							switch (source) {
									case '1':
											source = '悦站app'
											break;
									case '2':
											source = '悦站H5'
											break;
									default:
											break;
							}
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span>订单来源 : {source}</span>
											</div>
											<div>
													<div style={{marginBottom:10}}>&yen; {record.alldata.amount}</div>
													<div>粮票 : {record.alldata.ticket}元</div>
											</div>
									</div>
							)
					}
			}, 
			{
					title: '支付方式',
					dataIndex: 'userName',
					key: 'userName',
					width: 200,
					render: (text, record) => {
							let paymentMethod = record.alldata.paymentMethod;
							switch (paymentMethod) {
									case '1':
											paymentMethod = '线上支付-微信'
											break;
									case '2':
											paymentMethod = '线上支付-支付宝'
											break;
									default:
											break;
							}
							let way = record.alldata.orderFreight.way;
							switch (way) {
									case '1':
											way = '商家配送'
											break;
									case '2':
											way = '快递'
											break;
									case '3':
											way = '上门自取'
											break;
									default:
											break;
							}
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span style={{visibility:"hidden"}}>订单编号 : </span>
											</div>
											<div>
													<div style={{marginBottom:10}}>{ paymentMethod }</div>
													<div>{ way }</div>
											</div>
											
									</div>
							)
					}
			},
			{
					title: '发货信息',
					dataIndex: 'phone',
					key: 'phone',
					width: 350,
					render: (text, record) => {
							let way = record.alldata.orderFreight.way;
							let freightTimeInfo = record.alldata.orderFreight.freightTimeInfo;
							let time;
							if(way == '1'){
									time = freightTimeInfo ? freightTimeInfo : '尽快配送'
							}
							if(way == '2'){
									time = '尽快配送'
							}
							if(way == '3'){
									time = freightTimeInfo
							}
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span style={{visibility:"hidden"}}>订单编号 : </span>
											</div>
											<div>
													<div>
															收货人 : {record.alldata.orderFreight.receiptName} , 
															{record.alldata.orderFreight.receiptPhone}
													</div>
													<div>收货地址 : {record.alldata.orderFreight.address}</div>
													<div>配送时间 : {time}</div>
											</div>
											
									</div>
							)
					}
			}, 
			{
					title: '订单状态',
					dataIndex: 'contents',
					key: 'contents',
					width: 200,
					render: (i, record) =>{
							let deliverGoodsStatus = record.alldata.deliverGoodsStatus;
							let display;
							if(deliverGoodsStatus == '1'){
									display = 'block'
							}
							if(deliverGoodsStatus == '0'){
									display = 'none'
							}
							let status = record.alldata.status;
							switch (status) {
									case '1':
											status = '待付款'
											break;
									case '2':
											status = '待配送'
											break;
									case '3':
											status = '配送中'
											break;
									case '4':
											status = '交易完成-待评价'
											break;
									case '5':
											status = '已关闭'
											break;
									case '6':
											status = '交易完成-已评价'
											break;
									case '7':
											status = '交易完成'
											break;
									default:
											break;
							}
						 return (
							<div>
									<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
											<span style={{visibility:"hidden"}}>订单编号 : </span>
									</div>
									<div>
											<div style={{marginBottom:10}}>{ status }</div>
											<div>
													<Button 
															onClick={ (e) => {
																	e.stopPropagation();
																	this.setState({shipmentsVisible: true})
																	this.props.saveSelect({
																			orderNo: record.alldata.orderNo, 
																			id: record.alldata.id
																	})
															} }
															style={{color:'#1890ff',borderColor:'#1890ff',display:display}}>发货</Button>
											</div>
									</div>
							
							</div>
						 )
					}
			}
		];
		//订单售后
		const columns5 = [
			{
					title: '商品信息',
					dataIndex: 'content',
					key: 'content',
					width: 465,
					render: (value, record) => {
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10,paddingLeft:15}}>
													<span style={{marginRight:12}}>退款单号 : {record.alldata.orderNo}</span>
													<span>申请时间 : {Moment(record.alldata.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
											</div>
											<div style={{minHeight: 80}}>
													{
															record.alldata.orderSkus.map((item,index) => {
																	return (
																			<Card bordered={false} key={item.id}>
																					<Meta
																							avatar={<Avatar src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} />}
																							title={item.goodName}
																							description={
																									<Col>
																											<Col span={16}><span>{ item.skuName }</span>&nbsp;&nbsp;<span>x { item.num }</span></Col>
																									</Col>
																							}
																					/>
																			</Card>
																	)
															})
													}
	
											</div>
									</div>
							)
					}
			},
			{
					title: '实付款',
					dataIndex: 'orderNo',
					key: 'orderNo',
					width: 300,
					render: (text, record) => {
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span>业务单号 : { record.alldata.origOrderNo }</span>
											</div>
											<div>
													<div style={{marginBottom:10}}>&yen; {record.alldata.amount}</div>
													<div>粮票 : {record.alldata.ticket}元</div>
											</div>
									</div>
							)
					}
			}, 
			{
					title: '售后类型',
					dataIndex: 'userNameaaa',
					key: 'userNameaaa',
					width: 200,
					render: (text, record) => {
							let refundType = record.alldata.refundType;
							let refundReason = record.alldata.refundType;
							switch (refundType) {
									case '1':
											refundType = '仅退款'
											break;
									case '2':
											refundType = '退货退款'
											break;
									default:
											break;
							}
							switch (refundReason) {
									case '1':
											refundReason = '退运费'
											break;
									case '2':
											refundReason = '收到商品破损'
											break;
									case '3':
											refundReason = '商品发错、漏发'
											break;
									case '4':
											refundReason = '商品需要维修'
											break;
									case '5':
											refundReason = '收到商品与描述不符'
											break;
									case '6':
											refundReason = '商品质量问题'
											break;
									case '7':
											refundReason = '商品需要维修'
											break;
									case '8':
											refundReason = '未按约定时间发货'
											break;
									case '9':
											refundReason = '其他'
											break;
									default:
											break;
							}
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span style={{visibility:"hidden"}}>订单编号 : </span>
											</div>
											<div>
													<div style={{marginBottom:10}}>{ refundType } ({ refundReason }) </div>
													<div>备注 : { record.alldata.refundMemo }</div>
											</div>
									</div>
							)
					}
			},
			{
					title: '退款金额',
					dataIndex: 'userName',
					key: 'userName',
					width: 150,
					render: (text, record) => {
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span style={{visibility:"hidden"}}>订单编号 : </span>
											</div>
											<div>
													<div style={{marginBottom:10}}>{ record.alldata.amount }</div>
													<div>粮票 ：{ record.alldata.ticket }</div>
											</div>
											
									</div>
							)
					}
			},
			{
					title: '客户信息',
					dataIndex: 'phone',
					key: 'phone',
					width: 200,
					render: (text, record) => {
							return (
									<div>
											<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
													<span style={{visibility:"hidden"}}>订单编号 : </span>
											</div>
											<div>
													<div style={{marginBottom:10}}>{record.alldata.orderFreight.receiptName}</div>
													<div>{record.alldata.orderFreight.receiptPhone}</div>
											</div>
											
									</div>
							)
					}
			}, 
			{
					title: '订单状态',
					dataIndex: 'contents',
					key: 'contents',
					width: 200,
					render: (text, record) =>{
							let status = record.alldata.status;
							let refundState = record.alldata.refundState;
							switch (status) {
									case '1':
											status = '待付款'
											break;
									case '2':
											status = '待配送'
											break;
									case '3':
											status = '配送中'
											break;
									case '4':
											status = '交易完成-待评价'
											break;
									case '5':
											status = '已关闭'
											break;
									case '6':
											status = '交易完成-已评价'
											break;
									case '7':
											status = '交易完成'
											break;
									default:
											break;
							}
							switch (refundState) {
									case '2':
											refundState = '待审核'
											break;
									case '3':
											refundState = '已同意'
											break;
									case '4':
											refundState = '已退款'
											break;
									case '5':
											refundState = '已拒绝'
											break;
									default:
											break;
							}
							let btn;
							if(refundState == '待审核'){
									btn = <Button 
											onClick={ (e) => {
													e.stopPropagation();
													this.setState({refundVisible: true})
													this.props.saveSelect({
															orderNo: record.alldata.orderNo, 
													})
											} }
											style={{color:'#1890ff',borderColor:'#1890ff'}}>退款审核</Button>
							}
							if(refundState == '已同意'){
									btn = <Button 
											onClick={ (e) => {
													e.stopPropagation();
													this.setState({refundAffirm: true})
													this.props.saveSelect({
															orderNo: record.alldata.orderNo, 
													})
											} }
											style={{color:'#1890ff',borderColor:'#1890ff'}}>确认退款</Button>
							}
						 return (
							<div>
									<div style={{borderBottom:'1px solid #e8e8e8',paddingBottom:10}}>
											<span style={{visibility:"hidden"}}>订单编号 : </span>
									</div>
									<div>
											<div style={{marginBottom:10}}>{ status }-{ refundState }</div>
											<div>{ btn }</div>
									</div>
							
							</div>
						 )
					}
			}
		];

		const userDatas = userData ? userData : "";

		const menu = (
			<Menu>
				{
					userDatas.communityNames ? userDatas.communityNames.map((item,index) => {
						return (
							<Menu.Item key={index}>
								{ item }
							</Menu.Item>
						)
					}) : ''
				}
			</Menu>
		);

		const pagination = {
			defaultPageSize: 20
		}


		return (
			<div className={Styles.homeStyle}>
				<Row>
					{/* 左侧 */}
					<Col span={18}>
						<h1><span>{ userDatas.name }</span> 您有 <span>{ homeCount ? homeCount.total : '' }</span> 条待办事项，请及时处理！</h1>
						{/* 待办事项 */}
						<Col className={Styles.backlog}>
								<h3>待办事项</h3>
								<div className="tabs">
									<Tabs activeKey={this.state.activeKey} onTabClick={this.onTabClick.bind(this)}>
										<TabPane key="1" 
											tab={
												<div className={Styles.tabsTitle}>
													<p>{ homeCount ? homeCount.list[0].count : '' }</p>
													<p>业主认证</p>
												</div>
											}>
											<Table 
												columns={columns1} 
												dataSource={content1}
												rowKey={record => record.id }
												onRow={ (record) => ({ onClick: this.onSelect1.bind(this, record) }) }
												scroll={{ y: 346,x: 1000 }}
												pagination={ pagination }
												bordered />
										</TabPane>
										<TabPane key="2"
											tab={
												<div className={Styles.tabsTitle}>
													<p>{ homeCount ? homeCount.list[1].count : '' }</p>
													<p>报事保修</p>
												</div>
											}>
											<Table
												columns={columns2}
												dataSource={content2}
												rowKey={record => record.id }
												onRow={(record) => {return {onClick: this.onSelect2.bind(this, record)}}}
												scroll={{ y: 346,x: 1000 }}
												pagination={ pagination }
												bordered
											/>
										</TabPane>
										<TabPane key="3"
											tab={
												<div className={Styles.tabsTitle}>
													<p>{ homeCount ? homeCount.list[2].count : '' }</p>
													<p>投诉建议</p>
												</div>
											}>
											<Table
												columns={columns3}
												dataSource={content3}
												rowKey={record => record.id }
												onRow={(record) => {return {onClick: this.onSelect3.bind(this, record)}}}
												scroll={{ y: 346,x: 1000 }}
												pagination={ pagination }
												bordered
											/>
										</TabPane>
										<TabPane key="4"
											tab={
												<div className={Styles.tabsTitle}>
													<p>{ homeCount ? homeCount.list[3].count : '' }</p>
													<p>订单发货</p>
												</div>
											}>
											<div className="shipmentManage">
												<Table
													columns={columns4}
													dataSource={content4}
													rowKey={ record =>  record.alldata.id }
													onRow={(record) => {return {onClick: this.onSelect4.bind(this, record)}}}
													scroll={{ y: 346,x: 1000 }}
													pagination={ pagination }
												/>
											</div>
										</TabPane>
										<TabPane key="5"
											tab={
												<div className={Styles.tabsTitle}>
													<p>{ homeCount ? homeCount.list[4].count : '' }</p>
													<p>订单售后</p>
												</div>
											}>
											<div className="afterSaleManage">
												<Table
													columns={columns5}
													dataSource={content5}
													rowKey={ record =>  record.alldata.id }
													onRow={(record) => {return {onClick: this.onSelect5.bind(this, record)}}}
													scroll={{ y: 346,x: 1000 }}
													pagination={ pagination }
												/>
											</div>

										</TabPane>
									</Tabs>
								</div>

						</Col>

						{/* 数据统计 */}
						{/* <Col className={Styles.dataStatistics}>
							<Col>
									<Tabs defaultActiveKey="1">
										<TabPane disabled tab="数据统计" key="0"></TabPane>
										<TabPane tab="昨日" key="1">
											<Row>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
											</Row>
										</TabPane>
										<TabPane tab="本月" key="2">
											<Row>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
											</Row>
										</TabPane>
										<TabPane tab="上月" key="3">
											<Row>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
												<Col span={4}>
													<Card>
														<p>129</p>
														<p>新注册用户</p>
													</Card>
												</Col>
											</Row>
										</TabPane>
									</Tabs>
							</Col>
							
						</Col> */}
					</Col>
					{/* 右侧 */}
					<Col span={5} className={Styles.container}>
							<Col style={{width:'126%',border:'1px solid #ccc',paddingBottom:'9%'}}>
								<Row className={Styles.perInfo}>{/* 个人信息 */}
									<Col span={7}>
										<img src="./img/tx.png" alt=""/>
									</Col>
									<Col span={17}>
										<Col><span>{ userDatas.name }</span><span>{ userDatas.phoneNo }</span></Col>
										<Col><span>{ userDatas.instName }</span></Col>

										<Col>
											<Col span={22}>共管理 <span>{ userDatas.communityCount }</span> 个小区</Col>
											<Col style={{cursor:'pointer'}} span={2}>
												<Dropdown overlay={menu} placement="bottomLeft">
													<Icon style={{fontSize:18}} type="file-search" theme="outlined" />
												</Dropdown>
											</Col>
										</Col>
										
									</Col>
								</Row>
								<Row className={Styles.entrance}>{/* 快速入口 */}
									<h3>快速入口</h3>
										<Col span={5} style={{width:'22%'}} onClick={ this.goodsReleased.bind(this) }>
											<Card>
												<IconFont type="icon-public" />
												<p>发布商品</p>
											</Card>
										</Col>
										<Col span={5} style={{width:'22%'}} onClick={ this.allOrder.bind(this) }>
											<Card>
												<IconFont type="icon-dingdan" />
												<p>订单管理</p>
											</Card>
										</Col>
										<Col span={5} style={{width:'22%'}} onClick={ this.proprietorManage.bind(this) }>
											<Card>
												<IconFont type="icon-shenhe" />
												<p>业主审核</p>
											</Card>
										</Col>
										{/* <Col span={5} style={{width:'22%'}}>
											<Card>
												<IconFont type="icon-1" />
												<p>缴费处理</p>
											</Card>
										</Col> */}
										<Col span={5} style={{width:'22%'}} onClick={ this.affairManage.bind(this) }>
											<Card>
												<IconFont type="icon-paidan" />
												<p>报事派单</p>
											</Card>
										</Col>
										<Col span={5} style={{width:'22%'}} onClick={ this.activityManagement.bind(this) }>
											<Card>
												<IconFont type="icon-huodong" />
												<p>活动发布</p>
											</Card>
										</Col>
										<Col span={5} style={{width:'22%'}} onClick={ this.usersManagement.bind(this) }>
											<Card>
												<IconFont type="icon-yonghu" />
												<p>用户查询</p>
											</Card>
										</Col>
								</Row>
							</Col>
							{/* 重要通知 */}
							{/* <Col className={Styles.inform}>
									<h3>重要通知</h3>
									<Row>
										<Col>近期大闸蟹活动需要各物业部门大力推广；</Col>
										<Col>平台近期将考核管理员及服务人员办事效率，请大家及时妥善处理所有待办事项；</Col>
										<Col>需尽快完成业主信息录入，保证业主认证流程通畅，所有租客都需备案到系统；</Col>
									</Row>
							</Col> */}
					</Col>
				</Row>

				{/* 业主认证 */}
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
					<ProprietorDetail search={this.search.bind(this)}  closeDetail={this.closeDetail.bind(this)} goEdit={this.DetailData.bind(this)} match={this.props.match.params.id}/>
				</Drawer>
				<Drawer
          title="审核"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'auditVisible')}
          maskClosable={false}
          visible={this.state.auditVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Audit search={this.search.bind(this)} closeAudit={ () => this.setState({auditVisible: false}) }/>
        </Drawer> 

				{/* 保修事项 */}
				<Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'affairVisible')}
          maskClosable={false}
          visible={this.state.affairVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <AffairDetails search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
        </Drawer>
        <Drawer
          title="派单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'sendVisible')}
          maskClosable={false}
          visible={this.state.sendVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Send search={this.search.bind(this)}/>
        </Drawer>
        <Drawer
          title="结单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'finishVisible')}
          maskClosable={false}
          visible={this.state.finishVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Finish search={this.search.bind(this)}/>
        </Drawer>
        <Drawer
          title="关闭订单"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'closeVisible')}
          maskClosable={false}
          visible={this.state.closeVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <CloseOrder search={this.search.bind(this)}/>
        </Drawer>

				{/* 投诉建议 */}
				<Drawer
          title="详情"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'adviceVisible')}
          maskClosable={false}
          visible={this.state.adviceVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <AdviceDetails search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)}/>
        </Drawer>
        <Drawer
          title="答复"
          width="45%"
          placement="right"
          destroyOnClose
          onClose={this.handleCancel.bind(this, 'answerVisible')}
          maskClosable={false}
          visible={this.state.answerVisible}
          style={{overflow: 'auto',paddingBottom: 53}}
          >
          <Answer search={this.search.bind(this)}/>
        </Drawer>   

				{/* 订单发货 */}
				<Drawer
					title="订单详情"
					width="45%"
					destroyOnClose
					placement="right"
					onClose={this.handleCancel.bind(this, 'shipmentsDetail')}
					maskClosable={false}
					visible={this.state.shipmentsDetail}
					style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
					>
					<ShipmentsDetail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)}  match={this.props.match}/>
				</Drawer>
				<Drawer
						title="发货"
						width="45%"
						destroyOnClose
						placement="right"
						onClose={this.handleCancel.bind(this, 'shipmentsVisible')}
						maskClosable={false}
						visible={this.state.shipmentsVisible}
						style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
						>
						<Shipments search={this.search.bind(this)} closeShipments={ () => this.setState({shipmentsVisible: false}) } />
				</Drawer>

				{/* 订单售后 */}
				<Drawer
						title="售后详情"
						width="45%"
						destroyOnClose
						placement="right"
						onClose={this.handleCancel.bind(this, 'afterSaleDetail')}
						maskClosable={false}
						visible={this.state.afterSaleDetail}
						style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
						>
						<AfterSaleDetail search={this.search.bind(this)} closeDetail={this.closeDetail.bind(this)} />
				</Drawer>
				<Drawer
						title="退款审核"
						width="45%"
						destroyOnClose
						placement="right"
						onClose={this.handleCancel.bind(this, 'refundVisible')}
						maskClosable={false}
						visible={this.state.refundVisible}
						style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
						>
						<RefundCheck	search={this.search.bind(this)}  
								closeRefundCheck={() => this.setState({refundVisible: false})} />
				</Drawer>
				<Drawer
						title="退款确认"
						width="45%"
						destroyOnClose
						placement="right"
						onClose={this.handleCancel.bind(this, 'refundAffirm')}
						maskClosable={false}
						visible={this.state.refundAffirm}
						style={{height: 'calc(100% - 55px)',overflow: 'auto',paddingBottom: 53}}
						>
						<RefundAffirm	search={this.search.bind(this)} 
								closeRefundAffirm={() => this.setState({refundAffirm: false})} />
				</Drawer>


			</div>
		)
	}
}

App.contextTypes = {
  router: PropTypes.object
};

function mapStateToProps(state, ownProps) {
		return {
			proprietorData: state.proprietorManage.list,    //业主认证
			affairData: state.affairManage.list,  	//保修事项
			adviceData: state.adviceManage.list,		//投诉建议
			shipmentsData: state.orderList.list,	//订单发货
			afterSaleData: state.orderList.list,	//订单售后
			homeCount: state.home.homeCount
		}
}

function dispatchToProps(dispatch) {
		return {
			//业主认证
			queryProprietor(payload, params) {
				dispatch({type: 'proprietorManage/serch', payload})
			},
			//保修事项
			queryAffairManage(payload, params) {
				dispatch({type: 'affairManage/serch', payload})
			},
			//投诉建议
			queryAdvice(payload, params) {
				dispatch({type: 'adviceManage/serch', payload})
			},
			//订单发货,订单售后
			queryShipments(payload = {}) {
				dispatch({type: 'orderList/serch', payload})
			},


			saveSelect1(payload = {}) {
				dispatch({type: 'proprietorManage/save', payload})
			},
			saveSelect2(payload = {}) {
				dispatch({type: 'affairManage/save', payload})
			},
			saveSelect3(payload = {}) {
				dispatch({type: 'adviceManage/save', payload})
			},
			saveSelect4(payload = {}) {
				dispatch({type: 'orderList/save', payload})
			},

			queryStatistics(payload, params) {
				dispatch({type: 'home/queryStatistics', payload})
			},
			queryHomeCount(payload, params) {
				dispatch({type: 'home/queryHomeCount', payload})
			},
			setStatus(payload, params) {
				dispatch({type: 'home/setStatus', payload})
			},
			companyStatus(payload, params) {
				dispatch({type: 'home/companyStatus', payload})
			},
			saveSelect(payload = {}) {
				dispatch({type: 'orderList/save', payload})
			},

		}
}
export default connect(mapStateToProps, dispatchToProps)(App);
