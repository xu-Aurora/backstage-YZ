import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tabs,Form, Button, Row,Col,Input,Radio,Select,Card,Tag } from 'antd';
import {connect} from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { CheckableTag } = Tag;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            supplierList: [],
            checked: true,
            assureList: [
                {id: '1', name: '佳源自营', checked: false},
                {id: '2', name: '送货到家', checked: false},
                {id: '3', name: '破损包退', checked: false},
                {id: '4', name: '24小时发货', checked: false},
                {id: '5', name: '业主专享', checked: false}
            ]
        };
    }

    componentDidMount() {
        const userData = JSON.parse(localStorage.getItem('userDetail'));
        const threePage = JSON.parse(localStorage.getItem('threePage'));
        const threePage1 = JSON.parse(localStorage.getItem('threePage1'));

        let goodsId = this.context.router.route.match.params.goodsId

        let self = this
        this.props.getSupplier({
            params:{
                userId: userData.id,
                instCode: userData.instCode
            },
            func: function() {
                self.setState({
                    supplierList: self.props.supplierList
                },function() {
                    if(goodsId) {
                        if(threePage1) {
                            self.setState({
                                assureList: threePage1.assureList
                            })
                            self.props.form.setFieldsValue({
                                labelCode: threePage1.labelCode,
                                initialSales: threePage1.initialSales,
                                calculate: threePage1.calculate,
                                status: threePage1.status,
                                supplierId: threePage1.supplierId     
                             })
                        } else {
                            let data = self.props.detailList
                            self.props.form.setFieldsValue({
                                labelCode: data.labelCode,
                                initialSales: data.initialSales,
                                calculate: data.calculate,
                                status: data.status,
                                supplierId: data.supplierId ? Number(data.supplierId) : ''     
                             })
                             let list = []
                             self.state.assureList.forEach(item => {
                                 list.push(Object.assign({}, item))
                             })
                             let lableList = data.labelName ? data.labelName.split(',') : ''
                             lableList.forEach(item=>{
                                 list.forEach(data=>{
                                     if(item == data.name) {
                                         data.checked = true
                                     }
                                 })
                             })
                             self.setState({
                                assureList: list
                             })
                        }
                    } else if(threePage) {
                        self.setState({
                            assureList: threePage.assureList
                        })
                        self.props.form.setFieldsValue({
                            labelCode: threePage.labelCode,
                            initialSales: threePage.initialSales,
                            calculate: threePage.calculate,
                            status: threePage.putawayTime,
                            supplierId: threePage.supplierId     
                         })
                    } else {
                        let assureList =  [
                            {id: '1', name: '佳源自营', checked: true},
                            {id: '2', name: '送货到家', checked: false},
                            {id: '3', name: '破损包退', checked: false},
                            {id: '4', name: '24小时发货', checked: false},
                            {id: '5', name: '业主专享', checked: false}
                        ]
                        self.setState({
                            assureList: assureList
                        })
                    }
                })
            }
        })
        //向父组件传this
        this.props.onRef('threeConfig', this)
    }
    //商户渲染
    supplierApply(){
        let children = []
        this.state.supplierList.forEach((data, index)=>{
            if(data.status) {
                children.push(<Option key={index} value={data.id}>{data.name}</Option>)
            }                           
        })
        return children
    }
    //
    handleChange(checked) {
        console.log(arguments)
        this.setState({ checked });
    }
    //商品保证
    assureApply () { 
        let children = []
        this.state.assureList.forEach((data, index) =>{
            children.push(
                <Col span={4} className={data.checked ? `${styles.assure__list} ${styles.assure__show}`: `${styles.assure__list}`} key={index} onClick={this.assureChange.bind(this, data)}>
                    <div>{data.name}</div>
                </Col>
            )
        })
        return children
    }
    assureChange(params) {
        let list = []
        this.state.assureList.forEach(data=>{
            list.push(Object.assign({}, data))
        })
        list.forEach((item, index)=>{
            if(params.id == item.id) {
                item.checked = !item.checked
            }
        })
        this.setState({
            assureList: list
        })
    }
    render() {
        const formItemLayout = {
            labelCol: {xs: { span: 24 },sm: { span: 3 }},
            wrapperCol: {xs: { span: 24 },sm: { span: 12 },md: { span: 8 }}
        };
        const { getFieldDecorator,getFieldValue } = this.props.form;
        return (
            <div className={styles.box}>
                <Card>
                    <h3>其他设置</h3>
                    <Form hideRequiredMark style={{ marginTop: 8 }}>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 12}} label="商品保证">
                            {/* {getFieldDecorator('labelName', {initialValue: '1'})(
                                <Radio.Group defaultValue="1" buttonStyle="solid">
                                    <Radio.Button value="1">佳源自营</Radio.Button>
                                    <Radio.Button value="2">送货到家</Radio.Button>
                                    <Radio.Button value="3">破损包退</Radio.Button>
                                    <Radio.Button value="4">24小时发货</Radio.Button>
                                    <Radio.Button value="5">业主专享</Radio.Button>

                                </Radio.Group>
                            )} */}
                            {/* <CheckableTag  checked={this.state.checked} onClick={this.handleChange.bind(this)}>佳源自营</CheckableTag>
                            <CheckableTag  checked={this.state.checked} onChange={this.handleChange.bind(this)}>送货到家</CheckableTag>
                            <CheckableTag  checked={this.state.checked} onChange={this.handleChange.bind(this)}>破损包退</CheckableTag>
                            <CheckableTag  checked={this.state.checked} onChange={this.handleChange.bind(this)}>24小时发货</CheckableTag>
                            <CheckableTag  checked={this.state.checked} onChange={this.handleChange.bind(this)}>业主专享</CheckableTag> */}
                            <Row>
                                {this.assureApply()}
                                {/* <Col span={4} className={styles.assure__list}>
                                    <div>佳源自营</div>
                                </Col>
                                <Col span={4} className={styles.assure__list}>
                                    <div>佳源自营</div>
                                </Col>
                                <Col span={4} className={styles.assure__list}>
                                    <div>佳源自营</div>
                                </Col>
                                <Col span={4} className={styles.assure__list}>
                                    <div>佳源自营</div>
                                </Col> */}
                            </Row>
                        </FormItem>
                        <FormItem {...formItemLayout} label="售后服务">
                            {getFieldDecorator('labelCode', {initialValue: '1'})(
                                <Radio.Group>
                                    <Radio value="1">物跑跑送货到家</Radio>
                                    <Radio value="2">包安装</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem labelCol={{span: 3}}  label="初始销量">
                            {getFieldDecorator('initialSales')(
                                <Input style={{width:'33.3%'}} placeholder="默认值为0" />
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="库存计算">
                            {getFieldDecorator('calculate', {initialValue: '1'})(
                                <Radio.Group>
                                    <Radio value="1">付款减库存</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="上架时间">
                            {getFieldDecorator('status', {initialValue: '1'})(
                            <Radio.Group>
                                <Radio value="2">立即上架</Radio>
                                <Radio value="1">放入仓库</Radio>
                            </Radio.Group>
                            )}
                        </FormItem>
                        <FormItem labelCol={{span: 3}} wrapperCol={{span: 23}} className='partLine'>
                            <Col offset={1} style={{borderBottom:'1px solid #ccc'}}></Col>
                        </FormItem>
                        <FormItem {...formItemLayout} label="选择商户">
                            {getFieldDecorator('supplierId')(
                                <Select placeholder="请选择">
                                  {this.supplierApply()}
                                </Select>
                            )}
                        </FormItem>

                    </Form>
                </Card>
            </div>
        )
    }
}
App.contextTypes = {
    router: PropTypes.object
}
function mapStateToProps(state) {
    return {
        supplierList: state.goodsReleased.supplierList,//商户
        detailList: state.goodsReleased.detailList
    }
}
function dispatchToProps(dispatch) {
    return {
        getSupplier(payload={}) {
            dispatch({type: 'goodsReleased/getSupplier',payload})
        },

        queryList(payload, params) {
            dispatch({type: 'borrowingManagement/queryList', payload})
        }
    }
}

export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));