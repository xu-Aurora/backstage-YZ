import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Row, Col, Icon, Tree, Drawer, message,Menu, Input, Upload} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SelectImg from '../../selectImg';
const FormItem = Form.Item;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        array: [],
        totalStock: 0,
        code: '',
        fileList: [],
        selectImgVisible: false,
        imgInfo:[]
    }
  }
  componentDidMount() {
    let self = this
    let goodsId = this.context.router.route.match.params.goodsId
    let firstPage = JSON.parse(localStorage.getItem('firstPage'));
    let firstPage1 = JSON.parse(localStorage.getItem('firstPage1'));

    if(goodsId) {
        if(firstPage1) {
            self.setState({
                array: firstPage1.tableArray || [],
                totalStock: firstPage1.totalStock,
                code: firstPage1.code,
            })
        } else {
            let data = self.props.detailList
            let skuDetail = JSON.parse(data.specificationIds)
            
            if(skuDetail) {
                self.setState({
                    array: skuDetail.tableArray,
                    totalStock: data.totalStock,
                    code: data.code
                })
            }
        }

    //    self.setState({
    //         array: JSON.parse(data.goodSkus)
    //    })
    } else if (firstPage) {
        self.setState({
            array: firstPage.tableArray || [],
            totalStock: firstPage.totalStock,
            code: firstPage.code,
        })
    } else {
        this.assemble()
    }
    if(this.props.isTableStatus) {
        this.assemble()
        self.setState({
            totalStock: 0,
        })
    }
    this.props.onRef('tableSelf', this)
    
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.sellingPrice != this.state.sellingPrice) {
        return true
    }
    if(nextState.ticket != this.state.ticket) {
        return true
    }
    if(nextState.costPrice != this.state.costPrice) {
        return true
    }
    if(nextState.stock != this.state.stock) {
        return true
    }
    if(nextState.weight != this.state.weight) {
        return true
    }
    if(nextState.volume != this.state.volume) {
        return true
    }
    if(nextState.code != this.state.code) {
        return true
    }
    if(nextState.selectImgVisible != this.state.selectImgVisible) {
        return true
    }
    if(JSON.stringify(nextState.array) == JSON.stringify(this.state.array)) {
        return false
    }
    return true

  }
   //表格标题
  tableHeader() {
    let array = this.props.headerLIst
    let children = []
    array.forEach(function(item, index){
        children.push(
            item.name ? (<td key={index} className={item.isMust ? styles.lable : ''}>{item.name}</td>): null
        )
    })
    return children
  }
  //组装数组
  assemble() {
    let first = this.props.first.list
    let second = this.props.second.list
    let third = this.props.third.list
    let array = []
   //第一个规格存在，二三不存在
   if(!third.length && !second.length && first.length) {
       for (let i=0; i<first.length; i++) {
           array.push(Object.assign({}, {oneConfig: first[i],twoConfig: '',code: i ,threeConfig: '',pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
        }
       this.setState({
            array
       })
   }
   //第一二个规格存在，三不存在
    if(!third.length && second.length && first.length) {
        for (let i=0; i<first.length; i++) {
            for (let j=0; j<second.length; j++) {
                array.push(Object.assign({}, {oneConfig: first[i],twoConfig: second[j],threeConfig: '',code: `${i}|${j}`,pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
            }    
        }
        this.setState({
            array
        })
    }
   //第一三个规格存在，二不存在
    if(third.length && !second.length && first.length) {
        for (let i=0; i<first.length; i++) {
            for (let j=0; j<third.length; j++) {
                array.push(Object.assign({}, {oneConfig: first[i],twoConfig: '',threeConfig: third[j], code: `${i}|${j}`, pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
            }    
        }
        this.setState({
            array
        })
    }
   //第二个规格存在，一三不存在
    if(!third.length && second.length && !first.length) {
        for (let i=0; i<second.length; i++) {
            array.push(Object.assign({}, {oneConfig: '',twoConfig: second[i], threeConfig: '', code: `${i}`,pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
        }
        this.setState({
            array
        })
    }
   //第二三存在,一不存在
    if(third.length && second.length && !first.length) {
        for (let i=0; i<second.length; i++) {
            for (let j=0; j<third.length; j++) {
                array.push(Object.assign({}, {oneConfig: '',twoConfig: second[i],threeConfig: third[j],code: `${i}|${j}`,pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
            }    
        }
        this.setState({
            array
        })
    }
    //第三存在,一二不存在
    if(third.length && !second.length && !first.length) {
        for (let i=0; i<third.length; i++) {
            array.push(Object.assign({}, {oneConfig: '',twoConfig: '', threeConfig: third[i],code: `${i}`,pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
        }
        this.setState({
            array
        })
    }
   //三个规格
   if(third.length && second.length && first.length) {
        for (let i=0; i<first.length; i++) {
            for (let j=0; j<second.length; j++) {
                for (let k=0; k<third.length; k++) {
                    array.push(Object.assign({}, {oneConfig: first[i],twoConfig: second[j], threeConfig: third[k],code: `${i}|${j}|${k}`,pic:'',sellingPrice: '',ticket: '',costPrice: '',stock: '', weight: '',volume: '',option: ''}))
                }
            }
        }
        this.setState({
            array
        })
    }
  }
  //渲染表格
  rendering() {
    // array.push(Object.assign({}, {oneConfig: first[i],twoConfig: '',threeConfig: '',pic:'',salesPrice: '',ticketRange: '',costPrice: '',stock: '', weight: '',bulk: '',option: ''}))
    let children = []
    let self = this
    this.state.array.forEach(function(item, index){
        children.push(
            <tr key={index}>
                {item.oneConfig? (<td>{item.oneConfig}</td>): null}
                {item.twoConfig? (<td>{item.twoConfig}</td>): null}
                {item.threeConfig? (<td>{item.threeConfig}</td>): null}
                <td>
                   <div className={styles.openImg} onClick={self.showSelectImg.bind(self, item)}>
                    {item.pic ? 
                        (<img src={`/backstage/upload/download?uuid=${item.pic}&viewFlag=1&fileType=jpg&filename=aa`} alt=""/>)
                        :
                        (<Icon type="plus" style={{fontSize: 20}} />)
                    }
                       
                       
                   </div>
                </td>
                <td><Input  onChange={self.inputChange.bind(self, item, 'sellingPrice')} value={item.sellingPrice}/></td>
                <td><Input onChange={self.inputChange.bind(self, item, 'ticket')} value={item.ticket}/></td>
                <td><Input onChange={self.inputChange.bind(self, item, 'costPrice')} value={item.costPrice}/></td>
                <td><Input onChange={self.inputChange.bind(self, item, 'stock')} value={item.stock}/></td>
                <td><Input onChange={self.inputChange.bind(self, item, 'weight')} value={item.weight}/></td>
                <td><Input onChange={self.inputChange.bind(self, item, 'volume')} value={item.volume}/></td>
                <td><span onClick={self.onClear.bind(self, index)}>清空</span></td>
            </tr>
        )            
    })
    return  children
  }
  showSelectImg(param) {
    this.setState({
        selectImgVisible: true,
        imgInfo: param 
    })
  }
  //图片限制
  checkImg = (file, fileList) => {
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
  // 图片上传
  handleChange(info) {
    if(info.file.status == 'uploading') {
      this.setState({
        fileList: info.fileList,
        pic: []
      })
    } else if (info.file.status == 'done') {
      this.setState({
        fileList: info.fileList,
        pic: info.file.response
      })
    } else if (info.file.status === 'error') {
      message.error(`上传失败`);
      this.setState({
        fileList: [],
        pic: ''
      })
    } else {
      this.setState({
        fileList: [],
        pic: ''
      })
    }
  }
  //内容改变
  inputChange(data, params, ev) {
    let list = []
    let total = 0
    this.state.array.forEach((item, idnex)=>{
        list.push(Object.assign({},item))
    })
    list.forEach((item,index)=>{
        if(item.code == data.code) {
            item[params] = ev.target.value
        }
        total += Number(item.stock)
    })
    this.setState({
        array: list,
        totalStock: total
    })
  }
  //内容清空
  onClear(params) {
    let list = []
    let total = 0
    this.state.array.forEach((item, idnex)=>{
        list.push(Object.assign({},item))
    })
    list.forEach((item,index)=>{
        if(params == index) {
            item.sellingPrice = ''
            item.ticket = ''
            item.costPrice = ''
            item.stock = ''
            item.weight = ''
            item.volume = ''
            item.pic = ''
        }
        total += Number(item.stock)
    })
    this.setState({
        array: list,
        totalStock: total
    })
  }
  //合并表格
  componentDidUpdate () {
        let one = this.props.first.list
        let two = this.props.second.list
        let three = this.props.third.list
        //第一二个规格存在，三不存在
        if(!three.length && one.length && two.length) {
          this.autoRowSpan(this.refs.table,1,0)
        }
        // 第一三个规格存在，二不存在
        if(three.length && one.length && !two.length){
            this.autoRowSpan(this.refs.table,1,0)
        }
         //第二三存在,一不存在
        if(!one.length && two.length  && three.length) {
            this.autoRowSpan(this.refs.table,1,0)
        }
        //三个规格
        if(one.length && two.length  && three.length) {
            if(two.length>1){
                this.autoRowSpan(this.refs.table,1, 1)
                this.autoRowSpan(this.refs.table,1, 0)
            } else {
                this.autoRowSpan(this.refs.table,1, 0)
            }
        } 
  }
  //合并表格
  autoRowSpan(tb, row, col) {
    var lastValue = "";
    var value = "";
    var pos = 1;
    for(var i = row; i < tb.rows.length; i++) {
        value = tb.rows[i].cells[col].innerText;
        if(lastValue == value) {
            tb.rows[i].deleteCell(col);
            tb.rows[i - pos].cells[col].rowSpan = tb.rows[i - pos].cells[col].rowSpan + 1;
            pos++;
        } else {
            lastValue = value;
            pos = 1;
        }
    }
  }
  //渲染表格
  applyTable() {
    let children = (<table cellSpacing="0" className={styles.mytable} style={{margin: 0}} ref="table" key={Math.random}> 
    <thead>
        <tr style={{height: '30px', lineHeight: '30px'}}>{this.tableHeader()}</tr>
    </thead>
    <tbody>
        {this.rendering()}
    </tbody>
   
  </table>)
    return children
  }
  save(){
    let first = this.props.first
    let second = this.props.second
    let third = this.props.third
    let array = []
    if (first.name) {
        array.push(first)
    }
    if (second.name) {
        array.push(second)
    }
    if (third.name) {
        array.push(third)
    }
    array.forEach((data, i)=>{
        let list = []
        data.list.forEach((item,index)=>{
            list.push({
                value: item,
                id: index
            })
        })
        data.entries = list
    })
    const userData = JSON.parse(localStorage.getItem('userDetail'));

    this.props.addGoods({
        params:{
            userId: userData.id,
            good: JSON.stringify({
                specification:  array    
            }),
            goodSkus: JSON.stringify(this.state.array)  
        }
    })
  }
    //确定批量编辑
    onEdit() {
        let list = []
        let total = 0
        this.state.array.forEach((item, idnex)=>{
            list.push(Object.assign({},item))
        })
            list.forEach((item,index)=>{
                item.sellingPrice = this.state.sellingPrice
                item.ticket = this.state.ticket
                item.costPrice = this.state.costPrice
                item.stock = this.state.stock
                item.weight = this.state.weight
                item.volume = this.state.volume
                total += Number(item.stock)
            })
            this.setState({
                array: list,
                totalStock: total
            })
    }
    codeValue(e) {
        this.setState({
            code: e.target.value
        })
    }

    //点击关闭抽屉框
    closeDrawer(type){
        this.setState({
            [type]: false
        })
    }
     //关闭图片选择
     closeSelectImg(params) {
        this.setState({
            selectImgVisible: false 
        }, ()=>{
            let list = []
            let imgInfo = this.state.imgInfo
            this.state.array.forEach((item, idnex)=>{
                list.push(Object.assign({},item))
            })
            if(params) {
                if(params.length){
                    list.forEach((item,index)=>{
                        if(imgInfo.code == item.code) {
                            item.pic = params[0].ossKey
                        }
                    })
                }
                                
            }
            this.setState({
                array: list
            })
           
        })
    }
    onRef (param, ref) {
        this[param] = ref
    }
    //编辑值改变
    bulkEdit(param, ev) {
        this.setState({
            [param]: ev.target.value
        })
    }
  render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <div className={styles.content}> 
        <FormItem labelCol={{span: 2}} wrapperCol={{span: 22}} label="批量编辑">
                <Input style={{width:'14%',marginRight:17}} placeholder="销售价"  onChange={this.bulkEdit.bind(this, 'sellingPrice')}/>
                <Input style={{width:'14%',marginRight:17}} placeholder="粮票抵用"   onChange={this.bulkEdit.bind(this, 'ticket')}/>
                <Input style={{width:'14%',marginRight:17}} placeholder="成本价"   onChange={this.bulkEdit.bind(this, 'costPrice')}/>
                <Input style={{width:'14%',marginRight:17}} placeholder="库存"   onChange={this.bulkEdit.bind(this, 'stock')}/>
                <Input style={{width:'14%',marginRight:17}} placeholder="重量"   onChange={this.bulkEdit.bind(this, 'weight')}/>
                <Input style={{width:'14%',marginRight:17}} placeholder="体积"   onChange={this.bulkEdit.bind(this, 'volume')}/>
            <Button type="primary" style={{width:100}} onClick={this.onEdit.bind(this)}>确定</Button>
        </FormItem>
        {this.applyTable()}
        <FormItem labelCol={{span: 2}} wrapperCol={{span: 12}}  label={<span>总库存 <span className={styles.red}>*</span></span>}>
            <Input disabled style={{width:'35%',backgroundColor:'#ccc'}} value={this.state.totalStock}/>
        </FormItem>
        <FormItem labelCol={{span: 2}} wrapperCol={{span: 12}}  label={<span>商品编码 <span className={styles.red}>*</span></span>}>
            <Input style={{width:'35%'}} value={this.state.code} onChange={this.codeValue.bind(this)}/>
        </FormItem>
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
            <SelectImg onRef={this.onRef.bind(this)} closeSelectImg={this.closeSelectImg.bind(this)} selectImgNum={1}/>   
        </Drawer>   
      </div>
    )
  }
}
App.contextTypes = {
  router: PropTypes.object
}
function mapStateToProps(state, ownProps) {
    return {
    detailList: state.goodsReleased.detailList,
    isTableStatus: state.goodsReleased.isTableStatus
    }
}
function dispatchToProps(dispatch) {
  return {
    addGoods(payload = {}) {
        dispatch({type: 'goodsReleased/addGoods', payload})
    },
  }
}
export default connect(mapStateToProps, dispatchToProps)(Form.create()(App));
