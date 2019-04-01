import React, {Component} from 'react';
import Md5 from 'js-md5';
import CountUp from 'countup.js';
import Moment from 'moment';
import {message} from 'antd';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ''
        };
        this.timer = null;
    }
    componentDidMount() {
        this.setState({data: this.props.data});
        const options = {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.'
        };

        //data 内容数字 startNum 开始数 endNum 结束数  Decimals 末位保存多少位 separator 分隔 speed 速度
        const data = this.props.data || 0;
        const startNum =  0;
        const endNum = this.props.endNum || data;
        const Decimals = 0;
        const speed = this.props.speed || 0;
        const play = new CountUp(this.refs.countBox, startNum, endNum, Decimals, speed, options);
        if (!play.error) {
            play.start();
        } else {
            message.error(play.error);
        }
    }
    render() {
        return (
            <span ref="countBox" style={{ ...this.props.styles }}></span>
        )
    }
}

export default App;